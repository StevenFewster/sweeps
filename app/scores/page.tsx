'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ScoresRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/pl-2026/scores');
  }, [router]);
  return null;
}
