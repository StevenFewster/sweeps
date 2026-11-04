import PageLayout from "@/components/PageLayout";
import { WC2026_FAQS, WC2026_NAV_ITEMS, WC2026_NAME } from "@/lib/constants";
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
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      {subtitle && <p className="sf-eyebrow mb-1">{subtitle}</p>}
      <h2 className="text-2xl font-medium text-gray-900">{title}</h2>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <PageLayout
      title="How It Works"
      competition={WC2026_NAME}
      navItems={WC2026_NAV_ITEMS}
    >
      <EnterButton />

      {/* ── Group Stage ─────────────────────────────────────────── */}
      <div className="card sf-panel mb-4">
        <div className="card-body p-6">
          <SectionHeading
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
                  <th>Scores</th>
                  <th className="text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Your pick <strong>tops the group</strong>
                  </td>
                  <td className="text-right">
                    <span className="badge font-bold sf-score-high">
                      3&nbsp;pts
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    Your pick <strong>qualifies for the Last 32</strong> (but
                    didn&apos;t win the group)
                  </td>
                  <td className="text-right">
                    <span className="badge font-bold sf-score-low">1 pt</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    Your pick is <strong>eliminated</strong> in the group
                    stage
                  </td>
                  <td className="text-right">
                    <span className="badge sf-score-none">0&nbsp;pts</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Finals ──────────────────────────────────────────────── */}
      <div className="card sf-panel mb-4">
        <div className="card-body p-6">
          <SectionHeading
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
                  <td className="text-sm text-gray-600">
                    Picked Brazil 1st — Brazil wins
                  </td>
                  <td className="text-right">
                    <span className="badge font-bold sf-score-high">
                      5&nbsp;pts
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    Team reached the <strong>right stage</strong> but wrong
                    position
                  </td>
                  <td className="text-sm text-gray-600">
                    Picked South Korea 3rd — they lost the 3rd/4th play-off;
                    or picked Brazil 1st — they lost the final
                  </td>
                  <td className="text-right">
                    <span className="badge font-bold sf-score-mid">
                      2 pts
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    Team <strong>finished in the top 4</strong> but a
                    different position
                  </td>
                  <td className="text-sm text-gray-600">
                    Picked Mexico 4th — they won the tournament
                  </td>
                  <td className="text-right">
                    <span className="badge font-bold sf-score-low">1 pt</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    Team <strong>did not reach</strong> the top 4
                  </td>
                  <td className="text-sm text-gray-600">
                    Picked Germany 2nd — eliminated in the quarters
                  </td>
                  <td className="text-right">
                    <span className="badge sf-score-none">0 pts</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Tie Breaker ─────────────────────────────────────────── */}
      <div className="card sf-panel mb-4">
        <div className="card-body p-6">
          <SectionHeading
            title="Tie Breaker"
            subtitle="Used only if two entrants finish level on points"
          />

          <p className="mb-4">
            Predict the <strong>total number of yellow cards</strong> issued
            across the entire tournament. The entrant whose prediction is
            closest to the actual total wins the tie.
          </p>

          <div className="sf-aside">
            <p className="sf-eyebrow mb-2">
              Context
            </p>
            <ul className="text-sm space-y-1">
              <li>
                The record was set at the <strong>2006 World Cup</strong> —{" "}
                <strong>
                  345 yellow cards
                </strong>{" "}
                across 64 matches
              </li>
              <li>
                This World Cup features{" "}
                <strong>104 matches</strong>,
                the most in history
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <div className="card sf-panel mb-4">
        <div className="card-body p-6">
          <SectionHeading title="FAQs" />

          {WC2026_FAQS.map((faq) => (
            <div className="collapse collapse-arrow mb-2 bg-white last:mb-0" key={faq.id}>
              <input type="checkbox" />
              <div className="collapse-title font-medium">{faq.question}</div>
              <div className="collapse-content text-gray-700">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EnterButton />
    </PageLayout>
  );
}
