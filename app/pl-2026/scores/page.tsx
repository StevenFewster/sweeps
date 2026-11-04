import Link from "next/link";
import ScoresTable from "@/components/ScoresTable";
import { ScoresData } from "@/lib/types";
import scoresData from "@/public/scores.json";
import PageLayout from "@/components/PageLayout";
import { PL2026_NAV_ITEMS, PL2026_NAME } from "@/lib/constants";

export default async function ScoresPage() {
  const data = scoresData as ScoresData;

  return (
    <PageLayout
      title="Current Scores"
      competition={PL2026_NAME}
      navItems={PL2026_NAV_ITEMS}
    >
      <div className="card sf-panel-outline">
        <div className="card-body p-2 md:p-4">
          {data.players.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg mb-4">No scores available yet.</p>
              <p className="text-sm text-base-content/70">
                Please update the league table to generate scores.
              </p>
              <Link href="/pl-2026/table" className="btn btn-primary mt-4">
                Go to Table Editor
              </Link>
            </div>
          ) : (
            <ScoresTable
              players={data.players}
              estimatedTotalGoals={data.estimatedTotalGoals}
              timestamp={data.generatedAt}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
