"use client";

import { useState } from "react";

interface FinalScore {
  name: string;
  shortName: string;
  finalPosition: number | null;
  score: number;
}

interface WcShareButtonProps {
  playerName: string;
  finalScores: {
    winner: FinalScore;
    runnerUp: FinalScore;
    third: FinalScore;
    fourth: FinalScore;
  };
}

const PLACE_SQUARES = ["🟨", "⬜", "🟧", "⬛"] as const;

export default function WcShareButton({
  playerName,
  finalScores,
}: WcShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const lines = [
      `WC 2026 Sweepstake — ${playerName}`,
      `${PLACE_SQUARES[0]} ${finalScores.winner.name}`,
      `${PLACE_SQUARES[1]} ${finalScores.runnerUp.name}`,
      `${PLACE_SQUARES[2]} ${finalScores.third.name}`,
      `${PLACE_SQUARES[3]} ${finalScores.fourth.name}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  return (
    <span className="relative inline-flex items-center">
      {copied && (
        <span className="absolute bottom-full left-0 mb-1 whitespace-nowrap rounded bg-neutral text-neutral-content text-xs px-2 py-0.5 pointer-events-none animate-fade-out z-10">
          Copied to clipboard!
        </span>
      )}
    <button
      onClick={handleShare}
      title="Copy picks to clipboard"
      className="btn btn-neutral btn-xs p-0 min-h-0 h-auto mr-1 text-base-content/40 hover:text-base-content"
    >
      {copied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-3.5 h-3.5 text-success"
        >
          <path
            fillRule="evenodd"
            d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="16"
          fill="currentColor"
          className="w-3.5 h-3.5"
        >
          {" "}
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      )}
    </button>
    </span>
  );
}
