import { Entry, LeagueTable, PlayerScore, TeamScore } from './types';

/**
 * Calculate score for a single prediction
 * Returns:
 * - 5 points for exact position match
 * - 1 point for correct section (top 4 or bottom 3) but wrong position
 * - 0 points otherwise
 */
export function calculatePredictionScore(
  predictedPosition: number,
  actualPosition: number
): number {
  // Exact match
  if (predictedPosition === actualPosition) {
    return 5;
  }

  // Check if both are in top 4
  if (predictedPosition <= 4 && actualPosition <= 4) {
    return 1;
  }

  // Check if both are in bottom 3 (positions 18, 19, 20)
  if (predictedPosition >= 18 && actualPosition >= 18) {
    return 1;
  }

  return 0;
}

/**
 * Calculate scores for all players based on league table and predictions
 */
export function calculatePlayerScores(
  leagueTable: LeagueTable,
  entries: Entry[]
): PlayerScore[] {
  const playerScores: PlayerScore[] = [];

  for (const entry of entries) {
    const teamScores: TeamScore[] = [];
    let totalScore = 0;

    for (const prediction of entry.predictions) {
      // Find actual position of the predicted team
      const actualTeam = leagueTable.teams.find(
        (t) => t.shortName === prediction.team
      );

      const actualPosition = actualTeam?.position || 0;
      const score = calculatePredictionScore(prediction.position, actualPosition);

      teamScores.push({
        position: prediction.position,
        team: prediction.team,
        actualPosition,
        score,
      });

      totalScore += score;
    }

    playerScores.push({
      name: entry.name,
      totalScore,
      tieBreaker: entry.tieBreaker,
      teamScores,
    });
  }

  // Sort by score (descending), then by tie breaker closeness to actual
  playerScores.sort((a, b) => {
    if (a.totalScore !== b.totalScore) {
      return b.totalScore - a.totalScore;
    }
    // Tie breaker: closer to estimated total goals wins
    const aDiff = Math.abs(a.tieBreaker - leagueTable.estimatedTotalGoals);
    const bDiff = Math.abs(b.tieBreaker - leagueTable.estimatedTotalGoals);
    return aDiff - bDiff;
  });

  return playerScores;
}

/**
 * Calculate estimated total goals for the season
 * Formula: (current goals / games played) * total games in season
 * Assuming 38 games per team in a season
 */
export function calculateEstimatedTotalGoals(
  currentGoals: number,
  gamesPlayed: number,
  totalGamesPerTeam: number = 38
): number {
  if (gamesPlayed === 0) return 0;
  const goalsPerGame = currentGoals / gamesPlayed;
  return Math.round(goalsPerGame * totalGamesPerTeam);
}
