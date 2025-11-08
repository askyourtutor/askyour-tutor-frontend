import { useState, useEffect } from 'react';
import { 
  IconBook, 
  IconCurrencyDollar, 
  IconChartBar,
  IconLayoutDashboard
} from '@tabler/icons-react';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import StudentOverviewTab from '../components/StudentOverviewTab';
import StudentCoursesTab from '../components/StudentCoursesTab';
import StudentPaymentsTab from '../components/StudentPaymentsTab';

function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'payments'>(() => {
    const savedTab = localStorage.getItem('student-dashboard-tab');
    return (savedTab as 'overview' | 'courses' | 'payments') || 'overview';
  });
  
  const [loading] = useState(false);

  // Save activeTab to localStorage
  useEffect(() => {
    localStorage.setItem('student-dashboard-tab', activeTab);
  }, [activeTab]);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: IconChartBar },
    { id: 'courses' as const, label: 'My Courses', icon: IconBook },
    { id: 'payments' as const, label: 'Payments', icon: IconCurrencyDollar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Gaming Style Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          {/* Title Section */}
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-sm flex items-center justify-center shadow-lg">
              <IconLayoutDashboard size={14} className="sm:hidden text-white" />
              <IconLayoutDashboard size={16} className="hidden sm:block text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg lg:text-xl font-black text-gray-900 tracking-tight uppercase">Dashboard</h1>
              <p className="text-[8px] sm:text-[9px] lg:text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Level Up Your Skills</p>
            </div>
          </div>

          {/* Tab Navigation - Gaming Pill Style */}
          <div className="inline-flex w-full sm:w-auto bg-white rounded-sm p-0.5 shadow-sm border border-gray-200 gap-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-sm
                    font-bold text-[8px] sm:text-[9px] lg:text-[10px] uppercase tracking-wide transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon size={12} className="sm:hidden flex-shrink-0" />
                  <Icon size={13} className="hidden sm:block flex-shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content - Clean Container */}
        <div className="animate-fadeIn">
          {activeTab === 'overview' && <StudentOverviewTab />}
          {activeTab === 'courses' && <StudentCoursesTab />}
          {activeTab === 'payments' && <StudentPaymentsTab />}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;