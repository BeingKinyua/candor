/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/src/lib/auth/authContext';
import { NavigationProvider, useNavigation } from '@/src/lib/router/navigationContext';
import { FloatingSidebar } from '@/src/components/shell/FloatingSidebar';
import { Navbar } from '@/src/components/shell/Navbar';
import { GlobalSearch } from '@/src/components/shell/GlobalSearch';
import { MobileBottomNav } from '@/src/components/shell/MobileBottomNav';
import { AIDrawer } from '@/src/components/ai/AIDrawer';

// Views
import { LoginView, ForgotPasswordView, ActivateView } from '@/src/components/views/auth/AuthViews';
import { OverviewView } from '@/src/components/views/overview/OverviewView';
import { PeopleListView } from '@/src/components/views/people/PeopleListView';
import { PersonDetailView } from '@/src/components/views/people/PersonDetailView';
import { MeetingsListView } from '@/src/components/views/meetings/MeetingsListView';
import { MeetingDetailView } from '@/src/components/views/meetings/MeetingDetailView';
import { CommitmentsView } from '@/src/components/views/commitments/CommitmentsView';
import { FieldDashboardView } from '@/src/components/views/field/FieldDashboardView';
import { CameraCaptureView } from '@/src/components/views/field/CameraCaptureView';
import { DigitalFormCaptureView } from '@/src/components/views/field/DigitalFormCaptureView';
import { VerificationQueueView } from '@/src/components/views/field/VerificationQueueView';
import { VerificationDetailView } from '@/src/components/views/field/VerificationDetailView';
import { KnowledgeListView } from '@/src/components/views/knowledge/KnowledgeListView';
import { KnowledgeDetailView } from '@/src/components/views/knowledge/KnowledgeDetailView';
import { IssuesListView } from '@/src/components/views/issues/IssuesListView';
import { IssueDetailView } from '@/src/components/views/issues/IssueDetailView';
import { TeamManagementView } from '@/src/components/views/settings/TeamManagementView';
import { RolesMatrixView } from '@/src/components/views/settings/RolesMatrixView';
import { SecurityAuditView } from '@/src/components/views/settings/SecurityAuditView';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentPath, isAiDrawerOpen, closeAiDrawer, aiInitialPrompt } = useNavigation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Auth routes (unauthenticated)
  if (!isAuthenticated) {
    if (currentPath === '/forgot-password') return <ForgotPasswordView />;
    if (currentPath === '/activate') return <ActivateView />;
    return <LoginView />;
  }

  // Router logic
  const renderView = () => {
    // Exact routes
    if (currentPath === '/overview' || currentPath === '/') return <OverviewView />;
    if (currentPath === '/people') return <PeopleListView />;
    if (currentPath === '/meetings') return <MeetingsListView />;
    if (currentPath === '/commitments') return <CommitmentsView />;
    if (currentPath === '/field') return <FieldDashboardView />;
    if (currentPath === '/field/capture') return <CameraCaptureView />;
    if (currentPath === '/field/capture/digital') return <DigitalFormCaptureView />;
    if (currentPath === '/field/submissions') return <VerificationQueueView />;
    if (currentPath === '/knowledge') return <KnowledgeListView />;
    if (currentPath === '/issues') return <IssuesListView />;
    if (currentPath === '/settings/team') return <TeamManagementView />;
    if (currentPath === '/settings/roles') return <RolesMatrixView />;
    if (currentPath === '/settings/audit') return <SecurityAuditView />;

    // Dynamic Parameter Routes
    if (currentPath.startsWith('/people/')) {
      const personId = currentPath.split('/people/')[1];
      return <PersonDetailView personId={personId} />;
    }
    if (currentPath.startsWith('/meetings/')) {
      const meetingId = currentPath.split('/meetings/')[1];
      return <MeetingDetailView meetingId={meetingId} />;
    }
    if (currentPath.startsWith('/field/submissions/')) {
      const submissionId = currentPath.split('/field/submissions/')[1];
      return <VerificationDetailView submissionId={submissionId} />;
    }
    if (currentPath.startsWith('/knowledge/')) {
      const docId = currentPath.split('/knowledge/')[1];
      return <KnowledgeDetailView docId={docId} />;
    }
    if (currentPath.startsWith('/issues/')) {
      const issueId = currentPath.split('/issues/')[1];
      return <IssueDetailView issueId={issueId} />;
    }

    // Default Fallback
    return <OverviewView />;
  };

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
        <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

        {/* Dynamic Route Workspace with Smooth Page Transition */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {renderView()}
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

export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </AuthProvider>
  );
}
