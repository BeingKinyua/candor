import React from 'react';
import {
  ArrowLeft,
  FileText,
  Sparkles,
  Download,
  Share2,
  Lock,
  Tag,
  CheckCircle2,
  Clock,
  BookOpen,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';
import { Button, Badge } from '@/src/components/ui/Controls';
import { GlassCard, BentoCard } from '@/src/components/ui/Cards';

export const KnowledgeDetailView: React.FC<{ docId: string }> = ({ docId }) => {
  const { navigate, openAiDrawer } = useNavigation();
  const doc = campaignStore.getDocument(docId);

  if (!doc) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-[#AACBC4]">Document record not found.</p>
        <Button variant="primary" onClick={() => navigate('/knowledge')}>
          Back to Knowledge Base
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/knowledge')}
          className="flex items-center space-x-2 text-xs text-[#AACBC4] hover:text-[#00DF81] transition-colors cursor-pointer hover:cursor-pointer px-3 py-1.5 rounded-full hover:bg-[#08453A]/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Vault</span>
        </button>

        <div className="flex items-center space-x-2">
          <Button
            variant="ai"
            size="sm"
            onClick={() => openAiDrawer(`Synthesize strategic implications and risks in document "${doc.title}"`)}
            icon={<Sparkles className="w-3.5 h-3.5 text-[#00DF81]" />}
          >
            AI Document Q&A
          </Button>
        </div>
      </div>

      {/* Header Info */}
      <GlassCard elevated className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={
                  doc.classification === 'Confidential'
                    ? 'danger'
                    : doc.classification === 'Internal Ops'
                    ? 'warning'
                    : 'neutral'
                }
              >
                {doc.classification.toUpperCase()}
              </Badge>
              <Badge variant="info">{doc.category}</Badge>
              <span className="text-xs text-[#707D7D] font-mono">{doc.type} &bull; {doc.fileSize}</span>
            </div>

            <h1 className="font-serif-heading text-2xl md:text-3xl font-bold text-[#F1F7F6]">
              {doc.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#AACBC4]">
              <span>Author: <strong className="text-[#F1F7F6]">{doc.author}</strong></span>
              <span>&bull;</span>
              <span>Deposited on: <span className="font-mono">{doc.date}</span></span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* AI Executive Synthesis Card */}
      {doc.aiSummary && (
        <GlassCard borderAccent className="space-y-4">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-[#AACBC4]/15">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#002DF8] to-[#00DF81] text-[#F1F7F6]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-heading text-base font-semibold text-[#F1F7F6]">
                AI Semantic Synthesis & Key Strategic Takeaways
              </h3>
              <p className="text-[10px] text-[#00DF81] font-mono">Neural extraction of policy bounds & commitments</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#032221]/80 text-xs text-[#F1F7F6] leading-relaxed">
            {doc.aiSummary}
          </div>

          {doc.keyTakeaways && doc.keyTakeaways.length > 0 && (
            <div className="space-y-2 pt-1">
              <p className="text-xs uppercase font-semibold tracking-wider text-[#00DF81]">Actionable Policy Mandates:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#AACBC4]">
                {doc.keyTakeaways.map((takeaway, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-[#06302B] border border-[#AACBC4]/10 flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00DF81] shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      )}

      {/* Full Document Body */}
      <BentoCard title="Full Document Text" eyebrow="Verbatim Record" icon={<BookOpen className="w-4 h-4" />}>
        <div className="p-5 rounded-2xl bg-[#032221]/90 border border-[#AACBC4]/15 text-sm text-[#F1F7F6] leading-relaxed whitespace-pre-wrap font-sans">
          {doc.content}
        </div>

        <div className="mt-4 pt-4 border-t border-[#AACBC4]/15 flex flex-wrap gap-2">
          {doc.tags.map((t) => (
            <span
              key={t}
              className="px-3 py-1 rounded-xl bg-[#08453A] border border-[#00DF81]/30 text-xs text-[#00DF81]"
            >
              #{t}
            </span>
          ))}
        </div>
      </BentoCard>
    </div>
  );
};
