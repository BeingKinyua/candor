/**
 * @file AuthViews.tsx
 * @description Authentication user interfaces: LoginView, ForgotPasswordView, and ActivateView.
 *
 * Designed for Candor's invite-only operational workspace with explicit account-status
 * validation handling, password visibility toggle, accessible input styling,
 * and a rich demo persona selector for easy test evaluation.
 */

import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  Sparkles,
  ArrowLeft,
  KeyRound,
  Ban,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/src/lib/auth/authContext';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { Button, Input } from '@/src/components/ui/Controls';
import { MockUserRecord } from '@/src/data/mock/users';

export const LoginView: React.FC = () => {
  const { signIn, getDemoAccounts } = useAuth();
  const { navigate } = useNavigation();

  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  const demoAccounts = getDemoAccounts();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorType(null);
    setIsLoading(true);

    const result = await signIn({ email: email.trim(), password });
    setIsLoading(false);

    if (result.success) {
      navigate('/overview');
    } else {
      setError(result.errorMessage || 'Invalid email or password.');
      setErrorType(result.errorCode || 'INVALID_CREDENTIALS');
    }
  };

  const selectDemoUser = (user: MockUserRecord) => {
    setEmail(user.email);
    setPassword(user.defaultPassword || 'password123');
    setError(null);
    setErrorType(null);
  };

  return (
    <div className="min-h-screen bg-[#032221] flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-[#00DF81]/30">
      {/* Dynamic Ambient Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial from-[#00DF81]/12 via-[#03624C]/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#002DF8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#002DF8] via-[#03624C] to-[#00DF81] p-0.5 shadow-xl shadow-[#00DF81]/20">
            <div className="w-full h-full bg-[#032221] rounded-[14px] flex items-center justify-center">
              <span className="font-serif-heading text-2xl font-bold text-[#00DF81]">C</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center space-x-1.5 mb-1">
              <Building2 className="w-3.5 h-3.5 text-[#00DF81]" />
              <span className="text-[10px] font-mono tracking-widest text-[#00DF81] uppercase font-semibold">
                Candor Campaign HQ
              </span>
            </div>
            <h1 className="font-serif-heading text-2xl md:text-3xl font-semibold text-[#F1F7F6] tracking-tight">
              Sign In to Candor
            </h1>
            <p className="text-xs text-[#AACBC4] mt-1">
              Internal Leadership & Campaign Operations Portal
            </p>
          </div>
        </div>

        {/* Login Form Box */}
        <div className="p-6 md:p-8 rounded-3xl bg-[#06302B]/85 border border-[#AACBC4]/20 shadow-2xl backdrop-blur-md space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#AACBC4]/15 text-xs text-[#AACBC4]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Workspace Authentication
            </span>
            <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30">
              <Lock className="w-2.5 h-2.5" />
              <span>Restricted Access</span>
            </span>
          </div>

          {/* Account Status / Error Alert */}
          {error && (
            <div
              className={`p-3.5 rounded-2xl border flex items-start space-x-3 text-xs leading-relaxed animate-in fade-in duration-200 ${
                errorType === 'ACCOUNT_SUSPENDED'
                  ? 'bg-[#E05252]/15 border-[#E05252]/35 text-[#E05252]'
                  : errorType === 'ACCOUNT_INACTIVE'
                  ? 'bg-[#E69D41]/15 border-[#E69D41]/35 text-[#E69D41]'
                  : errorType === 'ACCOUNT_PENDING_INVITE'
                  ? 'bg-[#00DF81]/15 border-[#00DF81]/35 text-[#00DF81]'
                  : 'bg-[#E05252]/15 border-[#E05252]/35 text-[#E05252]'
              }`}
            >
              {errorType === 'ACCOUNT_SUSPENDED' ? (
                <Ban className="w-4 h-4 shrink-0 mt-0.5" />
              ) : errorType === 'ACCOUNT_PENDING_INVITE' ? (
                <Clock className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-semibold">
                  {errorType === 'ACCOUNT_SUSPENDED'
                    ? 'Account Suspended'
                    : errorType === 'ACCOUNT_INACTIVE'
                    ? 'Account Inactive'
                    : errorType === 'ACCOUNT_PENDING_INVITE'
                    ? 'Invitation Pending Activation'
                    : 'Authentication Failed'}
                </p>
                <p className="text-[11px] opacity-90">{error}</p>
                {errorType === 'ACCOUNT_PENDING_INVITE' && (
                  <button
                    type="button"
                    onClick={() => navigate('/activate')}
                    className="underline text-[11px] font-semibold hover:text-[#F1F7F6] block pt-1"
                  >
                    Go to Activation Screen &rarr;
                  </button>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#AACBC4] mb-1.5" htmlFor="email-input">
                Campaign Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#AACBC4]/60">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@example.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#032221]/90 border border-[#AACBC4]/25 text-xs text-[#F1F7F6] placeholder-[#AACBC4]/40 focus:outline-none focus:border-[#00DF81] focus:ring-1 focus:ring-[#00DF81] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-[#AACBC4]" htmlFor="password-input">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-[11px] text-[#AACBC4] hover:text-[#00DF81] transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#AACBC4]/60">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#032221]/90 border border-[#AACBC4]/25 text-xs text-[#F1F7F6] placeholder-[#AACBC4]/40 focus:outline-none focus:border-[#00DF81] focus:ring-1 focus:ring-[#00DF81] transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#AACBC4]/60 hover:text-[#F1F7F6] transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Command Center
            </Button>
          </form>

          {/* Invitation Activation Link */}
          <div className="pt-2 text-center border-t border-[#AACBC4]/10">
            <p className="text-xs text-[#AACBC4]">
              Received a campaign invite?{' '}
              <button
                type="button"
                onClick={() => navigate('/activate')}
                className="text-[#00DF81] font-semibold hover:underline ml-1"
              >
                Activate Account
              </button>
            </p>
          </div>

          {/* Development Demo Persona Quick Selector */}
          <div className="pt-4 border-t border-[#AACBC4]/15 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[#AACBC4]/70 font-semibold flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#00DF81]" />
                <span>Demo Personas (RBAC Testing):</span>
              </span>
              <span className="text-[9px] font-mono text-[#AACBC4]/50">Click to fill</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {demoAccounts.slice(0, 5).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => selectDemoUser(u)}
                  className={`p-2 rounded-xl text-left transition-all border ${
                    email === u.email
                      ? 'bg-[#00DF81]/15 border-[#00DF81]/50 text-[#00DF81]'
                      : 'bg-[#032221] hover:bg-[#08453A]/60 border-[#AACBC4]/15 text-[#AACBC4]'
                  }`}
                >
                  <p className="text-[11px] font-semibold text-[#F1F7F6] truncate">{u.name}</p>
                  <p className="text-[9px] font-mono text-[#00DF81] truncate">{u.roleId}</p>
                </button>
              ))}
            </div>

            {/* Inactive & Suspended Test Accounts */}
            <div className="pt-1.5 flex items-center justify-between text-[10px] text-[#AACBC4]/70">
              <span className="text-[9px] font-mono">Status Validation:</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => selectDemoUser(demoAccounts[6])} // suspended
                  className="px-2 py-0.5 rounded bg-[#E05252]/15 text-[#E05252] border border-[#E05252]/30 hover:bg-[#E05252]/25 font-mono text-[9px]"
                >
                  Test Suspended
                </button>
                <button
                  type="button"
                  onClick={() => selectDemoUser(demoAccounts[5])} // inactive
                  className="px-2 py-0.5 rounded bg-[#E69D41]/15 text-[#E69D41] border border-[#E69D41]/30 hover:bg-[#E69D41]/25 font-mono text-[9px]"
                >
                  Test Inactive
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-[#707D7D] leading-relaxed">
          Candor Internal Operations Portal &bull; Cryptographically logged &bull; Invitation-only workspace
        </p>
      </div>
    </div>
  );
};

export const ForgotPasswordView: React.FC = () => {
  const { requestPasswordReset } = useAuth();
  const { navigate } = useNavigation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    const result = await requestPasswordReset(email);
    setIsSubmitting(false);
    setMessage(result.message);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#032221] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-radial from-[#00DF81]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-8 rounded-3xl bg-[#06302B]/85 border border-[#AACBC4]/20 shadow-2xl backdrop-blur-md space-y-6 relative z-10">
        <div className="flex items-center space-x-2 text-xs text-[#AACBC4]">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center space-x-1 hover:text-[#00DF81] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to sign in</span>
          </button>
        </div>

        <div className="space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-[#08453A] border border-[#00DF81]/30 flex items-center justify-center text-[#00DF81] mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="font-serif-heading text-2xl font-semibold text-[#F1F7F6]">
            Reset Password
          </h2>
          <p className="text-xs text-[#AACBC4] leading-relaxed">
            Enter your registered campaign email to receive password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4 text-center py-2 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-[#00DF81]/20 text-[#00DF81] border border-[#00DF81]/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-[#AACBC4] leading-relaxed max-w-sm mx-auto">
              {message}
            </p>
            <Button variant="primary" className="w-full" onClick={() => navigate('/login')}>
              Return to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#AACBC4] mb-1.5" htmlFor="reset-email">
                Registered Campaign Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#AACBC4]/60">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@example.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#032221]/90 border border-[#AACBC4]/25 text-xs text-[#F1F7F6] placeholder-[#AACBC4]/40 focus:outline-none focus:border-[#00DF81] focus:ring-1 focus:ring-[#00DF81] transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full"
            >
              Send Reset Link
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export const ActivateView: React.FC = () => {
  const { activateAccount } = useAuth();
  const { navigate } = useNavigation();

  const [token, setToken] = useState('invite-candor-2026-chebet');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const result = await activateAccount({
      token,
      newPassword: password,
      confirmPassword,
    });
    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#032221] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-radial from-[#00DF81]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-8 rounded-3xl bg-[#06302B]/85 border border-[#AACBC4]/20 shadow-2xl backdrop-blur-md space-y-6 relative z-10">
        <div className="flex items-center space-x-2 text-xs text-[#AACBC4]">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center space-x-1 hover:text-[#00DF81] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to sign in</span>
          </button>
        </div>

        <div className="space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-[#08453A] border border-[#00DF81]/30 flex items-center justify-center text-[#00DF81] mb-2">
            <UserCheck className="w-6 h-6" />
          </div>
          <h2 className="font-serif-heading text-2xl font-semibold text-[#F1F7F6]">
            Activate Campaign Seat
          </h2>
          <p className="text-xs text-[#AACBC4] leading-relaxed">
            Configure your password to finalize your workspace invitation into Candor.
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-4 text-center py-2 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-[#00DF81]/20 text-[#00DF81] border border-[#00DF81]/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#F1F7F6]">Seat Activated Successfully</p>
              <p className="text-xs text-[#AACBC4]">
                Your account is now active. You may now sign in using your new credentials.
              </p>
            </div>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate('/login')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleActivate} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-[#E05252]/15 border border-[#E05252]/30 flex items-center space-x-2 text-xs text-[#E05252]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#AACBC4] mb-1.5" htmlFor="invite-token">
                Invitation Token
              </label>
              <input
                id="invite-token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="invite-xxx"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#032221]/90 border border-[#AACBC4]/25 text-xs text-[#F1F7F6] font-mono focus:outline-none focus:border-[#00DF81] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#AACBC4] mb-1.5" htmlFor="new-password">
                Set New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#032221]/90 border border-[#AACBC4]/25 text-xs text-[#F1F7F6] focus:outline-none focus:border-[#00DF81] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#AACBC4]/60 hover:text-[#F1F7F6]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#AACBC4] mb-1.5" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#032221]/90 border border-[#AACBC4]/25 text-xs text-[#F1F7F6] focus:outline-none focus:border-[#00DF81] transition-colors"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Activate Account
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
