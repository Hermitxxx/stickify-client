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

    if (!product || !product.image) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 1. Verify User Session
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json(
        {
          error: "Authentication required. Please sign in to download this skin.",
          requiresAuth: true,
        },
        { status: 401 }
      );
    }

    // 2. Verify Skin Ownership (or Admin Privileges)
    const isAdmin =
      (session.user as any)?.role === "admin" ||
      session.user.email?.includes("admin");

    const isOwned =
      isAdmin ||
      (await checkUserSkinOwnership(session.user.id, product._id, session.user.email)) ||
      (await checkUserSkinOwnership(session.user.id, product.slug, session.user.email));

    if (!isOwned) {
      return NextResponse.json(
        {
          error:
            "Purchase required: This skin's 300 DPI vector cut files are locked until purchased.",
          requiresPurchase: true,
          productSlug: product.slug,
          productTitle: product.title,
          price: product.price,
        },
        { status: 403 }
      );
    }

    // 3. User is authorized & has purchased — serve download
    let imageUrl = product.image;
    if (imageUrl.startsWith("/")) {
      imageUrl = new URL(imageUrl, request.url).toString();
    }

    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      return NextResponse.redirect(imageUrl);
    }

    const imageBlob = await imageRes.arrayBuffer();
    const contentType = imageRes.headers.get("content-type") || "image/png";

    return new NextResponse(imageBlob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${product.slug}-300dpi-cutfile.png"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-Licensed-To": session.user.email || session.user.id,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Download authorization error:", err);
    return NextResponse.json(
      { error: "Download failed", message: err.message },
      { status: 500 }
    );
  }
}
