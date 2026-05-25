"use client";

import PageNav from "@/components/PageNav";
import { PL2027_NAV_ITEMS } from "@/lib/constants";
import { useState } from "react";
import teamsData from "@/resources/prem-2026-27.json";
import emailjs from "@emailjs/browser";

const TEAMS = teamsData as { shortName: string; fullName: string }[];

const POSITION_SLOTS = [
  { pos: 1, label: "1st Place" },
  { pos: 2, label: "2nd Place" },
  { pos: 3, label: "3rd Place" },
  { pos: 4, label: "4th Place" },
  { pos: 18, label: "18th Place (Relegated)" },
  { pos: 19, label: "19th Place (Relegated)" },
  { pos: 20, label: "20th Place (Relegated)" },
];

interface FormData {
  name: string;
  displayName: string;
  tieBreak: string;
  predictions: Record<number, string>;
}

const INITIAL_FORM_DATA: FormData = {
  name: "",
  displayName: "",
  tieBreak: "",
  predictions: {},
};

function TeamDropdown({
  label,
  selected,
  onChange,
  hasError,
}: {
  label: string;
  selected: string;
  onChange: (team: string) => void;
  hasError?: boolean;
}) {
  const selectedTeam = TEAMS.find((t) => t.shortName === selected);

  function handleSelect(shortName: string) {
    onChange(shortName);
    (document.activeElement as HTMLElement)?.blur();
  }

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-semibold">{label}</span>
        {hasError && (
          <span className="label-text-alt text-error">Already selected</span>
        )}
      </label>
      <div className="dropdown w-full">
        <div
          tabIndex={0}
          role="button"
          className={`btn w-full justify-between font-normal border bg-base-100 hover:bg-base-200 hover:border-base-300 ${hasError ? "border-error text-error hover:border-error hover:text-error hover:bg-base-100" : "border-base-300 text-base-content"}`}
        >
          <span className={selectedTeam ? "" : "text-base-content/40"}>
            {selectedTeam ? selectedTeam.fullName : "Select a team"}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[999] w-full p-2 shadow-lg border border-base-300 mt-1 max-h-60 overflow-y-auto flex-nowrap"
        >
          {TEAMS.map((team) => (
            <li key={team.shortName}>
              <button
                type="button"
                onClick={() => handleSelect(team.shortName)}
                className={selected === team.shortName ? "active" : ""}
              >
                {team.fullName}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function isFormValid(data: FormData): boolean {
  if (!data.name.trim() || !data.displayName.trim() || !data.tieBreak)
    return false;
  const selected = POSITION_SLOTS.map((s) => data.predictions[s.pos]).filter(
    Boolean,
  );
  if (selected.length !== POSITION_SLOTS.length) return false;
  return new Set(selected).size === selected.length;
}

export default function SubmitEntryPage() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [submitted, setSubmitted] = useState(false);

  const allSelected = Object.values(formData.predictions).filter(Boolean);
  const duplicates = allSelected.filter((v, i) => allSelected.indexOf(v) !== i);

  function patchFormData(patch: Partial<FormData>) {
    setFormData((prev) => ({ ...prev, ...patch }));
  }

  function setPrediction(pos: number, team: string) {
    setFormData((prev) => ({
      ...prev,
      predictions: { ...prev.predictions, [pos]: team },
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const entry = {
      username: formData.displayName,
      tieBreaker: Number(formData.tieBreak),
      predictions: POSITION_SLOTS.map((s) => ({
        pos: s.pos,
        team: formData.predictions[s.pos],
      })),
    };
    emailjs
      .send(
        "service_vmm195j",
        "template_sgb3sna",
        {
          name: `PL 26-27 Entry - ${formData.name}`,
          message: JSON.stringify(entry, null, 2),
        },
        { publicKey: "R0NA0abzOhyKQ6hRF" },
      )
      .then(
        () => setSubmitted(true),
        (error) => {
          console.error("FAILED...", error);
          alert("Failed to submit entry. Please contact Steven Fewster");
        },
      );
  }

  return (
    <div className="min-h-screen bg-base-200 md:p-4">
      <div className="max-w-6xl mx-auto">
        <PageNav navItems={PL2027_NAV_ITEMS}>Enter Competition</PageNav>

        {submitted ? (
          <div className="card bg-base-100 shadow-xl rounded-none md:rounded-box">
            <div className="card-body p-6 items-center text-center gap-4">
              <span className="text-5xl">✅</span>
              <h2 className="card-title text-2xl">Entry Submitted!</h2>
              <p className="text-base-content/70">
                Your entry has been received. If you need to make any changes,
                contact Steven Fewster directly.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="card bg-base-100 shadow-xl rounded-none md:rounded-box mb-4">
              <div className="card-body p-6">
                <h2 className="card-title text-xl mb-4">Your Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label" htmlFor="name">
                      <span className="label-text font-semibold">
                        Full Name
                      </span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="e.g. Steve Fewster"
                      className="input input-bordered w-full"
                      value={formData.name}
                      onChange={(e) => patchFormData({ name: e.target.value })}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label" htmlFor="displayName">
                      <span className="label-text font-semibold">
                        Display Name
                      </span>
                      <span className="label-text-alt text-base-content/50">
                        Shown on leaderboard
                      </span>
                    </label>
                    <input
                      id="displayName"
                      type="text"
                      placeholder="e.g. Fewster"
                      className="input input-bordered w-full"
                      value={formData.displayName}
                      onChange={(e) =>
                        patchFormData({ displayName: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl rounded-none md:rounded-box mb-4">
              <div className="card-body p-6">
                <h2 className="card-title text-xl mb-2">Predictions</h2>
                <p className="text-sm text-base-content/60 mb-4">
                  Pick the teams you think will finish in each position.
                </p>
                <div className="flex flex-col gap-4">
                  {POSITION_SLOTS.map(({ pos, label }, i) => (
                    <div key={pos}>
                      {i === 4 && (
                        <div className="divider text-xs text-base-content/40 uppercase tracking-widest my-2">
                          Relegation Zone
                        </div>
                      )}
                      <TeamDropdown
                        label={label}
                        selected={formData.predictions[pos] ?? ""}
                        onChange={(team) => setPrediction(pos, team)}
                        hasError={
                          !!formData.predictions[pos] &&
                          duplicates.includes(formData.predictions[pos])
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl rounded-none md:rounded-box mb-4">
              <div className="card-body p-6">
                <h2 className="card-title text-xl mb-2">Tie Break</h2>
                <p className="text-sm text-base-content/60 mb-4">
                  Predict the total number of goals scored across all Premier
                  League matches this season. Used only if two entrants finish
                  level on points. Last season saw <strong>1,009</strong> goals.
                </p>
                <div className="form-control max-w-xs">
                  <input
                    id="tieBreak"
                    type="number"
                    min={0}
                    placeholder="e.g. 1045"
                    className="input input-bordered w-full"
                    value={formData.tieBreak}
                    onChange={(e) =>
                      patchFormData({ tieBreak: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pb-4 px-0">
              <button
                type="submit"
                className="btn btn-primary btn-wide"
                disabled={!isFormValid(formData)}
              >
                Submit Entry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
