import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  password: z.string()
    .min(8, 'At least 8 characters')
    .max(128, 'Too long')
    .regex(/[a-z]/, 'Must include a lowercase letter')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/\d/, 'Must include a number')
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'Must include a special character'),
  role: z.enum(['STUDENT', 'TUTOR']),
  acceptTerms: z.boolean().refine((v) => v === true, { message: 'You must accept the terms' }),
});
type FormValues = z.infer<typeof schema>;

export default function Register() {
  const { register: doRegister } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '', lastName: '', email: '', password: '', role: 'STUDENT', acceptTerms: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null); setSuccess(null);
    try {
      await doRegister(values);
      setSuccess('Registration successful. Please verify your email with the 6-digit code.');
      // Auto-redirect to verify page with email prefilled
      setTimeout(() => navigate(`/verify-email?email=${encodeURIComponent(values.email)}`), 800);
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message?: string }).message) : 'Registration failed';
      setError(msg);
    }
  };

  return (
    <div 
      className="h-full flex items-center justify-center px-4 py-8 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/assets/img/authpages/login2.svg")' }}
    >
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-1 text-slate-600">Join and start learning today</p>

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}
        {success && (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{success}</div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">First name</label>
              <input 
                {...register('firstName')} 
                type="text" 
                placeholder="Jane" 
                className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:outline-none focus-visible:outline-none focus:shadow-none focus-visible:shadow-none transition-colors ${
                  errors.firstName 
                    ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                    : 'border-slate-200 focus:ring-2 focus:ring-blue-500'
                }`}
                aria-invalid={!!errors.firstName}
              />
              {errors.firstName && (
                <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                  <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errors.firstName.message}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Last name</label>
              <input 
                {...register('lastName')} 
                type="text" 
                placeholder="Doe" 
                className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:outline-none focus-visible:outline-none focus:shadow-none focus-visible:shadow-none transition-colors ${
                  errors.lastName 
                    ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                    : 'border-slate-200 focus:ring-2 focus:ring-blue-500'
                }`}
                aria-invalid={!!errors.lastName}
              />
              {errors.lastName && (
                <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                  <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errors.lastName.message}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input 
              {...register('email')} 
              type="email" 
              placeholder="you@example.com" 
              className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:outline-none focus-visible:outline-none focus:shadow-none focus-visible:shadow-none transition-colors ${
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
              placeholder="Create a password" 
              className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:outline-none focus-visible:outline-none focus:shadow-none focus-visible:shadow-none transition-colors ${
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

          <div>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2">
                <input {...register('role')} type="radio" value="STUDENT" className="rounded border-slate-300" />
                <span className="text-slate-600">Student</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input {...register('role')} type="radio" value="TUTOR" className="rounded border-slate-300" />
                <span className="text-slate-600">Tutor</span>
              </label>
            </div>
            {errors.role && (
              <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.role.message}</span>
              </div>
            )}
          </div>

          <div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input {...register('acceptTerms')} type="checkbox" className="rounded border-slate-300" />
              <span className="text-slate-600">I agree to the Terms and Privacy Policy</span>
            </label>
            {errors.acceptTerms && (
              <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.acceptTerms.message}</span>
              </div>
            )}
          </div>

          <button disabled={isSubmitting} type="submit" className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
