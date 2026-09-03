'use client';

import { useParams } from 'next/navigation';
import { RequirePermission } from '@/src/lib/auth/guards';
import { PersonDetailView } from '@/src/components/views/people/PersonDetailView';

export default function PersonDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string) || '';

  return (
    <RequirePermission permission="people.read">
      <PersonDetailView personId={id} />
    </RequirePermission>
  );
}
