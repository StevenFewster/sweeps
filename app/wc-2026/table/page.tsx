import PageLayout from "@/components/PageLayout";
import { WC2026_NAV_ITEMS, WC2026_NAME } from "@/lib/constants";
import { WcCountry, WcTableData } from "@/lib/types";
import wcTableData from "@/public/wc-table.json";

const typedWcTableData = wcTableData as WcTableData;

function sortCountries(a: WcCountry, b: WcCountry) {
  const aFinalPosition = a.finalPosition ?? Number.MAX_SAFE_INTEGER;
  const bFinalPosition = b.finalPosition ?? Number.MAX_SAFE_INTEGER;

  if (aFinalPosition !== bFinalPosition) {
    return aFinalPosition - bFinalPosition;
  }

  if (a.groupPoints !== b.groupPoints) {
    return b.groupPoints - a.groupPoints;
  }

  if (a.groupGoalDifference !== b.groupGoalDifference) {
    return b.groupGoalDifference - a.groupGoalDifference;
  }

  if (a.groupGoalsFor !== b.groupGoalsFor) {
    return b.groupGoalsFor - a.groupGoalsFor;
  }

  return a.name.localeCompare(b.name);
}

function getRowClass(country: WcCountry) {
  if (country.finalPosition === 1) return "bg-wedgewood-200";
  if (country.finalPosition === 2) return "bg-wedgewood-100";
  if (country.finalPosition === 3 || country.finalPosition === 4) {
    return "bg-wedgewood-50";
  }
    return "";
}

function getStatusBadge(country: WcCountry) {
  if (country.finalPosition === 1) {
    return (
      <span className="badge badge-sm font-semibold sf-score-high">Winner</span>
    );
  }

  if (country.finalPosition === 2) {
    return (
      <span className="badge badge-sm font-semibold sf-score-mid">
        Runner-up
      </span>
    );
  }

  if (country.finalPosition === 3) {
    return (
      <span className="badge badge-sm font-semibold sf-score-low">Third</span>
    );
  }

  if (country.finalPosition === 4) {
    return (
      <span className="badge badge-sm font-semibold sf-score-low">Fourth</span>
    );
  }

  if (country.groupPosition === 1) {
    return (
      <span className="badge badge-sm font-semibold sf-score-none text-wedgewood-700">
        Group winner
      </span>
    );
  }

  return null;
}

export default function TablePage() {
  const countries = [...typedWcTableData.countries].sort(sortCountries);

  return (
    <PageLayout
      title="WC Table"
      competition={WC2026_NAME}
      navItems={WC2026_NAV_ITEMS}
    >
      <div className="card sf-panel-outline">
        <div className="card-body p-2 md:p-4">
          <div className="flex items-baseline justify-end mb-4">
            <span className="text-xs text-gray-500">
              Updated {new Date(typedWcTableData.timestamp).toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra table-sm md:table-md w-full">
              <thead>
                <tr>
                  <th className="text-center">Position</th>
                  <th>Team</th>
                  <th className="text-center">Group</th>
                  <th className="text-center">Played</th>
                  <th className="text-center">For</th>
                  <th className="text-center">Against</th>
                  <th className="text-center">GD</th>
                  <th className="text-center">Points</th>
                </tr>
              </thead>
              <tbody>
                {countries.map((country) => (
                  <tr key={country.name} className={getRowClass(country)}>
                    <td className="text-center font-semibold">
                      {country.finalPosition ?? "-"}
                    </td>
                    <td className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{country.name}</span>
                        {getStatusBadge(country)}
                      </div>
                    </td>
                    <td className="text-center">{country.group}</td>
                    <td className="text-center">{country.groupPlayed}</td>
                    <td className="text-center">{country.groupGoalsFor}</td>
                    <td className="text-center">
                      {country.groupGoalsAgainst}
                    </td>
                    <td className="text-center">
                      {country.groupGoalDifference}
                    </td>
                    <td className="text-center font-semibold">
                      {country.groupPoints}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="badge badge-sm font-semibold sf-score-high">
              Winner
            </span>
            <span className="badge badge-sm font-semibold sf-score-mid">
              Runner-up
            </span>
            <span className="badge badge-sm font-semibold sf-score-low">
              Third/Fourth
            </span>
            <span className="badge badge-sm font-semibold sf-score-none text-wedgewood-700">
              Group winner
            </span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
