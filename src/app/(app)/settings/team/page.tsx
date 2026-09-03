'use client';

import { useAuth } from '@/src/lib/auth/authContext';
import { UnauthorizedView } from '@/src/components/views/auth/UnauthorizedView';
import { TeamManagementView } from '@/src/components/views/settings/TeamManagementView';

export default function TeamManagementPage() {
  const { can } = useAuth();

  if (!can('team.read') && !can('team.manage') && !can('team.invite')) {
    return <UnauthorizedView requiredPermission="team.read" />;
  }

  return <TeamManagementView />;
}
