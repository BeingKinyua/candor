import React from 'react';

// --- BUTTON ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'ai';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  roundedFull?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className = '',
  roundedFull,
  disabled,
  ...props
}) => {
  const hasIcon = Boolean(icon);
  const isRoundedFull = roundedFull !== undefined ? roundedFull : hasIcon;
  const radiusClass = isRoundedFull ? 'rounded-full' : 'rounded-xl';

  const base = `inline-flex items-center justify-center font-medium ${radiusClass} transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#00DF81]/50 cursor-pointer hover:cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed select-none`;

  const sizeClasses = {
    sm: `${children ? 'px-3.5 py-1.5 space-x-1.5' : 'p-1.5'} text-xs min-h-[36px] min-w-[36px]`,
    md: `${children ? 'px-4 py-2 space-x-2' : 'p-2'} text-sm min-h-[42px] min-w-[42px]`,
    lg: `${children ? 'px-6 py-3 space-x-2.5' : 'p-3'} text-base min-h-[48px] min-w-[48px]`,
  }[size];

  const variantClasses = {
    primary: 'bg-[#00DF81] text-[#032221] font-semibold hover:bg-[#2CC295] active:scale-[0.98] shadow-sm shadow-[#00DF81]/20',
    secondary: 'bg-[#08453A] text-[#F1F7F6] border border-[#AACBC4]/25 hover:bg-[#09544F] hover:border-[#AACBC4]/40 active:scale-[0.98]',
    outline: 'bg-transparent text-[#F1F7F6] border border-[#AACBC4]/30 hover:bg-[#08453A]/60 hover:border-[#00DF81]/50',
    danger: 'bg-[#E05252]/15 text-[#E05252] border border-[#E05252]/30 hover:bg-[#E05252]/25',
    ghost: 'bg-transparent text-[#AACBC4] hover:text-[#F1F7F6] hover:bg-[#08453A]/50',
    ai: 'bg-gradient-to-r from-[#002DF8] to-[#03624C] text-[#F1F7F6] font-semibold border border-[#00DF81]/40 hover:border-[#00DF81] shadow-lg shadow-[#002DF8]/25',
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`${base} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className={`animate-spin ${children ? '-ml-1 mr-2' : ''} h-4 w-4 text-current`} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon ? (
        <span className="shrink-0 flex items-center justify-center">{icon}</span>
      ) : null}
      {children && <span className="whitespace-nowrap">{children}</span>}
    </button>
  );
};

// --- BADGE ---
export interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'ai';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  className = '',
}) => {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
  const variantClasses = {
    success: 'bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30',
    warning: 'bg-[#E5A93C]/15 text-[#E5A93C] border border-[#E5A93C]/30',
    danger: 'bg-[#E05252]/15 text-[#E05252] border border-[#E05252]/30',
    info: 'bg-[#2FA98C]/20 text-[#2FA98C] border border-[#2FA98C]/35',
    neutral: 'bg-[#AACBC4]/15 text-[#AACBC4] border border-[#AACBC4]/25',
    ai: 'bg-[#002DF8]/20 text-[#AACBC4] border border-[#00DF81]/40',
  }[variant];

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClass} ${variantClasses} ${className} whitespace-nowrap`}>
      {children}
    </span>
  );
};

// --- INPUT & FORM CONTROLS ---
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-[#AACBC4]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && <div className="absolute left-3.5 text-[#AACBC4]/60 pointer-events-none">{leftIcon}</div>}
        <input
          id={inputId}
          className={`w-full rounded-xl bg-[#032221]/80 border border-[#AACBC4]/25 px-3.5 py-2.5 text-sm text-[#F1F7F6] placeholder-[#707D7D] focus:outline-none focus:border-[#00DF81] focus:ring-1 focus:ring-[#00DF81]/40 transition-colors ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''} ${error ? 'border-[#E05252]' : ''} ${className}`}
          {...props}
        />
        {rightIcon && <div className="absolute right-3.5 text-[#AACBC4]/60">{rightIcon}</div>}
      </div>
      {error && <p className="text-xs text-[#E05252]">{error}</p>}
      {hint && !error && <p className="text-xs text-[#707D7D]">{hint}</p>}
    </div>
  );
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-medium text-[#AACBC4]">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full rounded-xl bg-[#032221]/90 border border-[#AACBC4]/25 px-3.5 py-2.5 text-sm text-[#F1F7F6] focus:outline-none focus:border-[#00DF81] focus:ring-1 focus:ring-[#00DF81]/40 transition-colors ${
          error ? 'border-[#E05252]' : ''
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#032221] text-[#F1F7F6]">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-[#E05252]">{error}</p>}
    </div>
  );
};
