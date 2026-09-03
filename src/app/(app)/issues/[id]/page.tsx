'use client';

import { useParams } from 'next/navigation';
import { RequirePermission } from '@/src/lib/auth/guards';
import { IssueDetailView } from '@/src/components/views/issues/IssueDetailView';

export default function IssueDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string) || '';

  return (
    <RequirePermission permission="issues.read">
      <IssueDetailView issueId={id} />
    </RequirePermission>
  );
}
