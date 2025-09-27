import { useAuth } from '../../../shared/contexts/AuthContext';
import type { TutorProfile } from '../../../shared/contexts/AuthContext';

export default function TutorProfile() {
  const { user } = useAuth();
  const tp = (user?.tutorProfile ?? {}) as TutorProfile;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-slate-800">Tutor Profile</h1>
      <p className="mt-2 text-slate-600">Complete your professional details for admin approval.</p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">First Name</label>
            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" defaultValue={tp.firstName ?? ''} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Last Name</label>
            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" defaultValue={tp.lastName ?? ''} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Professional Title</label>
            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" defaultValue={tp.professionalTitle ?? ''} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">University / Institution</label>
            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" defaultValue={tp.university ?? ''} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Teaching Experience (years)</label>
            <input type="number" min={0} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" defaultValue={tp.teachingExperience ?? 0} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Hourly Rate (USD)</label>
            <input type="number" min={0} step="1" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" defaultValue={tp.hourlyRate ?? 0} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Qualifications (JSON or comma-separated for now)</label>
            <textarea className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" rows={3} defaultValue={tp.qualifications ?? ''} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Subject Specializations (JSON or comma-separated)</label>
            <textarea className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" rows={3} defaultValue={tp.subjectSpecializations ?? ''} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Bio</label>
            <textarea className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" rows={5} defaultValue={tp.bio ?? ''} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Credentials Document (placeholder)</label>
            <input type="file" className="mt-1 block" />
            <p className="mt-1 text-xs text-slate-500">PDF only in production, with server-side validation.</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Save</button>
          <button className="rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50">Cancel</button>
          { tp.status && (
            <span className="ml-auto inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              Status: {tp.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
