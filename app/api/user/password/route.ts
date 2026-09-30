import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getServerSession } from "@/lib/services/auth.service";
import { auth } from "@/lib/auth/auth";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { error: "Please enter your current password." },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "New password must be different from current password." },
        { status: 400 }
      );
    }

    // Call Better Auth changePassword
    const result = await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error: any) {
    console.error("Password change error:", error);
    const msg = error.message || error.statusText || "Failed to update password";
    return NextResponse.json(
      { error: msg.includes("password") ? msg : "Current password incorrect or invalid." },
      { status: 400 }
    );
  }
}
