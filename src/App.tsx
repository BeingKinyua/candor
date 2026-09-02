/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/src/lib/auth/authContext';
import { NavigationProvider, useNavigation } from '@/src/lib/router/navigationContext';
import { FloatingSidebar } from '@/src/components/shell/FloatingSidebar';
import { Navbar } from '@/src/components/shell/Navbar';
import { Breadcrumbs } from '@/src/components/shell/Breadcrumbs';
import { GlobalSearch } from '@/src/components/shell/GlobalSearch';
import { MobileBottomNav } from '@/src/components/shell/MobileBottomNav';
import { AIDrawer } from '@/src/components/ai/AIDrawer';

// Auth Views
import { LoginView, ForgotPasswordView, ActivateView } from '@/src/components/views/auth/AuthViews';
import { UnauthorizedView } from '@/src/components/views/auth/UnauthorizedView';

// Core Operational Views
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

// Governance & Settings Views
import { SettingsHubView } from '@/src/components/views/settings/SettingsHubView';
import { TeamManagementView } from '@/src/components/views/settings/TeamManagementView';
import { RolesMatrixView } from '@/src/components/views/settings/RolesMatrixView';
import { SecurityAuditView } from '@/src/components/views/settings/SecurityAuditView';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, can } = useAuth();
  const { currentPath, isAiDrawerOpen, closeAiDrawer, aiInitialPrompt } = useNavigation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Loading state prevents any "auth flash" of protected views
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

  // Auth routes (unauthenticated)
  if (!isAuthenticated) {
    if (currentPath === '/forgot-password') return <ForgotPasswordView />;
    if (currentPath === '/activate') return <ActivateView />;
    return <LoginView />;
  }

  // Permission-aware view routing
  const renderView = () => {
    // Explicit 403 route
    if (currentPath === '/unauthorized') {
      return <UnauthorizedView />;
    }

    // Overview / Command Center (all authenticated users)
    if (currentPath === '/overview' || currentPath === '/') {
      return <OverviewView />;
    }

    // People Directory (requires people.read)
    if (currentPath === '/people') {
      if (!can('people.read')) return <UnauthorizedView requiredPermission="people.read" />;
      return <PeopleListView />;
    }
    if (currentPath.startsWith('/people/')) {
      if (!can('people.read')) return <UnauthorizedView requiredPermission="people.read" />;
      const personId = currentPath.split('/people/')[1];
      return <PersonDetailView personId={personId} />;
    }

    // Meetings & Engagements (requires meetings.read)
    if (currentPath === '/meetings') {
      if (!can('meetings.read')) return <UnauthorizedView requiredPermission="meetings.read" />;
      return <MeetingsListView />;
    }
    if (currentPath.startsWith('/meetings/')) {
      if (!can('meetings.read')) return <UnauthorizedView requiredPermission="meetings.read" />;
      const meetingId = currentPath.split('/meetings/')[1];
      return <MeetingDetailView meetingId={meetingId} />;
    }

    // Commitments & Follow-ups (requires commitments.read)
    if (currentPath === '/commitments') {
      if (!can('commitments.read')) return <UnauthorizedView requiredPermission="commitments.read" />;
      return <CommitmentsView />;
    }

    // Field Operations Dashboard (requires field.capture OR field.submissions.read)
    if (currentPath === '/field') {
      if (!can('field.capture') && !can('field.submissions.read')) {
        return <UnauthorizedView requiredPermission="field.capture" />;
      }
      return <FieldDashboardView />;
    }

    // Field Capture Forms (requires field.capture)
    if (currentPath === '/field/capture') {
      if (!can('field.capture')) return <UnauthorizedView requiredPermission="field.capture" />;
      return <CameraCaptureView />;
    }
    if (currentPath === '/field/capture/digital') {
      if (!can('field.capture')) return <UnauthorizedView requiredPermission="field.capture" />;
      return <DigitalFormCaptureView />;
    }

    // Field Verification Queue (requires field.submissions.read OR field.review)
    if (currentPath === '/field/submissions') {
      if (!can('field.submissions.read') && !can('field.review')) {
        return <UnauthorizedView requiredPermission="field.review" />;
      }
      return <VerificationQueueView />;
    }
    if (currentPath.startsWith('/field/submissions/')) {
      if (!can('field.submissions.read') && !can('field.review')) {
        return <UnauthorizedView requiredPermission="field.review" />;
      }
      const submissionId = currentPath.split('/field/submissions/')[1];
      return <VerificationDetailView submissionId={submissionId} />;
    }

    // Knowledge Base (requires knowledge.read)
    if (currentPath === '/knowledge') {
      if (!can('knowledge.read')) return <UnauthorizedView requiredPermission="knowledge.read" />;
      return <KnowledgeListView />;
    }
    if (currentPath.startsWith('/knowledge/')) {
      if (!can('knowledge.read')) return <UnauthorizedView requiredPermission="knowledge.read" />;
      const docId = currentPath.split('/knowledge/')[1];
      return <KnowledgeDetailView docId={docId} />;
    }

    // Issues Desk (requires issues.read)
    if (currentPath === '/issues') {
      if (!can('issues.read')) return <UnauthorizedView requiredPermission="issues.read" />;
      return <IssuesListView />;
    }
    if (currentPath.startsWith('/issues/')) {
      if (!can('issues.read')) return <UnauthorizedView requiredPermission="issues.read" />;
      const issueId = currentPath.split('/issues/')[1];
      return <IssueDetailView issueId={issueId} />;
    }

    // Settings Governance Hub
    if (currentPath === '/settings') {
      if (!can('team.read') && !can('team.manage') && !can('audit.read')) {
        return <UnauthorizedView requiredPermission="team.read" />;
      }
      return <SettingsHubView />;
    }

    // Settings: Team Management (requires team.read or team.manage or team.invite)
    if (currentPath === '/settings/team') {
      if (!can('team.read') && !can('team.manage') && !can('team.invite')) {
        return <UnauthorizedView requiredPermission="team.read" />;
      }
      return <TeamManagementView />;
    }

    // Settings: Roles & Permissions Matrix
    if (currentPath === '/settings/roles') {
      if (!can('team.read') && !can('team.manage')) {
        return <UnauthorizedView requiredPermission="team.read" />;
      }
      return <RolesMatrixView />;
    }

    // Settings: Security Audit Logs
    if (currentPath === '/settings/audit') {
      if (!can('audit.read')) {
        return <UnauthorizedView requiredPermission="audit.read" />;
      }
      return <SecurityAuditView />;
    }

    // Default Fallback to Overview
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
          <Breadcrumbs />
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
