import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router';
import { AuthAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

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
    <div className="h-full flex items-center justify-center px-4 py-8 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-slate-900 text-center">Verify your email</h1>

        {/* Link-based status */}
        {status !== 'idle' && (
          <p className="mt-2 text-center text-slate-600">{status === 'verifying' ? 'Verifying your email...' : message}</p>
        )}

        {/* Code entry form */}
        <div className="mt-6">
          <p className="text-slate-600 text-sm">Alternatively, enter the 6-digit code sent to your email.</p>
          {codeMsg && <div className="mt-3 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{codeMsg}</div>}
          {codeErr && <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{codeErr}</div>}

          <form className="mt-4 space-y-3" onSubmit={submitCode} noValidate>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Verification code</label>
              <input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" pattern="\d{6}" maxLength={6} placeholder="123456" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 tracking-widest outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button disabled={submitting} type="submit" className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{submitting ? 'Verifying...' : 'Verify code'}</button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-600">
            Didn’t receive the email? <Link to="/login" className="text-blue-600 hover:underline">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
