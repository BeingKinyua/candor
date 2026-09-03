'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/lib/auth/authContext';
import { FloatingSidebar } from '@/src/components/shell/FloatingSidebar';
import { Navbar } from '@/src/components/shell/Navbar';
import { Breadcrumbs } from '@/src/components/shell/Breadcrumbs';
import { GlobalSearch } from '@/src/components/shell/GlobalSearch';
import { MobileBottomNav } from '@/src/components/shell/MobileBottomNav';
import { AIDrawer } from '@/src/components/ai/AIDrawer';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Prevent flash of authenticated content during initial auth verification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#032221] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#08453A] border border-[#00DF81]/40 flex items-center justify-center animate-pulse shadow-xl shadow-[#00DF81]/10">
          <span className="font-serif-heading text-xl font-bold text-[#00DF81]">C</span>
        </div>
        <p className="text-xs font-mono text-[#AACBC4] tracking-wide animate-pulse">
          Establishing cryptographically verified session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#032221] text-[#F1F7F6] flex relative overflow-x-hidden font-sans">
      {/* Floating Operational Sidebar (Desktop) */}
      <FloatingSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Stage */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-out ${
          isSidebarCollapsed ? 'md:ml-[100px]' : 'md:ml-[288px]'
        }`}
      >
        {/* Top Operational Navigation */}
        <Navbar
          isSidebarCollapsed={isSidebarCollapsed}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* Dynamic Route Workspace with Smooth Page Transition and Fixed Navbar Clearance */}
        <main className="flex-1 pt-20 sm:pt-22 md:pt-24 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          <Breadcrumbs />
          {children}
        </main>

        {/* Mobile Navigation Dock */}
        <MobileBottomNav />
      </div>

      {/* Global Command Palette */}
      <GlobalSearch />

      {/* Context-Aware AI Intelligence Drawer */}
      <AIDrawer />
    </div>
  );
};
