'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <h2 className="text-4xl font-bold">404 - Not Found</h2>
      <p className="text-muted">Could not find the requested resource.</p>
      <Link href="/dashboard" className="text-primary hover:underline">
        Return to Dashboard
      </Link>
    </div>
  );
}
