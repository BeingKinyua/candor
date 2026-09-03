'use client';

import { useAuth } from '@/src/lib/auth/authContext';
import { UnauthorizedView } from '@/src/components/views/auth/UnauthorizedView';
import { SecurityAuditView } from '@/src/components/views/settings/SecurityAuditView';

export default function AuditPage() {
  const { can } = useAuth();

  if (!can('audit.read')) {
    return <UnauthorizedView requiredPermission="audit.read" />;
  }

  return <SecurityAuditView />;
}
