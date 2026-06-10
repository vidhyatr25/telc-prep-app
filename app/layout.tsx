import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "DeutschLearn - TELC Exam Prep",
  description: "DeutschLearn helps students prepare for German TELC exams with structured courses, practice, mock tests, and progress tracking.",
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
