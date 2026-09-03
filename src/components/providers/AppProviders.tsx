'use client';

import React from 'react';
import { AuthProvider } from '@/src/lib/auth/authContext';
import { NavigationProvider } from '@/src/lib/router/navigationContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <NavigationProvider>
        {children}
      </NavigationProvider>
    </AuthProvider>
  );
};
