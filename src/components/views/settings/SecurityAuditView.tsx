import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  ArrowLeft,
  Lock,
  Download,
  Terminal,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';
import { AuditLogDomain } from '@/src/types';
import { Button, Badge, Input } from '@/src/components/ui/Controls';

export const SecurityAuditView: React.FC = () => {
  const { navigate } = useNavigation();
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('all');

  const logs = campaignStore.getAuditLogs();

  const filtered = logs.filter((log) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      log.actorName.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.targetName.toLowerCase().includes(q) ||
      log.ipAddress.includes(q);

    const matchesDomain = domainFilter === 'all' || log.domain === domainFilter;

    return matchesSearch && matchesDomain;
  });

  const domains: AuditLogDomain[] = [
    'AUTH',
    'PEOPLE',
    'MEETINGS',
    'COMMITMENTS',
    'FIELD',
    'KNOWLEDGE',
    'ISSUES',
    'ADMIN',
    'AI',
  ];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono tracking-widest text-[#00DF81] uppercase font-semibold">
              Cryptographic Compliance
            </span>
          </div>
          <h1 className="font-serif-heading text-2xl md:text-3xl font-semibold text-[#F1F7F6]">
            Immutable Security & Audit Ledger
          </h1>
          <p className="text-xs md:text-sm text-[#AACBC4] mt-0.5">
            Append-only cryptographic record of all operational state transitions, access requests, and document inspections.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="success">Hash Chain Valid</Badge>
          <span className="text-xs font-mono text-[#707D7D]">SHA-256 / Ed25519</span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 border border-[#AACBC4]/20">
        <div className="w-full md:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search operator, IP, target record..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#032221] border border-[#AACBC4]/25 text-xs text-[#F1F7F6]"
          >
            <option value="all">All Operational Domains</option>
            {domains.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel-elevated rounded-3xl overflow-x-auto border border-[#AACBC4]/20 shadow-2xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#032221] border-b border-[#AACBC4]/20">
              <th className="p-4 font-semibold uppercase tracking-wider text-[#AACBC4]">Timestamp</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-[#AACBC4]">Operator</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-[#AACBC4]">Domain</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-[#AACBC4]">Action</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-[#AACBC4]">Target Entity</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-[#AACBC4]">IP / Network</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#AACBC4]/10">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-[#08453A]/30 transition-colors">
                <td className="p-4 font-mono text-[#707D7D] whitespace-nowrap">
                  {log.timestamp.replace('T', ' ').slice(0, 19)}
                </td>
                <td className="p-4">
                  <span className="font-semibold text-[#F1F7F6] block">{log.actorName}</span>
                  <span className="text-[10px] text-[#00DF81] font-mono">{log.actorRole}</span>
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded bg-[#032221] border border-[#AACBC4]/15 font-mono text-[10px] text-[#AACBC4]">
                    {log.domain}
                  </span>
                </td>
                <td className="p-4 font-mono text-[#F1F7F6] font-semibold">{log.action}</td>
                <td className="p-4 text-[#AACBC4]">{log.targetName}</td>
                <td className="p-4 font-mono text-[11px] text-[#707D7D]">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
