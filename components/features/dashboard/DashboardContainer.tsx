"use client";

import React, { useState } from "react";
import { UserDashboardData, AdminDashboardData } from "@/lib/services/dashboard.service";
import { DashboardSidebar, DashboardTab } from "./DashboardSidebar";
import { DashboardTopBar } from "./DashboardTopBar";
import UserDashboardView from "./UserDashboardView";
import AdminDashboardView from "./AdminDashboardView";
import { motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { selectBookmarksCount } from "@/lib/redux/slices/bookmarksSlice";
import { setInitialPurchases } from "@/lib/redux/slices/purchasesSlice";

interface DashboardContainerProps {
  userData: UserDashboardData;
  adminData?: AdminDashboardData | null;
  role: "admin" | "user";
  initialView?: "admin" | "collector";
}

export function DashboardContainer({
  userData: initialUserData,
  adminData: initialAdminData,
  role,
  initialView = role === "admin" ? "admin" : "collector",
}: DashboardContainerProps) {
  const dispatch = useAppDispatch();
  const reduxBookmarksCount = useAppSelector(selectBookmarksCount);

  const [userData, setUserData] = useState<UserDashboardData>(initialUserData);
  const [adminData, setAdminData] = useState<AdminDashboardData | null | undefined>(
    initialAdminData
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Synchronize state when props update
  React.useEffect(() => {
    setUserData(initialUserData);
  }, [initialUserData]);

  React.useEffect(() => {
    setAdminData(initialAdminData);
  }, [initialAdminData]);

  const [activeTab, setActiveTab] = useState<DashboardTab>(
    initialView === "admin" && role === "admin" ? "admin-users" : "purchases"
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const json = await res.json();
        if (json.userData) {
          setUserData(json.userData);
          if (json.userData.transactions) {
            dispatch(setInitialPurchases({ transactions: json.userData.transactions }));
          }
        }
      }
    } catch (err) {
      console.error("Dashboard refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSwitchView = (view: "admin" | "collector") => {
    if (view === "admin") {
      setActiveTab("admin-users");
    } else {
      setActiveTab("purchases");
    }
  };

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
  };

  const bookmarksCount =
    reduxBookmarksCount > 0 || !userData.bookmarks
      ? reduxBookmarksCount
      : userData.bookmarks.length;

  const isAdminTab = activeTab === "admin-users" || activeTab === "admin-transactions";

  return (
    <div className="relative z-10 min-h-screen flex flex-col lg:flex-row w-full">
      {/* 1. Dashboard Sidebar (Desktop docked & Mobile drawer) */}
      <DashboardSidebar
        user={userData.user}
        role={role}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        purchasesCount={userData.transactions.length}
        bookmarksCount={bookmarksCount}
        transactionsCount={userData.transactions.length}
        adminUsersCount={adminData?.users.length || 0}
        adminTransactionsCount={adminData?.transactions.length || 0}
        totalSpent={userData.stats.totalSpent}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Dashboard Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Sticky Top Navigation Bar */}
        <DashboardTopBar
          user={userData.user}
          role={role}
          activeTab={activeTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
          onSwitchView={role === "admin" ? handleSwitchView : undefined}
        />

        {/* Content Container */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {isAdminTab && role === "admin" && adminData ? (
              <AdminDashboardView
                initialData={adminData}
                currentUserId={userData.user.id}
                activeTab={activeTab === "admin-users" ? "users" : "transactions"}
                onTabChange={(tab) =>
                  setActiveTab(tab === "users" ? "admin-users" : "admin-transactions")
                }
              />
            ) : (
              <UserDashboardView
                initialData={userData}
                activeTab={
                  activeTab === "bookmarks"
                    ? "bookmarks"
                    : activeTab === "transactions"
                    ? "transactions"
                    : "purchases"
                }
                onTabChange={(tab) => setActiveTab(tab)}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default DashboardContainer;
