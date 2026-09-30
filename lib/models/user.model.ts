import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role?: "user" | "admin" | string;
  banned?: boolean;
  banReason?: string;
  banExpires?: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    emailVerified: { type: Boolean, default: false },
    image: { type: String, default: null },
    role: { type: String, default: "user" },
    banned: { type: Boolean, default: false },
    banReason: { type: String, default: null },
    banExpires: { type: Number, default: null },
  },
  {
    timestamps: true,
    collection: "user", // Aligns with Better Auth MongoDB collection naming
  }
);

export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
