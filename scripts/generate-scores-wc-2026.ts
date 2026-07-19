#!/usr/bin/env node

/**
 * Script to generate WC 2026 scores JSON from wc-table and player entries
 * Usage: npx ts-node scripts/generate-scores-wc-2026.ts
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const WC_TABLE_PATH = path.join(__dirname, "../public/wc-table.json");
const ENTRIES_DIR = path.join(__dirname, "../resources/entries/wc-2026");
const OUTPUT_PATH = path.join(__dirname, "../public/scores-wc-2026.json");

interface Country {
  name: string;
  shortName: string;
  group: string;
  groupPosition: number;
  groupPlayed: number;
  groupPoints: number;
  isLast16: boolean;
  finalPosition: number | null;
}

interface WcTable {
  countries: Country[];
  timestamp: string;
}

interface EntryJSON {
  name: string;
  displayName: string;
  league: string;
  tieBreak: string;
  groupPredictions: Record<string, string>; // group letter -> team name
  finalsPredictions: {
    winner: string;
    runnerUp: string;
    third: string;
    fourth: string;
  };
}

interface GroupScore {
  name: string;
  shortName: string;
  groupPosition: number | null;
  groupPlayed: number | null;
  score: number;
}

interface FinalScore {
  name: string;
  shortName: string;
  finalPosition: number | null;
  score: number;
}

interface PlayerScore {
  name: string;
  league: string;
  totalScore: number;
  tieBreak: string;
  groupScores: Record<string, GroupScore>; // group letter -> score object
  finalScores: Record<string, FinalScore>; // winner/runnerUp/third/fourth -> score object
}

function loadWcTable(): WcTable {
  try {
    const data = fs.readFileSync(WC_TABLE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading wc-table.json:", error);
    throw new Error("Failed to load wc-table.json.");
  }
}

function loadEntries(): EntryJSON[] {
  try {
    const files = fs.readdirSync(ENTRIES_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    return jsonFiles.map((file) => {
      const filePath = path.join(ENTRIES_DIR, file);
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    });
  } catch (error) {
    console.error("Error loading entries:", error);
    throw new Error(
      "Failed to load entries from resources/entries/wc-2026 directory.",
    );
  }
}

function calculateGroupScores(
  entry: EntryJSON,
  countries: Country[],
): Record<string, GroupScore> {
  const scores: Record<string, GroupScore> = {};

  for (const [group, predictedTeam] of Object.entries(entry.groupPredictions)) {
    const country = countries.find((c) => c.name === predictedTeam);
    let score = 0;

    if (country && country.groupPlayed > 0) {
      // 3 points if predicted team finished 1st in their group
      if (country.groupPosition === 1) {
        score += 3;
      }
      // 1 point if predicted team made it to last 16
      else if (country.isLast16 || country.groupPosition === 2) {
        score += 1;
      }
    }

    scores[group] = {
      name: predictedTeam,
      shortName: country?.shortName ?? "",
      groupPosition: country?.groupPosition ?? null,
      groupPlayed: country?.groupPlayed ?? null,
      score,
    };
  }

  return scores;
}

function calculateFinalScores(
  entry: EntryJSON,
  countries: Country[],
): Record<string, FinalScore> {
  const { winner, runnerUp, third, fourth } = entry.finalsPredictions;

  const findCountry = (name: string) => countries.find((c) => c.name === name);

  const winnerCountry = findCountry(winner);
  const runnerUpCountry = findCountry(runnerUp);
  const thirdCountry = findCountry(third);
  const fourthCountry = findCountry(fourth);

  // Winner prediction scoring
  let winnerScore = 0;
  if (winnerCountry?.finalPosition != null) {
    if (winnerCountry.finalPosition === 1) winnerScore = 5;
    else if (winnerCountry.finalPosition === 2) winnerScore = 2;
    else if (
      winnerCountry.finalPosition === 3 ||
      winnerCountry.finalPosition === 4
    )
      winnerScore = 1;
  }

  let runnerUpScore = 0;
  if (runnerUpCountry?.finalPosition != null) {
    if (runnerUpCountry.finalPosition === 2) runnerUpScore = 5;
    else if (runnerUpCountry.finalPosition === 1) runnerUpScore = 2;
    else if (
      runnerUpCountry.finalPosition === 3 ||
      runnerUpCountry.finalPosition === 4
    )
      runnerUpScore = 1;
  }

  // TODO: Update the logic for runnerUp, third, and fourth predictions
  let thirdScore = 0;
  if (thirdCountry?.finalPosition != null) {
    if (thirdCountry.finalPosition === 3) thirdScore = 5;
    else if (thirdCountry.finalPosition === 4) thirdScore = 2;
    else if (
      thirdCountry.finalPosition === 1 ||
      thirdCountry.finalPosition === 2
    )
      thirdScore = 1;
  }

  let fourthScore = 0;
  if (fourthCountry?.finalPosition != null) {
    if (fourthCountry.finalPosition === 4) fourthScore = 5;
    else if (fourthCountry.finalPosition === 3) fourthScore = 2;
    else if (
      fourthCountry.finalPosition === 1 ||
      fourthCountry.finalPosition === 2
    )
      fourthScore = 1;
  }

  return {
    winner: {
      name: winner,
      shortName: winnerCountry?.shortName ?? "",
      finalPosition: winnerCountry?.finalPosition ?? null,
      score: winnerScore,
    },
    runnerUp: {
      name: runnerUp,
      shortName: runnerUpCountry?.shortName ?? "",
      finalPosition: runnerUpCountry?.finalPosition ?? null,
      score: runnerUpScore,
    },
    third: {
      name: third,
      shortName: thirdCountry?.shortName ?? "",
      finalPosition: thirdCountry?.finalPosition ?? null,
      score: thirdScore,
    },
    fourth: {
      name: fourth,
      shortName: fourthCountry?.shortName ?? "",
      finalPosition: fourthCountry?.finalPosition ?? null,
      score: fourthScore,
    },
  };
}

function main() {
  console.log("Generating WC 2026 scores...\n");

  const wcTable = loadWcTable();
  const entries = loadEntries();

  console.log(`Loaded wc-table with ${wcTable.countries.length} countries`);
  console.log(`Loaded ${entries.length} player entries\n`);

  const players: PlayerScore[] = entries.map((entry) => {
    const groupScores = calculateGroupScores(entry, wcTable.countries);
    const finalScores = calculateFinalScores(entry, wcTable.countries);

    const totalScore =
      Object.values(groupScores).reduce((sum, s) => sum + s.score, 0) +
      Object.values(finalScores).reduce((sum, s) => sum + s.score, 0);

    return {
      name: entry.displayName ?? entry.name,
      league: entry.league,
      totalScore,
      tieBreak: entry.tieBreak,
      groupScores,
      finalScores,
    };
  });

  // Sort by totalScore descending, tieBreak ascending
  players.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return Number(a.tieBreak) - Number(b.tieBreak);
  });

  const output = { players, updatedDate: new Date().toISOString() };
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`Scores written to ${OUTPUT_PATH}`);
}

main();
