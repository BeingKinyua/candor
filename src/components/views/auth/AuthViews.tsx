import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/src/lib/auth/authContext';
import { useNavigation } from '@/src/lib/router/navigationContext';
import { Button, Input } from '@/src/components/ui/Controls';
import { campaignStore } from '@/src/lib/services/store';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const { navigate } = useNavigation();
  const [email, setEmail] = useState('wanjiku.mwangi@campaign.ops');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const users = campaignStore.getUsers();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      navigate('/overview');
    } else {
      setError('Invalid credentials or inactive account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#032221] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#00DF81]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#002DF8] via-[#03624C] to-[#00DF81] p-0.5 shadow-xl shadow-[#00DF81]/25 mb-3">
            <div className="w-full h-full bg-[#032221] rounded-[14px] flex items-center justify-center">
              <span className="font-serif-heading text-2xl font-bold text-[#00DF81]">V</span>
            </div>
          </div>
          <h1 className="font-serif-heading text-2xl font-semibold text-[#F1F7F6] tracking-tight">
            VANTAGE OPS COMMAND
          </h1>
          <p className="text-xs text-[#AACBC4] mt-1 tracking-wide">
            Role-Based Campaign Intelligence & Operations Portal
          </p>
        </div>

        {/* Login Box */}
        <div className="glass-panel-elevated rounded-3xl p-8 border border-[#AACBC4]/25 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#AACBC4]/15">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#AACBC4]">
              Secure Terminal Login
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30">
              TLS 1.3 / E2EE
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#E05252]/15 border border-[#E05252]/30 flex items-center space-x-2 text-xs text-[#E05252]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Campaign Officer Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@campaign.ops"
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Secret Passcode / Hardware Key"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-[#AACBC4] hover:text-[#00DF81] transition-colors"
              >
                Lost key or credential?
              </button>
              <button
                type="button"
                onClick={() => navigate('/activate')}
                className="text-[#00DF81] hover:underline"
              >
                Activate invitation
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Authenticate Session
            </Button>
          </form>

          {/* Quick Demo Switcher for fast evaluation */}
          <div className="pt-4 border-t border-[#AACBC4]/15 space-y-2">
            <p className="text-[10px] uppercase tracking-wider text-[#AACBC4]/70 font-semibold text-center">
              Quick Role Test Logins:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {users.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    setEmail(u.email);
                    setPassword('pass1234');
                  }}
                  className="p-2 rounded-xl bg-[#06302B] hover:bg-[#08453A] border border-[#AACBC4]/20 text-left transition-colors"
                >
                  <p className="text-[11px] font-semibold text-[#F1F7F6] truncate">{u.name}</p>
                  <p className="text-[9px] text-[#00DF81] font-mono truncate">{u.role}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-[#707D7D] mt-6">
          Authorized campaign personnel only. All access attempts are cryptographically audited.
        </p>
      </div>
    </div>
  );
};

export const ForgotPasswordView: React.FC = () => {
  const { navigate } = useNavigation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#032221] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md glass-panel-elevated rounded-3xl p-8 border border-[#AACBC4]/25 shadow-2xl space-y-6">
        <h2 className="font-serif-heading text-2xl text-[#F1F7F6]">Reset Officer Credential</h2>
        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#00DF81]/20 text-[#00DF81] flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-xs text-[#AACBC4] leading-relaxed">
              If an active campaign account matches <strong>{email}</strong>, a hardware-signed recovery magic link has been dispatched.
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
              Return to Login
            </Button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <p className="text-xs text-[#AACBC4]">
              Enter your campaign email to receive an emergency hardware credential recovery link.
            </p>
            <Input
              label="Registered Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@campaign.ops"
              required
            />
            <Button type="submit" variant="primary" className="w-full">
              Send Reset Key
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => navigate('/login')}>
              Back to Login
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export const ActivateView: React.FC = () => {
  const { navigate } = useNavigation();
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [done, setDone] = useState(false);

  return (
    <div className="min-h-screen bg-[#032221] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md glass-panel-elevated rounded-3xl p-8 border border-[#AACBC4]/25 shadow-2xl space-y-6">
        <h2 className="font-serif-heading text-2xl text-[#F1F7F6]">Activate Officer Account</h2>
        {done ? (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#00DF81]/20 text-[#00DF81] flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-xs text-[#AACBC4]">
              Account credentials secured and verified. You can now access the operational command terminal.
            </p>
            <Button variant="primary" className="w-full" onClick={() => navigate('/login')}>
              Proceed to Terminal Login
            </Button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
            className="space-y-4"
          >
            <p className="text-xs text-[#AACBC4]">
              Set your personal security passcode for your newly provisioned Vantage campaign officer seat.
            </p>
            <Input
              label="Create Security Passcode"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="At least 8 characters"
              required
            />
            <Input
              label="Confirm Passcode"
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Repeat passcode"
              required
            />
            <Button type="submit" variant="primary" className="w-full">
              Complete Activation
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
