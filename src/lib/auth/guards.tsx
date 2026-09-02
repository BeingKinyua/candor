/**
 * @file guards.tsx
 * @description Reusable React authorization primitives and route protection components.
 *
 * Provides declarative UX protection guards (<RequireAuth>, <RequirePermission>,
 * <RequireRole>, <PermissionGate>) adhering strictly to the principle that
 * frontend authorization is UX protection, not the final security boundary.
 */

import React from 'react';
import { useAuth } from './authContext';
import { PermissionKey } from './auth-types';
import { UnauthorizedView } from '@/src/components/views/auth/UnauthorizedView';

interface RequireAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Ensures a user is authenticated before rendering children.
 * If unauthenticated, displays fallback or nothing while redirect happens.
 */
export const RequireAuth: React.FC<RequireAuthProps> = ({ children, fallback = null }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface RequirePermissionProps {
  permission: PermissionKey | string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Guards a page or large feature block requiring a specific capability.
 * Defaults to the elegant <UnauthorizedView /> if the user lacks permission.
 */
export const RequirePermission: React.FC<RequirePermissionProps> = ({
  permission,
  children,
  fallback,
}) => {
  const { can, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!can(permission)) {
    return fallback ? <>{fallback}</> : <UnauthorizedView requiredPermission={permission} />;
  }

  return <>{children}</>;
};

interface RequireRoleProps {
  role: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Guards a section based on a strict role level restriction.
 */
export const RequireRole: React.FC<RequireRoleProps> = ({
  role,
  children,
  fallback,
}) => {
  const { hasRole, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!hasRole(role)) {
    return fallback ? <>{fallback}</> : <UnauthorizedView requiredPermission={`role:${role}`} />;
  }

  return <>{children}</>;
};

interface PermissionGateProps {
  permission: PermissionKey | string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Inline permission gate for buttons, action triggers, or individual cards.
 * Returns null or alternative fallback if permission is missing.
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  const { can } = useAuth();

  if (!can(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
