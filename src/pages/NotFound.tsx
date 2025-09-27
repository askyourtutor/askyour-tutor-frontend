export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl p-6 text-center">
      <h1 className="text-3xl font-semibold text-slate-800">404 - Page Not Found</h1>
      <p className="mt-2 text-slate-600">The page you are looking for doesnt exist or has been moved.</p>
      <a href="/" className="mt-6 inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Go Home</a>
    </div>
  );
}
