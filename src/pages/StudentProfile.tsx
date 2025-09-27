import { useAuth } from '../contexts/AuthContext';

export default function StudentProfile() {
  const { user } = useAuth();
  const sp = user?.studentProfile ?? {};

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-slate-800">Student Profile</h1>
      <p className="mt-2 text-slate-600">Complete or update your student details.</p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">First Name</label>
            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" defaultValue={sp.firstName ?? ''} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Last Name</label>
            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" defaultValue={sp.lastName ?? ''} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">University</label>
            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" defaultValue={(sp as any)?.university ?? ''} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Course of Study</label>
            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" defaultValue={(sp as any)?.courseOfStudy ?? ''} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Year of Study</label>
            <input type="number" min={1} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" defaultValue={(sp as any)?.yearOfStudy ?? ''} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Learning Goals</label>
            <textarea className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" rows={4} defaultValue={(sp as any)?.learningGoals ?? ''} />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Save</button>
          <button className="rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50">Cancel</button>
        </div>
      </div>
    </div>
  );
}
