import PageNav from "@/components/PageNav";
import { WcGroupScoreCell, WcFinalScoreCell } from "@/components/WcScoreCells";
import WcShareButton from "@/components/WcShareButton";
import { WC2026_NAV_ITEMS } from "@/lib/constants";
import scoresData from "@/public/scores-wc-2026.json";
import React from "react";

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export default function ScoresPage() {
  const { players, updatedDate } = scoresData;

  return (
    <div className="min-h-screen bg-base-200 md:p-4">
      <div className="max-w-6xl mx-auto">
        <PageNav navItems={WC2026_NAV_ITEMS}>Scores</PageNav>

        <div className="card bg-base-100 shadow-xl rounded-none md:rounded-box">
          <div className="card-body p-2 md:p-4">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="card-title text-3xl">Scores</h2>
              {updatedDate && (
                <span className="text-xs text-base-content/50">
                  Updated {new Date(updatedDate).toLocaleString()}
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="table table-xs border border-base-300 w-full">
                <thead>
                  <tr>
                    <th className="border-r border-base-300">Name</th>
                    <th className="border-r border-base-300">League</th>
                    <th className="border-r border-base-300 text-center">
                      Score
                    </th>
                    <th className="border-r border-base-300 text-center">TB</th>
                    {GROUPS.map((g) => (
                      <th key={g} className="text-center text-xs font-semibold">
                        {g}
                      </th>
                    ))}
                  </tr>
                  <tr className="border-b-2 border-base-300">
                    <th colSpan={4} className="border-r border-base-300" />
                    <th
                      colSpan={3}
                      className="text-center text-xs font-semibold text-base-content/50"
                    >
                      Winner
                    </th>
                    <th
                      colSpan={3}
                      className="text-center text-xs font-semibold text-base-content/50"
                    >
                      Runner Up
                    </th>
                    <th
                      colSpan={3}
                      className="text-center text-xs font-semibold text-base-content/50"
                    >
                      Third
                    </th>
                    <th
                      colSpan={3}
                      className="text-center text-xs font-semibold text-base-content/50"
                    >
                      Fourth
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <React.Fragment key={player.name}>
                      {/* Row 1: player info (rowspan 2) + group predictions */}
                      <tr className="border-t border-base-300">
                        <td
                          rowSpan={2}
                          className="font-bold text-base align-middle border-r border-base-300 whitespace-nowrap"
                        >
                          <WcShareButton
                            playerName={player.name}
                            finalScores={player.finalScores}
                          />
                          {player.name}
                        </td>
                        <td
                          rowSpan={2}
                          className="align-middle border-r border-base-300 whitespace-nowrap text-xs text-base-content/60"
                        >
                          {player.league}
                        </td>
                        <td
                          rowSpan={2}
                          className="align-middle border-r border-base-300 text-center font-bold text-lg"
                        >
                          {player.totalScore}
                        </td>
                        <td
                          rowSpan={2}
                          className="align-middle border-r border-base-300 text-center text-xs text-base-content/60"
                        >
                          {player.tieBreak}
                        </td>
                        {GROUPS.map((g) => {
                          const gs =
                            player.groupScores[
                              g as keyof typeof player.groupScores
                            ];
                          return (
                            <td key={g} className="text-center">
                              <WcGroupScoreCell group={g} data={gs} />
                            </td>
                          );
                        })}
                      </tr>

                      {/* Row 2: finals scores */}
                      <tr className="bg-base-200">
                        {(
                          [
                            ["winner", player.finalScores.winner],
                            ["runnerUp", player.finalScores.runnerUp],
                            ["third", player.finalScores.third],
                            ["fourth", player.finalScores.fourth],
                          ] as const
                        ).map(([key, fs]) => (
                          <td key={key} colSpan={3} className="text-center">
                            <WcFinalScoreCell data={fs} />
                          </td>
                        ))}
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
