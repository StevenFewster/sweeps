import LeagueTableEditor from "@/components/LeagueTableEditor";
import { Team } from "@/lib/types";
import leagueTableData from "@/public/pl-26-27/league-table.json";
import PageNav from "@/components/PageNav";
import { PL2027_NAV_ITEMS } from "@/lib/constants";

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
        <PageNav navItems={PL2027_NAV_ITEMS}>League Table Editor</PageNav>

        <LeagueTableEditor
          initialTeams={initialTeams}
          initialGamesPlayed={initialGamesPlayed}
          initialTotalGoals={initialTotalGoals}
        />
      </div>
    </div>
  );
}
