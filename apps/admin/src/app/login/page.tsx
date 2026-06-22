'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Mail, Lock, ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/authSlice';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('admin@thanku.app');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network request
    setTimeout(() => {
      dispatch(setUser({
        id: '1',
        name: 'Muktha Admin',
        email: email,
        role: 'super_admin',
        permissions: ['*'],
      }));
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      {/* ─── Left Panel: Branding ─── */}
      <div className="hidden md:flex flex-1 relative flex-col justify-between p-12 overflow-hidden bg-tamarind-900">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-gold blur-[100px]" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-display font-bold text-white tracking-wide">ThankU</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-white leading-tight mb-6">
            Empower the community of giving.
          </h1>
          <p className="text-lg text-tamarind-200">
            Manage donations, support users, and oversee the platform with the Enterprise Dashboard.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-tamarind-400">
          <span>&copy; {new Date().getFullYear()} ThankU Enterprise</span>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>

      {/* ─── Right Panel: Login Form ─── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-24 bg-surface">
        {/* Mobile Header */}
        <div className="flex md:hidden items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-md">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-display font-bold text-heading tracking-wide">ThankU</span>
        </div>

        <div className="w-full max-w-sm mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-display font-bold text-heading tracking-tight">Welcome back</h2>
            <p className="text-muted mt-2">Please enter your credentials to access the admin panel.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-heading" htmlFor="email">Email address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted transition-colors group-focus-within:text-primary" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-background border border-tamarind-200 rounded-xl text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  placeholder="admin@thanku.app"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-heading" htmlFor="password">Password</label>
                <a href="#" className="text-sm font-semibold text-primary hover:text-primary-600 transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted transition-colors group-focus-within:text-primary" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-background border border-tamarind-200 rounded-xl text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 text-primary bg-background border-tamarind-200 rounded focus:ring-primary/20 focus:ring-2 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-body cursor-pointer select-none">Remember me for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-600 active:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-warm-md hover:shadow-warm-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
