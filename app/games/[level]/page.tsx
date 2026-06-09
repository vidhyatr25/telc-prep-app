import { UnavailablePracticePage } from "@/components/practice/UnavailablePracticePage";

export default function GamesLevelUnavailableRoute({
  params,
}: {
  params: { level: string };
}) {
  return <UnavailablePracticePage levelSlug={params.level} kind="games" />;
}
