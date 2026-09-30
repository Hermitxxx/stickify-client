"use client";

import React, { useState } from "react";
import { UserDashboardData, AdminDashboardData } from "@/lib/services/dashboard.service";
import DashboardHeader from "./DashboardHeader";
import UserDashboardView from "./UserDashboardView";
import AdminDashboardView from "./AdminDashboardView";

interface DashboardContainerProps {
  userData: UserDashboardData;
  adminData?: AdminDashboardData | null;
  role: "admin" | "user";
  initialView?: "admin" | "collector";
}

export function DashboardContainer({
  userData,
  adminData,
  role,
  initialView = role === "admin" ? "admin" : "collector",
}: DashboardContainerProps) {
  const [currentView, setCurrentView] = useState<"admin" | "collector">(
    role === "admin" ? initialView : "collector"
  );

  return (
    <div className="space-y-8">
      {/* Universal Dashboard Header with Role Switching for Admins */}
      <DashboardHeader
        user={userData.user}
        role={role}
        currentView={currentView}
        onViewChange={role === "admin" ? setCurrentView : undefined}
      />

      {/* Main View Transition */}
      {role === "admin" && currentView === "admin" && adminData ? (
        <AdminDashboardView
          initialData={adminData}
          currentUserId={userData.user.id}
        />
      ) : (
        <UserDashboardView initialData={userData} />
      )}
    </div>
  );
}

export default DashboardContainer;
