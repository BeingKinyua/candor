import React, { useState } from 'react';
import {
  Users,
  Shield,
  UserPlus,
  Mail,
  CheckCircle2,
  Lock,
  MoreVertical,
  Key,
} from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { campaignStore } from '@/src/lib/services/store';
import { Role } from '@/src/types';
import { Button, Badge, Input } from '@/src/components/ui/Controls';
import { Modal } from '@/src/components/ui/Feedback';

export const TeamManagementView: React.FC = () => {
  const { navigate } = useNavigation();
  const { can, user: currentUser } = useAuth();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [users, setUsers] = useState(campaignStore.getUsers());

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Operations Lead' as Role,
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const created = campaignStore.createUser({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
    });

    setUsers(campaignStore.getUsers());
    setShowInviteModal(false);
    setNewUser({ name: '', email: '', role: 'Operations Lead' });
  };

  const toggleStatus = (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    campaignStore.updateUser(userId, { status: nextStatus as any });
    setUsers(campaignStore.getUsers());
  };

  const handleRoleChange = (userId: string, newRole: Role) => {
    campaignStore.updateUser(userId, { role: newRole });
    setUsers(campaignStore.getUsers());
  };

  const roles: Role[] = [
    'Admin',
    'Campaign Director',
    'Operations Lead',
    'Field Mobilizer',
    'Intelligence Analyst',
  ];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono tracking-widest text-[#00DF81] uppercase font-semibold">
              Access Control & Personnel
            </span>
          </div>
          <h1 className="font-serif-heading text-2xl md:text-3xl font-semibold text-[#F1F7F6]">
            Campaign Team & Operator Seats
          </h1>
          <p className="text-xs md:text-sm text-[#AACBC4] mt-0.5">
            Manage provisioned campaign staff seats, role credentials, and operational delegations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/settings/roles')}
            icon={<Key className="w-3.5 h-3.5" />}
          >
            RBAC Permission Matrix
          </Button>

          {can('users:manage') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowInviteModal(true)}
              icon={<UserPlus className="w-3.5 h-3.5" />}
            >
              Provision Officer Seat
            </Button>
          )}
        </div>
      </div>

      {/* Users Roster Table */}
      <div className="glass-panel-elevated rounded-3xl overflow-hidden border border-[#AACBC4]/20 shadow-xl">
        <div className="p-4 bg-[#032221] border-b border-[#AACBC4]/15 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#AACBC4]">
            Active Officers & Delegations ({users.length})
          </span>
          <span className="text-[11px] font-mono text-[#00DF81]">E2EE Token Bound</span>
        </div>

        <div className="divide-y divide-[#AACBC4]/10">
          {users.map((u) => (
            <div
              key={u.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#08453A]/30 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-11 h-11 rounded-2xl bg-[#08453A] border border-[#00DF81]/30 flex items-center justify-center text-sm font-bold text-[#00DF81]">
                  {u.name.charAt(0)}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif-heading text-base font-semibold text-[#F1F7F6]">
                      {u.name}
                    </h3>
                    {u.id === currentUser?.id && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00DF81]/20 text-[#00DF81]">
                        CURRENT SESSION
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#AACBC4] font-mono">{u.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Role Selector */}
                {can('users:manage') && u.id !== currentUser?.id ? (
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                    className="px-3 py-1.5 rounded-xl bg-[#032221] border border-[#AACBC4]/25 text-xs text-[#00DF81] font-medium"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Badge variant="info">{u.role}</Badge>
                )}

                <Badge variant={u.status === 'active' ? 'success' : 'danger'}>
                  {u.status.toUpperCase()}
                </Badge>

                {/* Suspend / Activate Toggle */}
                {can('users:manage') && u.id !== currentUser?.id && (
                  <Button
                    variant={u.status === 'active' ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => toggleStatus(u.id, u.status)}
                    className="text-xs"
                  >
                    {u.status === 'active' ? 'Suspend Seat' : 'Reactivate'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Provision Officer Seat"
        subtitle="Issue cryptographically sealed credential invitation to new campaign operator."
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <Input
            label="Officer Full Name *"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="e.g. David Kiprono"
            required
          />
          <Input
            label="Secure Campaign Email *"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="e.g. david.kiprono@campaign.ops"
            required
          />
          <div>
            <label className="block text-xs font-medium text-[#AACBC4] mb-1.5">Operational Role Authority</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#032221] border border-[#AACBC4]/25 text-sm text-[#F1F7F6]"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t border-[#AACBC4]/15">
            <Button variant="ghost" type="button" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Dispatch Activation Key
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
