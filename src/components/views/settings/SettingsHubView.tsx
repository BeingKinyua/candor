/**
 * @file SettingsHubView.tsx
 * @description Central Command Settings & RBAC Governance Hub.
 *
 * Implements Section 18 of the specification, dividing settings areas
 * cleanly by permission capability:
 * - /settings/team (team.read / team.invite / team.manage)
 * - /settings/roles (team.read)
 * - /settings/audit (audit.read)
 * - /settings/security (team.manage / audit.read)
 */

import React from 'react';
import { Users, Shield, Key, Sliders, Lock, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { GlassCard } from '@/src/components/ui/Cards';
import { Button } from '@/src/components/ui/Controls';

export const SettingsHubView: React.FC = () => {
  const { navigate } = useNavigation();
  const { can, user, role } = useAuth();

  const settingsCards = [
    {
      title: 'Team & Seat Management',
      description: 'Provision staff seats, invite campaign officers, and govern active session statuses.',
      path: '/settings/team',
      icon: <Users className="w-5 h-5 text-[#00DF81]" />,
      permission: 'team.read',
      requiredAction: 'team.invite / team.manage',
      hasAccess: can('team.read'),
      canAction: can('team.invite') || can('team.manage'),
    },
    {
      title: 'Role & Permission Matrix',
      description: 'Inspect assigned capabilities across Administrator, Operations, Field, and Reviewer roles.',
      path: '/settings/roles',
      icon: <Key className="w-5 h-5 text-[#00DF81]" />,
      permission: 'team.read',
      requiredAction: 'team.read',
      hasAccess: can('team.read'),
      canAction: can('team.read'),
    },
    {
      title: 'Cryptographic Audit Stream',
      description: 'Review immutable access records, verification approvals, and administrative actions.',
      path: '/settings/audit',
      icon: <Shield className="w-5 h-5 text-[#00DF81]" />,
      permission: 'audit.read',
      requiredAction: 'audit.read',
      hasAccess: can('audit.read'),
      canAction: can('audit.read'),
    },
  ];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#AACBC4]/15">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono tracking-widest text-[#00DF81] uppercase font-semibold">
              Campaign Governance
            </span>
          </div>
          <h1 className="font-serif-heading text-2xl md:text-3xl font-semibold text-[#F1F7F6]">
            Settings & Access Control
          </h1>
          <p className="text-xs md:text-sm text-[#AACBC4] mt-0.5">
            Role-Based Access Control and workspace administrative settings.
          </p>
        </div>

        {/* Current Identity Chip */}
        <div className="p-2.5 px-4 rounded-2xl bg-[#06302B] border border-[#AACBC4]/20 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#08453A] border border-[#00DF81]/40 flex items-center justify-center text-[#00DF81] font-bold text-xs">
            {user?.name?.substring(0, 2).toUpperCase() || 'VK'}
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-[#F1F7F6]">{user?.name}</p>
            <p className="text-[10px] text-[#00DF81] font-mono">{role}</p>
          </div>
        </div>
      </div>

      {/* Grid of Settings Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {settingsCards.map((card) => (
          <GlassCard
            key={card.path}
            className={`flex flex-col justify-between p-6 transition-all duration-200 ${
              card.hasAccess
                ? 'hover:border-[#00DF81]/40 cursor-pointer'
                : 'opacity-65 border-dashed border-[#AACBC4]/20'
            }`}
            onClick={() => {
              if (card.hasAccess) {
                navigate(card.path);
              }
            }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-[#08453A] border border-[#00DF81]/30">
                  {card.icon}
                </div>
                {card.hasAccess ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30 text-[10px] font-mono">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Authorized</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#E05252]/15 text-[#E05252] border border-[#E05252]/30 text-[10px] font-mono">
                    <Lock className="w-3 h-3" />
                    <span>Gated</span>
                  </span>
                )}
              </div>

              <h3 className="font-serif-heading text-lg font-semibold text-[#F1F7F6]">
                {card.title}
              </h3>
              <p className="text-xs text-[#AACBC4] leading-relaxed">
                {card.description}
              </p>
            </div>

            <div className="pt-5 mt-4 border-t border-[#AACBC4]/10 flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#AACBC4]/60">
                Scope: {card.permission}
              </span>
              {card.hasAccess ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(card.path);
                  }}
                  icon={<ArrowRight className="w-3.5 h-3.5 text-[#00DF81]" />}
                >
                  Configure
                </Button>
              ) : (
                <span className="text-[10px] text-[#E05252] flex items-center space-x-1 font-mono">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Requires {card.requiredAction}</span>
                </span>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Architecture Notice Banner */}
      <div className="p-4 rounded-2xl bg-[#06302B]/60 border border-[#AACBC4]/15 flex items-start space-x-3 text-xs text-[#AACBC4] leading-relaxed">
        <Shield className="w-5 h-5 text-[#00DF81] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[#F1F7F6]">Frontend UX Protection Notice</p>
          <p className="text-[11px] text-[#AACBC4]">
            Settings access and user management restrictions are evaluated on the client to provide tailored operator experiences.
            In production deployments, write operations will additionally be cryptographically enforced via PostgreSQL Row Level Security (RLS) and backend API policies.
          </p>
        </div>
      </div>
    </div>
  );
};
