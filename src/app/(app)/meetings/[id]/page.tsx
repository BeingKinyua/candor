'use client';

import { useParams } from 'next/navigation';
import { RequirePermission } from '@/src/lib/auth/guards';
import { MeetingDetailView } from '@/src/components/views/meetings/MeetingDetailView';

export default function MeetingDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string) || '';

  return (
    <RequirePermission permission="meetings.read">
      <MeetingDetailView meetingId={id} />
    </RequirePermission>
  );
}
