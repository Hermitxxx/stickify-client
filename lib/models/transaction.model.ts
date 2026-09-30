import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITransaction {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  productId: mongoose.Types.ObjectId | string;
  productTitle: string;
  productSlug: string;
  productImage: string;
  price: number;
  currency: string;
  status: "completed" | "pending" | "refunded";
  transactionId: string;
  licenseType: string;
  formats: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ITransactionDocument extends Omit<ITransaction, "_id">, Document {}

const TransactionSchema = new Schema<ITransactionDocument>(
  {
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productTitle: { type: String, required: true },
    productSlug: { type: String, required: true },
    productImage: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["completed", "pending", "refunded"],
      default: "completed",
      index: true,
    },
    transactionId: { type: String, required: true, unique: true, index: true },
    licenseType: { type: String, default: "Precision Cut & Vinyl Commercial License" },
    formats: { type: [String], default: ["PNG", "SVG"] },
  },
  {
    timestamps: true,
    collection: "transactions",
  }
);

TransactionSchema.index({ createdAt: -1 });

export const TransactionModel: Model<ITransactionDocument> =
  mongoose.models.Transaction ||
  mongoose.model<ITransactionDocument>("Transaction", TransactionSchema, "transactions");

export default TransactionModel;
