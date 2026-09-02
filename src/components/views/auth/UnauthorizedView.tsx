/**
 * @file UnauthorizedView.tsx
 * @description Dedicated, elegant 403 Forbidden / Unauthorized view.
 *
 * Provides a clear, non-leaking explanation when an authenticated user attempts
 * to access an area beyond their granted permissions.
 */

import React from 'react';
import { ShieldAlert, ArrowLeft, LayoutDashboard, Lock, HelpCircle } from 'lucide-react';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { useAuth } from '@/src/lib/auth/authContext';
import { Button } from '@/src/components/ui/Controls';

interface UnauthorizedViewProps {
  requiredPermission?: string;
  onBack?: () => void;
}

export const UnauthorizedView: React.FC<UnauthorizedViewProps> = ({
  requiredPermission,
  onBack,
}) => {
  const { navigate } = useNavigation();
  const { user } = useAuth();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/overview');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-lg p-8 rounded-3xl bg-[#06302B]/80 border border-[#AACBC4]/20 shadow-2xl backdrop-blur-md text-center space-y-6 relative overflow-hidden">
        {/* Subtle Ambient Gradient Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#E05252]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#00DF81]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Shield Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E05252]/20 via-[#08453A] to-[#032221] border border-[#E05252]/40 flex items-center justify-center text-[#E05252] shadow-lg shadow-[#E05252]/10">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Heading & Context */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E05252]/10 border border-[#E05252]/30 text-[11px] font-mono font-semibold text-[#E05252] uppercase tracking-wider">
            <Lock className="w-3 h-3" />
            <span>403 &bull; Authorization Gate</span>
          </div>
          <h1 className="font-serif-heading text-2xl md:text-3xl font-semibold text-[#F1F7F6]">
            Access Restricted
          </h1>
          <p className="text-sm text-[#AACBC4] leading-relaxed max-w-md mx-auto">
            You don’t have permission to access this area. Your current campaign role does not include the required authorization scopes.
          </p>
        </div>

        {/* Current User Context Card */}
        <div className="p-4 rounded-2xl bg-[#032221]/80 border border-[#AACBC4]/15 text-left text-xs space-y-2">
          <div className="flex items-center justify-between text-[#AACBC4]">
            <span>Signed in as</span>
            <span className="text-[#F1F7F6] font-semibold">{user?.name}</span>
          </div>
          <div className="flex items-center justify-between text-[#AACBC4]">
            <span>Assigned Role</span>
            <span className="px-2 py-0.5 rounded-md bg-[#08453A] text-[#00DF81] font-mono font-medium border border-[#00DF81]/30">
              {user?.role}
            </span>
          </div>
          {requiredPermission && (
            <div className="flex items-center justify-between text-[#AACBC4] pt-1 border-t border-[#AACBC4]/10">
              <span>Required Capability</span>
              <span className="font-mono text-[#AACBC4]/80 text-[11px]">{requiredPermission}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={handleBack}
            icon={<ArrowLeft className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/overview')}
            icon={<LayoutDashboard className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Return to Dashboard
          </Button>
        </div>

        {/* Help footer */}
        <p className="text-[11px] text-[#AACBC4]/60 flex items-center justify-center space-x-1.5 pt-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Need elevated rights? Contact your campaign workspace administrator.</span>
        </p>
      </div>
    </div>
  );
};
