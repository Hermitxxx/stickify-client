import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/services/auth.service";
import { removeBookmark, addBookmark } from "@/lib/services/dashboard.service";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const result = await addBookmark(session.user.id, productId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Bookmark add error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add bookmark" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let productId = searchParams.get("productId");

    if (!productId) {
      try {
        const body = await req.json();
        productId = body.productId;
      } catch {
        // body not present
      }
    }

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const result = await removeBookmark(session.user.id, productId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Bookmark remove error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to remove bookmark" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ isBookmarked: false, bookmarks: [], bookmarkedIds: [] });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    const { connectToDatabase } = await import("@/lib/db/mongoose");
    const { default: BookmarkModel } = await import("@/lib/models/bookmark.model");
    await connectToDatabase();

    // If specific product check is requested
    if (productId) {
      const exists = await BookmarkModel.exists({
        userId: session.user.id,
        productId,
      });

      return NextResponse.json({ isBookmarked: Boolean(exists) });
    }

    // Return list of all bookmarks for the authenticated user
    const rawBookmarks = await BookmarkModel.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const bookmarks = rawBookmarks.map((b: any) => ({
      _id: b._id.toString(),
      userId: b.userId,
      productId: b.productId?.toString(),
      productTitle: b.productTitle,
      productSlug: b.productSlug,
      productImage: b.productImage,
      productPrice: Number(b.productPrice) || 0,
      compatibleDevices: b.compatibleDevices || [],
      createdAt: b.createdAt ? new Date(b.createdAt).toISOString() : undefined,
      updatedAt: b.updatedAt ? new Date(b.updatedAt).toISOString() : undefined,
    }));

    const bookmarkedIds = bookmarks.map((b) => b.productId);

    return NextResponse.json({ bookmarks, bookmarkedIds });
  } catch (error: any) {
    console.error("Bookmark fetch error:", error);
    return NextResponse.json({ isBookmarked: false, bookmarks: [], bookmarkedIds: [] });
  }
}

