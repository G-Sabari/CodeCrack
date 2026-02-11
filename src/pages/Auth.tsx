import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { lovable } from '@/integrations/lovable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Code2, Eye, EyeOff, Loader2, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

function FloatingInput({
  id, label, icon: Icon, type = "text", value, onChange, error, showToggle, onToggle, showValue,
}: {
  id: string; label: string; icon: React.ElementType; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; showToggle?: boolean; onToggle?: () => void; showValue?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="relative group">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200 z-10" />
        <Input
          id={id}
          type={showToggle ? (showValue ? 'text' : 'password') : type}
          placeholder={label}
          value={value}
          onChange={onChange}
          className={cn(
            "pl-10 h-12 bg-secondary/40 border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground/60",
            "focus:border-primary/50 focus:bg-secondary/60 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]",
            "transition-all duration-300",
            error && "border-destructive/50 focus:border-destructive/50"
          )}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
          >
            {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-destructive pl-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100),
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      navigate(from, { state: { showLoginAnimation: true }, replace: true });
    }
  }, [user, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setIsLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast({ title: "Login Failed", description: "Invalid email or password.", variant: "destructive" });
      } else if (error.message.includes('Email not confirmed')) {
        toast({ title: "Email Not Confirmed", description: "Please check your email and confirm your account.", variant: "destructive" });
      } else {
        toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Welcome back!", description: "You have successfully logged in." });
      navigate('/', { state: { showLoginAnimation: true }, replace: true });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signupSchema.safeParse({
      fullName: signupFullName, email: signupEmail,
      password: signupPassword, confirmPassword: signupConfirmPassword,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(signupEmail, signupPassword, signupFullName);
    setIsLoading(false);

    if (error) {
      if (error.message.includes('User already registered')) {
        toast({ title: "Account Exists", description: "Please login instead.", variant: "destructive" });
      } else {
        toast({ title: "Signup Failed", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Account Created!", description: "Please login to continue!" });
      setActiveTab('login');
      setSignupFullName(''); setSignupEmail(''); setSignupPassword(''); setSignupConfirmPassword('');
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    setIsGoogleLoading(false);
    if (error) {
      toast({ title: "Google Sign-In Failed", description: error.message || "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen animated-gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[hsl(var(--primary)/0.08)] rounded-full blur-[150px] animate-float-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[hsl(var(--accent)/0.06)] rounded-full blur-[120px] animate-float-slow" style={{ animationDelay: "7s" }} />
        <div className="absolute top-[30%] right-[20%] w-[200px] h-[200px] bg-[hsl(200,80%,60%,0.05)] rounded-full blur-[80px] animate-float" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex items-center justify-center gap-2.5 mb-8"
        >
          <div className="w-11 h-11 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] rounded-xl flex items-center justify-center shadow-lg shadow-[hsl(var(--primary)/0.3)]">
            <Code2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold gradient-text">CodeCrack</span>
        </motion.div>

        {/* Glass card */}
        <div className="glass rounded-2xl p-8 shadow-[var(--shadow-float)]">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-1.5">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {activeTab === 'login' 
                ? 'Sign in to continue your prep journey' 
                : 'Join CodeCrack and ace your interviews'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl bg-secondary/40 p-1 mb-6">
            {(['login', 'signup'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setErrors({}); }}
                className={cn(
                  "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300",
                  activeTab === tab
                    ? "bg-primary text-primary-foreground shadow-md shadow-[hsl(var(--primary)/0.25)]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'login' ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <FloatingInput id="login-email" label="Email address" icon={Mail} type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} error={errors.email} />
                <FloatingInput id="login-password" label="Password" icon={Lock} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} error={errors.password} showToggle onToggle={() => setShowPassword(!showPassword)} showValue={showPassword} />

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                    <input type="checkbox" className="rounded border-border bg-secondary/40 text-primary focus:ring-primary/50" />
                    Remember me
                  </label>
                  <button type="button" className="text-primary hover:text-primary/80 transition-colors font-medium">
                    Forgot password?
                  </button>
                </div>

                <Button type="submit" variant="neon" className="w-full h-12 rounded-xl text-base" disabled={isLoading || isGoogleLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>
                  ) : (
                    <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>
                  )}
                </Button>

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <span className="relative flex justify-center text-xs">
                    <span className="bg-[hsl(var(--card)/0.6)] px-3 text-muted-foreground backdrop-blur-sm">or continue with</span>
                  </span>
                </div>

                <Button type="button" variant="outline" className="w-full h-11 rounded-xl bg-secondary/30 border-border/50 hover:bg-secondary/50" onClick={handleGoogleLogin} disabled={isLoading || isGoogleLoading}>
                  {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  Continue with Google
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSignup}
                className="space-y-4"
              >
                <FloatingInput id="signup-name" label="Full Name" icon={User} value={signupFullName} onChange={(e) => setSignupFullName(e.target.value)} error={errors.fullName} />
                <FloatingInput id="signup-email" label="Email address" icon={Mail} type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} error={errors.email} />
                <FloatingInput id="signup-password" label="Password" icon={Lock} value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} error={errors.password} showToggle onToggle={() => setShowPassword(!showPassword)} showValue={showPassword} />
                <FloatingInput id="signup-confirm" label="Confirm Password" icon={Lock} value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} error={errors.confirmPassword} showToggle onToggle={() => setShowPassword(!showPassword)} showValue={showPassword} />

                <Button type="submit" variant="neon" className="w-full h-12 rounded-xl text-base" disabled={isLoading || isGoogleLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</>
                  ) : (
                    <>Create Account <Sparkles className="ml-2 h-4 w-4" /></>
                  )}
                </Button>

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <span className="relative flex justify-center text-xs">
                    <span className="bg-[hsl(var(--card)/0.6)] px-3 text-muted-foreground backdrop-blur-sm">or continue with</span>
                  </span>
                </div>

                <Button type="button" variant="outline" className="w-full h-11 rounded-xl bg-secondary/30 border-border/50 hover:bg-secondary/50" onClick={handleGoogleLogin} disabled={isLoading || isGoogleLoading}>
                  {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  Continue with Google
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
