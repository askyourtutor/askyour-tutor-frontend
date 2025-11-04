import { useState, useEffect } from 'react';
import {
  IconCreditCard,
  IconDownload,
  IconFilter,
  IconSearch,
  IconTrendingUp,
  IconClock,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import tutorDashboardService, {
  type Payment,
  type PaymentStats,
} from '../../../shared/services/tutorDashboardService';

function TutorPaymentsTab() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    totalTransactions: 0,
    successRate: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed' | 'refunded'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await tutorDashboardService.getTutorPayments();
      setPayments(response.payments);
      setStats(response.stats);
    } catch (error) {
      console.error('Error fetching payments:', error);
      // Reset to empty state on error
      setPayments([]);
      setStats({
        totalRevenue: 0,
        monthlyRevenue: 0,
        pendingPayments: 0,
        totalTransactions: 0,
        successRate: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <IconCheck size={16} className="text-green-600" />;
      case 'pending':
        return <IconClock size={16} className="text-yellow-600" />;
      case 'failed':
        return <IconX size={16} className="text-red-600" />;
      case 'refunded':
        return <IconX size={16} className="text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: Payment['status']) => {
    const styles = {
      completed: 'bg-green-50 text-green-700 border-green-200',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      failed: 'bg-red-50 text-red-700 border-red-200',
      refunded: 'bg-gray-50 text-gray-700 border-gray-200',
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium border ${styles[status]}`}>
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredPayments = payments
    .filter(payment => {
      if (filterStatus !== 'all' && payment.status !== filterStatus) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          payment.studentName.toLowerCase().includes(query) ||
          payment.studentEmail.toLowerCase().includes(query) ||
          payment.courseName.toLowerCase().includes(query) ||
          payment.transactionId.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return b.amount - a.amount;
      }
    });

  const handleExportPayments = () => {
    // TODO: Implement CSV export
    console.log('Exporting payments...');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payments</h2>
          <p className="text-sm text-gray-600 mt-1">Track your earnings and payment history</p>
        </div>
        <button
          onClick={handleExportPayments}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-sm text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <IconDownload size={18} />
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Revenue</p>
            <IconTrendingUp size={18} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-gray-600 mt-1">All time earnings</p>
        </div>

        <div className="bg-white rounded-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Monthly Revenue</p>
            <IconTrendingUp size={18} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toFixed(2)}</p>
          <p className="text-xs text-gray-600 mt-1">Current month</p>
        </div>

        <div className="bg-white rounded-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Transactions</p>
            <IconCreditCard size={18} className="text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
          <p className="text-xs text-gray-600 mt-1">Total completed</p>
        </div>

        <div className="bg-white rounded-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Success Rate</p>
            <IconCheck size={18} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
          <p className="text-xs text-gray-600 mt-1">Payment success</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student, course, or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <IconFilter size={18} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <IconCreditCard size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 text-sm">No payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{payment.studentName}</p>
                        <p className="text-xs text-gray-500">{payment.studentEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{payment.courseName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">${payment.amount.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {new Date(payment.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-600 font-mono">{payment.transactionId}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Note */}
      {stats.pendingPayments > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-4">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">{stats.pendingPayments}</span> payment{stats.pendingPayments > 1 ? 's' : ''} pending processing
          </p>
        </div>
      )}
    </div>
  );
}

export default TutorPaymentsTab;
