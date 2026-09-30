import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBookmark {
  _id: string;
  userId: string;
  productId: mongoose.Types.ObjectId | string;
  productTitle: string;
  productSlug: string;
  productImage: string;
  productPrice: number;
  compatibleDevices: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IBookmarkDocument extends Omit<IBookmark, "_id">, Document {}

const BookmarkSchema = new Schema<IBookmarkDocument>(
  {
    userId: { type: String, required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productTitle: { type: String, required: true },
    productSlug: { type: String, required: true },
    productImage: { type: String, required: true },
    productPrice: { type: Number, required: true },
    compatibleDevices: { type: [String], default: [] },
  },
  {
    timestamps: true,
    collection: "bookmarks",
  }
);

// Prevent duplicate bookmark of the same product for the same user
BookmarkSchema.index({ userId: 1, productId: 1 }, { unique: true });
BookmarkSchema.index({ userId: 1, createdAt: -1 });

export const BookmarkModel: Model<IBookmarkDocument> =
  mongoose.models.Bookmark ||
  mongoose.model<IBookmarkDocument>("Bookmark", BookmarkSchema, "bookmarks");

export default BookmarkModel;
