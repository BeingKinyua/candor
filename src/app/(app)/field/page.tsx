'use client';

import { useAuth } from '@/src/lib/auth/authContext';
import { UnauthorizedView } from '@/src/components/views/auth/UnauthorizedView';
import { FieldDashboardView } from '@/src/components/views/field/FieldDashboardView';

export default function FieldDashboardPage() {
  const { can } = useAuth();

  if (!can('field.capture') && !can('field.submissions.read')) {
    return <UnauthorizedView requiredPermission="field.capture" />;
  }

  return <FieldDashboardView />;
}
