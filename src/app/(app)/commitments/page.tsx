'use client';

import { RequirePermission } from '@/src/lib/auth/guards';
import { CommitmentsView } from '@/src/components/views/commitments/CommitmentsView';

export default function CommitmentsPage() {
  return (
    <RequirePermission permission="commitments.read">
      <CommitmentsView />
    </RequirePermission>
  );
}
