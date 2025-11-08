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
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Gaming Style Header */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-sm flex items-center justify-center shadow-lg">
              <IconLayoutDashboard size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight uppercase">Dashboard</h1>
              <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Level Up Your Skills</p>
            </div>
          </div>

          {/* Tab Navigation - Gaming Pill Style */}
          <div className="inline-flex bg-white rounded-sm p-0.5 shadow-sm border border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-sm
                    font-bold text-[9px] sm:text-[10px] uppercase tracking-wide transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon size={13} className="flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
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