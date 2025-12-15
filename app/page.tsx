import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 shadow-xl max-w-md">
        <div className="card-body items-center text-center">
          <h1 className="card-title text-4xl font-bold mb-4">
            Welcome to the PL Sweepstake 2025/26
          </h1>
          <p className="text-lg mb-6">
            Track predictions and scores for the Premier League season
          </p>
          <Link href="/scores" className="btn btn-primary btn-outline">
            Enter
          </Link>
        </div>
      </div>
    </div>
  );
}

