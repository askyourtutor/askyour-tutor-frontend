import React, { useState, useEffect } from 'react';
import { 
  IconCurrencyDollar, 
  IconSearch, 
  IconFilter,
  IconTrendingUp,
  IconCreditCard,
  IconCheck,
  IconClock,
  IconX,
  IconRefresh,
  IconBook,
  IconVideo,
  IconChevronDown,
  IconChevronRight,
  IconUser,
  IconLoader,
  IconMail,
  IconCalendar,
  IconReceipt
} from '@tabler/icons-react';
import tutorDashboardService, { type Payment, type PaymentStats } from '../../../shared/services/tutorDashboardService';

const AdminPaymentsTab: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    totalTransactions: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed' | 'refunded'>('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (paymentId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(paymentId)) {
      newExpanded.delete(paymentId);
    } else {
      newExpanded.add(paymentId);
    }
    setExpandedRows(newExpanded);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const response = await tutorDashboardService.getTutorPayments();
      setPayments(response.payments);
      setStats(response.stats);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'refunded': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <IconCheck size={16} />;
      case 'pending': return <IconClock size={16} />;
      case 'failed': return <IconX size={16} />;
      case 'refunded': return <IconRefresh size={16} />;
      default: return <IconClock size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader className="animate-spin text-gray-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Payments & Transactions</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Track payments and revenue for courses you teach</p>
        </div>
        <button
          onClick={loadPayments}
          className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 font-medium text-xs sm:text-sm flex items-center gap-2 justify-center"
        >
          <IconRefresh size={16} />
          Refresh
        </button>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
        <div className="bg-white rounded-sm border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] sm:text-xs text-gray-600 font-medium">Total Revenue</p>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-sm flex items-center justify-center">
              <IconCurrencyDollar size={16} className="sm:w-5 sm:h-5 text-green-600" />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
          <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5">All time</p>
        </div>

        <div className="bg-white rounded-sm border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] sm:text-xs text-gray-600 font-medium">Monthly</p>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-sm flex items-center justify-center">
              <IconTrendingUp size={16} className="sm:w-5 sm:h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
          <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5">This month</p>
        </div>

        <div className="bg-white rounded-sm border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] sm:text-xs text-gray-600 font-medium">Pending</p>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-sm flex items-center justify-center">
              <IconClock size={16} className="sm:w-5 sm:h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.pendingPayments}</p>
          <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5">Awaiting processing</p>
        </div>

        <div className="bg-white rounded-sm border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] sm:text-xs text-gray-600 font-medium">Transactions</p>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-sm flex items-center justify-center">
              <IconCreditCard size={16} className="sm:w-5 sm:h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
          <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5">Total count</p>
        </div>

        <div className="bg-white rounded-sm border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] sm:text-xs text-gray-600 font-medium">Success Rate</p>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-sm flex items-center justify-center">
              <IconCheck size={16} className="sm:w-5 sm:h-5 text-green-600" />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.successRate.toFixed(1)}%</p>
          <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5">Completed payments</p>
        </div>
      </div>

      {/* Filters - Responsive */}
      <div className="bg-white rounded-sm border border-gray-200 p-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <IconSearch size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student, course, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <IconFilter size={16} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <IconCurrencyDollar size={48} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Payments Found</h3>
            <p className="text-sm text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No payments have been processed yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide w-8"></th>
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide">Student</th>
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide">Course/Session</th>
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide">Amount</th>
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => {
                  const isExpanded = expandedRows.has(payment.id);
                  
                  return (
                    <React.Fragment key={payment.id}>
                      {/* Main Row */}
                      <tr 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => toggleRow(payment.id)}
                      >
                        <td className="px-3 py-3 whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(payment.id);
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {isExpanded ? (
                              <IconChevronDown size={16} />
                            ) : (
                              <IconChevronRight size={16} />
                            )}
                          </button>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                              <IconUser size={14} className="text-purple-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-gray-900 truncate">{payment.studentName}</p>
                              <p className="text-[10px] text-gray-500 truncate">{payment.studentEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-900 truncate max-w-[200px]">{payment.courseName}</p>
                            {payment.type && (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-medium flex-shrink-0 ${
                                payment.type === 'enrollment' 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {payment.type === 'enrollment' ? (
                                  <>
                                    <IconBook size={10} />
                                    Course
                                  </>
                                ) : (
                                  <>
                                    <IconVideo size={10} />
                                    Session
                                  </>
                                )}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <IconCurrencyDollar size={14} className="text-green-600" />
                            <p className="text-sm font-semibold text-gray-900">${payment.amount.toFixed(2)}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${getStatusColor(payment.status)}`}>
                            {getStatusIcon(payment.status)}
                            <span className="capitalize">{payment.status}</span>
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <IconCalendar size={12} className="text-gray-400" />
                            {new Date(payment.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric'
                            })}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr className="bg-gray-50">
                          <td colSpan={6} className="px-3 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              {/* Left Column */}
                              <div className="space-y-3">
                                {/* Student Details */}
                                <div className="bg-white rounded border border-gray-200 p-3">
                                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                                    <IconUser size={14} className="text-purple-600" />
                                    Student Information
                                  </h4>
                                  <div className="space-y-2">
                                    <div>
                                      <span className="text-gray-500">Name:</span>
                                      <span className="ml-2 text-gray-900 font-medium">{payment.studentName}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <IconMail size={12} className="text-gray-400" />
                                      <span className="text-gray-500">Email:</span>
                                      <span className="ml-2 text-blue-600">{payment.studentEmail}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Payment Details */}
                                <div className="bg-white rounded border border-green-200 p-3">
                                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                                    <IconCurrencyDollar size={14} className="text-green-600" />
                                    Payment Details
                                  </h4>
                                  <div className="space-y-2">
                                    <div>
                                      <span className="text-gray-500">Amount:</span>
                                      <span className="ml-2 text-green-600 font-bold text-sm">
                                        ${payment.amount.toFixed(2)}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Payment Method:</span>
                                      <span className="ml-2 text-gray-900 font-medium capitalize">
                                        {payment.paymentMethod}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Status:</span>
                                      <span className="ml-2">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${getStatusColor(payment.status)}`}>
                                          {getStatusIcon(payment.status)}
                                          <span className="capitalize">{payment.status}</span>
                                        </span>
                                      </span>
                                    </div>
                                    {payment.completedAt && (
                                      <div>
                                        <span className="text-gray-500">Completed:</span>
                                        <span className="ml-2 text-gray-900 font-medium">
                                          {new Date(payment.completedAt).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Right Column */}
                              <div className="space-y-3">
                                {/* Course/Session Details */}
                                <div className="bg-white rounded border border-gray-200 p-3">
                                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                                    {payment.type === 'enrollment' ? (
                                      <>
                                        <IconBook size={14} className="text-blue-600" />
                                        Course Details
                                      </>
                                    ) : (
                                      <>
                                        <IconVideo size={14} className="text-purple-600" />
                                        Session Details
                                      </>
                                    )}
                                  </h4>
                                  <div className="space-y-2">
                                    <div>
                                      <span className="text-gray-500">
                                        {payment.type === 'enrollment' ? 'Course:' : 'Session:'}
                                      </span>
                                      <span className="ml-2 text-gray-900 font-medium">{payment.courseName}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Type:</span>
                                      <span className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-medium ${
                                        payment.type === 'enrollment' 
                                          ? 'bg-blue-100 text-blue-700' 
                                          : 'bg-purple-100 text-purple-700'
                                      }`}>
                                        {payment.type === 'enrollment' ? (
                                          <>
                                            <IconBook size={10} />
                                            Course Enrollment
                                          </>
                                        ) : (
                                          <>
                                            <IconVideo size={10} />
                                            One-on-One Session
                                          </>
                                        )}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Payment Date:</span>
                                      <span className="ml-2 text-gray-900 font-medium">
                                        {new Date(payment.createdAt).toLocaleDateString('en-US', { 
                                          month: 'long', 
                                          day: 'numeric', 
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Transaction Details */}
                                <div className="bg-white rounded border border-gray-200 p-3">
                                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                                    <IconReceipt size={14} className="text-orange-600" />
                                    Transaction Information
                                  </h4>
                                  <div className="space-y-2">
                                    <div>
                                      <span className="text-gray-500">Transaction ID:</span>
                                      <div className="mt-1 text-[10px] text-gray-900 font-mono bg-gray-50 p-2 rounded break-all">
                                        {payment.transactionId}
                                      </div>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200">
                                      <div className="flex items-center justify-between text-[10px]">
                                        <span className="text-gray-500">Payment Processed via</span>
                                        <span className="font-medium text-gray-900">{payment.paymentMethod}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentsTab;
