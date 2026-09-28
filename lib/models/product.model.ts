import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  compatibleDevices: string[];
  formats: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IProductDocument extends Omit<IProduct, "_id">, Document {}

const ProductSchema = new Schema<IProductDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    compatibleDevices: { type: [String], default: [] },
    formats: { type: [String], default: ["PNG"] },
  },
  {
    timestamps: true,
    collection: "products",
  }
);

// Text index for search across title and description
ProductSchema.index({ title: "text", description: "text" });

export const ProductModel: Model<IProductDocument> =
  mongoose.models.Product ||
  mongoose.model<IProductDocument>("Product", ProductSchema, "products");

export default ProductModel;
