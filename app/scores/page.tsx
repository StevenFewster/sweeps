import Link from 'next/link';
import ScoresTable from '@/components/ScoresTable';
import { ScoresData } from '@/lib/types';
import scoresData from '@/public/scores.json';

export default async function ScoresPage() {
  const data = scoresData as ScoresData;

  return (
    <div className="min-h-screen bg-base-200 md:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="navbar bg-base-100 md:rounded-box shadow-md mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold pl-4">Current Scores</h1>
          </div>
          <div className="flex-none">
            <Link href="/" className="btn btn-ghost">
              Home
            </Link>
            <Link href="/table" className="btn btn-ghost">
              Edit Table
            </Link>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl rounded-none md:rounded-box">
          <div className="card-body p-2 md:p-4">
            {data.players.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg mb-4">No scores available yet.</p>
                <p className="text-sm text-base-content/70">
                  Please update the league table to generate scores.
                </p>
                <Link href="/table" className="btn btn-primary mt-4">
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
