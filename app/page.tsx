import Link from "next/link";
import PageLayout from "@/components/PageLayout";

const ARCHIVE = [
  {
    href: "/wc-2026/scores",
    title: "World Cup 2026",
    description:
      "Group winners, the final four and a yellow card tie break across 104 matches.",
  },
  {
    href: "/pl-2026/scores",
    title: "PL Sweepstake 2025/26",
    description:
      "Predicting the Premier League top four and bottom three, with total goals as the tie break.",
  },
];

export default function Home() {
  return (
    <PageLayout>
      <h1 className="sr-only">Sports Prediction Sweepstake</h1>

      <section className="flex flex-col md:flex-row">
        <div className="sf-banner flex h-36 items-center justify-center md:h-auto md:w-1/3">
          <span className="text-6xl font-medium text-wedgewood-50">26/27</span>
        </div>
        <div className="sf-panel flex flex-col p-6 md:w-2/3 md:p-12">
          <p className="sf-eyebrow mb-1">Current</p>
          <h2 className="mb-3 text-3xl font-medium text-gray-900 md:text-4xl">
            PL Sweepstake 2026/27
          </h2>
          <p className="mb-6 leading-relaxed text-gray-700">
            Enter and track your sports prediction sweepstake!
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link href="/pl-26-27/submit-entry" className="btn btn-primary">
              Enter competition
            </Link>
            <Link href="/pl-26-27/scores" className="text-wedgewood-700 hover:underline">
              Scores
            </Link>
            <Link href="/pl-26-27/table" className="text-wedgewood-700 hover:underline">
              Table
            </Link>
          </div>
        </div>
      </section>

      <section className="-mx-4 mt-4 flex flex-wrap md:mt-6">
        {ARCHIVE.map((item) => (
          <div key={item.href} className="w-full p-4 md:w-1/2">
            <div className="sf-panel-outline flex h-full flex-col p-6">
              <p className="sf-eyebrow mb-1">Archive</p>
              <Link
                href={item.href}
                className="text-gray-900 hover:text-wedgewood-500 hover:underline"
              >
                <h2 className="mb-3 text-lg font-medium">{item.title}</h2>
              </Link>
              <p className="leading-relaxed text-gray-700">{item.description}</p>
            </div>
          </div>
        ))}
      </section>
    </PageLayout>
  );
}
