'use client';

import { useParams } from 'next/navigation';
import { RequirePermission } from '@/src/lib/auth/guards';
import { KnowledgeDetailView } from '@/src/components/views/knowledge/KnowledgeDetailView';

export default function KnowledgeDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string) || '';

  return (
    <RequirePermission permission="knowledge.read">
      <KnowledgeDetailView docId={id} />
    </RequirePermission>
  );
}
