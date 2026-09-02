import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Sparkles,
  Shield,
  Download,
  Lock,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';
import { CampaignDocument, DocumentCategory, ClassificationLevel } from '@/src/types';
import { Button, Badge, Input } from '@/src/components/ui/Controls';
import { Modal } from '@/src/components/ui/Feedback';

export const KnowledgeListView: React.FC = () => {
  const { navigate, openAiDrawer } = useNavigation();
  const { can, user } = useAuth();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const docs = campaignStore.getDocuments();

  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'Policy Memo' as DocumentCategory,
    classification: 'Confidential' as ClassificationLevel,
    content: '',
    tags: '',
  });

  const filtered = docs.filter((d) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      d.title.toLowerCase().includes(q) ||
      d.content.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q));
    const matchesCat = categoryFilter === 'all' || d.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.content) return;

    campaignStore.createDocument({
      title: newDoc.title,
      category: newDoc.category,
      classification: newDoc.classification,
      content: newDoc.content,
      author: user?.name || 'Policy Director',
      authorId: user?.id || 'usr-1',
      fileSize: `${(newDoc.content.length / 1024).toFixed(1)} KB`,
      fileType: 'TXT',
      tags: newDoc.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setShowUploadModal(false);
    setNewDoc({
      title: '',
      category: 'Policy Memo',
      classification: 'Confidential',
      content: '',
      tags: '',
    });
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono tracking-widest text-[#00DF81] uppercase font-semibold">
              Policy & Strategy Repository
            </span>
          </div>
          <h1 className="font-serif-heading text-2xl md:text-3xl font-semibold text-[#F1F7F6]">
            Campaign Intelligence & Knowledge Vault
          </h1>
          <p className="text-xs md:text-sm text-[#AACBC4] mt-0.5">
            Classified policy briefs, legal accords, coalition agreements, and synthesized speech drafts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ai"
            size="sm"
            onClick={() => openAiDrawer('Search knowledge base for agricultural subsidy commitments')}
            icon={<Sparkles className="w-3.5 h-3.5 text-[#00DF81]" />}
          >
            AI Policy Query
          </Button>

          {can('knowledge:edit') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowUploadModal(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Deposit Document
            </Button>
          )}
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 border border-[#AACBC4]/20">
        <div className="w-full md:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search briefs, policies, keywords..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto scrollbar-thin pb-1">
          {['all', 'Policy Memo', 'Legal Brief', 'Coalition Accord', 'Field Report'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                categoryFilter === cat
                  ? 'bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30'
                  : 'text-[#AACBC4] hover:bg-[#08453A]/40'
              }`}
            >
              {cat === 'all' ? 'All Formats' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            onClick={() => navigate(`/knowledge/${doc.id}`)}
            className="glass-panel rounded-2xl p-5 border border-[#AACBC4]/20 hover:border-[#00DF81]/40 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    doc.classification === 'Confidential'
                      ? 'danger'
                      : doc.classification === 'Internal Ops'
                      ? 'warning'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {doc.classification.toUpperCase()}
                </Badge>
                <span className="text-[11px] font-mono text-[#707D7D]">{doc.type} &bull; {doc.fileSize}</span>
              </div>

              <h3 className="font-serif-heading text-lg font-semibold text-[#F1F7F6] group-hover:text-[#00DF81] transition-colors line-clamp-2">
                {doc.title}
              </h3>

              <p className="text-xs text-[#AACBC4] line-clamp-3 leading-relaxed">
                {doc.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {doc.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md bg-[#032221] border border-[#AACBC4]/15 text-[10px] text-[#AACBC4]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#AACBC4]/15 flex items-center justify-between text-xs text-[#707D7D]">
              <span>Author: <strong className="text-[#AACBC4]">{doc.author}</strong></span>
              <span className="font-mono">{doc.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Deposit Document Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Deposit Policy or Intelligence Brief"
        subtitle="Secure document ingestion with automatic semantic vector indexing."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Document Title *"
            value={newDoc.title}
            onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
            placeholder="e.g. 2026 Agrarian Economic Transformation Accord"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#AACBC4] mb-1.5">Category</label>
              <select
                value={newDoc.category}
                onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value as DocumentCategory })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#032221] border border-[#AACBC4]/25 text-sm text-[#F1F7F6]"
              >
                <option value="Policy Memo">Policy Memo</option>
                <option value="Legal Brief">Legal Brief</option>
                <option value="Coalition Accord">Coalition Accord</option>
                <option value="Field Report">Field Report</option>
                <option value="Speech Draft">Speech Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#AACBC4] mb-1.5">Classification Level</label>
              <select
                value={newDoc.classification}
                onChange={(e) => setNewDoc({ ...newDoc, classification: e.target.value as ClassificationLevel })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#032221] border border-[#AACBC4]/25 text-sm text-[#F1F7F6]"
              >
                <option value="Public">Public</option>
                <option value="Internal">Internal</option>
                <option value="Confidential">Confidential</option>
                <option value="Strictly Confidential">Strictly Confidential</option>
              </select>
            </div>
          </div>

          <Input
            label="Tags (comma-separated)"
            value={newDoc.tags}
            onChange={(e) => setNewDoc({ ...newDoc, tags: e.target.value })}
            placeholder="Agriculture, Fertilizers, Kiambu, Policy"
          />

          <div>
            <label className="block text-xs font-medium text-[#AACBC4] mb-1.5">Document Content / Full Text *</label>
            <textarea
              rows={6}
              value={newDoc.content}
              onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
              placeholder="Paste full text or policy brief here..."
              className="w-full rounded-xl bg-[#032221] border border-[#AACBC4]/25 p-3 text-sm text-[#F1F7F6] focus:outline-none focus:border-[#00DF81]"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-[#AACBC4]/15">
            <Button variant="ghost" type="button" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Deposit & Index
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
