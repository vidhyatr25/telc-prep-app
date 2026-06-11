import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle, MessageCircle, Volume2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { a2Units } from "@/data/a2-curriculum";
import { cn } from "@/lib/utils";

const lessonTypeCopy = {
  vocab: { label: "Vocabulary", icon: BookOpen, color: "text-blue-300" },
  grammar: { label: "Grammar", icon: CheckCircle, color: "text-yellow-300" },
  dialogue: { label: "Dialogue", icon: MessageCircle, color: "text-purple-300" },
  reading: { label: "Reading", icon: BookOpen, color: "text-green-300" },
};

export default async function A2LessonPage({
  params,
}: {
  params: Promise<{ unitSlug: string; lessonId: string }>;
}) {
  const { unitSlug, lessonId } = await params;
  const unit = a2Units.find((item) => item.slug === unitSlug);
  const lesson = unit?.lessons.find((item) => item.id === lessonId);

  if (!unit || !lesson) notFound();

  const type = lessonTypeCopy[lesson.type];
  const TypeIcon = type.icon;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-5">
      <Breadcrumbs
        items={[
          { label: "Courses", href: "/learn" },
          { label: "A2", href: "/learn/a2" },
          { label: unit.title, href: `/learn/a2/${unit.slug}` },
          { label: lesson.title },
        ]}
      />

      <Link
        href={`/learn/a2/${unit.slug}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to unit
      </Link>

      <article className="card p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className={cn("inline-flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-950 px-3 py-1.5 text-sm font-bold", type.color)}>
              <TypeIcon size={16} />
              {type.label}
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-white">{lesson.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">{lesson.content}</p>
          </div>
          <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3 text-sm font-bold text-yellow-300">
            +{lesson.xp} XP
          </div>
        </div>
      </article>

      {lesson.vocab && (
        <section className="grid gap-3 sm:grid-cols-2">
          {lesson.vocab.map((item) => (
            <div key={item.german} className="card p-4">
              <p className="text-lg font-extrabold text-white">{item.german}</p>
              <p className="mt-1 text-sm text-gray-400">{item.english}</p>
              {item.example && (
                <p className="mt-3 rounded-xl border border-gray-800 bg-gray-950 p-3 text-sm text-blue-200">
                  {item.example}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {lesson.grammar && (
        <section className="space-y-4">
          {lesson.grammar.map((rule) => (
            <article key={rule.title} className="card p-5">
              <h2 className="text-xl font-extrabold text-white">{rule.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{rule.explanation}</p>
              <div className="mt-4 space-y-3">
                {rule.examples.map((example) => (
                  <div key={example.german} className="rounded-xl border border-gray-800 bg-gray-950 p-4">
                    <p className="font-bold text-white">{example.german}</p>
                    <p className="mt-1 text-sm text-gray-400">{example.english}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={`/learn/a2/${unit.slug}`} className="btn-secondary flex items-center justify-center gap-2">
          <ArrowLeft size={16} />
          Unit overview
        </Link>
        <Link href={`/learn/a2/${unit.slug}/quiz`} className="btn-primary flex items-center justify-center gap-2">
          <Volume2 size={16} />
          Take unit quiz
        </Link>
      </div>
    </div>
  );
}
