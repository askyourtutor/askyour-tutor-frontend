import React from 'react';

type IconProps = { size?: number; className?: string };
export type TabId = 'overview' | 'reviews' | 'qna' | 'syllabus' | 'resources';

export type TabItem = {
  id: TabId;
  label: string;
  icon: React.ComponentType<IconProps>;
};

interface TabNavProps {
  items: TabItem[];
  activeTab: TabId;
  onChange: (id: TabId) => void;
}

const TabNav: React.FC<TabNavProps> = ({ items, activeTab, onChange }) => {
  return (
    <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
      <nav className="flex overflow-x-auto scrollbar-hide">
        {items.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 md:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 text-[10px] sm:text-xs md:text-sm font-bold whitespace-nowrap border-b-2 sm:border-b-3 transition-all duration-300 flex-1 sm:flex-none min-w-0 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-white shadow-sm'
                  : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-white/50'
              }`}
              title={tab.label}
            >
              <Icon size={16} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] flex-shrink-0" />
              <span className="hidden sm:inline truncate">{tab.label}</span>
              <span className="sm:hidden text-[9px] leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TabNav;
