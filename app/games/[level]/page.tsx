import { UnavailablePracticePage } from "@/components/practice/UnavailablePracticePage";

export default async function GamesLevelUnavailableRoute({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  return <UnavailablePracticePage levelSlug={level} kind="games" />;
}
