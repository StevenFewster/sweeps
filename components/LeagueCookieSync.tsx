"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LeagueCookieSync() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const league = searchParams.get("league");
    if (league) {
      document.cookie = `league=${encodeURIComponent(league)}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [searchParams]);

  return null;
}
