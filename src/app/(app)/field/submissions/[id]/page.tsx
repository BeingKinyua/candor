'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/src/lib/auth/authContext';
import { UnauthorizedView } from '@/src/components/views/auth/UnauthorizedView';
import { VerificationDetailView } from '@/src/components/views/field/VerificationDetailView';

export default function VerificationDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string) || '';
  const { can } = useAuth();

  if (!can('field.submissions.read') && !can('field.review')) {
    return <UnauthorizedView requiredPermission="field.review" />;
  }

  return <VerificationDetailView submissionId={id} />;
}
