import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { AuthAPI } from '../services/api';
import { Link } from 'react-router';

const schema = z.object({
  email: z.string().email('Invalid email').min(1, 'Email is required'),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPassword() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setMessage(null); setError(null);
    try {
      await AuthAPI.forgotPassword(values.email);
      setMessage('If an account with this email exists, a password reset email has been sent.');
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message?: string }).message) : 'Request failed';
      setError(msg);
    }
  };

  return (
    <div className="h-full flex items-center justify-center px-4 py-8 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-slate-900">Forgot password</h1>
        <p className="mt-1 text-slate-600">Enter your email to receive a reset link</p>

        {message && <div className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{message}</div>}
        {error && <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input 
              {...register('email')} 
              type="email" 
              placeholder="you@example.com" 
              className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none transition-colors ${
                errors.email 
                  ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                  : 'border-slate-200 focus:ring-2 focus:ring-blue-500'
              }`}
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

          <button disabled={isSubmitting} type="submit" className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
            {isSubmitting ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Remembered your password?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
