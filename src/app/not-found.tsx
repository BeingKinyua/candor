'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#032221] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#08453A] border border-[#00DF81]/30 flex items-center justify-center mb-6 shadow-xl shadow-[#00DF81]/10">
        <Compass className="w-8 h-8 text-[#00DF81]" />
      </div>
      <h1 className="text-3xl font-serif-heading font-bold text-[#F1F7F6] mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-[#AACBC4] max-w-md mb-8">
        The tactical dossier, operational route, or asset identifier you requested could not be located in the Vantage operations command.
      </p>
      <Link
        href="/overview"
        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#00DF81] text-[#032221] font-semibold text-sm hover:bg-[#2CC295] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Command Center</span>
      </Link>
    </div>
  );
}
