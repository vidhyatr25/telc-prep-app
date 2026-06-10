"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const { lang } = useLang();

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs font-semibold text-gray-500">
      <Link href="/" className="inline-flex items-center gap-1 text-gray-400 transition-colors hover:text-white">
        <Home size={13} />
        {lang === "de" ? "Startseite" : "Home"}
      </Link>
      {items.map((item) => (
        <span key={`${item.label}-${item.href ?? "current"}`} className="inline-flex items-center gap-1">
          <ChevronRight size={13} className="text-gray-700" />
          {item.href ? (
            <Link href={item.href} className="text-gray-400 transition-colors hover:text-white">
              {item.label}
            </Link>
          ) : (
            <span className="text-yellow-400">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
