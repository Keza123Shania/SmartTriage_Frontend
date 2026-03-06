import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore, DEMO_USERS } from '../store/authStore';
import type { UserRole } from '../types/roles';

export function LoginPage() {
  const navigate = useNavigate();
  const { isDark, toggle, glassCard, glassInner, pageBg, text } = useTheme();
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    // Simulate API call delay
    await new Promise((r) => setTimeout(r, 800));

    // Demo login: map known emails to roles, or default to NURSE
    const EMAIL_ROLE_MAP: Record<string, UserRole> = {
      'patrick.kamanzi@smarttriage.rw': 'SUPER_ADMIN',
      'marie.uwimana@kfh.rw': 'HOSPITAL_ADMIN',
      'jean.nkurunziza@kfh.rw': 'DOCTOR',
      'alice.mukiza@kfh.rw': 'NURSE',
      'claude.habimana@kfh.rw': 'TRIAGE_OFFICER',
      'grace.ishimwe@kfh.rw': 'READ_ONLY',
    };

    const role = EMAIL_ROLE_MAP[email.toLowerCase()] ?? 'NURSE';
    setUser(DEMO_USERS[role]);
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-500 relative"
      style={{ background: pageBg }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(6,182,212,0.25), transparent 70%)'
              : 'radial-gradient(circle, rgba(6,182,212,0.15), transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)'
              : 'radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)',
          }}
        />
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="absolute top-6 right-6 z-20 p-2.5 rounded-xl transition-all duration-300 hover:scale-110"
        style={{
          ...glassInner,
        }}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-slate-600" />
        )}
      </button>

      {/* Login Card */}
      <div
        className="w-full max-w-md rounded-3xl p-8 relative z-10 animate-fade-in"
        style={{
          ...glassCard,
          boxShadow: isDark
            ? '0 24px 64px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            : '0 24px 64px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        }}
      >
        {/* Logo & Heading */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(12,74,110,0.3), rgba(6,182,212,0.15))'
                : 'linear-gradient(135deg, rgba(2,132,199,0.1), rgba(6,182,212,0.08))',
              border: isDark ? '1px solid rgba(2,132,199,0.3)' : '1px solid rgba(2,132,199,0.15)',
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.2)',
            }}
          >
            <img src="/Logo.png" alt="SmartTriage" className="w-10 h-10 object-contain" />
          </div>
          <h1 className={`text-2xl font-extrabold tracking-tight ${text.heading}`}>
            Welcome Back
          </h1>
          <p className={`text-sm mt-1.5 font-medium ${text.body}`}>
            Sign in to SmartTriage
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-5 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
            style={{
              background: isDark ? 'rgba(220, 38, 38, 0.15)' : 'rgba(254, 226, 226, 0.8)',
              border: isDark ? '1px solid rgba(220, 38, 38, 0.3)' : '1px solid rgba(220, 38, 38, 0.2)',
              color: isDark ? '#fca5a5' : '#dc2626',
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className={`block text-xs font-bold mb-1.5 ${text.label}`}>
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@hospital.rw"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-300 placeholder:text-slate-400"
                style={{
                  ...glassInner,
                  color: isDark ? '#e2e8f0' : '#1e293b',
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className={`block text-xs font-bold mb-1.5 ${text.label}`}>
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-300 placeholder:text-slate-400"
                style={{
                  ...glassInner,
                  color: isDark ? '#e2e8f0' : '#1e293b',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-400'} hover:text-cyan-500 transition-colors`} />
                ) : (
                  <Eye className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-400'} hover:text-cyan-500 transition-colors`} />
                )}
              </button>
            </div>
          </div>

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span className={`text-xs font-medium ${text.body}`}>Remember me</span>
            </label>
            <button type="button" className={`text-xs font-semibold ${text.accent} hover:underline`}>
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #0284c7, #06b6d4)',
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.35)',
            }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
          <span className={`px-3 text-[10px] font-bold uppercase tracking-wider ${text.muted}`}>
            or
          </span>
          <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className={`text-sm ${text.body}`}>
            Don't have an account?{' '}
            <Link
              to="/signup"
              className={`font-bold ${text.accent} hover:underline`}
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className={`absolute bottom-6 text-[10px] font-medium ${text.muted}`}>
        SmartTriage v3.2 · King Faisal Hospital
      </p>
    </div>
  );
}
