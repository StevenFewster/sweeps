import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card  max-w-md">
        <div className="card-body items-center text-center">
          <h1 className="card-title text-4xl font-bold mb-4">
            Sports Prediction Sweepstake
          </h1>
          <p className="text-lg mb-6">
            Enter and Track Your Sports Prediction Sweepstake!
          </p>
          <div className="indicator w-full">
            <span className="indicator-item badge badge-warning">New</span>
            <Link href="/wc-2026/how-it-works" className="btn btn-primary btn-outline w-full">
              World Cup 2026
            </Link>
          </div>
          <Link href="/pl-2026/scores" className="btn btn-primary btn-outline w-full mt-4">
            PL Sweepstake 2025/26
          </Link>
        </div>
      </div>
    </div>
  );
}

