import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router';
import { AuthAPI } from '../../../shared/services/api';
import { useAuth } from '../../../shared/contexts/AuthContext';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeMsg, setCodeMsg] = useState<string | null>(null);
  const [codeErr, setCodeErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { setSession } = useAuth();

  // Link-based verification (token in URL)
  useEffect(() => {
    const token = params.get('token');
    const prefillEmail = params.get('email');
    if (prefillEmail) setEmail(prefillEmail);
    if (!token) return; // No token -> allow code entry form

    const run = async () => {
      setStatus('verifying');
      try {
        const data = await AuthAPI.verifyEmail(token);
        // Auto-login: set session and go home
        setSession(data.accessToken, data.user);
        setStatus('success');
        setMessage('Email verified successfully. Redirecting...');
        setTimeout(() => navigate('/'), 800);
      } catch {
        setStatus('error');
        setMessage('Invalid or expired verification link');
      }
    };
    run();
  }, [params, navigate, setSession]);

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeMsg(null); setCodeErr(null);
    if (!email || !code) { setCodeErr('Email and 6-digit code are required'); return; }
    if (!/^\d{6}$/.test(code)) { setCodeErr('Code must be a 6-digit number'); return; }
    try {
      setSubmitting(true);
      const data = await AuthAPI.verifyEmailCode(email, code);
      // Auto-login: set session and go home
      setSession(data.accessToken, data.user);
      setCodeMsg('Email verified successfully. Redirecting...');
      setTimeout(() => navigate('/'), 800);
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message?: string }).message) : 'Verification failed';
      setCodeErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-sm shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center tracking-tight">Verify your email</h1>

        {/* Link-based status */}
        {status !== 'idle' && (
          <p className="mt-3 text-center text-gray-600 text-sm">{status === 'verifying' ? 'Verifying your email...' : message}</p>
        )}

        {/* Code entry form */}
        <div className="mt-8">
          <p className="text-gray-600 text-sm leading-relaxed">Enter the 6-digit verification code sent to your email address.</p>
          {codeMsg && <div className="mt-4 rounded-sm border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{codeMsg}</div>}
          {codeErr && <div className="mt-4 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{codeErr}</div>}

          <form className="mt-6 space-y-4" onSubmit={submitCode} noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="w-full rounded-sm border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Verification code</label>
              <input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" pattern="\d{6}" maxLength={6} placeholder="123456" className="w-full rounded-sm border border-gray-300 px-3.5 py-2.5 text-sm tracking-[0.5em] text-center outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900" />
            </div>
            <button disabled={submitting} type="submit" className="w-full rounded-sm bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">{submitting ? 'Verifying...' : 'Verify code'}</button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Didn't receive the email? <Link to="/login" className="text-gray-900 font-medium hover:underline">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
