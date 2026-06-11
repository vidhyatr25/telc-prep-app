import Link from "next/link";
import { ArrowLeft, BookOpen, BookMarked, ChevronRight, FileText, MessageSquare, Star } from "lucide-react";
import { a2Units } from "@/data/a2-curriculum";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const typeIcon = {
  vocab: BookOpen,
  grammar: BookMarked,
  dialogue: MessageSquare,
  reading: FileText,
};

export default async function A2UnitPage({ params }: { params: Promise<{ unitSlug: string }> }) {
  const { unitSlug } = await params;
  const unit = a2Units.find((item) => item.slug === unitSlug);

  if (!unit) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="text-gray-400">A2 unit not found.</p>
        <Link href="/learn/a2" className="btn-primary mt-4 inline-flex">Back to A2</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-5 space-y-5">
      <Breadcrumbs
        items={[
          { label: "German A2", href: "/learn/a2" },
          { label: unit.title },
        ]}
      />

      <section className="card p-5">
        <Link href="/learn/a2" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white">
          <ArrowLeft size={14} />
          Back to A2 syllabus
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold text-white">{unit.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">{unit.description}</p>
        <p className="mt-3 rounded-xl border border-blue-400/20 bg-blue-400/10 px-3 py-2 text-sm text-blue-200">
          Exam focus: {unit.examFocus}
        </p>
      </section>

      <section className="space-y-3">
        {unit.lessons.map((lesson) => {
          const Icon = typeIcon[lesson.type];
          return (
            <Link key={lesson.id} href={`/learn/a2/${unit.slug}/lesson/${lesson.id}`} className="block">
              <article className="card flex items-center gap-4 p-4 transition-all hover:border-gray-600">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-800 bg-gray-950 text-blue-300">
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-white">{lesson.title}</h2>
                  <p className="mt-1 line-clamp-1 text-sm text-gray-400">{lesson.content}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-yellow-400">
                  <Star size={12} /> {lesson.xp}
                </span>
                <ChevronRight size={18} className="shrink-0 text-gray-600" />
              </article>
            </Link>
          );
        })}
      </section>

      <Link href={`/learn/a2/${unit.slug}/quiz`} className="btn-primary flex items-center justify-center">
        Start unit quiz
      </Link>
    </div>
  );
}
