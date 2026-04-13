'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TableRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/pl-2026/table');
  }, [router]);
  return null;
}
