import { useState, useEffect } from 'react';
import { 
  IconBook, 
  IconCheck, 
  IconCurrencyDollar,
  IconTrendingUp,
  IconCalendar,
  IconTrophy,
  IconFlame,
  IconStar
} from '@tabler/icons-react';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';

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
      
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch real data from API
      const [statsResponse, enrollmentsResponse, paymentsResponse] = await Promise.all([
        fetch('/api/students/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/enrollments/my-enrollments', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/payments/my-payments', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Build recent activity from enrollments and payments
      const activities: RecentActivity[] = [];
      
      if (enrollmentsResponse.ok) {
        const enrollments: Enrollment[] = await enrollmentsResponse.json();
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
      }

      if (paymentsResponse.ok) {
        const payments: Payment[] = await paymentsResponse.json();
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
      }

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
      icon: IconTrophy,
      gradient: 'from-blue-500 to-cyan-400',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Active',
      value: stats.inProgressCourses,
      icon: IconFlame,
      gradient: 'from-orange-500 to-red-400',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Done',
      value: stats.completedCourses,
      icon: IconStar,
      gradient: 'from-green-500 to-emerald-400',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Total',
      value: `$${stats.totalSpent.toFixed(0)}`,
      icon: IconCurrencyDollar,
      gradient: 'from-purple-500 to-pink-400',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Month',
      value: `$${stats.currentMonthSpent.toFixed(0)}`,
      icon: IconTrendingUp,
      gradient: 'from-indigo-500 to-blue-400',
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      label: 'Coming',
      value: stats.upcomingSessions,
      icon: IconCalendar,
      gradient: 'from-yellow-500 to-orange-400',
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div className="space-y-2.5">
      {/* Stats Grid - Compact Gaming Style */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label}
              className="relative bg-white rounded-sm p-2 border border-gray-200 hover:border-gray-300 transition-all group overflow-hidden"
            >
              {/* Subtle glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <div className={`w-5 h-5 ${stat.bgColor} rounded-sm flex items-center justify-center`}>
                    <Icon size={11} className={stat.iconColor} />
                  </div>
                </div>
                <p className="text-base sm:text-lg font-bold text-gray-900 mb-0.5">{stat.value}</p>
                <p className="text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-wide">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity - Compact Light Theme */}
      <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
        <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-1.5">
            <div className="w-0.5 h-3 bg-gradient-to-b from-blue-500 to-purple-500 rounded-sm"></div>
            <h3 className="text-[10px] sm:text-xs font-bold text-gray-900 uppercase tracking-wide">Activity</h3>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {recentActivity.length === 0 ? (
            <div className="px-3 py-6 text-center">
              <div className="w-9 h-9 bg-gray-100 rounded-sm flex items-center justify-center mx-auto mb-2 border border-gray-200">
                <IconBook size={16} className="text-gray-400" />
              </div>
              <p className="text-[10px] text-gray-500">No activity yet</p>
            </div>
          ) : (
            recentActivity.map((activity) => (
              <div key={activity.id} className="px-3 py-2 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-100 rounded-sm flex items-center justify-center flex-shrink-0 border border-gray-200 group-hover:border-gray-300 transition-colors">
                    {getActivityIcon(activity.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs font-medium text-gray-900 line-clamp-1">{activity.title}</p>
                    <p className="text-[8px] sm:text-[9px] text-gray-500 mt-0.5 line-clamp-1">{activity.description}</p>
                  </div>
                  <p className="text-[8px] text-gray-400 flex-shrink-0">
                    {formatTimestamp(activity.timestamp)}
                  </p>
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
