"use client";

import PageNav from "@/components/PageNav";
import { WC2026_NAV_ITEMS } from "@/lib/constants";
import { useEffect, useState } from "react";
import wcTableData from "@/public/wc-table.json";
import emailjs from "@emailjs/browser";


const STEPS = ["Details", "Group Stage", "The Finals"];
const GROUP_LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
];

const FLAGS: Record<string, string> = {
  Mexico: "🇲🇽",
  "South Africa": "🇿🇦",
  "South Korea": "🇰🇷",
  "Czech Republic": "🇨🇿",
  Canada: "🇨🇦",
  "Bosnia-Herzegovina": "🇧🇦",
  Qatar: "🇶🇦",
  Switzerland: "🇨🇭",
  Brazil: "🇧🇷",
  Morocco: "🇲🇦",
  Haiti: "🇭🇹",
  Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "United States": "🇺🇸",
  Paraguay: "🇵🇾",
  Australia: "🇦🇺",
  Turkey: "🇹🇷",
  Germany: "🇩🇪",
  Curaçao: "🇨🇼",
  "Ivory Coast": "🇨🇮",
  Ecuador: "🇪🇨",
  Netherlands: "🇳🇱",
  Japan: "🇯🇵",
  Sweden: "🇸🇪",
  Tunisia: "🇹🇳",
  Belgium: "🇧🇪",
  Egypt: "🇪🇬",
  Iran: "🇮🇷",
  "New Zealand": "🇳🇿",
  Spain: "🇪🇸",
  "Cape Verde": "🇨🇻",
  "Saudi Arabia": "🇸🇦",
  Uruguay: "🇺🇾",
  France: "🇫🇷",
  Senegal: "🇸🇳",
  Iraq: "🇮🇶",
  Norway: "🇳🇴",
  Argentina: "🇦🇷",
  Algeria: "🇩🇿",
  Austria: "🇦🇹",
  Jordan: "🇯🇴",
  Portugal: "🇵🇹",
  "Congo DR": "🇨🇩",
  Uzbekistan: "🇺🇿",
  Colombia: "🇨🇴",
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  Croatia: "🇭🇷",
  Ghana: "🇬🇭",
  Panama: "🇵🇦",
};

// Group countries by letter, preserving JSON order (groupPosition 1–4)
const GROUPS_BY_LETTER = wcTableData.countries.reduce<
  Record<string, typeof wcTableData.countries>
>((acc, country) => {
  if (!acc[country.group]) acc[country.group] = [];
  acc[country.group].push(country);
  return acc;
}, {});

// All 48 countries sorted alphabetically for the finals dropdowns
const ALL_COUNTRIES = [...wcTableData.countries].sort((a, b) =>
  a.name.localeCompare(b.name),
);

// ── Types ────────────────────────────────────────────────────────────────────

interface FinalsPredictions {
  winner: string;
  runnerUp: string;
  third: string;
  fourth: string;
}

interface FormData {
  name: string;
  displayName: string;
  league: string;
  tieBreak: string;
  groupPredictions: Record<string, string>;
  finalsPredictions: FinalsPredictions;
  message?: string;
}

const INITIAL_FORM_DATA: FormData = {
  name: "",
  displayName: "",
  league: "",
  tieBreak: "",
  groupPredictions: {},
  finalsPredictions: { winner: "", runnerUp: "", third: "", fourth: "" },
};

// ── Shared dropdown component ─────────────────────────────────────────────────

function CountryDropdown({
  label,
  placeholder,
  countries,
  selected,
  onChange,
  hasError,
}: {
  label: string;
  placeholder: string;
  countries: { name: string }[];
  selected: string;
  onChange: (country: string) => void;
  hasError?: boolean;
}) {
  function handleSelect(countryName: string) {
    onChange(countryName);
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
          <span className={selected ? "" : "text-base-content/40"}>
            {selected ? `${FLAGS[selected] ?? "🏳️"} ${selected}` : placeholder}
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
          {countries.map((country) => (
            <li key={country.name}>
              <button
                onClick={() => handleSelect(country.name)}
                className={selected === country.name ? "active" : ""}
              >
                {FLAGS[country.name] ?? "🏳️"} {country.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Step components ───────────────────────────────────────────────────────────

function StepDetails({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="form-control">
        <label className="label" htmlFor="name">
          <span className="label-text font-semibold">Full Name</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g. Steve Fewster"
          className="input input-bordered w-full"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>

      <div className="form-control">
        <label className="label" htmlFor="displayName">
          <span className="label-text font-semibold">Display Name</span>
          <span className="label-text-alt text-base-content/50">
            Shown on the leaderboard
          </span>
        </label>
        <input
          id="displayName"
          type="text"
          placeholder="e.g. Fewster"
          className="input input-bordered w-full"
          value={data.displayName}
          onChange={(e) => onChange({ displayName: e.target.value })}
        />
      </div>

      <div className="form-control">
        <label className="label" htmlFor="league">
          <span className="label-text font-semibold">League</span>
          <span className="label-text-alt text-base-content/50">Optional</span>
        </label>
        <input
          id="league"
          type="text"
          placeholder="e.g. Friday Night League"
          className="input input-bordered w-full"
          value={data.league}
          onChange={(e) => onChange({ league: e.target.value })}
        />
      </div>

      <div className="divider" />

      <div className="form-control">
        <label className="label" htmlFor="tieBreak">
          <span className="label-text font-semibold">
            Tie Break — Total goal minutes in the World Cup Final
          </span>
        </label>
        <p className="text-sm text-base-content/60 mb-2">
          Add up the minute of every goal scored in the final. e.g. goals in the
          6th, 19th, and 89th minute = <strong>114</strong>.
        </p>
        <input
          id="tieBreak"
          type="number"
          min={0}
          placeholder="e.g. 114"
          className="input input-bordered w-full max-w-xs"
          value={data.tieBreak}
          onChange={(e) => onChange({ tieBreak: e.target.value })}
        />
      </div>
    </div>
  );
}

function StepGroupStage({
  predictions,
  onChange,
}: {
  predictions: Record<string, string>;
  onChange: (group: string, country: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {GROUP_LETTERS.map((group) => (
        <CountryDropdown
          key={group}
          label={`Group ${group}`}
          placeholder={`Select winner for Group ${group}`}
          countries={GROUPS_BY_LETTER[group] ?? []}
          selected={predictions[group] ?? ""}
          onChange={(country) => onChange(group, country)}
        />
      ))}
    </div>
  );
}

const FINALS_FIELDS: { key: keyof FinalsPredictions; label: string }[] = [
  { key: "winner", label: "Winner" },
  { key: "runnerUp", label: "Runner Up" },
  { key: "third", label: "3rd Place" },
  { key: "fourth", label: "4th Place" },
];

function StepFinals({
  predictions,
  onChange,
}: {
  predictions: FinalsPredictions;
  onChange: (patch: Partial<FinalsPredictions>) => void;
}) {
  const selectedValues = Object.values(predictions).filter(Boolean);
  const duplicates = selectedValues.filter(
    (v, i) => selectedValues.indexOf(v) !== i,
  );

  return (
    <div className="flex flex-col gap-4">
      {FINALS_FIELDS.map(({ key, label }) => (
        <CountryDropdown
          key={key}
          label={label}
          placeholder={`Select ${label}`}
          countries={ALL_COUNTRIES}
          selected={predictions[key]}
          onChange={(country) => onChange({ [key]: country })}
          hasError={!!predictions[key] && duplicates.includes(predictions[key])}
        />
      ))}
    </div>
  );
}

// ── Validation ────────────────────────────────────────────────────────────────

function isStepValid(step: number, data: FormData): boolean {
  if (step === 0) {
    return (
      data.name.trim() !== "" &&
      data.displayName.trim() !== "" &&
      data.tieBreak !== ""
    );
  }
  if (step === 1) {
    return GROUP_LETTERS.every((g) => !!data.groupPredictions[g]);
  }
  if (step === 2) {
    const vals = Object.values(data.finalsPredictions);
    const allFilled = vals.every(Boolean);
    const noDuplicates = new Set(vals).size === vals.length;
    return allFilled && noDuplicates;
  }
  return true;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SubmitEntryPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)league=([^;]*)/);
    if (match) {
      setFormData((prev) => ({
        ...prev,
        league: prev.league || decodeURIComponent(match[1]),
      }));
    }
  }, []);

  const totalSteps = STEPS.length;
  const isLast = step === totalSteps - 1;
  const canProceed = isStepValid(step, formData);

  function patchFormData(patch: Partial<FormData>) {
    setFormData((prev) => ({ ...prev, ...patch }));
  }

  function setGroupPrediction(group: string, country: string) {
    setFormData((prev) => ({
      ...prev,
      groupPredictions: { ...prev.groupPredictions, [group]: country },
    }));
  }

  function setFinalsPrediction(patch: Partial<FinalsPredictions>) {
    setFormData((prev) => ({
      ...prev,
      finalsPredictions: { ...prev.finalsPredictions, ...patch },
    }));
  }

  function handleSubmit() {
    emailjs
      .send(
        "service_vmm195j",
        "template_sgb3sna",
        {
          name: formData.name,
          message: JSON.stringify(formData),
        },
        { publicKey: "R0NA0abzOhyKQ6hRF" },
      )
      .then(
        () => {
          alert(
            "Your entry has been submitted successfully. If you have any changes, please contact Steven Fewster directly.",
          );
        },
        (error) => {
          console.error("FAILED...", error);
          alert("Failed to submit entry. Please contact Steven Fewster");
        },
      );
  }

  return (
    <div className="min-h-screen bg-base-200 md:p-4">
      <div className="max-w-6xl mx-auto">
        <PageNav navItems={WC2026_NAV_ITEMS}>Enter Competition</PageNav>

        <ul className="steps w-full mb-6 px-2">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={`step text-xs ${i <= step ? "step-primary" : ""}`}
            >
              {label}
            </li>
          ))}
        </ul>

        <div className="card bg-base-100 shadow-xl rounded-none md:rounded-box">
          <div className="card-body p-6">
            <h2 className="card-title text-xl mb-6">{STEPS[step]}</h2>

            {step === 0 && (
              <StepDetails data={formData} onChange={patchFormData} />
            )}
            {step === 1 && (
              <StepGroupStage
                predictions={formData.groupPredictions}
                onChange={setGroupPrediction}
              />
            )}
            {step === 2 && (
              <StepFinals
                predictions={formData.finalsPredictions}
                onChange={setFinalsPrediction}
              />
            )}

            <div className="flex justify-between mt-8">
              <button
                className="btn btn-ghost"
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 0}
              >
                ← Back
              </button>

              {isLast ? (
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={!canProceed}
                >
                  Submit Entry
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed}
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
