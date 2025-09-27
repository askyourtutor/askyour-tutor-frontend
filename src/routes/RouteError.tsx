import { isRouteErrorResponse, useRouteError } from 'react-router';

export default function RouteError() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-800">{error.status} {error.statusText}</h1>
        {error.data && (
          <p className="mt-2 text-slate-600">{String(error.data)}</p>
        )}
      </div>
    );
  }

  const message = error instanceof Error ? error.message : 'Something went wrong';
  return (
    <div className="mx-auto max-w-3xl p-6 text-center">
      <h1 className="text-2xl font-semibold text-slate-800">Unexpected Error</h1>
      <p className="mt-2 text-slate-600">{message}</p>
    </div>
  );
}
