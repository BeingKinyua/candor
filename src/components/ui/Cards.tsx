import React from 'react';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  borderAccent?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  elevated = false,
  borderAccent = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl p-4 sm:p-6 transition-all duration-200 ${
        elevated ? 'glass-panel-elevated' : 'glass-panel'
      } ${borderAccent ? 'border-l-4 border-l-[#00DF81]' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  span?: string; // e.g. "col-span-12 md:col-span-6"
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  title,
  eyebrow,
  action,
  span = 'col-span-12',
  className = '',
  children,
  icon,
  ...props
}) => {
  return (
    <div
      className={`${span} glass-panel rounded-2xl p-4 sm:p-6 flex flex-col justify-between transition-all duration-200 hover:border-[#00DF81]/40 ${className}`}
      {...props}
    >
      {(title || action || eyebrow || icon) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-[#AACBC4]/15 gap-2">
          <div className="flex items-center space-x-2.5 sm:space-x-3 overflow-hidden">
            {icon && <div className="p-2 rounded-xl bg-[#00DF81]/10 text-[#00DF81] border border-[#00DF81]/20 shrink-0">{icon}</div>}
            <div className="overflow-hidden">
              {eyebrow && <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#AACBC4] uppercase block truncate">{eyebrow}</span>}
              {title && <h3 className="font-serif-heading text-base sm:text-lg text-[#F1F7F6] font-medium leading-snug truncate">{title}</h3>}
            </div>
          </div>
          {action && <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">{action}</div>}
        </div>
      )}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
};

export interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtext?: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  changeType = 'positive',
  subtext,
  icon,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-2xl p-3.5 sm:p-5 flex items-start justify-between transition-all duration-200 hover:border-[#00DF81]/50 gap-2 ${
        onClick ? 'cursor-pointer hover:translate-y-[-2px]' : ''
      }`}
    >
      <div className="space-y-1 sm:space-y-2 min-w-0 overflow-hidden">
        <p className="text-[10px] sm:text-xs font-medium text-[#AACBC4] tracking-wide uppercase truncate">{label}</p>
        <p className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#F1F7F6] tracking-tight">{value}</p>
        {(change || subtext) && (
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs pt-0.5">
            {change && (
              <span
                className={`font-semibold px-1.5 py-0.5 rounded-md text-[10px] sm:text-xs truncate ${
                  changeType === 'positive'
                    ? 'bg-[#00DF81]/15 text-[#00DF81]'
                    : changeType === 'negative'
                    ? 'bg-[#E05252]/15 text-[#E05252]'
                    : 'bg-[#AACBC4]/15 text-[#AACBC4]'
                }`}
              >
                {change}
              </span>
            )}
            {subtext && <span className="text-[#707D7D] truncate hidden sm:inline">{subtext}</span>}
          </div>
        )}
      </div>
      <div className="p-2 sm:p-2.5 rounded-xl bg-[#08453A]/90 text-[#00DF81] border border-[#AACBC4]/20 shrink-0">{icon}</div>
    </div>
  );
};
