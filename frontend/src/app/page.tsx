"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/auth");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <h1 className="text-6xl font-bold text-gray-900">Hello World</h1>
    </div>
  );
}
