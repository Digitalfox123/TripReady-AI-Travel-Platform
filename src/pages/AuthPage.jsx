import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Check, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useTranslation } from '../utils/useTranslation';
import { useTheme } from '../hooks/useTheme';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp, signInWithGoogle, resetPassword, loading } = useAuth();
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Smart redirect: If user is already logged in, send them back
  const from = location.state?.from || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Clean messages on mode switch
  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
  }, [mode]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setFormLoading(true);
    setErrorMsg('');
    
    const res = await signIn(email, password);
    setFormLoading(false);
    if (!res.success) {
      setErrorMsg(res.error.message || 'Login failed. Please try again.');
    } else {
      setSuccessMsg('Logged in successfully! Redirecting...');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all details.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }
    setFormLoading(true);
    setErrorMsg('');

    const res = await signUp(fullName, email, password);
    setFormLoading(false);
    if (!res.success) {
      setErrorMsg(res.error.message || 'Registration failed. Please try again.');
    } else {
      setSuccessMsg(t('auth.signup_redirect', 'Registration successful! Please check your email inbox (or Gmail) to verify your email address and activate your account.'));
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    setFormLoading(true);
    setErrorMsg('');

    const res = await resetPassword(email);
    setFormLoading(false);
    if (res.success) {
      setSuccessMsg('Reset password link sent to your email.');
    } else {
      setErrorMsg('Failed to send reset link.');
    }
  };

  const handleGoogleSignIn = async () => {
    setFormLoading(true);
    const res = await signInWithGoogle();
    if (!res.success) {
      setFormLoading(false);
      setErrorMsg('Google Sign-In failed.');
    }
  };

  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center py-12 px-6 overflow-hidden select-none transition-colors duration-500 ${isDark ? 'bg-[#090C15]' : 'bg-slate-50'}`}>
      {/* Travel Hero Background with gradient overlays */}
      <div 
        className={`absolute inset-0 bg-cover bg-center z-0 scale-105 pointer-events-none transition-all duration-700 ${isDark ? 'filter brightness-[0.4]' : 'filter brightness-[0.85] contrast-[0.95]'}`}
        style={{ backgroundImage: "url('/images/landmarks.jpg')" }}
      />
      <div className={`absolute inset-0 z-0 pointer-events-none transition-all duration-500 ${
        isDark 
          ? 'bg-gradient-to-tr from-[#060810]/95 via-[#0b0e1b]/80 to-[#0e162f]/60' 
          : 'bg-gradient-to-tr from-white/95 via-sky-50/80 to-indigo-50/60'
      }`} />

      {/* Floating abstract glowing lights */}
      <div className={`absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-blue-600/10 blur-[130px] z-0 pointer-events-none transition-all ${isDark ? 'opacity-100' : 'opacity-40'}`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[var(--accent)]/10 blur-[130px] z-0 pointer-events-none transition-all ${isDark ? 'opacity-100' : 'opacity-40'}`} />

      {/* Auth Card Container */}
      <div className={`relative z-10 w-full max-w-md backdrop-blur-2xl border rounded-[36px] p-8 sm:p-10 flex flex-col text-left transition-all duration-300 ${
        isDark 
          ? 'bg-[#0d1326]/60 border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.4)] text-white' 
          : 'bg-white/80 border-slate-200 shadow-[0_24px_60px_rgba(0,0,0,0.06)] text-slate-800'
      }`}>
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link to="/" className={`font-heading font-black text-2xl tracking-tighter lowercase flex items-baseline select-none mb-2 transition-all ${isDark ? 'text-white' : 'text-slate-900'}`}>
            tripready
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] ml-0.5 self-baseline mb-0.5" />
          </Link>
          <p className={`text-xs font-light max-w-xs leading-relaxed transition-all ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {mode === 'signin' && 'Sign in to unlock personalized AI itineraries, hidden gems, and local guidebooks.'}
            {mode === 'signup' && 'Create a free account to download guides, save routes, and planning boards.'}
            {mode === 'forgot' && 'Enter your email to receive a secure password recovery authorization link.'}
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="flex items-center gap-2.5 px-4.5 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs mb-6 select-text">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-2.5 px-4.5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-550 dark:text-emerald-400 text-xs mb-6 select-text leading-relaxed">
            <Check size={14} className="shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Forms */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-555'}`}>Email Address</label>
              <div className={`flex items-center gap-3 border rounded-2xl px-4 py-3 focus-within:border-[var(--accent)] transition-all ${
                isDark 
                  ? 'bg-[#12182c]/80 border-white/10 dark:border-white/[0.06]' 
                  : 'bg-slate-100/85 border-slate-200/80'
              }`}>
                <Mail size={15} className="text-slate-500 shrink-0" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className={`w-full bg-transparent border-none outline-none text-xs font-light ${
                    isDark ? 'text-white placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'
                  }`}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-555'}`}>Password</label>
                <button 
                  type="button" 
                  onClick={() => setMode('forgot')}
                  className={`text-[10px] font-bold hover:underline cursor-pointer ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                >
                  Forgot Password?
                </button>
              </div>
              <div className={`flex items-center gap-3 border rounded-2xl px-4 py-3 focus-within:border-[var(--accent)] transition-all relative ${
                isDark 
                  ? 'bg-[#12182c]/80 border-white/10 dark:border-white/[0.06]' 
                  : 'bg-slate-100/85 border-slate-200/80'
              }`}>
                <Lock size={15} className="text-slate-500 shrink-0" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-transparent border-none outline-none text-xs pr-8 font-light ${
                    isDark ? 'text-white placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 cursor-pointer transition-all ${isDark ? 'text-slate-500 hover:text-slate-350' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1 select-none">
              <label className={`flex items-center gap-2 cursor-pointer text-xs ${isDark ? 'text-slate-400' : 'text-slate-555'}`}>
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={`rounded bg-transparent text-[var(--accent)] focus:ring-0 cursor-pointer ${
                    isDark ? 'border-white/10' : 'border-slate-300'
                  }`}
                />
                <span>Remember me</span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={formLoading}
              className="w-full py-3.5 bg-gradient-to-tr from-[var(--accent)] to-indigo-600 text-white rounded-2xl font-semibold text-xs shadow-lg hover:shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {formLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-1.5">
              <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-555'}`}>Full Name</label>
              <div className={`flex items-center gap-3 border rounded-2xl px-4 py-3 focus-within:border-[var(--accent)] transition-all ${
                isDark 
                  ? 'bg-[#12182c]/80 border-white/10 dark:border-white/[0.06]' 
                  : 'bg-slate-100/85 border-slate-200/80'
              }`}>
                <User size={15} className="text-slate-500 shrink-0" />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className={`w-full bg-transparent border-none outline-none text-xs font-light ${
                    isDark ? 'text-white placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'
                  }`}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-555'}`}>Email Address</label>
              <div className={`flex items-center gap-3 border rounded-2xl px-4 py-3 focus-within:border-[var(--accent)] transition-all ${
                isDark 
                  ? 'bg-[#12182c]/80 border-white/10 dark:border-white/[0.06]' 
                  : 'bg-slate-100/85 border-slate-200/80'
              }`}>
                <Mail size={15} className="text-slate-500 shrink-0" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className={`w-full bg-transparent border-none outline-none text-xs font-light ${
                    isDark ? 'text-white placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'
                  }`}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-555'}`}>Password</label>
              <div className={`flex items-center gap-3 border rounded-2xl px-4 py-3 focus-within:border-[var(--accent)] transition-all relative ${
                isDark 
                  ? 'bg-[#12182c]/80 border-white/10 dark:border-white/[0.06]' 
                  : 'bg-slate-100/85 border-slate-200/80'
              }`}>
                <Lock size={15} className="text-slate-500 shrink-0" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className={`w-full bg-transparent border-none outline-none text-xs pr-8 font-light ${
                    isDark ? 'text-white placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 cursor-pointer transition-all ${isDark ? 'text-slate-500 hover:text-slate-350' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-555'}`}>Confirm Password</label>
              <div className={`flex items-center gap-3 border rounded-2xl px-4 py-3 focus-within:border-[var(--accent)] transition-all ${
                isDark 
                  ? 'bg-[#12182c]/80 border-white/10 dark:border-white/[0.06]' 
                  : 'bg-slate-100/85 border-slate-200/80'
              }`}>
                <Lock size={15} className="text-slate-500 shrink-0" />
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className={`w-full bg-transparent border-none outline-none text-xs font-light ${
                    isDark ? 'text-white placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'
                  }`}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={formLoading}
              className="w-full py-3.5 bg-gradient-to-tr from-[var(--accent)] to-indigo-600 text-white rounded-2xl font-semibold text-xs shadow-lg hover:shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {formLoading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-555'}`}>Email Address</label>
              <div className={`flex items-center gap-3 border rounded-2xl px-4 py-3 focus-within:border-[var(--accent)] transition-all ${
                isDark 
                  ? 'bg-[#12182c]/80 border-white/10 dark:border-white/[0.06]' 
                  : 'bg-slate-100/85 border-slate-200/80'
              }`}>
                <Mail size={15} className="text-slate-500 shrink-0" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className={`w-full bg-transparent border-none outline-none text-xs font-light ${
                    isDark ? 'text-white placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'
                  }`}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={formLoading}
              className="w-full py-3.5 bg-gradient-to-tr from-[var(--accent)] to-indigo-600 text-white rounded-2xl font-semibold text-xs shadow-lg hover:shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formLoading ? 'Sending Reset Link...' : 'Send Recovery Email'}
            </button>

            <button 
              type="button" 
              onClick={() => setMode('signin')}
              className={`w-full text-center text-xs font-bold transition-colors cursor-pointer mt-2 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Back to Sign In
            </button>
          </form>
        )}

        {/* OAuth Social Divider */}
        {mode !== 'forgot' && (
          <>
            <div className="flex items-center gap-4 my-6 select-none">
              <div className="flex-1 h-px bg-slate-200 dark:bg-white/[0.06]" />
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 font-mono">OR</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-white/[0.06]" />
            </div>

            {/* Google Login Button */}
            <button 
              onClick={handleGoogleSignIn}
              type="button"
              className={`w-full py-3 rounded-2xl border transition-all duration-300 text-xs font-semibold flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
                isDark 
                  ? 'bg-[#12182c]/60 border-white/10 dark:border-white/[0.08] hover:bg-white/10 hover:border-white/20 text-white' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </>
        )}

        {/* Mode Switch Footer Links */}
        <div className="mt-8 text-center text-xs select-none">
          {mode === 'signin' && (
            <p className={`font-light ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Don't have an account?{' '}
              <button 
                onClick={() => setMode('signup')}
                className="font-bold text-[var(--accent)] hover:underline cursor-pointer"
              >
                Create one
              </button>
            </p>
          )}
          {mode === 'signup' && (
            <p className={`font-light ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Already have an account?{' '}
              <button 
                onClick={() => setMode('signin')}
                className="font-bold text-[var(--accent)] hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
