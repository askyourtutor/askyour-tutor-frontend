import { useState, useEffect } from 'react';
import { 
  IconBook, 
  IconCheck, 
  IconCurrencyDollar,
  IconTrendingUp,
  IconCalendar,
  IconTrophy,
  IconFlame,
  IconStar,
  IconSparkles,
  IconTarget,
  IconBolt,
  IconRocket
} from '@tabler/icons-react';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import { apiFetch } from '../../../shared/services/api';

interface StudentStats {
  totalCourses: number;
  inProgressCourses: number;
  completedCourses: number;
  totalSpent: number;
  currentMonthSpent: number;
  upcomingSessions: number;
}

interface RecentActivity {
  id: string;
  type: 'enrollment' | 'completion' | 'payment';
  title: string;
  description: string;
  timestamp: Date;
  icon: 'book' | 'check' | 'dollar';
}

interface Enrollment {
  id: string;
  enrolledAt: string;
  course?: {
    title: string;
  };
}

interface Payment {
  id: string;
  status: string;
  amount: number;
  createdAt: string;
  course?: {
    title: string;
  };
}

interface StatCard {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  gradient: string;
  iconColor: string;
  bgColor: string;
}

function StudentOverviewTab() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StudentStats>({
    totalCourses: 0,
    inProgressCourses: 0,
    completedCourses: 0,
    totalSpent: 0,
    currentMonthSpent: 0,
    upcomingSessions: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);

      // Fetch real data from API using apiFetch (handles authentication automatically)
      // Note: apiFetch automatically adds /api prefix, so paths start without /api
      const [statsData, enrollments, payments] = await Promise.all([
        apiFetch<StudentStats>('/students/stats'),
        apiFetch<Enrollment[]>('/enrollments/my-enrollments'),
        apiFetch<Payment[]>('/payments/my-payments')
      ]);

      setStats(statsData);

      // Build recent activity from enrollments and payments
      const activities: RecentActivity[] = [];
      
      enrollments.slice(0, 3).forEach((enrollment) => {
        activities.push({
          id: `enroll-${enrollment.id}`,
          type: 'enrollment',
          title: `Enrolled in ${enrollment.course?.title || 'Course'}`,
          description: 'Started learning new course',
          timestamp: new Date(enrollment.enrolledAt),
          icon: 'book'
        });
      });

      payments.slice(0, 2).forEach((payment) => {
        if (payment.status === 'completed') {
          activities.push({
            id: `payment-${payment.id}`,
            type: 'payment',
            title: 'Payment Successful',
            description: `$${payment.amount.toFixed(2)} for ${payment.course?.title || 'Course'}`,
            timestamp: new Date(payment.createdAt),
            icon: 'dollar'
          });
        }
      });

      // Sort by timestamp
      activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setRecentActivity(activities.slice(0, 5));

    } catch (error) {
      console.error('Failed to load student stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (icon: string) => {
    const iconMap = {
      book: <IconBook size={14} className="text-blue-600" />,
      check: <IconCheck size={14} className="text-green-600" />,
      dollar: <IconCurrencyDollar size={14} className="text-purple-600" />
    };
    return iconMap[icon as keyof typeof iconMap] || <IconBook size={14} />;
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Now';
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return <LoadingSpinner message="Loading overview..." />;
  }

  const statCards: StatCard[] = [
    {
      label: 'Courses',
      value: stats.totalCourses,
      icon: IconBook,
      gradient: 'from-blue-500 via-blue-400 to-cyan-400',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Active',
      value: stats.inProgressCourses,
      icon: IconFlame,
      gradient: 'from-orange-500 via-orange-400 to-yellow-400',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Done',
      value: stats.completedCourses,
      icon: IconCheck,
      gradient: 'from-green-500 via-emerald-400 to-teal-400',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Total',
      value: `$${stats.totalSpent.toFixed(0)}`,
      icon: IconCurrencyDollar,
      gradient: 'from-purple-500 via-purple-400 to-pink-400',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Month',
      value: `$${stats.currentMonthSpent.toFixed(0)}`,
      icon: IconTrendingUp,
      gradient: 'from-indigo-500 via-indigo-400 to-blue-400',
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      label: 'Coming',
      value: stats.upcomingSessions,
      icon: IconCalendar,
      gradient: 'from-pink-500 via-rose-400 to-red-400',
      iconColor: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Stats Cards - Modern Glass Design */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label}
              className="group relative bg-white rounded-sm p-4 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <Icon size={20} className={stat.iconColor} />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
              </div>

              {/* Corner accent */}
              <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-bl-full`}></div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity - Modern Card Design */}
      <div className="bg-white rounded-sm border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-sm flex items-center justify-center shadow-md">
                <IconBolt size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>
                <p className="text-xs text-gray-500">Your latest achievements</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <IconSparkles size={16} className="text-yellow-500" />
              <span className="text-xs font-semibold text-gray-600">{recentActivity.length}</span>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {recentActivity.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm flex items-center justify-center mx-auto mb-4 shadow-inner">
                <IconBook size={28} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">No activity yet</p>
              <p className="text-xs text-gray-500">Start learning to see your progress here</p>
            </div>
          ) : (
            recentActivity.map((activity, index) => (
              <div 
                key={activity.id} 
                className="px-5 py-3 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200 group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 rounded-sm flex items-center justify-center flex-shrink-0 border border-gray-200 group-hover:border-blue-300 group-hover:scale-110 transition-all duration-200 shadow-sm">
                    {getActivityIcon(activity.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-sm">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentOverviewTab;
