import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/services/auth.service";
import { connectToDatabase } from "@/lib/db/mongoose";
import TransactionModel from "@/lib/models/transaction.model";
import {
  getUserPurchasedProductIdentifiers,
  confirmUserPurchase,
} from "@/lib/services/purchase.service";
import { syncUserLemonOrders } from "@/lib/services/dashboard.service";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({
        transactions: [],
        ownedSlugs: [],
        ownedProductIds: [],
      });
    }

    await connectToDatabase();

    // 1. Sync any recent Lemon Squeezy orders for this user
    if (session.user.email) {
      await syncUserLemonOrders(
        session.user.email,
        session.user.id,
        session.user.name
      );
    }

    // 2. Fetch all completed transactions matching by userId OR userEmail
    const userConditions: Record<string, unknown>[] = [
      { userId: session.user.id },
    ];
    if (session.user.email) {
      userConditions.push({ userEmail: session.user.email });
    }

    const rawTransactions = await TransactionModel.find({
      $or: userConditions,
      status: "completed",
    })
      .sort({ createdAt: -1 })
      .lean();

    const transactions = rawTransactions.map((t: any) => ({
      _id: t._id.toString(),
      userId: t.userId,
      userEmail: t.userEmail,
      userName: t.userName,
      productId: t.productId?.toString(),
      productTitle: t.productTitle,
      productSlug: t.productSlug,
      productImage: t.productImage,
      price: Number(t.price) || 0,
      currency: t.currency || "USD",
      status: t.status || "completed",
      transactionId: t.transactionId,
      licenseType: t.licenseType,
      formats: t.formats || ["PNG", "SVG"],
      createdAt: t.createdAt
        ? new Date(t.createdAt).toISOString()
        : undefined,
      updatedAt: t.updatedAt
        ? new Date(t.updatedAt).toISOString()
        : undefined,
    }));

    const { slugs: ownedSlugs, productIds: ownedProductIds } =
      await getUserPurchasedProductIdentifiers(
        session.user.id,
        session.user.email
      );

    return NextResponse.json({
      transactions,
      ownedSlugs,
      ownedProductIds,
    });
  } catch (error: any) {
    console.error("Purchases fetch error:", error);
    return NextResponse.json(
      { transactions: [], ownedSlugs: [], ownedProductIds: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { productSlug, transactionId } = await req.json();
    if (!productSlug) {
      return NextResponse.json(
        { error: "Missing productSlug parameter" },
        { status: 400 }
      );
    }

    const transaction = await confirmUserPurchase({
      userId: session.user.id,
      userEmail: session.user.email || "collector@stickify.store",
      userName: session.user.name || "Collector",
      productSlug,
      transactionId,
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Product not found or failed to confirm purchase" },
        { status: 404 }
      );
    }

    revalidatePath(`/products/${productSlug}`);
    revalidatePath("/dashboard");
    revalidatePath("/products");

    return NextResponse.json({
      success: true,
      transaction,
    });
  } catch (error: any) {
    console.error("Purchase confirmation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to confirm purchase" },
      { status: 500 }
    );
  }
}
