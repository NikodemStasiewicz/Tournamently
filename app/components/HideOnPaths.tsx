"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function HideOnPaths({
  paths,
  children,
}: {
  paths: (string | RegExp)[];
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "/";
  const shouldHide = paths.some((p) =>
    typeof p === "string" ? pathname.startsWith(p) : p.test(pathname)
  );
  if (shouldHide) return null;
  return <>{children}</>;
}
