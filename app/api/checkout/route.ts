import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/services/auth.service";
import { getProductBySlug } from "@/lib/services/product.service";
import { checkUserSkinOwnership, recordCompletedPurchase } from "@/lib/services/purchase.service";
import { createLemonCheckout } from "@/lib/services/lemonsqueezy.service";
import TransactionModel from "@/lib/models/transaction.model";

export async function POST(request: NextRequest) {
  try {
    // 1. Verify User Authentication
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json(
        {
          error: "You must be signed in to purchase a skin.",
          requiresAuth: true,
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, selectedDevice, simulate, returnUrl } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product identifier is required." },
        { status: 400 }
      );
    }

    // 2. Fetch Product from Database
    const product = await getProductBySlug(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    // 3. Check If User Already Owns This Skin
    const isOwned =
      (await checkUserSkinOwnership(session.user.id, product._id, session.user.email)) ||
      (await checkUserSkinOwnership(session.user.id, product.slug, session.user.email));

    if (isOwned) {
      return NextResponse.json({
        alreadyOwned: true,
        message: "You already own this skin! Download is active and unlocked in your vault.",
        redirectUrl: `/products/${product.slug}?purchased=true`,
      });
    }

    // 4. Development Simulation Mode (for testing when no variants exist yet on Lemon Squeezy)
    if (simulate === true) {
      const transactionId = `DEV-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`;
      const txn = await recordCompletedPurchase({
        userId: session.user.id,
        userEmail: session.user.email || "collector@stickify.store",
        userName: session.user.name || "Collector",
        productId: product._id,
        productSlug: product.slug,
        productTitle: product.title,
        productImage: product.image,
        price: product.price,
        currency: "USD",
        transactionId,
        licenseType: "Commercial & Personal Vinyl Cut License (300 DPI)",
      });

      return NextResponse.json({
        success: true,
        isSimulated: true,
        transaction: txn,
        transactionId,
        redirectUrl: `/products/${product.slug}?purchased=true`,
      });
    }

    // 5. Initiate Lemon Squeezy Checkout
    try {
      const checkout = await createLemonCheckout({
        userId: session.user.id,
        userEmail: session.user.email || "",
        userName: session.user.name || "Collector",
        productId: product._id,
        productSlug: product.slug,
        productTitle: product.title,
        productPrice: product.price,
        productImage: product.image,
        selectedDevice,
        variantId: product.lemonVariantId,
        returnUrl,
      });

      // Pre-record pending checkout transaction with the exact product info
      await TransactionModel.create({
        userId: session.user.id,
        userEmail: session.user.email || "",
        userName: session.user.name || "Collector",
        productId: product._id,
        productTitle: product.title,
        productSlug: product.slug,
        productImage: product.image,
        price: product.price,
        currency: "USD",
        status: "pending",
        transactionId: `PENDING-${checkout.checkoutId || Date.now()}`,
        licenseType: "Commercial & Personal Vinyl Cut License (300 DPI)",
        formats: product.formats || ["PNG", "SVG"],
      }).catch((err) => {
        console.warn("Failed to create pending checkout transaction:", err);
      });

      return NextResponse.json({
        success: true,
        checkoutUrl: checkout.url,
      });
    } catch (lemonErr: any) {
      console.error("Lemon Squeezy Checkout Error:", lemonErr);

      if (lemonErr.message?.includes("LEMONSQUEEZY_NO_VARIANT")) {
        return NextResponse.json(
          {
            error:
              "Lemon Squeezy store setup pending: No product variants exist yet in your Lemon Squeezy store (ID 486296).",
            noVariant: true,
            setupRequired: true,
            hint: "Please add a product in your Lemon Squeezy dashboard (https://app.lemonsqueezy.com/products/new). You can also simulate purchase in dev mode to test download unlocking immediately.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: lemonErr.message || "Failed to initiate Lemon Squeezy checkout.",
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Checkout route error:", err);
    return NextResponse.json(
      { error: "Internal checkout error", message: err.message },
      { status: 500 }
    );
  }
}
