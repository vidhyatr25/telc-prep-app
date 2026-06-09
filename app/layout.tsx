import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Deutsch TELC - Exam Prep",
  description: "German TELC exam preparation with structured courses, practice, mock tests, and progress tracking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
