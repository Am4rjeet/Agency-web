import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all credentials.');
      return;
    }

    setError('');
    setLoading(true);

    fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => {
        if (!res.ok) throw new Error('Invalid email or password.');
        return res.json();
      })
      .then(data => {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      })
      .catch(err => {
        setError(err.message || 'Server connection failed.');
        setLoading(false);
      });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      
      {/* Glow blobs */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-neon-purple/5 rounded-full glow-blur" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-neon-cyan/5 rounded-full glow-blur" />

      <div className="relative z-10 w-full max-w-md glass-panel rounded-3xl border border-zinc-800 light:border-zinc-200 p-8 space-y-8 bg-zinc-950/70 light:bg-white/80">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="p-3 bg-neon-purple/10 rounded-2xl w-fit mx-auto">
            <ShieldCheck className="w-8 h-8 text-neon-cyan" />
          </div>
          <h2 className="font-display font-black text-2xl text-white light:text-zinc-950">Admin Console</h2>
          <p className="text-xs text-zinc-500 light:text-zinc-400 uppercase tracking-widest font-semibold">Secure Log-In</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-neon-pink/15 text-neon-pink rounded-2xl text-xs flex items-center gap-2 border border-neon-pink/20 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Security Email</label>
            <div className="relative">
              <input 
                type="email" 
                placeholder="admin@amarixsolution.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-300 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-zinc-200 light:text-zinc-800 focus:outline-none focus:border-neon-cyan transition-colors"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Security Password</label>
            <div className="relative">
              <input 
                type="password" 
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-300 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-zinc-200 light:text-zinc-800 focus:outline-none focus:border-neon-cyan transition-colors"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold text-zinc-950 bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-purple hover:to-neon-cyan transition-all mt-6 disabled:opacity-50"
          >
            {loading ? 'Authenticating Credentials...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Authorized Access Terminal Only</span>
        </div>

      </div>
    </div>
  );
}
