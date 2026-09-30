import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getServerSession } from "@/lib/services/auth.service";
import { connectToDatabase } from "@/lib/db/mongoose";
import UserModel from "@/lib/models/user.model";
import mongoose from "mongoose";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    await connectToDatabase();

    // Check if new email is already taken by another account
    const existing = await UserModel.findOne({
      email: normalizedEmail,
      _id: { $ne: new mongoose.Types.ObjectId(session.user.id) },
    }).lean();

    if (existing) {
      return NextResponse.json(
        { error: "This email address is already in use by another account." },
        { status: 409 }
      );
    }

    // 1. Update using Mongoose
    const updated = await UserModel.findByIdAndUpdate(
      session.user.id,
      { $set: { email: normalizedEmail } },
      { new: true }
    ).lean();

    // 2. Also update Better Auth account records if present
    const db = mongoose.connection.db;
    if (db) {
      const orFilters: any[] = [{ userId: session.user.id }];
      if (mongoose.Types.ObjectId.isValid(session.user.id)) {
        orFilters.push({ userId: new mongoose.Types.ObjectId(session.user.id) });
      }
      await db.collection("account").updateMany(
        { $or: orFilters },
        { $set: { accountId: normalizedEmail } }
      );
    }

    return NextResponse.json({
      success: true,
      email: normalizedEmail,
      message: "Email address updated successfully.",
    });
  } catch (error: any) {
    console.error("Email update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update email address" },
      { status: 500 }
    );
  }
}
