import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '@/src/types';
import { campaignStore } from '@/src/lib/services/store';
import { can, ROLE_PERMISSIONS } from '@/src/lib/permissions';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
  can: (permission: Parameters<typeof can>[1]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(campaignStore.getCurrentUser());

  useEffect(() => {
    const unsub = campaignStore.subscribe(() => {
      setUser(campaignStore.getCurrentUser());
    });
    return unsub;
  }, []);

  const login = async (email: string, _pass: string): Promise<boolean> => {
    // Artificial realistic network check
    await new Promise((res) => setTimeout(res, 500));
    const users = campaignStore.getUsers();
    const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || users[0];
    if (matched) {
      campaignStore.setCurrentUser(matched);
      return true;
    }
    return false;
  };

  const logout = () => {
    campaignStore.setCurrentUser(null);
  };

  const switchRole = (role: Role) => {
    const users = campaignStore.getUsers();
    const matched = users.find((u) => u.role === role);
    if (matched) {
      campaignStore.setCurrentUser(matched);
    } else if (user) {
      const updated = campaignStore.updateUser(user.id, { role });
      if (updated) campaignStore.setCurrentUser(updated);
    }
  };

  const checkCan = (permission: Parameters<typeof can>[1]): boolean => {
    return can(user, permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
        can: checkCan,
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
