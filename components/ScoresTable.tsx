'use client';

import React, { useState } from 'react';
import { PlayerScore } from '@/lib/types';

interface ScoresTableProps {
  players: PlayerScore[];
  estimatedTotalGoals: number;
  timestamp: string;
}

export default function ScoresTable({ players, estimatedTotalGoals, timestamp }: ScoresTableProps) {
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);

  const togglePlayer = (playerName: string) => {
    setExpandedPlayer(expandedPlayer === playerName ? null : playerName);
  };

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-GB', { month: 'long' });
    const year = date.getFullYear();
    
    // Add ordinal suffix (st, nd, rd, th)
    const getOrdinal = (n: number) => {
      const s = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    
    return `${getOrdinal(day)} ${month}, ${year}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Player</th>
            <th>Score</th>
            <th>Tie Break</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <React.Fragment key={`${player.name}-${index}`}>
              <tr
                onClick={() => togglePlayer(player.name)}
                className="cursor-pointer hover:bg-primary"
              >
                <td>{index + 1}</td>
                <td className="font-semibold">{player.name}</td>
                <td>{player.totalScore}</td>
                <td>{player.tieBreaker}</td>
              </tr>
              {expandedPlayer === player.name && (
                <tr>
                  <td colSpan={4} className="bg-base-200 p-0">
                    <div className="p-4">
                      <table className="table table-sm w-full">
                        <thead>
                          <tr>
                            <th>Pos</th>
                            <th>Team</th>
                            <th>Actual</th>
                            <th>Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {player.teamScores.map((teamScore) => (
                            <tr key={`${player.name}-${teamScore.team}`} className={`row-color-${teamScore.score}`}>
                              <td>{teamScore.position}</td>
                              <td>{teamScore.team}</td>
                              <td>{teamScore.actualPosition}</td>
                              <td className="font-semibold">{teamScore.score}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td className="font-bold">{estimatedTotalGoals}</td>
          </tr>
        </tfoot>
      </table>
        <p>Updated: {formatTimestamp(timestamp)}</p>
    </div>
  );
}
