import PageNav from "@/components/PageNav";
import { WC2026_NAV_ITEMS } from "@/lib/constants";

export default function ScoresPage() {
  return (
    <div className="min-h-screen bg-base-200 md:p-4">
      <div className="max-w-6xl mx-auto">
        <PageNav navItems={WC2026_NAV_ITEMS}>Results</PageNav>

        <div className="card bg-base-100 shadow-xl rounded-none md:rounded-box">
          <div className="card-body p-6">
            <h2 className="card-title text-3xl mb-2">Scores</h2>
            <p className="text-base-content/70 mb-6">
              Coming soon — scores will appear here once the tournament begins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
