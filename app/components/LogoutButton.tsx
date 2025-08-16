"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });

    router.push("/");
    router.refresh(); // odśwież, żeby zniknął awatar
  };

  return (
    <button
     onClick={async () => {
        await fetch("/api/logout", { method: "POST" });
        window.location.href = "/";
      }}
      className="text-yellow-300 text-sm font-medium  hover:text-red-600 transition-colors"
    >
      Wyloguj się
    </button>
  );
}
