import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-base-200 md:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="navbar bg-base-100 md:rounded-box shadow-md mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold pl-4">How It Works</h1>
          </div>
          <div className="flex-none">
            <Link href="/" className="btn btn-ghost">
              Home
            </Link>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl rounded-none md:rounded-box">
          <div className="card-body p-6">
            <h2 className="card-title text-3xl mb-2">World Cup 2026 Sweepstake</h2>
            <p className="text-base-content/70 mb-6">Coming soon — rules and scoring to be confirmed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
