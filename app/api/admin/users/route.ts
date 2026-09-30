import { NextRequest, NextResponse } from "next/server";
import { getServerSession, getUserRole } from "@/lib/services/auth.service";
import { deleteUserAccount, getAdminDashboardData } from "@/lib/services/dashboard.service";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = await getUserRole(session.user.id);
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required" },
        { status: 403 }
      );
    }

    const data = await getAdminDashboardData();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Admin users GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve users" },
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

    const role = await getUserRole(session.user.id);
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required to delete users" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get("userId");

    if (!targetUserId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
    }

    const result = await deleteUserAccount(targetUserId, session.user.id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Admin user DELETE error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete user account" },
      { status: 400 }
    );
  }
}
