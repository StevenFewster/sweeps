import Link from "next/link";
import LeagueTableEditor from "@/components/LeagueTableEditor";
import { Team } from "@/lib/types";
import leagueTableData from "@/public/league-table.json";
import PageLayout from "@/components/PageLayout";
import { PL2026_NAV_ITEMS, PL2026_NAME } from "@/lib/constants";

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
      competition={PL2026_NAME}
      navItems={PL2026_NAV_ITEMS}
    >
      <LeagueTableEditor
        initialTeams={initialTeams}
        initialGamesPlayed={initialGamesPlayed}
        initialTotalGoals={initialTotalGoals}
      />
    </PageLayout>
  );
}
