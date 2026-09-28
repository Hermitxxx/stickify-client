"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { signOut } from "@/lib/auth/auth-client";

export default function DashboardSignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-danger hover:text-red transition-colors px-3 py-1.5 rounded-full border border-danger/30 hover:bg-danger/10 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-danger"
    >
      {isSigningOut ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <LogOut className="h-3.5 w-3.5" />
      )}
      <span>{isSigningOut ? "Signing out..." : "Log out"}</span>
    </button>
  );
}
