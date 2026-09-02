/**
 * @file authContext.tsx
 * @description Central React Context Provider and hook for Authentication & Authorization.
 *
 * Provides reactive access to:
 * - Session state & authentication status
 * - Current user identity, organization, and assigned role
 * - Granular permission checker (can / hasPermission)
 * - Sign in, sign out, password reset, and account activation flows
 * - Dev role switcher for simulating distinct RBAC tiers
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AuthUser,
  Session,
  Organization,
  SignInCredentials,
  AuthResult,
  PasswordResetResult,
  ActivateAccountParams,
  ActivationResult,
  RoleId,
  PermissionKey,
  MockUserRecord,
} from './auth-types';
import { mockAuthService } from './mock-auth';
import { hasPermission, normalizePermission } from './permissions';
import { campaignStore } from '@/src/lib/services/store';

export interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  organization: Organization | null;
  role: string | null;
  roleId: RoleId | null;
  permissions: PermissionKey[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  signIn: (credentials: SignInCredentials) => Promise<AuthResult>;
  login: (email: string, pass?: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<PasswordResetResult>;
  activateAccount: (params: ActivateAccountParams) => Promise<ActivationResult>;

  // Authorization checks
  hasPermission: (permission: PermissionKey | string) => boolean;
  can: (permission: PermissionKey | string) => boolean;
  hasRole: (roleId: string) => boolean;

  // Role simulation
  switchRole: (role: string) => void;
  getDemoAccounts: () => MockUserRecord[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session from service on bootstrap
  const refreshSession = useCallback(async () => {
    try {
      const activeSession = await mockAuthService.getSession();
      setSession(activeSession);

      // Keep campaignStore current user in sync
      if (activeSession?.user) {
        campaignStore.setCurrentUser({
          id: activeSession.user.id,
          name: activeSession.user.name,
          email: activeSession.user.email,
          role: activeSession.user.role as any,
          avatar: activeSession.user.avatar,
          badge: activeSession.user.badge,
          assignedRegion: activeSession.user.assignedRegion,
          status: activeSession.user.status as any,
        });
      } else {
        campaignStore.setCurrentUser(null);
      }
    } catch (err: any) {
      console.error('[AuthProvider] Error loading session:', err);
      setError(err?.message || 'Failed to establish session');
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
    const unsubscribe = mockAuthService.subscribe(() => {
      refreshSession();
    });
    return () => unsubscribe();
  }, [refreshSession]);

  const user = session?.user ? (session.user as AuthUser) : null;
  const organization = session?.organization || null;
  const role = session?.role?.name || session?.user?.role || null;
  const roleId = (session?.roleId as RoleId) || null;
  const permissions = session?.permissions || [];
  const isAuthenticated = !!session && session.status === 'active';

  const signIn = async (credentials: SignInCredentials): Promise<AuthResult> => {
    setError(null);
    const result = await mockAuthService.signIn(credentials);
    if (!result.success && result.errorMessage) {
      setError(result.errorMessage);
    }
    return result;
  };

  const login = async (email: string, pass: string = 'password123'): Promise<AuthResult> => {
    return signIn({ email, password: pass });
  };

  const signOut = async (): Promise<void> => {
    setError(null);
    await mockAuthService.signOut();
  };

  const logout = () => {
    signOut();
  };

  const requestPasswordReset = async (email: string): Promise<PasswordResetResult> => {
    return mockAuthService.requestPasswordReset(email);
  };

  const activateAccount = async (params: ActivateAccountParams): Promise<ActivationResult> => {
    return mockAuthService.activateAccount(params);
  };

  const checkPermission = (permission: PermissionKey | string): boolean => {
    if (!session || !isAuthenticated) return false;
    return hasPermission(session, normalizePermission(permission));
  };

  const checkRole = (targetRole: string): boolean => {
    if (!session || !isAuthenticated) return false;
    const lower = targetRole.toLowerCase().replace(/[\s_-]/g, '');
    const currentRoleId = (session.roleId || '').toLowerCase().replace(/[\s_-]/g, '');
    const currentRoleName = (session.role?.name || '').toLowerCase().replace(/[\s_-]/g, '');
    return currentRoleId.includes(lower) || currentRoleName.includes(lower);
  };

  const switchRole = (newRole: string) => {
    // Map arbitrary input (e.g. 'Admin', 'administrator', 'Field Mobilizer') to canonical RoleId
    const lower = newRole.toLowerCase();
    let targetId: RoleId = 'viewer';

    if (lower.includes('admin')) {
      targetId = 'administrator';
    } else if (lower.includes('manager') || lower.includes('director') || lower.includes('lead')) {
      targetId = 'operations_manager';
    } else if (lower.includes('mobilizer') || lower.includes('field')) {
      targetId = 'field_officer';
    } else if (lower.includes('review') || lower.includes('analyst')) {
      targetId = 'reviewer';
    } else {
      targetId = 'viewer';
    }

    mockAuthService.switchActiveRole(targetId);
  };

  const getDemoAccounts = (): MockUserRecord[] => {
    return mockAuthService.getDemoAccounts();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        organization,
        role,
        roleId,
        permissions,
        isAuthenticated,
        isLoading,
        error,
        signIn,
        login,
        signOut,
        logout,
        requestPasswordReset,
        activateAccount,
        hasPermission: checkPermission,
        can: checkPermission,
        hasRole: checkRole,
        switchRole,
        getDemoAccounts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
