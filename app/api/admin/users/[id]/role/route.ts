import { NextRequest, NextResponse } from "next/server";
import { getServerSession, getUserRole } from "@/lib/services/auth.service";
import { updateUserRole } from "@/lib/services/dashboard.service";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentRole = await getUserRole(session.user.id);
    if (currentRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required" },
        { status: 403 }
      );
    }

    const { id: targetUserId } = await context.params;
    const body = await req.json();
    const { role } = body;

    if (role !== "admin" && role !== "user") {
      return NextResponse.json(
        { error: "Invalid role. Must be 'admin' or 'user'" },
        { status: 400 }
      );
    }

    const result = await updateUserRole(targetUserId, role, session.user.id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Admin user role PATCH error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update role" },
      { status: 400 }
    );
  }
}
