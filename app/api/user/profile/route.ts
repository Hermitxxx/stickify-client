import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getServerSession } from "@/lib/services/auth.service";
import { connectToDatabase } from "@/lib/db/mongoose";
import UserModel from "@/lib/models/user.model";
import { auth } from "@/lib/auth/auth";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await UserModel.findById(session.user.id).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image || null,
        role: user.role || "user",
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("GET user profile error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, image } = body;

    const updateFields: Record<string, any> = {};

    if (typeof name === "string") {
      const trimmed = name.trim();
      if (!trimmed) {
        return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
      }
      updateFields.name = trimmed;
    }

    if (image !== undefined) {
      updateFields.image = typeof image === "string" && image.trim() ? image.trim() : null;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    await connectToDatabase();

    // 1. Update using Mongoose with schema validation
    const updatedUser = await UserModel.findByIdAndUpdate(
      session.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Keep Better Auth session synchronized
    try {
      await auth.api.updateUser({
        headers: await headers(),
        body: updateFields,
      });
    } catch (syncErr) {
      console.warn("Better Auth session sync warning:", syncErr);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        role: updatedUser.role,
      },
    });
  } catch (error: any) {
    console.error("PATCH user profile error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
