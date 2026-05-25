import PageNav from "@/components/PageNav";
import { WC2026_FAQS, WC2026_NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";

function EnterButton() {
  return (
    <div className="flex justify-center py-4">
      <Link href="/wc-2026/submit-entry" className="btn btn-primary btn-wide">
        Enter Sweepstake
      </Link>
    </div>
  );
}

function SectionHeading({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <span className="text-4xl leading-none">{icon}</span>
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {subtitle && (
          <p className="text-base-content/60 text-sm mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-base-200 md:p-4">
      <div className="max-w-6xl mx-auto">
        <PageNav navItems={WC2026_NAV_ITEMS}>How It Works</PageNav>

        <EnterButton />

        {/* ── Group Stage ─────────────────────────────────────────── */}
        <div className="card bg-base-100 shadow-xl rounded-none md:rounded-box mb-4">
          <div className="card-body p-6">
            <SectionHeading
              icon="🌍"
              title="Group Stage"
              subtitle="Groups A – L · 12 groups of 4 teams"
            />

            <p className="mb-4">
              For each of the 12 groups, pick which country you think will{" "}
              <strong>win the group</strong> and finish top of the table.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Result</th>
                    <th className="text-right">Points</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      Your pick <strong>tops the group</strong>
                    </td>
                    <td className="text-right">
                      <span className="badge badge-warning font-bold">
                        3&nbsp;pts
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Your pick <strong>qualifies for the Last 16</strong> (but
                      didn&apos;t win the group)
                    </td>
                    <td className="text-right">
                      <span className="badge badge-info font-bold">1 pt</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Your pick is <strong>eliminated</strong> in the group
                      stage
                    </td>
                    <td className="text-right">
                      <span className="badge badge-ghost">0&nbsp;pts</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border-2 border-dashed border-base-content/20 rounded-box p-8 flex flex-col items-center justify-center gap-2 text-base-content/40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                  strokeLinejoin="round"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 9h18M9 21V9"
                />
              </svg>
              <p className="text-sm font-medium">
                Example screenshot coming soon
              </p>
            </div>
          </div>
        </div>

        {/* ── Finals ──────────────────────────────────────────────── */}
        <div className="card bg-base-100 shadow-xl rounded-none md:rounded-box mb-4">
          <div className="card-body p-6">
            <SectionHeading
              icon="🏆"
              title="The Finals"
              subtitle="Winner · Runner-up · 3rd place · 4th place"
            />

            <p className="mb-4">
              Pick the four teams you think will finish in the top positions at
              the end of the tournament — the <strong>Winner</strong>,{" "}
              <strong>Runner-up</strong>, <strong>3rd place</strong>, and{" "}
              <strong>4th place</strong>.
            </p>

            <div className="overflow-x-auto mb-2">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Example</th>
                    <th className="text-right">Points</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Exact position</strong> correct
                    </td>
                    <td className="text-base-content/60 text-sm">
                      Picked Brazil 1st — Brazil wins
                    </td>
                    <td className="text-right">
                      <span className="badge badge-warning font-bold">
                        5&nbsp;pts
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Team reached the <strong>right stage</strong> but wrong
                      position
                    </td>
                    <td className="text-base-content/60 text-sm">
                      Picked South Korea 3rd — they lost the 3rd/4th play-off;
                      or picked Brazil 1st — they lost the final
                    </td>
                    <td className="text-right">
                      <span className="badge badge-info font-bold">2 pts</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Team <strong>finished in the top 4</strong> but a
                      different position
                    </td>
                    <td className="text-base-content/60 text-sm">
                      Picked Mexico 4th — they won the tournament
                    </td>
                    <td className="text-right">
                      <span className="badge badge-ghost font-bold">1 pt</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Team <strong>did not reach</strong> the top 4
                    </td>
                    <td className="text-base-content/60 text-sm">
                      Picked Germany 2nd — eliminated in the quarters
                    </td>
                    <td className="text-right">
                      <span className="badge badge-ghost">0 pts</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Tie Breaker ─────────────────────────────────────────── */}
        <div className="card bg-base-100 shadow-xl rounded-none md:rounded-box mb-4">
          <div className="card-body p-6">
            <SectionHeading
              icon="🟨"
              title="Tie Breaker"
              subtitle="Used only if two entrants finish level on points"
            />

            <p className="mb-4">
              Predict the <strong>total number of yellow cards</strong> issued
              across the entire tournament. The entrant whose prediction is
              closest to the actual total wins the tie.
            </p>

            <div className="bg-base-200 rounded-box p-4">
              <p className="text-sm font-semibold text-base-content/70 uppercase tracking-widest mb-3">
                Context
              </p>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>
                  🏆 The record was set at the <strong>2006 World Cup</strong>{" "}
                  — <strong className="text-base-content">345 yellow cards</strong> across 64 matches
                </li>
                <li>
                  📅 This World Cup features <strong className="text-base-content">104 matches</strong>, the most in history
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <div className="card bg-base-100 shadow-xl rounded-none md:rounded-box mb-4">
          <div className="card-body p-6">
            <SectionHeading icon="❓" title="FAQs" />

            {WC2026_FAQS.map((faq) => (
              <div className="collapse collapse-arrow bg-base-200" key={faq.id}>
                <input type="checkbox" />
                <div className="collapse-title font-medium">{faq.question}</div>
                <div className="collapse-content text-base-content/70">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <EnterButton />
      </div>
    </div>
  );
}
