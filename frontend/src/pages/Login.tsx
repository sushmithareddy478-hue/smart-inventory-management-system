import React, { useState } from 'react';
import { Boxes, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';
import { AuthResponse } from '../types';
import { apiClient } from '../api/client';

interface LoginProps {
  onLoginSuccess: (user: AuthResponse) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password.trim()) {
      setError('Please provide both username and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await apiClient.login(usernameOrEmail.trim(), password);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsernameOrEmail(u);
    setPassword(p);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-emerald-600 selection:text-white font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Logo */}
        <div className="inline-flex h-12 w-12 rounded-xl bg-emerald-600 items-center justify-center text-white shadow-sm mb-3">
          <Boxes className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Inventory Pro
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enterprise Warehouse &amp; Supply Chain Management System
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 border border-slate-200 rounded-2xl shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Sign in to your account</h3>
            <p className="text-xs text-slate-500 mt-0.5">Enter your verified enterprise credentials to continue</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Username or Email
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. admin or admin@inventorypro.io"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-10 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Remember this workstation</span>
              </label>
              <span className="text-slate-400 text-[11px]">JWT Session Protected</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Fillers */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              Quick Demo Access (Click to autofill):
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'admin123')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors group"
              >
                <div className="font-semibold text-slate-900 group-hover:text-emerald-700">Admin</div>
                <div className="text-[10px] text-slate-500 font-mono">admin123</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('manager', 'manager123')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors group"
              >
                <div className="font-semibold text-slate-900 group-hover:text-emerald-700">Manager</div>
                <div className="text-[10px] text-slate-500 font-mono">manager123</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('staff', 'staff123')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors group"
              >
                <div className="font-semibold text-slate-900 group-hover:text-emerald-700">Staff</div>
                <div className="text-[10px] text-slate-500 font-mono">staff123</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security badges at bottom */}
        <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Enforced</span>
          </div>
          <div className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
            <span>JWT Signed Tokens</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Spring Security 6</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
