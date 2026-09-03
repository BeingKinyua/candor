'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/lib/auth/authContext';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/overview');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#032221] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-[#08453A] border border-[#00DF81]/40 flex items-center justify-center animate-pulse shadow-xl shadow-[#00DF81]/10">
        <span className="font-serif-heading text-xl font-bold text-[#00DF81]">C</span>
      </div>
      <p className="text-xs font-mono text-[#AACBC4] tracking-wide animate-pulse">
        Initializing CANDOR...
      </p>
    </div>
  );
}
