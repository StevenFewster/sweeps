"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface GroupScoreData {
  name: string;
  shortName: string;
  groupPosition: number | null;
  groupPlayed: number | null;
  score: number;
}

interface FinalScoreData {
  name: string;
  shortName: string;
  finalPosition: number | null;
  score: number;
}

function TooltipCard({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, calc(-100% - 6px))",
      }}
    >
      <div className="card card-compact bg-base-100 shadow-xl border border-base-300 w-44 text-left">
        <div className="card-body p-2 gap-0.5">{children}</div>
      </div>
    </div>
  );
}

function useScrollToDismiss(visible: boolean, onDismiss: () => void) {
  useEffect(() => {
    if (!visible) return;
    window.addEventListener("scroll", onDismiss, true);
    return () => window.removeEventListener("scroll", onDismiss, true);
  }, [visible, onDismiss]);
}

function scoreBadgeClass(score: number, groupPlayed?: number | null): string {
  let base = "badge badge-xs font-bold";
  if (score === 3 || score === 5) base = `${base} badge-warning`;
  if (score === 2) base = `${base} badge-accent`;
  if (score === 1) base = `${base} badge-info`;
  if (groupPlayed !== undefined && groupPlayed !== null && groupPlayed !== 3) {
    base = `${base} badge-outline`;
  } else {
    base = `${base} text-gray-80`;
  }
  return `${base}`;
}

export function WcGroupScoreCell({
  group,
  data,
}: {
  group: string;
  data: GroupScoreData;
}) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLSpanElement>(null);

  const hide = () => setVisible(false);
  useScrollToDismiss(visible, hide);

  function handleMouseEnter() {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setPos({ x: rect.left + rect.width / 2, y: rect.top });
    setVisible(true);
  }

  return (
    <>
      <span
        ref={ref}
        className="text-xs font-medium cursor-default"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={hide}
      >
        {data.shortName}
      </span>{" "}
      <span className={scoreBadgeClass(data.score, data.groupPlayed)}>
        {data.score}
      </span>
      {visible &&
        createPortal(
          <TooltipCard x={pos.x} y={pos.y}>
            <p className="font-bold text-sm">
              {data.name}{" "}
              <span className="font-normal text-base-content/60">
                ({data.shortName})
              </span>
            </p>
            <p className="text-xs text-base-content/70">Group: {group}</p>
            <p className="text-xs text-base-content/70">
              Position: {data.groupPosition ?? "—"}
            </p>
            <p className="text-xs text-base-content/70">
              Played: {data.groupPlayed ?? "—"}
            </p>
            <p className="text-xs text-base-content/70">Score: {data.score}</p>
          </TooltipCard>,
          document.body,
        )}
    </>
  );
}

export function WcFinalScoreCell({ data }: { data: FinalScoreData }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLSpanElement>(null);

  const hide = () => setVisible(false);
  useScrollToDismiss(visible, hide);

  function handleMouseEnter() {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setPos({ x: rect.left + rect.width / 2, y: rect.top });
    setVisible(true);
  }

  return (
    <>
      <span
        ref={ref}
        className="text-xs font-medium cursor-default"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={hide}
      >
        {data.shortName}
      </span>{" "}
      <span className={scoreBadgeClass(data.score)}>{data.score}</span>
      {visible &&
        createPortal(
          <TooltipCard x={pos.x} y={pos.y}>
            <p className="font-bold text-sm">
              {data.name}{" "}
              <span className="font-normal text-base-content/60">
                ({data.shortName})
              </span>
            </p>
            <p className="text-xs text-base-content/70">
              Final Position: {data.finalPosition ?? "—"}
            </p>
            <p className="text-xs text-base-content/70">Score: {data.score}</p>
          </TooltipCard>,
          document.body,
        )}
    </>
  );
}
