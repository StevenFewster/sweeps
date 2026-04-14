export interface Team {
  position: number;
  shortName: string;
  name: string;
  played?: number;
  goalsScored?: number;
}

export interface LeagueTable {
  teams: Team[];
  gamesPlayed: number;
  totalGoals: number;
  estimatedTotalGoals: number;
  timestamp: string;
}

export interface Prediction {
  position: number;
  team: string;
}

export interface Entry {
  name: string;
  predictions: Prediction[];
  tieBreaker: number;
}

export interface TeamScore {
  position: number;
  team: string;
  actualPosition: number;
  score: number;
}

export interface PlayerScore {
  name: string;
  totalScore: number;
  tieBreaker: number;
  teamScores: TeamScore[];
}

export interface ScoresData {
  players: PlayerScore[];
  estimatedTotalGoals: number;
  generatedAt: string;
}

export type NavItem = {
  path: string;
  text: string;
};
