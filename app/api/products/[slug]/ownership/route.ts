import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/services/product.service";
import { getServerSession } from "@/lib/services/auth.service";
import { checkUserSkinOwnership } from "@/lib/services/purchase.service";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({
        isAuthenticated: false,
        isOwned: false,
        isAdmin: false,
      });
    }

    const isAdmin =
      (session.user as any)?.role === "admin" ||
      session.user.email?.includes("admin");

    const isOwned =
      isAdmin ||
      (await checkUserSkinOwnership(session.user.id, product._id, session.user.email)) ||
      (await checkUserSkinOwnership(session.user.id, product.slug, session.user.email));

    return NextResponse.json({
      isAuthenticated: true,
      isOwned,
      isAdmin,
      userId: session.user.id,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: "Failed to check ownership", message: err.message },
      { status: 500 }
    );
  }
}
