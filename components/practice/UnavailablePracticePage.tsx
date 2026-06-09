import Link from "next/link";
import { ArrowLeft, Clock, Lock } from "lucide-react";
import { courseLevels } from "@/data/curriculum";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export function UnavailablePracticePage({
  levelSlug,
  kind,
}: {
  levelSlug: string;
  kind: "games" | "mock-tests";
}) {
  const level = courseLevels.find((item) => item.slug === levelSlug);
  const preparing = level?.status === "preparing";
  const title = level ? `${level.title} ${kind === "games" ? "Games" : "Mock Tests"}` : "Practice area";
  const backHref = kind === "games" ? "/games" : "/mock-tests";

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Breadcrumbs
        items={[
          { label: kind === "games" ? "Games" : "Mock Tests", href: backHref },
          { label: title },
        ]}
      />

      <div className="card mt-6 p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-gray-800 bg-gray-950">
          {preparing ? <Clock size={24} className="text-blue-300" /> : <Lock size={24} className="text-gray-500" />}
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-white">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">
          {preparing
            ? "This level is being prepared. It will open after the syllabus, vocabulary pool, games, and test bank are complete."
            : "This level is planned for a later release."}
        </p>
        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
          <Link href={backHref} className="btn-secondary inline-flex items-center justify-center gap-2">
            <ArrowLeft size={16} />
            Level selector
          </Link>
          <Link href="/" className="btn-primary inline-flex items-center justify-center">
            Course dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
