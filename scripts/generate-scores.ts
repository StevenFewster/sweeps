#!/usr/bin/env node

/**
 * Script to generate scores JSON from league table and player entries
 * Usage: npm run generate-scores
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { calculatePlayerScores } from '../lib/scoring.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const LEAGUE_TABLE_PATH = path.join(__dirname, '../public/league-table.json');
const ENTRIES_DIR = path.join(__dirname, '../resources/entries');
const OUTPUT_PATH = path.join(__dirname, '../public/scores.json');

interface LeagueTableJSON {
  teams: Array<{
    position: number;
    shortName: string;
    name: string;
  }>;
  gamesPlayed: number;
  totalGoals: number;
  estimatedTotalGoals: number;
  timestamp: string;
}

interface EntryJSON {
  username: string;
  tieBreaker: number;
  predictions: Array<{
    pos: number;
    team: string;
  }>;
}

function loadLeagueTable(): LeagueTableJSON {
  try {
    const data = fs.readFileSync(LEAGUE_TABLE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading league table:', error);
    throw new Error('Failed to load league-table.json. Please create it first by using the Table Editor.');
  }
}

function loadEntries(): EntryJSON[] {
  try {
    const files = fs.readdirSync(ENTRIES_DIR);
    const jsonFiles = files.filter((file) => file.endsWith('.json'));

    return jsonFiles.map((file) => {
      const filePath = path.join(ENTRIES_DIR, file);
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    });
  } catch (error) {
    console.error('Error loading entries:', error);
    throw new Error('Failed to load entries from resources/entries directory.');
  }
}

function main() {
  console.log('Generating scores...\n');

  // Load data
  const leagueTableData = loadLeagueTable();
  const entriesData = loadEntries();

  console.log(`Loaded league table with ${leagueTableData.teams.length} teams`);
  console.log(`Loaded ${entriesData.length} player entries\n`);

  // Transform data to match our types
  const leagueTable = {
    teams: leagueTableData.teams,
    gamesPlayed: leagueTableData.gamesPlayed,
    totalGoals: leagueTableData.totalGoals,
    estimatedTotalGoals: leagueTableData.estimatedTotalGoals,
    timestamp: leagueTableData.timestamp,
  };

  const entries = entriesData.map((entry) => ({
    name: entry.username,
    tieBreaker: entry.tieBreaker,
    predictions: entry.predictions.map((pred) => ({
      position: pred.pos,
      team: pred.team,
    })),
  }));

  // Calculate scores
  const playerScores = calculatePlayerScores(leagueTable, entries);

  // Create output data
  const scoresData = {
    players: playerScores,
    estimatedTotalGoals: leagueTable.estimatedTotalGoals,
    generatedAt: new Date().toISOString(),
  };

  // Ensure public directory exists
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write output
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(scoresData, null, 2));

  console.log('✓ Scores generated successfully!');
  console.log(`✓ Output saved to: ${OUTPUT_PATH}\n`);

  // Display summary
  console.log('Score Summary:');
  playerScores.forEach((player, index) => {
    console.log(`${index + 1}. ${player.name}: ${player.totalScore} points (TB: ${player.tieBreaker})`);
  });
}

// Run the script
try {
  main();
} catch (error) {
  console.error('Error:', error instanceof Error ? error.message : error);
  process.exit(1);
}
