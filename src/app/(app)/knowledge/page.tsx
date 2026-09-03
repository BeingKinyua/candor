'use client';

import { RequirePermission } from '@/src/lib/auth/guards';
import { KnowledgeListView } from '@/src/components/views/knowledge/KnowledgeListView';

export default function KnowledgePage() {
  return (
    <RequirePermission permission="knowledge.read">
      <KnowledgeListView />
    </RequirePermission>
  );
}
