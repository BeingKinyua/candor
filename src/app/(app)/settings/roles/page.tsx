'use client';

import { useAuth } from '@/src/lib/auth/authContext';
import { UnauthorizedView } from '@/src/components/views/auth/UnauthorizedView';
import { RolesMatrixView } from '@/src/components/views/settings/RolesMatrixView';

export default function RolesMatrixPage() {
  const { can } = useAuth();

  if (!can('team.read') && !can('team.manage')) {
    return <UnauthorizedView requiredPermission="team.read" />;
  }

  return <RolesMatrixView />;
}
