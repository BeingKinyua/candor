'use client';

import { useAuth } from '@/src/lib/auth/authContext';
import { UnauthorizedView } from '@/src/components/views/auth/UnauthorizedView';
import { VerificationQueueView } from '@/src/components/views/field/VerificationQueueView';

export default function VerificationQueuePage() {
  const { can } = useAuth();

  if (!can('field.submissions.read') && !can('field.review')) {
    return <UnauthorizedView requiredPermission="field.review" />;
  }

  return <VerificationQueueView />;
}
