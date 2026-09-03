'use client';

import { useAuth } from '@/src/lib/auth/authContext';
import { UnauthorizedView } from '@/src/components/views/auth/UnauthorizedView';
import { SettingsHubView } from '@/src/components/views/settings/SettingsHubView';

export default function SettingsPage() {
  const { can } = useAuth();

  if (!can('team.read') && !can('team.manage') && !can('audit.read')) {
    return <UnauthorizedView requiredPermission="team.read" />;
  }

  return <SettingsHubView />;
}
