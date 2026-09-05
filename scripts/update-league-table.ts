/**
 * Update League Table Script
 *
 * This script fetches the current Premier League table from the BBC Sport website
 * and updates the local league-table.json file with:
 * - Team positions and names
 * - Games played
 * - Total goals scored so far
 * - Estimated total goals for the full season (calculated based on current goal rate)
 * - Timestamp of the update
 *
 * Usage: npm run update-league-table
 */

import * as fs from "fs";
import * as path from "path";
import { JSDOM } from "jsdom";

interface Team {
  position: number;
  shortName: string;
  name: string;
}

interface LeagueTable {
  teams: Team[];
  gamesPlayed: number;
  totalGoals: number;
  estimatedTotalGoals: number;
  timestamp: string;
}

// Team name mappings from BBC to our shortNames
const teamMappings: { [key: string]: string } = {
  Arsenal: "ARS",
  "Manchester City": "MCI",
  "Aston Villa": "AVL",
  Chelsea: "CHE",
  "Crystal Palace": "CRY",
  "Manchester United": "MUN",
  Liverpool: "LIV",
  Sunderland: "SUN",
  Everton: "EVE",
  "Brighton & Hove Albion": "BHA",
  Brighton: "BHA",
  "Tottenham Hotspur": "TOT",
  Tottenham: "TOT",
  "Newcastle United": "NEW",
  Newcastle: "NEW",
  "AFC Bournemouth": "BOU",
  Bournemouth: "BOU",
  Fulham: "FUL",
  Brentford: "BRE",
  Brenford: "BRE",
  "Nottingham Forest": "NFO",
  "Nott'm Forest": "NFO",
  "Leeds United": "LEE",
  Leeds: "LEE",
  "West Ham United": "WHU",
  "West Ham": "WHU",
  Burnley: "BUR",
  "Wolverhampton Wanderers": "WOL",
  Wolves: "WOL",
  "Leicester City": "LEI",
  Leicester: "LEI",
  Southampton: "SOU",
  "Ipswich Town": "IPS",
  Ipswich: "IPS",
  "Luton Town": "LUT",
  Luton: "LUT",
  "Sheffield United": "SHU",
  "Sheffield Utd": "SHU",
  "Hull City": "HUL",
  "Coventry City": "COV",
};

async function fetchBBCTable(): Promise<{
  teams: Team[];
  gamesPlayed: number;
  totalGoals: number;
}> {
  const url = "https://www.bbc.co.uk/sport/football/premier-league/table";

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Try to find the table with the league data
    const rows = document.querySelectorAll("table tbody tr");
    const teams: Team[] = [];
    let totalGoals = 0;
    let gamesPlayed = 0;

    if (rows.length === 0) {
      throw new Error("Could not find table data on BBC page");
    }

    rows.forEach((row, index) => {
      const cells = row.querySelectorAll("td");
      if (cells.length < 10) return;

      // Extract team name - look for the cell with the team name
      let teamName = "";
      let position = index + 1;

      // Try to find the team name cell (usually contains link or span with team name)
      for (let i = 0; i < Math.min(4, cells.length); i++) {
        const cell = cells[i];
        const text = cell.textContent?.trim() || "";

        // Check if this is the position cell (just a number)
        if (i === 0 && !isNaN(Number(text)) && text.length <= 2) {
          position = parseInt(text);
          continue;
        }

        // Look for team name (not a number, reasonable length)
        if (text && text.length > 2) {
          // Remove position number if it's prefixed
          teamName = text.replace(/^\d+/, "").trim();
          if (teamName.length > 2) {
            break;
          }
        }
      }

      if (!teamName) return;

      // Find played, goals for, and goals against columns
      const played = parseInt(
        Array.from(cells)
          .find((cell, idx) => idx > 0 && idx < 5)
          ?.textContent?.trim() || "0",
      );
      const goalsFor = parseInt(
        Array.from(cells)
          .filter((cell) => {
            const text = cell.textContent?.trim() || "";
            return !isNaN(Number(text)) && Number(text) >= 0;
          })[4]
          ?.textContent?.trim() || "0",
      );

      if (played > gamesPlayed) {
        gamesPlayed = played;
      }

      totalGoals += goalsFor;

      // Try to match team name to short name
      let shortName = teamMappings[teamName];

      // If not found, try partial matching
      if (!shortName) {
        for (const [fullName, short] of Object.entries(teamMappings)) {
          if (teamName.includes(fullName) || fullName.includes(teamName)) {
            shortName = short;
            break;
          }
        }
      }

      // If still not found, create a default short name
      if (!shortName) {
        shortName = teamName.substring(0, 3).toUpperCase();
      }

      teams.push({
        position,
        shortName,
        name: teamName,
      });
    });

    if (teams.length === 0) {
      throw new Error("No teams found in table");
    }

    return { teams, gamesPlayed, totalGoals };
  } catch (error) {
    console.error("Error fetching BBC table:", error);
    throw error;
  }
}

async function updateLeagueTable() {
  try {
    console.log("Fetching Premier League table from BBC...");

    const { teams, gamesPlayed, totalGoals } = await fetchBBCTable();

    console.log(`Found ${teams.length} teams`);
    console.log(`Games played: ${gamesPlayed}`);
    console.log(`Total goals: ${totalGoals}`);

    // Calculate estimated total goals (assuming 38 games in a season)
    const totalGamesInSeason = 380; // 20 teams * 38 games / 2
    const gamesPlayedSoFar = (teams.length * gamesPlayed) / 2;
    const estimatedTotalGoals =
      gamesPlayedSoFar > 0
        ? Math.round((totalGoals / gamesPlayedSoFar) * totalGamesInSeason)
        : 0;

    const leagueTable: LeagueTable = {
      teams,
      gamesPlayed,
      totalGoals,
      estimatedTotalGoals,
      timestamp: new Date().toISOString(),
    };

    // Save to file
    const outputPath = path.join(process.cwd(), "public", "pl-26-27", "league-table.json");
    fs.writeFileSync(outputPath, JSON.stringify(leagueTable, null, 2));

    console.log(`\nLeague table updated successfully!`);
    console.log(`Updated at: ${leagueTable.timestamp}`);
    console.log(`Estimated total goals for season: ${estimatedTotalGoals}`);
    console.log(`Output saved to: ${outputPath}`);
  } catch (error) {
    console.error("Failed to update league table:", error);
    process.exit(1);
  }
}

// Run the update
updateLeagueTable();
