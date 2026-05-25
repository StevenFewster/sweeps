import Link from "next/link";
import ScoresTable from "@/components/ScoresTable";
import { ScoresData } from "@/lib/types";
import scoresData from "@/public/pl-26-27/scores.json";
import PageNav from "@/components/PageNav";
import { PL2027_NAV_ITEMS } from "@/lib/constants";

export default async function ScoresPage() {
  const data = scoresData as ScoresData;

  return (
    <div className="min-h-screen bg-base-200 md:p-4">
      <div className="max-w-6xl mx-auto">
        <PageNav navItems={PL2027_NAV_ITEMS}>Current Scores</PageNav>

        <div className="card bg-base-100 shadow-xl rounded-none md:rounded-box">
          <div className="card-body p-2 md:p-4">
            {data.players.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg mb-4">No scores available yet.</p>
                <p className="text-sm text-base-content/70">
                  Please update the league table to generate scores.
                </p>
                <Link href="/pl-26-27/table" className="btn btn-primary mt-4">
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
      </div>
    </div>
  );
}
