'use client';

import React, { useState } from 'react';
import { PlayerScore } from '@/lib/types';
import StarIcon from './StarIcon';

interface ScoresTableProps {
  players: PlayerScore[];
  estimatedTotalGoals: number;
  timestamp: string;
}

export default function ScoresTable({ players, estimatedTotalGoals, timestamp }: ScoresTableProps) {
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
  const [copiedPlayer, setCopiedPlayer] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<'result' | 'picks' | null>(null);
  const [tooltipPlayer, setTooltipPlayer] = useState<string | null>(null);

  // Close tooltip when clicking anywhere
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (tooltipPlayer) {
        setTooltipPlayer(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [tooltipPlayer]);

  const togglePlayer = (playerName: string) => {
    setExpandedPlayer(expandedPlayer === playerName ? null : playerName);
  };

  const generateShareText = (player: PlayerScore) => {
    // Sort team scores by position to get top 7
    const sortedTeams = [...player.teamScores].sort((a, b) => a.position - b.position);
    const top7 = sortedTeams.slice(0, 7);
    
    // Generate boxes: 🟨 for 5 points, 🟦 for 1 point, ⬛ for 0 points
    const boxes = top7.map(team => {
      if (team.score === 5) return '🟨';
      if (team.score === 1) return '🟦';
      return '⬛';
    }).join('');
    
    const url = `${window.location.origin}/sweeps/scores`;
    return `PL Sweepstake 2025/26\n${boxes} ${player.totalScore}\n${url}`;
  };

  const generatePicksText = (player: PlayerScore) => {
    const sortedTeams = [...player.teamScores].sort((a, b) => a.position - b.position);
    const list = sortedTeams.map(team => `${team.position}. ${team.team}`).join('\n');
    return `${player.name}'s Picks - PL Sweepstake 2025/26\n${list}\nTie Break: ${player.tieBreaker}`;
  };

  const handleShare = async (player: PlayerScore, type: 'result' | 'picks') => {
    const shareText = type === 'result' ? generateShareText(player) : generatePicksText(player);
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedPlayer(player.name);
      setCopiedType(type);
      setTimeout(() => {
        setCopiedPlayer(null);
        setCopiedType(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
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

  const getDifference = (tieBreaker: number) => {
    return tieBreaker - estimatedTotalGoals;
  };

  const getDifferenceColor = (diff: number) => {
    return diff > 0 ? 'text-blue-500' : 'text-red-500';
  };

  const getDifferenceIcon = (diff: number) => {
    return diff > 0 ? '+' : '-';
  };

  const getDotCount = (diff: number) => {
    return Math.min(Math.ceil(Math.abs(diff) / 10), 12);
  };

  return (
    <div className="overflow-x-auto">

      <div className="flex mb-4">
        <p className="grow">Current estimated Total Goals: <strong>{estimatedTotalGoals}</strong></p>
        <p className='flex-none'>Last update: {formatTimestamp(timestamp)}</p>
      </div>

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
          {players.map((player, index) => {
            const diff = getDifference(player.tieBreaker);
            const colorClass = getDifferenceColor(diff);
            const icon = getDifferenceIcon(diff);
            const dotCount = getDotCount(diff);
            
            return (
              <React.Fragment key={`${player.name}-${index}`}>
                <tr
                  onClick={() => togglePlayer(player.name)}
                  className={`cursor-pointer ${expandedPlayer === player.name ? 'selected' : ''}`}
                >
                  <td>{index + 1}</td>
                  <td className="font-semibold">{player.name}</td>
                  <td>{player.totalScore}</td>
                  <td>
                    <div className="flex items-center gap-4">
                      <span className='tie-breaker'>{player.tieBreaker}</span>
                      {diff !== 0 && (
                        <div 
                          className={`tooltip ${tooltipPlayer === player.name ? 'tooltip-open' : ''} tooltip-left`}
                          data-tip={`${icon}${Math.abs(diff)} from estimated total goals: ${estimatedTotalGoals}`}
                        >
                          <span 
                            className={`${colorClass} cursor-pointer diff-indicator`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setTooltipPlayer(tooltipPlayer === player.name ? null : player.name);
                            }}
                          >
                            {'▌'.repeat(dotCount)}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedPlayer === player.name && (
                  <tr className="border-4 border-teal-800">
                    <td colSpan={4} className="bg-base-200 p-0">
                      <div className="p-4">
                        <table className="table table-sm w-full">
                          <thead>
                            <tr>
                              <th>Pos</th>
                              <th>Actual</th>
                              <th>Team</th>
                              <th className="w-auto md:w-1/3">Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {player.teamScores.map((teamScore) => (
                              <tr key={`${player.name}-${teamScore.team}`} className={`row-color-${teamScore.score}`}>
                                <td><span className='pos-indicator'>{teamScore.position}</span></td>
                                <td>{teamScore.actualPosition}</td>
                                <td>
                                   <span className="icon-indicator"><StarIcon className="w-4 h-4 inline-block align-top" /></span>
                                   {teamScore.team}
                                  </td>
                                <td className="font-semibold">{teamScore.score}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="mt-4 flex justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(player, 'picks');
                            }}
                            className="btn btn-sm btn-primary btn-outline"
                          >
                            {copiedPlayer === player.name && copiedType === 'picks' ? '✓ Copied!' : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                </svg>
                                Share Picks
                              </>
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(player, 'result');
                            }}
                            className="btn btn-sm btn-primary btn-outline"
                          >
                            {copiedPlayer === player.name && copiedType === 'result' ? '✓ Copied!' : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Share Result
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
