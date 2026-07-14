import PageNav from "@/components/PageNav";
import { WC2026_NAV_ITEMS } from "@/lib/constants";
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
  if (country.finalPosition === 1) return "bg-warning/20";
  if (country.finalPosition === 2) return "bg-accent/15";
  if (country.finalPosition === 3 || country.finalPosition === 4) {
    return "bg-info/15";
  }
  if (country.groupPosition === 1) return "bg-success/10";
  return "";
}

function getStatusBadge(country: WcCountry) {
  if (country.finalPosition === 1) {
    return (
      <span className="badge badge-warning badge-sm font-semibold">Winner</span>
    );
  }

  if (country.finalPosition === 2) {
    return (
      <span className="badge badge-accent badge-sm font-semibold">
        Runner-up
      </span>
    );
  }

  if (country.finalPosition === 3) {
    return (
      <span className="badge badge-info badge-sm font-semibold">Third</span>
    );
  }

  if (country.finalPosition === 4) {
    return (
      <span className="badge badge-info badge-sm font-semibold">Fourth</span>
    );
  }

  if (country.groupPosition === 1) {
    return (
      <span className="badge badge-success badge-sm badge-outline font-semibold">
        Group winner
      </span>
    );
  }

  return null;
}

export default function TablePage() {
  const countries = [...typedWcTableData.countries].sort(sortCountries);

  return (
    <div className="min-h-screen bg-base-200 md:p-4">
      <div className="max-w-6xl mx-auto">
        <PageNav navItems={WC2026_NAV_ITEMS}>WC Table</PageNav>

        <div className="card bg-base-100 shadow-xl rounded-none md:rounded-box">
          <div className="card-body p-2 md:p-4">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="card-title text-3xl">World Cup Table</h2>
              <span className="text-xs text-base-content/50">
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
              <span className="badge badge-warning badge-sm font-semibold">
                Winner
              </span>
              <span className="badge badge-accent badge-sm font-semibold">
                Runner-up
              </span>
              <span className="badge badge-info badge-sm font-semibold">
                Third/Fourth
              </span>
              <span className="badge badge-success badge-sm badge-outline font-semibold">
                Group winner
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
