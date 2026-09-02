import React from 'react';
import {
  Shield,
  ArrowLeft,
  Check,
  X,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { ROLE_PERMISSIONS } from '@/src/lib/permissions';
import { Role, Permission } from '@/src/types';
import { Button, Badge } from '@/src/components/ui/Controls';
import { GlassCard } from '@/src/components/ui/Cards';

const ALL_PERMISSIONS: { action: Permission; label: string; category: string }[] = [
  // People
  { action: 'people:view', label: 'View Stakeholder Directory', category: 'People & Stakeholders' },
  { action: 'people:create', label: 'Create New Stakeholders', category: 'People & Stakeholders' },
  { action: 'people:edit', label: 'Edit Existing Records & Scores', category: 'People & Stakeholders' },
  { action: 'people:delete', label: 'Purge / Archive Stakeholders', category: 'People & Stakeholders' },
  
  // Field
  { action: 'field:view', label: 'View Field Stream & Telemetry', category: 'Field Ingestion & OCR' },
  { action: 'field:capture', label: 'Capture Camera / Digital Slips', category: 'Field Ingestion & OCR' },
  { action: 'field:verify', label: 'Approve & Reject Batches', category: 'Field Ingestion & OCR' },

  // Meetings
  { action: 'meetings:view', label: 'View Meetings & Briefings', category: 'Meetings & Agendas' },
  { action: 'meetings:create', label: 'Schedule New Sessions', category: 'Meetings & Agendas' },
  { action: 'meetings:edit', label: 'Edit Minutes & Log Decisions', category: 'Meetings & Agendas' },

  // Commitments
  { action: 'commitments:view', label: 'View Campaign Pledges', category: 'Commitments & Promises' },
  { action: 'commitments:manage', label: 'Create & Complete Commitments', category: 'Commitments & Promises' },
  { action: 'commitments:audit', label: 'Access Verification Audit Trail', category: 'Commitments & Promises' },

  // Knowledge
  { action: 'knowledge:view', label: 'Read Classified Documents', category: 'Knowledge Vault' },
  { action: 'knowledge:manage', label: 'Deposit & Edit Policy Memos', category: 'Knowledge Vault' },

  // Issues
  { action: 'issues:view', label: 'View Operational Friction Log', category: 'Issues & Grievances' },
  { action: 'issues:manage', label: 'Log, Escalate & Resolve Incidents', category: 'Issues & Grievances' },

  // AI
  { action: 'ai:access', label: 'Access Context-Aware AI Chat', category: 'AI Intelligence Suite' },
  { action: 'ai:execute_actions', label: 'Execute Proposed System Actions', category: 'AI Intelligence Suite' },

  // Governance
  { action: 'team:manage', label: 'Invite & Suspend Staff Seats', category: 'System Governance' },
  { action: 'roles:manage', label: 'Reassign Security Roles', category: 'System Governance' },
  { action: 'security:audit', label: 'Inspect Immutable Audit Ledger', category: 'System Governance' },
];

const ROLES: Role[] = [
  'Admin',
  'Campaign Director',
  'Operations Lead',
  'Intelligence Analyst',
  'Field Mobilizer',
];

export const RolesMatrixView: React.FC = () => {
  const { navigate } = useNavigation();

  // Group by category
  const categories = Array.from(new Set(ALL_PERMISSIONS.map((p) => p.category)));

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/settings/team')}
          className="flex items-center space-x-2 text-xs text-[#AACBC4] hover:text-[#00DF81] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Team Management</span>
        </button>

        <div className="flex items-center space-x-2">
          <Badge variant="success">Authoritative Matrix Active</Badge>
        </div>
      </div>

      <div>
        <h1 className="font-serif-heading text-2xl md:text-3xl font-bold text-[#F1F7F6]">
          Role-Based Access Control (RBAC) Matrix
        </h1>
        <p className="text-xs md:text-sm text-[#AACBC4] mt-1">
          Cryptographically enforced permissions defining data boundaries and operational capabilities across 5 campaign tiers.
        </p>
      </div>

      {/* Interactive Matrix Table */}
      <div className="glass-panel-elevated rounded-3xl overflow-x-auto border border-[#AACBC4]/20 shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#032221] border-b border-[#AACBC4]/20 text-xs">
              <th className="p-4 font-semibold uppercase tracking-wider text-[#AACBC4] w-72">
                Permission Capability
              </th>
              {ROLES.map((role) => (
                <th key={role} className="p-4 text-center font-semibold text-[#F1F7F6] whitespace-nowrap">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#AACBC4]/10 text-xs">
            {categories.map((cat) => (
              <React.Fragment key={cat}>
                <tr className="bg-[#08453A]/40">
                  <td colSpan={6} className="px-4 py-2 font-semibold text-[#00DF81] text-[11px] uppercase tracking-wider">
                    {cat}
                  </td>
                </tr>
                {ALL_PERMISSIONS.filter((p) => p.category === cat).map((perm) => (
                  <tr key={perm.action} className="hover:bg-[#06302B]/60 transition-colors">
                    <td className="p-4 text-[#F1F7F6] font-medium">
                      {perm.label}
                      <span className="block text-[10px] font-mono text-[#707D7D]">{perm.action}</span>
                    </td>
                    {ROLES.map((role) => {
                      const hasPerm = ROLE_PERMISSIONS[role].includes(perm.action);
                      return (
                        <td key={role} className="p-4 text-center">
                          {hasPerm ? (
                            <div className="w-6 h-6 rounded-full bg-[#00DF81]/20 text-[#00DF81] border border-[#00DF81]/40 flex items-center justify-center mx-auto">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-[#E05252]/10 text-[#707D7D] border border-transparent flex items-center justify-center mx-auto">
                              <X className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
