"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { hydrateFromStorage } from "@/store/slices/authSlice";
import type { User } from "@/store/slices/authSlice";

function isUser(value: unknown): value is User {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.email === "string" &&
    typeof record.name === "string"
  );
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userStr = localStorage.getItem("user");

    let user: User | null = null;
    if (userStr) {
      try {
        const parsed: unknown = JSON.parse(userStr);
        user = isUser(parsed) ? parsed : null;
      } catch {
        user = null;
      }
    }

    // We intentionally hydrate AFTER mount to keep SSR markup stable
    // and avoid hydration mismatches.
    store.dispatch(
      hydrateFromStorage({
        token,
        user,
      }),
    );
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
