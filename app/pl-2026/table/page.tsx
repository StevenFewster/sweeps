import Link from 'next/link';
import LeagueTableEditor from '@/components/LeagueTableEditor';
import { Team } from '@/lib/types';
import leagueTableData from '@/public/league-table.json';

export default function TablePage() {
  // Load teams from league-table.json if available, otherwise use default teams
  const initialTeams: Team[] = leagueTableData.teams.map((team) => ({
    position: team.position,
    shortName: team.shortName,
    name: team.name,
  }));

  const initialGamesPlayed = leagueTableData.gamesPlayed || 0;
  const initialTotalGoals = leagueTableData.totalGoals || 0;

  return (
    <div className="min-h-screen bg-base-200 md:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="navbar bg-base-100 md:rounded-box shadow-md mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold pl-4">League Table Editor</h1>
          </div>
          <div className="flex-none">
            <Link href="/" className="btn btn-ghost">
              Home
            </Link>
            <Link href="/pl-2026/scores" className="btn btn-ghost">
              Scores
            </Link>
          </div>
        </div>

        <LeagueTableEditor
          initialTeams={initialTeams}
          initialGamesPlayed={initialGamesPlayed}
          initialTotalGoals={initialTotalGoals}
        />
      </div>
    </div>
  );
}
