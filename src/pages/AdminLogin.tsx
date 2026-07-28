import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ShieldAlert, ArrowRight, Lock, KeyRound, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminLogin = () => {
  const [password, setPassword] = React.useState('');
  const [show2FA, setShow2FA] = React.useState(false);
  const [totpCode, setTotpCode] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, code: show2FA ? totpCode : undefined }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Access Denied');
      }

      if (data.twoFactorRequired) {
        setShow2FA(true);
        setLoading(false);
        return;
      }

      localStorage.setItem('adminToken', data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid Access Protocol');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white p-6 relative overflow-hidden font-sans">
      <Helmet>
        <title>Admin Login | Preet Web Vision</title>
      </Helmet>

      {/* Abstract Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF6B00]/10 rounded-full blur-[180px] pointer-events-none" />
      
      <div className="max-w-md w-full bg-[#121212] border border-white/10 rounded-3xl p-10 relative z-10 shadow-2xl">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#FF6B00]/30 w-fit mb-8">
          <ShieldAlert className="text-[#FF6B00]" size={16} />
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FFB347]">
            {show2FA ? 'AUTHENTICATION CODE' : 'ADMIN CONTROL ACCESS'}
          </span>
        </div>

        <h1 className="font-display text-3xl font-black uppercase tracking-tight text-white mb-3">
          {show2FA ? "VERIFY TOKEN" : "ADMIN ACCESS"}
        </h1>
        <p className="text-[#BFBFBF] text-xs leading-relaxed mb-8">
          {show2FA 
            ? 'Please enter the 6-digit confirmation code from your authenticator app.' 
            : 'Enter your administrative password below to access site management controls.'
          }
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          {!show2FA ? (
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B8B8B]" size={18} />
                <input 
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-[#161616] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-xs text-white placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#FF6B00] transition-colors font-mono"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B8B8B]" size={18} />
                <input 
                  required
                  type="text"
                  pattern="\d{6}"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-Digit Verification Code"
                  className="w-full bg-[#161616] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-xs text-white placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#FF6B00] transition-colors font-mono tracking-widest text-center text-base font-bold"
                />
              </div>

              <button 
                type="button"
                onClick={() => { setShow2FA(false); setTotpCode(''); setError(''); }}
                className="flex items-center gap-2 text-[#BFBFBF] hover:text-white transition-colors text-[10px] font-mono font-bold uppercase tracking-wider mx-auto"
              >
                <ArrowLeft size={12} /> Back to password
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-mono font-bold uppercase tracking-wider rounded-xl text-center">
              {error}
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] text-white py-4 rounded-xl font-mono font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#FF6B00]/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating...' : (
              <>
                <span>{show2FA ? 'Confirm Identity' : 'Authenticate'}</span> 
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-[#8B8B8B]">
          <span className="text-[10px] font-mono uppercase tracking-widest">Preet Web Vision</span>
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-ping" />
          </div>
        </div>
      </div>
    </div>
  );
};

