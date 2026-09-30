import { connectToDatabase } from "@/lib/db/mongoose";
import ProductModel, { IProduct } from "@/lib/models/product.model";

export interface GetProductsParams {
  search?: string;
  device?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "title-asc" | "newest";
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: IProduct[];
  total: number;
  page: number;
  totalPages: number;
  devices: string[];
}

export async function getProducts(
  params: GetProductsParams = {}
): Promise<ProductsResponse> {
  await connectToDatabase();

  const {
    search,
    device,
    sort = "featured",
    minPrice,
    maxPrice,
    page = 1,
    limit = 24,
  } = params;

  // Build filter query
  const query: Record<string, unknown> = {};

  if (search && search.trim() !== "") {
    const trimmed = search.trim();
    // Escape regex special characters
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.$or = [
      { title: { $regex: escaped, $options: "i" } },
      { description: { $regex: escaped, $options: "i" } },
      { slug: { $regex: escaped, $options: "i" } },
    ];
  }

  if (device && device !== "all" && device !== "All") {
    // Case-insensitive regex match inside compatibleDevices array
    query.compatibleDevices = {
      $elemMatch: { $regex: new RegExp(`^${device}$`, "i") },
    };
  }

  if (typeof minPrice === "number" || typeof maxPrice === "number") {
    query.price = {};
    if (typeof minPrice === "number") {
      (query.price as Record<string, number>).$gte = minPrice;
    }
    if (typeof maxPrice === "number") {
      (query.price as Record<string, number>).$lte = maxPrice;
    }
  }

  // Sorting
  let sortOption: Record<string, 1 | -1> = { _id: 1 };
  if (sort === "price-asc") {
    sortOption = { price: 1 };
  } else if (sort === "price-desc") {
    sortOption = { price: -1 };
  } else if (sort === "title-asc") {
    sortOption = { title: 1 };
  } else if (sort === "newest") {
    sortOption = { _id: -1 };
  }

  const skip = (page - 1) * limit;

  const [rawProducts, total, distinctDevices] = await Promise.all([
    ProductModel.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),
    ProductModel.countDocuments(query),
    ProductModel.distinct("compatibleDevices"),
  ]);

  // Serialize MongoDB ObjectIds and Dates for React Client boundary
  const products: IProduct[] = rawProducts.map((doc: any) => ({
    _id: doc._id.toString(),
    title: doc.title || "",
    slug: doc.slug || "",
    description: doc.description || "",
    price: Number(doc.price) || 0,
    image: doc.image || "",
    compatibleDevices: Array.isArray(doc.compatibleDevices)
      ? doc.compatibleDevices
      : [],
    formats: Array.isArray(doc.formats) ? doc.formats : ["PNG"],
    lemonVariantId: doc.lemonVariantId || undefined,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : undefined,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
  }));

  const devicesList = Array.from(
    new Set((distinctDevices as string[]).filter(Boolean))
  ).sort();

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    devices: devicesList,
  };
}

export async function getProductBySlug(slug: string): Promise<IProduct | null> {
  await connectToDatabase();

  const mongoose = (await import("mongoose")).default;
  let doc = (await ProductModel.findOne({ slug }).lean()) as Record<string, unknown> | null;
  if (!doc && mongoose.Types.ObjectId.isValid(slug)) {
    doc = (await ProductModel.findById(slug).lean()) as Record<string, unknown> | null;
  }
  if (!doc) return null;

  return {
    _id: (doc._id as { toString(): string }).toString(),
    title: (doc.title as string) || "",
    slug: (doc.slug as string) || "",
    description: (doc.description as string) || "",
    price: Number(doc.price) || 0,
    image: (doc.image as string) || "",
    compatibleDevices: (doc.compatibleDevices as string[]) || [],
    formats: (doc.formats as string[]) || ["PNG"],
    lemonVariantId: (doc.lemonVariantId as string) || undefined,
    createdAt: doc.createdAt ? new Date(doc.createdAt as string | Date).toISOString() : undefined,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt as string | Date).toISOString() : undefined,
  };
}
