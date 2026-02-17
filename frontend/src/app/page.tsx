"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export default function Home() {
  const { isAuthenticated, hydrated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (hydrated) {
      router.replace(isAuthenticated ? "/dashboard" : "/auth/login");
    }
  }, [hydrated, isAuthenticated, router]);

  return <div className="min-h-screen bg-background" />;
}
