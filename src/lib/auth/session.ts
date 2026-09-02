/**
 * @file session.ts
 * @description Local session persistence layer for mock authentication.
 *
 * NOTE: In development and preview, this manages client storage (localStorage)
 * to simulate session persistence across tab reloads.
 * This is easily swappable with backend/Supabase tokens later.
 */

import { Session } from './auth-types';

const SESSION_STORAGE_KEY = 'candor_auth_session_v2';

export function isSessionValid(session: Session | null): boolean {
  if (!session) return false;
  if (session.status !== 'active') return false;

  try {
    const expiresAt = new Date(session.expiresAt).getTime();
    if (Number.isNaN(expiresAt)) return true;
    return Date.now() < expiresAt;
  } catch {
    return true;
  }
}

export function loadStoredSession(): Session | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const parsed: Session = JSON.parse(raw);
    if (!isSessionValid(parsed)) {
      clearStoredSession();
      return null;
    }

    return parsed;
  } catch (err) {
    console.error('[Candor Auth] Failed to parse stored session:', err);
    clearStoredSession();
    return null;
  }
}

export function saveStoredSession(session: Session): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('[Candor Auth] Failed to persist session to localStorage:', err);
  }
}

export function clearStoredSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    // Also clean any legacy keys
    localStorage.removeItem('vantage_current_user_v1');
  } catch (err) {
    console.error('[Candor Auth] Failed to clear session from storage:', err);
  }
}
