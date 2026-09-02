/**
 * @file auth-types.ts
 * @description Strongly-typed authentication and authorization contract types.
 *
 * Designed to cleanly decouple frontend components from whether the underlying provider
 * is a local mock service or an eventual Supabase/backend service.
 */

import { PermissionKey, PermissionDefinition } from '@/src/data/mock/permissions';
import { RoleId, RoleDefinition } from '@/src/data/mock/roles';
import { UserAccountStatus, MockUserRecord } from '@/src/data/mock/users';
import { MockSession } from '@/src/data/mock/sessions';

export type { PermissionKey, PermissionDefinition, RoleId, RoleDefinition, UserAccountStatus, MockUserRecord };

export interface Organization {
  id: string;
  name: string;
  slug: string;
  badge?: string;
  tier?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roleId: RoleId;
  role: string;
  organizationId: string;
  status: UserAccountStatus;
  avatar?: string;
  assignedRegion?: string;
  badge?: string;
  lastLoginAt?: string;
}

export type Session = MockSession;

export interface SignInCredentials {
  email: string;
  password?: string;
}

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_INACTIVE'
  | 'ACCOUNT_SUSPENDED'
  | 'ACCOUNT_PENDING_INVITE'
  | 'SESSION_EXPIRED'
  | 'UNAUTHORIZED'
  | 'UNKNOWN_ERROR';

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  session?: Session;
  errorCode?: AuthErrorCode;
  errorMessage?: string;
}

export interface PasswordResetResult {
  success: boolean;
  message: string;
}

export interface ActivateAccountParams {
  token: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ActivationResult {
  success: boolean;
  message: string;
  user?: AuthUser;
}

/**
 * Interface that all authentication services (Mock, Supabase, etc.) must fulfill.
 */
export interface AuthService {
  signIn(credentials: SignInCredentials): Promise<AuthResult>;
  signOut(): Promise<void>;
  getSession(): Promise<Session | null>;
  getCurrentUser(): Promise<AuthUser | null>;
  hasPermission(permission: PermissionKey | string): Promise<boolean>;
  hasRole(roleId: RoleId | string): Promise<boolean>;
  requestPasswordReset(email: string): Promise<PasswordResetResult>;
  activateAccount(params: ActivateAccountParams): Promise<ActivationResult>;
}
