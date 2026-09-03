'use client';

import { RequirePermission } from '@/src/lib/auth/guards';
import { PeopleListView } from '@/src/components/views/people/PeopleListView';

export default function PeoplePage() {
  return (
    <RequirePermission permission="people.read">
      <PeopleListView />
    </RequirePermission>
  );
}
