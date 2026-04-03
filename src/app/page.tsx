"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const USER_ID_KEY = "10markers_user_id";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem(USER_ID_KEY);
    if (userId) {
      router.replace("/dashboard");
    } else {
      router.replace("/onboarding");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#28312f]">
      <div className="w-8 h-8 border-4 border-[#c8973a] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
