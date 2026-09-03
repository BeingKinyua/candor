'use client';

import { RequirePermission } from '@/src/lib/auth/guards';
import { IssuesListView } from '@/src/components/views/issues/IssuesListView';

export default function IssuesPage() {
  return (
    <RequirePermission permission="issues.read">
      <IssuesListView />
    </RequirePermission>
  );
}
