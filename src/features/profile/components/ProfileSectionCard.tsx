import type { ReactNode } from 'react';

interface ProfileSectionCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  description?: ReactNode;
}

export const ProfileSectionCard = ({ title, icon, children, description }: ProfileSectionCardProps) => (
  <section className="bg-white shadow-lg p-8 rounded-lg">
    <header className="flex items-center space-x-3 mb-6">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {description ? <p className="text-sm text-gray-500 mt-1">{description}</p> : null}
      </div>
    </header>
    {children}
  </section>
);
