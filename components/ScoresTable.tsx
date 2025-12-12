'use client';

import React, { useState } from 'react';
import { PlayerScore } from '@/lib/types';

interface ScoresTableProps {
  players: PlayerScore[];
  estimatedTotalGoals: number;
}

export default function ScoresTable({ players, estimatedTotalGoals }: ScoresTableProps) {
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);

  const togglePlayer = (playerName: string) => {
    setExpandedPlayer(expandedPlayer === playerName ? null : playerName);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Position</th>
            <th>Player</th>
            <th>Score</th>
            <th>Tie Breaker</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <React.Fragment key={`${player.name}-${index}`}>
              <tr
                onClick={() => togglePlayer(player.name)}
                className="cursor-pointer hover:bg-base-200"
              >
                <td>{index + 1}</td>
                <td className="font-semibold">{player.name}</td>
                <td>{player.totalScore}</td>
                <td>{player.tieBreaker}</td>
              </tr>
              {expandedPlayer === player.name && (
                <tr>
                  <td colSpan={4} className="bg-base-200">
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
                            <tr key={`${player.name}-${teamScore.team}`}>
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
            <td className="font-semibold">{estimatedTotalGoals}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
