import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/services/product.service";

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

    // Fetch the image from Cloudinary
    const imageRes = await fetch(product.image);
    if (!imageRes.ok) {
      return NextResponse.redirect(product.image);
    }

    const imageBlob = await imageRes.arrayBuffer();
    const contentType = imageRes.headers.get("content-type") || "image/png";

    return new NextResponse(imageBlob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${product.slug}.png"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Download failed", message: error.message },
      { status: 500 }
    );
  }
}
