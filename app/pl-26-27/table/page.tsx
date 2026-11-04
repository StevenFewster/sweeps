import LeagueTableEditor from "@/components/LeagueTableEditor";
import { Team } from "@/lib/types";
import leagueTableData from "@/public/pl-26-27/league-table.json";
import PageLayout from "@/components/PageLayout";
import { PL2027_NAV_ITEMS, PL2027_NAME } from "@/lib/constants";

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
    <PageLayout
      title="League Table Editor"
      competition={PL2027_NAME}
      navItems={PL2027_NAV_ITEMS}
    >
      <LeagueTableEditor
        initialTeams={initialTeams}
        initialGamesPlayed={initialGamesPlayed}
        initialTotalGoals={initialTotalGoals}
      />
    </PageLayout>
  );
}
