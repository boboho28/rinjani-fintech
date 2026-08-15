import React, { useState } from 'react';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously
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
  Zap,
  CheckCircle2,
  HelpCircle,
  KeyRound
} from 'lucide-react';

export const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const getFriendlyErrorMessage = (err: any): string => {
    const code = err?.code || '';
    const msg = err?.message || '';

    switch (code) {
      case 'auth/invalid-credential':
        return isLogin
          ? 'Email atau password tidak sesuai. Jika Anda belum memiliki akun, silakan klik tombol "Daftar Akun Baru" di bawah.'
          : 'Kredensial tidak valid untuk pendaftaran. Silakan periksa kembali email & password Anda.';
      case 'auth/user-not-found':
        return 'Akun dengan email ini belum terdaftar. Silakan beralih ke mode "Daftar Akun Baru".';
      case 'auth/wrong-password':
        return 'Password yang Anda masukkan salah. Silakan periksa kembali.';
      case 'auth/email-already-in-use':
        return 'Email ini sudah terdaftar. Silakan beralih ke mode "Login" untuk masuk.';
      case 'auth/invalid-email':
        return 'Format email tidak valid. Pastikan format email seperti nama@email.com.';
      case 'auth/weak-password':
        return 'Password terlalu lemah. Masukkan minimal 6 karakter kombinasi huruf dan angka.';
      case 'auth/too-many-requests':
        return 'Terlalu banyak percobaan gagal. Silakan tunggu beberapa menit sebelum mencoba lagi.';
      case 'auth/popup-closed-by-user':
        return 'Jendela login Google ditutup sebelum autentikasi selesai.';
      case 'auth/unauthorized-domain':
        return 'Domain ini belum diizinkan di Firebase Console. Gunakan email/password atau login demo.';
      case 'auth/network-request-failed':
        return 'Gagal terhubung ke server Firebase. Pastikan koneksi internet aktif.';
      case 'auth/admin-restricted-operation':
        return 'Operasi ini dibatasi oleh konfigurasi Firebase.';
      default:
        if (msg.includes('invalid-credential')) {
          return 'Email atau password tidak sesuai. Jika akun baru, silakan gunakan tombol "Daftar Akun Baru".';
        }
        return `Gagal autentikasi: ${msg || 'Terjadi kesalahan sistem. Silakan coba lagi.'}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Mohon isi email dan password.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      } else {
        await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        setSuccessMsg('Akun berhasil didaftarkan! Mengalihkan ke sistem...');
      }
    } catch (err: any) {
      console.error("Auth Error Details:", err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccessMsg('');
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setSuccessMsg('');
    setGuestLoading(true);
    try {
      await signInAnonymously(auth);
    } catch (err: any) {
      console.error("Guest Auth Error:", err);
      // If anonymous auth is disabled on firebase console, inform clearly
      if (err?.code === 'auth/admin-restricted-operation' || err?.code === 'auth/operation-not-allowed') {
        setError('Fitur Guest/Anonim belum diaktifkan di Firebase Console. Silakan daftar menggunakan Email & Password.');
      } else {
        setError(getFriendlyErrorMessage(err));
      }
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06030e] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
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
              cx={(i * 24 + 17) % 1440}
              cy={(i * 19 + 23) % 500}
              r={(i % 3) * 0.5 + 0.8}
              fill="white"
              className="animate-pulse"
              style={{ animationDelay: `${(i % 5)}s`, opacity: 0.7 }}
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
      <div className="max-w-md w-full bg-[#130b20]/85 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(168,85,247,0.25)] relative z-10 my-8">
        
        {/* Floating Accent Icons */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
           <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 p-0.5 shadow-[0_0_30px_rgba(217,70,239,0.5)]">
              <div className="w-full h-full bg-[#120a21] rounded-full flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-fuchsia-400" />
              </div>
            </div>
        </div>

        <div className="text-center space-y-2 mt-8 mb-6">
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-purple-500/30" />
            <span className="text-[10px] font-orbitron font-bold text-fuchsia-400 tracking-[0.3em] uppercase">
              {isLogin ? 'Secure Login Gateway' : 'Registration Gateway'}
            </span>
            <span className="h-px w-8 bg-purple-500/30" />
          </div>
          <h1 className="font-orbitron font-black text-2xl sm:text-3xl text-white tracking-widest uppercase drop-shadow-[0_2px_10px_rgba(168,85,247,0.5)]">
            MONEY DENDA GIANA
          </h1>
          <p className="text-[9px] font-mono text-purple-300/70 uppercase tracking-[0.2em]">
            Multi-Node Cloud Synchronization
          </p>
        </div>

        {/* Tab Toggle: Login vs Register */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#0a0514] border border-purple-500/20 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
            className={`py-2 text-xs font-orbitron font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              isLogin 
                ? 'bg-purple-600/60 text-white border border-fuchsia-400/50 shadow-[0_0_12px_rgba(168,85,247,0.4)]' 
                : 'text-purple-300/60 hover:text-purple-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>MASUK</span>
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
            className={`py-2 text-xs font-orbitron font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              !isLogin 
                ? 'bg-fuchsia-600/60 text-white border border-fuchsia-400/50 shadow-[0_0_12px_rgba(217,70,239,0.4)]' 
                : 'text-purple-300/60 hover:text-purple-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>DAFTAR BARU</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-rose-500/15 border border-rose-500/40 rounded-xl p-3.5 flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs text-rose-200 font-medium leading-relaxed">{error}</p>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => { setIsLogin(false); setError(''); }}
                    className="text-[11px] text-fuchsia-300 underline font-bold hover:text-fuchsia-200 block pt-1"
                  >
                    👉 Klik di sini untuk membuat akun baru
                  </button>
                )}
              </div>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-xl p-3 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-xs text-emerald-200 font-medium">{successMsg}</p>
            </div>
          )}

          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail className="w-3 h-3 text-fuchsia-400" />
                <span>Identity Email</span>
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d0718]/90 border border-purple-500/30 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/50 transition-all font-mono placeholder-purple-300/30"
                placeholder="nama@email.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Lock className="w-3 h-3 text-fuchsia-400" />
                <span>Password Keamanan</span>
              </label>
              <input
                type="password"
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d0718]/90 border border-purple-500/30 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/50 transition-all font-mono placeholder-purple-300/30"
                placeholder={isLogin ? "Masukkan password Anda" : "Minimal 6 karakter"}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading || guestLoading}
            className={`w-full text-white font-orbitron font-black text-xs py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.4)] ${
              isLogin 
                ? 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400' 
                : 'bg-gradient-to-r from-fuchsia-600 via-pink-500 to-purple-600 hover:from-fuchsia-500 hover:to-pink-400'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>MEMPROSES AKSES...</span>
              </>
            ) : isLogin ? (
              <>
                <LogIn className="w-4 h-4" />
                <span className="tracking-[0.1em]">MASUK KE SISTEM</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span className="tracking-[0.1em]">BUAT AKUN BARU</span>
              </>
            )}
          </button>

          {/* Alternative Auth Methods */}
          <div className="pt-3 space-y-2.5">
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-purple-500/20"></div>
              <span className="flex-shrink mx-3 text-[9px] font-orbitron uppercase text-purple-300/50 tracking-wider">Opsi Alternatif</span>
              <div className="flex-grow border-t border-purple-500/20"></div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading || guestLoading}
                className="py-2.5 px-3 bg-[#0a0514] hover:bg-purple-900/30 border border-purple-500/30 hover:border-purple-400/60 rounded-xl text-purple-200 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {googleLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-fuchsia-400" />
                ) : (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                    <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.4 0 12s.7 3.2 1.9 5.6l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.2 7.5 23 12 23z" />
                  </svg>
                )}
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={loading || googleLoading || guestLoading}
                className="py-2.5 px-3 bg-[#0a0514] hover:bg-purple-900/30 border border-purple-500/30 hover:border-purple-400/60 rounded-xl text-purple-200 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {guestLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                ) : (
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>Akses Tamu</span>
              </button>
            </div>
          </div>

          <div className="pt-2 text-center">
            <p className="text-[10px] text-purple-300/60">
              {isLogin ? "Belum punya akun Rinjani?" : "Sudah pernah mendaftar sebelumnya?"}{' '}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); }}
                className="text-fuchsia-400 font-bold hover:underline"
              >
                {isLogin ? "Daftar Akun Baru" : "Masuk di sini"}
              </button>
            </p>
          </div>
        </form>

        {/* Footer Terminal Text */}
        <div className="mt-6 pt-4 border-t border-purple-500/15 flex items-center justify-between px-1">
           <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_#10b981]" />
              <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Cloud Synchronized</span>
           </div>
           <div className="flex items-center gap-1.5 opacity-60">
              <span className="text-[8px] font-mono text-purple-300 uppercase tracking-widest">Rinjani v2.5.0</span>
           </div>
        </div>
      </div>

      {/* Decorative Floating Elements (Z-1) */}
      <div className="absolute top-10 left-10 text-fuchsia-500/20 rotate-12 pointer-events-none">
        <Mountain className="w-32 h-32" />
      </div>
      <div className="absolute bottom-10 right-10 text-purple-500/20 -rotate-12 pointer-events-none">
        <Zap className="w-32 h-32" />
      </div>

    </div>
  );
};

