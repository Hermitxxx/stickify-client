import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/services/product.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const device = searchParams.get("device") || undefined;
    const sort = (searchParams.get("sort") as any) || "featured";
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page")!, 10)
      : 1;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : 24;

    const data = await getProducts({
      search,
      device,
      sort,
      page,
      limit,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", message: error.message },
      { status: 500 }
    );
  }
}
