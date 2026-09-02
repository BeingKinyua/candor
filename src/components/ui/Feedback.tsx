import React, { useEffect } from 'react';
import { X, AlertTriangle, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Button } from './Controls';

// --- MODAL ---
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#032221]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${widthClass} glass-panel-elevated rounded-2xl overflow-hidden shadow-2xl border border-[#AACBC4]/30 z-10 animate-in fade-in zoom-in-95 duration-150 my-auto`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#AACBC4]/15 bg-[#06302B]/60">
          <div>
            <h3 className="font-serif-heading text-lg sm:text-xl text-[#F1F7F6]">{title}</h3>
            {subtitle && <p className="text-xs text-[#AACBC4] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#AACBC4] hover:text-[#F1F7F6] hover:bg-[#08453A]/80 transition-colors shrink-0 ml-2 cursor-pointer hover:cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

// --- DRAWER ---
export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: 'md' | 'lg' | 'xl';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    md: 'w-full md:w-[420px]',
    lg: 'w-full md:w-[540px]',
    xl: 'w-full md:w-[680px]',
  }[width];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-[#032221]/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div
          className={`${widthClasses} glass-panel-elevated h-full shadow-2xl flex flex-col border-l border-[#AACBC4]/25 z-10 animate-in slide-in-from-right duration-200`}
        >
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#AACBC4]/15 bg-[#06302B]/90">
            <div>
              <h3 className="font-serif-heading text-lg text-[#F1F7F6]">{title}</h3>
              {subtitle && <p className="text-xs text-[#AACBC4] mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#AACBC4] hover:text-[#F1F7F6] hover:bg-[#08453A]/80 transition-colors shrink-0 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

// --- EMPTY STATE ---
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`glass-panel rounded-2xl p-10 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-6 ${className}`}>
      {icon && (
        <div className="p-4 rounded-2xl bg-[#08453A]/80 text-[#AACBC4] mb-4 border border-[#AACBC4]/20">
          {icon}
        </div>
      )}
      <h4 className="font-serif-heading text-lg font-medium text-[#F1F7F6] mb-1.5">{title}</h4>
      <p className="text-sm text-[#AACBC4] mb-6 max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction} size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

// --- SKELETON ---
export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return <div className={`animate-pulse bg-[#08453A]/70 rounded-lg ${className}`} />;
};

// --- ALERT ---
export const Alert: React.FC<{
  type?: 'info' | 'warning' | 'danger' | 'success';
  title?: string;
  message: string;
  action?: React.ReactNode;
}> = ({ type = 'info', title, message, action }) => {
  const styles = {
    info: 'bg-[#2FA98C]/15 border-[#2FA98C]/35 text-[#2FA98C]',
    warning: 'bg-[#E5A93C]/15 border-[#E5A93C]/35 text-[#E5A93C]',
    danger: 'bg-[#E05252]/15 border-[#E05252]/35 text-[#E05252]',
    success: 'bg-[#00DF81]/15 border-[#00DF81]/35 text-[#00DF81]',
  }[type];

  const icon = {
    info: <Info className="w-5 h-5 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 shrink-0" />,
    danger: <AlertCircle className="w-5 h-5 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 shrink-0" />,
  }[type];

  return (
    <div className={`p-4 rounded-xl border flex items-start space-x-3.5 ${styles}`}>
      {icon}
      <div className="flex-1 text-sm">
        {title && <p className="font-semibold mb-0.5 text-current">{title}</p>}
        <p className="text-[#F1F7F6]/90 leading-relaxed text-xs">{message}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
