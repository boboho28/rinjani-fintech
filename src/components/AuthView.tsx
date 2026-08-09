import React, { useState } from 'react';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  UserPlus, 
  LogIn, 
  Sparkles,
  AlertCircle,
  RefreshCw,
  Mountain,
  Zap
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
      console.error(err);
      if (err.code === 'auth/user-not-found') setError('Email tidak terdaftar di sistem.');
      else if (err.code === 'auth/wrong-password') setError('Password keamanan salah.');
      else if (err.code === 'auth/email-already-in-use') setError('Email sudah digunakan untuk akun lain.');
      else setError('Terjadi kesalahan akses sistem. Pastikan koneksi internet aktif.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06030e] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* --- BACKGROUND LAYER: CYBER RINJANI MOUNTAIN --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="w-full h-full absolute inset-0"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMax slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a0512" />
              <stop offset="100%" stopColor="#1a0f30" />
            </linearGradient>
            <linearGradient id="mtnGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#9333ea" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#06030e" />
            </linearGradient>
            <linearGradient id="aurora" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e879f9" stopOpacity="0" />
              <stop offset="30%" stopColor="#e879f9" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Dark Base Sky */}
          <rect width="1440" height="900" fill="url(#skyGrad)" />

          {/* Animated Aurora Borealis Waves */}
          <path
            className="animate-pulse"
            style={{ animationDuration: '8s' }}
            d="M0 200 Q 360 100 720 200 T 1440 200 V 400 Q 1080 300 720 400 T 0 400 Z"
            fill="url(#aurora)"
            filter="blur(60px)"
          />

          {/* Twinkling Stars */}
          {[...Array(60)].map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 1440}
              cy={Math.random() * 500}
              r={Math.random() * 1.5}
              fill="white"
              className="animate-pulse"
              style={{ animationDelay: `${Math.random() * 5}s`, opacity: Math.random() }}
            />
          ))}

          {/* Mount Rinjani Silhouette */}
          <path
            d="M-100 900 L200 650 L400 700 L720 350 L1040 700 L1240 650 L1540 900 Z"
            fill="url(#mtnGrad)"
            stroke="#c084fc"
            strokeWidth="1"
            opacity="0.9"
          />

          {/* Summit Beacon Glow */}
          <circle cx="720" cy="350" r="100" fill="#a855f7" opacity="0.1" filter="blur(40px)" />
          <circle cx="720" cy="350" r="4" fill="white" filter="drop-shadow(0 0 10px #e879f9)" className="animate-ping" />
        </svg>

        {/* Moving Mist / Kabut Layer */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#06030e] to-transparent opacity-80" 
          style={{ backdropFilter: 'blur(2px)' }}
        />
      </div>

      {/* --- FOREGROUND: LOGIN CARD --- */}
      <div className="max-w-md w-full bg-[#130b20]/75 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.25)] relative z-10 animate-scaleUp">
        
        {/* Floating Accent Icons */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
           <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 p-0.5 shadow-[0_0_30px_rgba(217,70,239,0.5)]">
              <div className="w-full h-full bg-[#120a21] rounded-full flex items-center justify-center">
                <ShieldCheck className="w-12 h-12 text-fuchsia-400" />
              </div>
            </div>
        </div>

        <div className="text-center space-y-2 mt-12 mb-8">
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-purple-500/30" />
            <span className="text-[10px] font-orbitron font-bold text-fuchsia-400 tracking-[0.3em] uppercase">Secure Access</span>
            <span className="h-px w-8 bg-purple-500/30" />
          </div>
          <h1 className="font-orbitron font-black text-3xl text-white tracking-widest uppercase drop-shadow-[0_2px_10px_rgba(168,85,247,0.5)]">
            RINJANI SYSTEM
          </h1>
          <p className="text-[9px] font-mono text-purple-300/60 uppercase tracking-[0.2em]">
            Multi-Node Cloud Synchronization Active
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <p className="text-[11px] text-rose-300 font-rajdhani leading-tight font-bold">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span>Identity Email</span>
              </label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0d0718]/80 border border-purple-500/20 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/50 transition-all font-mono placeholder-purple-200/20 shadow-inner"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Lock className="w-3 h-3" />
                <span>Secure Password</span>
              </label>
              <div className="relative group">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0d0718]/80 border border-purple-500/20 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/50 transition-all font-mono placeholder-purple-200/20 shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-black text-xs py-4 rounded-xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95 disabled:opacity-50 group"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <span className="tracking-[0.1em]">AUTHORIZE LOGIN</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="tracking-[0.1em]">REGISTER IDENTITY</span>
              </>
            )}
          </button>

          <div className="pt-6 border-t border-purple-500/15 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-orbitron font-black text-purple-300 hover:text-fuchsia-400 transition-all uppercase tracking-[0.2em] bg-purple-500/5 py-2 px-4 rounded-lg border border-purple-500/10 hover:border-fuchsia-500/30"
            >
              {isLogin ? "Generate New System Identity" : "Return to Login Gateway"}
            </button>
          </div>
        </form>

        {/* Footer Terminal Text */}
        <div className="mt-8 flex items-center justify-between px-2">
           <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_#10b981]" />
              <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Cloud Connected</span>
           </div>
           <div className="flex items-center gap-1.5 opacity-50">
              <span className="text-[8px] font-mono text-purple-300 uppercase tracking-widest">Rinjani v2.5.0 Neon</span>
           </div>
        </div>
      </div>

      {/* Decorative Floating Elements (Z-1) */}
      <div className="absolute top-10 left-10 text-fuchsia-500/20 rotate-12">
        <Mountain className="w-32 h-32" />
      </div>
      <div className="absolute bottom-10 right-10 text-purple-500/20 -rotate-12">
        <Zap className="w-32 h-32" />
      </div>

    </div>
  );
};
