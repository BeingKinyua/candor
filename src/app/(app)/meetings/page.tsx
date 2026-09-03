'use client';

import { RequirePermission } from '@/src/lib/auth/guards';
import { MeetingsListView } from '@/src/components/views/meetings/MeetingsListView';

export default function MeetingsPage() {
  return (
    <RequirePermission permission="meetings.read">
      <MeetingsListView />
    </RequirePermission>
  );
}
