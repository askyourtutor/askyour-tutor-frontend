import { Link } from 'react-router';

export default function Login() {
  return (
    <div 
      className="h-full flex items-center justify-center px-4 py-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("/assets/img/authpages/login.svg")'
      }}
    >
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-slate-600">Sign in to your account</p>

        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" placeholder="you@example.com" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" placeholder="••••••••" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="rounded border-slate-300" />
            <span className="text-slate-600">Remember me</span>
          </label>
          <button type="button" className="text-blue-600 hover:underline">Forgot password?</button>
        </div>

          <button type="button" className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">Sign in</button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Dont have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
