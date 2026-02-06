"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hydrated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [hydrated, isAuthenticated, router]);

  // Keep SSR + first client render consistent: we only decide after hydration.
  if (!hydrated) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-background" />;
  }

  return <>{children}</>;
}
