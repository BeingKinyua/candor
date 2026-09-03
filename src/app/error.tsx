'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Router Uncaught Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#032221] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#E05252]/10 border border-[#E05252]/30 flex items-center justify-center mb-6 shadow-xl shadow-[#E05252]/10">
        <AlertTriangle className="w-8 h-8 text-[#E05252]" />
      </div>
      <h1 className="text-2xl font-serif-heading font-bold text-[#F1F7F6] mb-2">
        Operational Telemetry Interruption
      </h1>
      <p className="text-sm text-[#AACBC4] max-w-md mb-8">
        An unexpected application boundary condition occurred. Operational state has been preserved.
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#08453A] border border-[#00DF81]/40 text-[#00DF81] font-semibold text-sm hover:bg-[#00DF81] hover:text-[#032221] transition-all cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Recover View Session</span>
      </button>
    </div>
  );
}
