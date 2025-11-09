import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { AuthAPI } from '../../../shared/services/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
  // Keep rememberMe as a required boolean for RHF typing, but we set default in useForm
  rememberMe: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const handleResendVerification = async () => {
    if (!verificationEmail) return;
    
    setIsResendingVerification(true);
    setResendSuccess(false);
    try {
      await AuthAPI.resendVerification({ email: verificationEmail });
      setResendSuccess(true);
      setError(null);
    } catch (e) {
      setError('Failed to resend verification email. Please try again.');
    } finally {
      setIsResendingVerification(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setVerificationEmail(null);
    setResendSuccess(false);
    
    try {
      await login(values.email, values.password, values.rememberMe);
      // Fetch fresh user to decide redirect based on role and profile completeness
      const me = await AuthAPI.me();
      const user = me.user;
      
      if (user) {
        const role = user.role;
        const needsStudentSetup = !user.studentProfile || !user.studentProfile.university || !user.studentProfile.yearOfStudy;
        const needsTutorSetup = !user.tutorProfile || !user.tutorProfile.qualifications || !user.tutorProfile.subjectSpecializations;
        
        // Check if profile setup is needed first
        if (role === 'STUDENT' && needsStudentSetup) {
          navigate('/student/profile', { replace: true });
          return;
        }
        if (role === 'TUTOR' && needsTutorSetup) {
          navigate('/tutor/profile', { replace: true });
          return;
        }
        
        // Role-based redirect after login
        if (role === 'STUDENT') {
          // Always redirect students to profile for verification
          navigate('/student/profile', { replace: true });
        } else if (role === 'TUTOR') {
          navigate('/tutor/dashboard', { replace: true });
        } else if (role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        navigate('/', { replace: true });
      }
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message?: string }).message) : 'Login failed';
      setError(msg);
      
      // If it's an email verification error, store the email for resend option
      if (msg.toLowerCase().includes('verify your email')) {
        setVerificationEmail(values.email);
      }
    }
  };

  return (
    <div 
      className="h-full flex items-center justify-center px-4 py-8 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/assets/img/authpages/login.svg")' }}
    >
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-slate-600">Sign in to your account</p>

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <div className="flex items-start gap-2">
              <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p>{error}</p>
                {verificationEmail && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResendingVerification}
                    className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline disabled:opacity-50"
                  >
                    {isResendingVerification ? 'Sending...' : 'Resend verification email'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {resendSuccess && (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            <div className="flex items-start gap-2">
              <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p>Verification email sent! Please check your inbox and verify your email.</p>
            </div>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input 
              {...register('email')} 
              type="email" 
              placeholder="you@example.com" 
              className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:outline-none focus-visible:outline-none focus:shadow-none focus-visible:shadow-none focus:ring-offset-0 focus-visible:ring-offset-0 transition-colors ${
                errors.email 
                  ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                  : 'border-slate-200 focus:ring-2 focus:ring-blue-500'
              }`}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.email.message}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input 
              {...register('password')} 
              type="password" 
              placeholder="••••••••" 
              className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:outline-none focus-visible:outline-none focus:shadow-none focus-visible:shadow-none focus:ring-offset-0 focus-visible:ring-offset-0 transition-colors ${
                errors.password 
                  ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                  : 'border-slate-200 focus:ring-2 focus:ring-blue-500'
              }`}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.password.message}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2">
              <input {...register('rememberMe')} type="checkbox" className="rounded border-slate-300" />
              <span className="text-slate-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot password?</Link>
          </div>

          <button disabled={isSubmitting} type="submit" className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don’t have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
