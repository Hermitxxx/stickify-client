import { NextResponse } from "next/server";
import { getServerSession, getUserRole } from "@/lib/services/auth.service";
import {
  getUserDashboardData,
  getAdminDashboardData,
} from "@/lib/services/dashboard.service";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = await getUserRole(session.user.id);
    const userData = await getUserDashboardData(
      session.user.id,
      session.user.email,
      session.user.name
    );

    let adminData = null;
    if (role === "admin") {
      adminData = await getAdminDashboardData();
    }

    return NextResponse.json({
      success: true,
      role,
      userData,
      adminData,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Dashboard API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data", message: err.message },
      { status: 500 }
    );
  }
}
