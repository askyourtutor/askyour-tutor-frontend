import { useState, useEffect } from 'react';
import { 
  IconBook, 
  IconCurrencyDollar, 
  IconChartBar
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your courses, payments, and settings</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap -mb-px" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 
                      border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && <StudentOverviewTab />}
          {activeTab === 'courses' && <StudentCoursesTab />}
          {activeTab === 'payments' && <StudentPaymentsTab />}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;