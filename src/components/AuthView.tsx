import React, { useState } from 'react';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  UserPlus, 
  LogIn, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0512] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full bg-[#130b20] border border-purple-500/30 rounded-3xl p-8 shadow-neo-purple relative z-10 animate-scaleUp">
        <div className="text-center space-y-3 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 p-0.5 mx-auto shadow-neo-purple">
            <div className="w-full h-full bg-[#120a21] rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-fuchsia-400" />
            </div>
          </div>
          <h1 className="font-orbitron font-black text-2xl text-white tracking-widest uppercase">
            RINJANI SYSTEM
          </h1>
          <p className="text-xs font-rajdhani font-bold text-purple-300/70 tracking-widest uppercase">
            SECURE ACCESS GATEWAY
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <p className="text-[11px] text-rose-300 font-rajdhani leading-tight">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-widest ml-1">
                Identity Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0d0718] border border-purple-500/20 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-fuchsia-500 transition-all font-mono"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-widest ml-1">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0d0718] border border-purple-500/20 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-fuchsia-500 transition-all font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-bold text-xs py-4 rounded-xl flex items-center justify-center gap-2 shadow-neo-purple transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>AUTHORIZE LOGIN</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>REGISTER IDENTITY</span>
              </>
            )}
          </button>

          <div className="pt-4 border-t border-purple-500/10 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-orbitron font-bold text-purple-300/60 hover:text-fuchsia-400 transition-colors uppercase tracking-widest"
            >
              {isLogin ? "Need a new identity? Register here" : "Already registered? Login access"}
            </button>
          </div>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 opacity-30 grayscale">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span className="text-[9px] font-mono text-purple-200 uppercase tracking-[0.3em]">
            Rinjani Cloud Sync Active
          </span>
          <Sparkles className="w-3 h-3 text-purple-400" />
        </div>
      </div>
    </div>
  );
};
