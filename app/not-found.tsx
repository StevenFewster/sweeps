import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export default function NotFound() {
  return (
    <PageLayout title="Page not found">
      <p className="mb-4 leading-relaxed text-gray-700">
        That page doesn&apos;t exist. It may have moved when a new competition started.
      </p>
      <Link href="/" className="btn btn-primary">
        Back to all sweepstakes
      </Link>
    </PageLayout>
  );
}
