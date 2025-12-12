import {
  calculatePredictionScore,
  calculatePlayerScores,
  calculateEstimatedTotalGoals,
} from '../lib/scoring';
import { Entry, LeagueTable } from '../lib/types';

describe('calculatePredictionScore', () => {
  it('should return 5 points for exact position match', () => {
    expect(calculatePredictionScore(1, 1)).toBe(5);
    expect(calculatePredictionScore(10, 10)).toBe(5);
    expect(calculatePredictionScore(20, 20)).toBe(5);
  });

  it('should return 1 point for correct section in top 4', () => {
    expect(calculatePredictionScore(1, 2)).toBe(1);
    expect(calculatePredictionScore(2, 4)).toBe(1);
    expect(calculatePredictionScore(4, 3)).toBe(1);
  });

  it('should return 1 point for correct section in bottom 3', () => {
    expect(calculatePredictionScore(18, 19)).toBe(1);
    expect(calculatePredictionScore(19, 20)).toBe(1);
    expect(calculatePredictionScore(20, 18)).toBe(1);
  });

  it('should return 0 points for wrong section', () => {
    expect(calculatePredictionScore(1, 5)).toBe(0);
    expect(calculatePredictionScore(4, 18)).toBe(0);
    expect(calculatePredictionScore(18, 10)).toBe(0);
    expect(calculatePredictionScore(10, 18)).toBe(0);
  });
});

describe('calculatePlayerScores', () => {
  const mockLeagueTable: LeagueTable = {
    teams: [
      { position: 1, shortName: 'LIV', name: 'Liverpool' },
      { position: 2, shortName: 'ARS', name: 'Arsenal' },
      { position: 3, shortName: 'MCI', name: 'Manchester City' },
      { position: 4, shortName: 'CHE', name: 'Chelsea' },
      { position: 18, shortName: 'WOL', name: 'Wolverhampton' },
      { position: 19, shortName: 'SUN', name: 'Sunderland' },
      { position: 20, shortName: 'BUR', name: 'Burnley' },
    ],
    gamesPlayed: 10,
    totalGoals: 300,
    estimatedTotalGoals: 1140,
    timestamp: '2024-12-12',
  };

  const mockEntries: Entry[] = [
    {
      name: 'Player1',
      tieBreaker: 1100,
      predictions: [
        { position: 1, team: 'LIV' }, // 5 points - exact
        { position: 2, team: 'ARS' }, // 5 points - exact
        { position: 18, team: 'WOL' }, // 5 points - exact
      ],
    },
    {
      name: 'Player2',
      tieBreaker: 1200,
      predictions: [
        { position: 1, team: 'ARS' }, // 1 point - top 4
        { position: 3, team: 'LIV' }, // 1 point - top 4
        { position: 19, team: 'BUR' }, // 1 point - bottom 3
      ],
    },
  ];

  it('should calculate correct scores for players', () => {
    const scores = calculatePlayerScores(mockLeagueTable, mockEntries);
    
    expect(scores).toHaveLength(2);
    expect(scores[0].name).toBe('Player1');
    expect(scores[0].totalScore).toBe(15);
    expect(scores[1].name).toBe('Player2');
    expect(scores[1].totalScore).toBe(3);
  });

  it('should sort players by total score', () => {
    const scores = calculatePlayerScores(mockLeagueTable, mockEntries);
    expect(scores[0].totalScore).toBeGreaterThanOrEqual(scores[1].totalScore);
  });

  it('should use tie breaker when scores are equal', () => {
    const tiedEntries: Entry[] = [
      {
        name: 'PlayerA',
        tieBreaker: 1140, // Exact match
        predictions: [{ position: 1, team: 'LIV' }],
      },
      {
        name: 'PlayerB',
        tieBreaker: 1000, // Further away
        predictions: [{ position: 2, team: 'ARS' }],
      },
    ];

    const scores = calculatePlayerScores(mockLeagueTable, tiedEntries);
    expect(scores[0].name).toBe('PlayerA'); // Closer tie breaker wins
  });
});

describe('calculateEstimatedTotalGoals', () => {
  it('should calculate estimated total goals correctly', () => {
    const result = calculateEstimatedTotalGoals(300, 10, 38);
    expect(result).toBe(1140); // (300/10) * 38 = 1140
  });

  it('should return 0 when games played is 0', () => {
    const result = calculateEstimatedTotalGoals(0, 0, 38);
    expect(result).toBe(0);
  });

  it('should round to nearest integer', () => {
    const result = calculateEstimatedTotalGoals(275, 10, 38);
    expect(result).toBe(1045); // (275/10) * 38 = 1045
  });
});
