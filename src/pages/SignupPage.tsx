import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, UserPlus, User, Building2,
  Sun, Moon, ChevronDown,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore, DEMO_USERS } from '../store/authStore';
import type { UserRole } from '../types/roles';

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'NURSE', label: 'Nurse' },
  { value: 'DOCTOR', label: 'Doctor' },
  { value: 'TRIAGE_OFFICER', label: 'Triage Officer' },
  { value: 'HOSPITAL_ADMIN', label: 'Hospital Admin' },
  { value: 'READ_ONLY', label: 'Read-Only / Observer' },
];

export function SignupPage() {
  const navigate = useNavigate();
  const { isDark, toggle, glassCard, glassInner, pageBg, text } = useTheme();
  const setUser = useAuthStore((s) => s.setUser);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [hospital, setHospital] = useState('');
  const [role, setRole] = useState<UserRole>('NURSE');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));

    // Create user from form data, using demo user as base
    const demoBase = DEMO_USERS[role];
    setUser({
      ...demoBase,
      id: `U${Date.now()}`,
      fullName,
      email,
      hospital: hospital || demoBase.hospital,
    });

    setLoading(false);
    navigate('/dashboard');
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { width: '0%', color: 'transparent', label: '' };
    if (password.length < 4) return { width: '25%', color: '#ef4444', label: 'Weak' };
    if (password.length < 6) return { width: '50%', color: '#f59e0b', label: 'Fair' };
    if (password.length < 8) return { width: '75%', color: '#06b6d4', label: 'Good' };
    return { width: '100%', color: '#10b981', label: 'Strong' };
  };

  const strength = getPasswordStrength();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-500 relative"
      style={{ background: pageBg }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(6,182,212,0.25), transparent 70%)'
              : 'radial-gradient(circle, rgba(6,182,212,0.15), transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20"
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

      {/* Signup Card */}
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
        <div className="text-center mb-6">
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
            Create Account
          </h1>
          <p className={`text-sm mt-1.5 font-medium ${text.body}`}>
            Join SmartTriage
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
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
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className={`block text-xs font-bold mb-1.5 ${text.label}`}>
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Jane Doe"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-300 placeholder:text-slate-400"
                style={{
                  ...glassInner,
                  color: isDark ? '#e2e8f0' : '#1e293b',
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={`block text-xs font-bold mb-1.5 ${text.label}`}>
              Email Address <span className="text-red-400">*</span>
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

          {/* Hospital & Role row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Hospital */}
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${text.label}`}>
                Hospital
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
                </div>
                <input
                  type="text"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  placeholder="KFH"
                  className="w-full pl-9 pr-3 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-300 placeholder:text-slate-400"
                  style={{
                    ...glassInner,
                    color: isDark ? '#e2e8f0' : '#1e293b',
                  }}
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${text.label}`}>
                Role
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full appearance-none pl-3 pr-8 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-300 cursor-pointer"
                  style={{
                    ...glassInner,
                    color: isDark ? '#e2e8f0' : '#1e293b',
                  }}
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                  <ChevronDown className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className={`block text-xs font-bold mb-1.5 ${text.label}`}>
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
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
            {/* Strength bar */}
            {password && (
              <div className="mt-2 flex items-center gap-2">
                <div
                  className="flex-1 h-1 rounded-full overflow-hidden"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: strength.width, background: strength.color }}
                  />
                </div>
                <span className="text-[10px] font-bold" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className={`block text-xs font-bold mb-1.5 ${text.label}`}>
              Confirm Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
              </div>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-12 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-300 placeholder:text-slate-400"
                style={{
                  ...glassInner,
                  color: isDark ? '#e2e8f0' : '#1e293b',
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
              >
                {showConfirm ? (
                  <EyeOff className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-400'} hover:text-cyan-500 transition-colors`} />
                ) : (
                  <Eye className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-400'} hover:text-cyan-500 transition-colors`} />
                )}
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 mt-0.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
            />
            <span className={`text-xs font-medium leading-relaxed ${text.body}`}>
              I agree to the{' '}
              <span className={`font-bold ${text.accent}`}>Terms of Service</span>{' '}
              and{' '}
              <span className={`font-bold ${text.accent}`}>Privacy Policy</span>
            </span>
          </label>

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
                <UserPlus className="w-4 h-4" />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
          <span className={`px-3 text-[10px] font-bold uppercase tracking-wider ${text.muted}`}>
            or
          </span>
          <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className={`text-sm ${text.body}`}>
            Already have an account?{' '}
            <Link
              to="/login"
              className={`font-bold ${text.accent} hover:underline`}
            >
              Sign In
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
