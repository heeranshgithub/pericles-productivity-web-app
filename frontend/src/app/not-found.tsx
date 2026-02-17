"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const { isAuthenticated, hydrated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleGoHome = () => {
    router.push(isAuthenticated ? "/dashboard" : "/auth/login");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-6">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>

        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
          Error 404
        </p>

        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Page Not Found
        </h1>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-8">
          The page you are looking for does not exist or has been moved.
        </p>

        {hydrated && (
          <Button onClick={handleGoHome} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {isAuthenticated ? "Back to Dashboard" : "Go to Login"}
          </Button>
        )}
      </div>
    </div>
  );
}
