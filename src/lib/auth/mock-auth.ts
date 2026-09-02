/**
 * @file mock-auth.ts
 * @description In-memory and local-storage backed mock authentication service.
 *
 * Implements full authentication, session establishment, role switching,
 * account status validation, password reset simulation, and invitation activation.
 *
 * Architecture Note: Designed with strict interface isolation so it can later
 * be replaced with a real Supabase/backend client with zero UI changes.
 */

import {
  AuthService,
  AuthResult,
  AuthUser,
  Session,
  SignInCredentials,
  PasswordResetResult,
  ActivateAccountParams,
  ActivationResult,
  RoleId,
  PermissionKey,
} from './auth-types';
import { MOCK_USERS, MockUserRecord } from '@/src/data/mock/users';
import { MOCK_ROLES } from '@/src/data/mock/roles';
import { createMockSessionForUser } from '@/src/data/mock/sessions';
import { loadStoredSession, saveStoredSession, clearStoredSession, isSessionValid } from './session';
import { hasPermission, normalizePermission } from './permissions';

class MockAuthServiceImpl implements AuthService {
  private currentSession: Session | null = null;
  private users: MockUserRecord[] = [...MOCK_USERS];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.bootstrap();
  }

  private bootstrap() {
    // Attempt restoring session from storage
    const stored = loadStoredSession();
    if (stored && isSessionValid(stored)) {
      this.currentSession = stored;
    } else {
      this.currentSession = null;
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.error('[MockAuthService] Listener error:', err);
      }
    });
  }

  public async getSession(): Promise<Session | null> {
    if (!this.currentSession) {
      const stored = loadStoredSession();
      if (stored && isSessionValid(stored)) {
        this.currentSession = stored;
      }
    }
    return this.currentSession;
  }

  public async getCurrentUser(): Promise<AuthUser | null> {
    const session = await this.getSession();
    return session ? (session.user as AuthUser) : null;
  }

  public async signIn(credentials: SignInCredentials): Promise<AuthResult> {
    // Artificial small delay (150ms) to simulate network handshake
    await new Promise((resolve) => setTimeout(resolve, 150));

    const email = credentials.email.trim().toLowerCase();
    const user = this.users.find((u) => u.email.toLowerCase() === email);

    if (!user) {
      return {
        success: false,
        errorCode: 'INVALID_CREDENTIALS',
        errorMessage: 'Invalid email or password.',
      };
    }

    // Validate account status
    if (user.status === 'suspended') {
      return {
        success: false,
        errorCode: 'ACCOUNT_SUSPENDED',
        errorMessage:
          user.suspensionReason ||
          'This account has been suspended for security reasons. Please contact your campaign administrator.',
      };
    }

    if (user.status === 'inactive') {
      return {
        success: false,
        errorCode: 'ACCOUNT_INACTIVE',
        errorMessage: 'This account is inactive. Please contact your workspace administrator to reactivate access.',
      };
    }

    if (user.status === 'pending_invite') {
      return {
        success: false,
        errorCode: 'ACCOUNT_PENDING_INVITE',
        errorMessage:
          'This account has not been activated yet. Please check your invitation link or proceed to account activation.',
      };
    }

    // In development mock mode, verify non-empty password
    if (credentials.password !== undefined && credentials.password.length === 0) {
      return {
        success: false,
        errorCode: 'INVALID_CREDENTIALS',
        errorMessage: 'Password is required.',
      };
    }

    // Create session
    const session = createMockSessionForUser(user);
    this.currentSession = session;
    saveStoredSession(session);
    this.notify();

    return {
      success: true,
      user: session.user as AuthUser,
      session,
    };
  }

  public async signOut(): Promise<void> {
    this.currentSession = null;
    clearStoredSession();
    this.notify();
  }

  public async hasPermission(permission: PermissionKey | string): Promise<boolean> {
    const session = await this.getSession();
    if (!session) return false;
    return hasPermission(session, normalizePermission(permission));
  }

  public async hasRole(roleId: RoleId | string): Promise<boolean> {
    const session = await this.getSession();
    if (!session) return false;
    return session.roleId === roleId;
  }

  public async requestPasswordReset(email: string): Promise<PasswordResetResult> {
    // Artificial small delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // For safety and privacy, standard UX response regardless of user existence
    return {
      success: true,
      message: 'Check your email for password reset instructions. If an account exists, a link will arrive shortly.',
    };
  }

  public async activateAccount(params: ActivateAccountParams): Promise<ActivationResult> {
    await new Promise((resolve) => setTimeout(resolve, 250));

    if (!params.token || params.token.trim().length === 0) {
      return {
        success: false,
        message: 'Invalid or missing invitation token. Please check your invitation link.',
      };
    }

    if (!params.newPassword || params.newPassword.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters.',
      };
    }

    if (params.newPassword !== params.confirmPassword) {
      return {
        success: false,
        message: 'Passwords do not match.',
      };
    }

    // Look for pending invite user or match token
    const pendingUser = this.users.find(
      (u) => u.invitationToken === params.token || (u.status === 'pending_invite' && params.token.includes('invite'))
    );

    if (pendingUser) {
      pendingUser.status = 'active';
      pendingUser.defaultPassword = params.newPassword;
      return {
        success: true,
        message: 'Account successfully activated! You may now sign in.',
        user: {
          id: pendingUser.id,
          name: pendingUser.name,
          email: pendingUser.email,
          roleId: pendingUser.roleId,
          role: MOCK_ROLES[pendingUser.roleId]?.name || pendingUser.roleId,
          organizationId: pendingUser.organizationId,
          status: 'active',
          assignedRegion: pendingUser.assignedRegion,
          badge: pendingUser.badge,
        },
      };
    }

    return {
      success: true,
      message: 'Account activated successfully! You can now log in with your new credentials.',
    };
  }

  /**
   * Development simulator method to instantly switch the active session's role
   * to test RBAC live across all screens.
   */
  public switchActiveRole(roleId: RoleId): void {
    if (!this.currentSession) return;

    const targetRole = MOCK_ROLES[roleId];
    if (!targetRole) return;

    this.currentSession = {
      ...this.currentSession,
      roleId: targetRole.id,
      role: targetRole,
      permissions: [...targetRole.permissions],
      user: {
        ...this.currentSession.user,
        roleId: targetRole.id,
        role: targetRole.name,
      },
    };

    saveStoredSession(this.currentSession);
    this.notify();
  }

  public getDemoAccounts(): MockUserRecord[] {
    return [...this.users];
  }
}

export const mockAuthService = new MockAuthServiceImpl();
export const authService: AuthService = mockAuthService;
