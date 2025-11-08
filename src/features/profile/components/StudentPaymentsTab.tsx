import { useState, useEffect } from 'react';
import { 
  IconCurrencyDollar, 
  IconSearch, 
  IconFilter,
  IconDownload,
  IconReceipt,
  IconCheck,
  IconClock,
  IconX
} from '@tabler/icons-react';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';

interface Payment {
  id: string;
  transactionId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  createdAt: Date;
  receipt?: string;
}

function StudentPaymentsTab() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  // Stats
  const totalSpent = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const successfulPayments = payments.filter(p => p.status === 'completed').length;
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const failedPayments = payments.filter(p => p.status === 'failed').length;

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    filterPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payments, searchQuery, statusFilter]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/students/payments', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const data = await response.json();
      
      // Mock data
      const mockPayments: Payment[] = [
        {
          id: '1',
          transactionId: 'TXN-2024-001',
          courseTitle: 'Advanced JavaScript Programming',
          amount: 199.99,
          currency: 'USD',
          status: 'completed',
          paymentMethod: 'Credit Card',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          receipt: 'https://example.com/receipt1.pdf'
        },
        {
          id: '2',
          transactionId: 'TXN-2024-002',
          courseTitle: 'React Mastery Course',
          amount: 299.99,
          currency: 'USD',
          status: 'completed',
          paymentMethod: 'PayPal',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          receipt: 'https://example.com/receipt2.pdf'
        },
        {
          id: '3',
          transactionId: 'TXN-2024-003',
          courseTitle: 'Python for Data Science',
          amount: 249.99,
          currency: 'USD',
          status: 'completed',
          paymentMethod: 'Credit Card',
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
        },
        {
          id: '4',
          transactionId: 'TXN-2024-004',
          courseTitle: 'Web Design Fundamentals',
          amount: 149.99,
          currency: 'USD',
          status: 'pending',
          paymentMethod: 'Bank Transfer',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
        },
        {
          id: '5',
          transactionId: 'TXN-2024-005',
          courseTitle: 'Database Design Course',
          amount: 179.99,
          currency: 'USD',
          status: 'failed',
          paymentMethod: 'Credit Card',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      ];
      
      setPayments(mockPayments);
    } catch (error) {
      console.error('Failed to load payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(payment =>
        payment.courseTitle.toLowerCase().includes(query) ||
        payment.transactionId.toLowerCase().includes(query)
      );
    }

    setFilteredPayments(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-green-100 text-green-800">
            <IconCheck size={14} className="mr-1" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-yellow-100 text-yellow-800">
            <IconClock size={14} className="mr-1" />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-red-100 text-red-800">
            <IconX size={14} className="mr-1" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return <LoadingSpinner message="Loading payment history..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-sm p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment History</h2>
        <p className="text-gray-600">
          View all your transactions and download receipts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-sm p-6 shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Spent</p>
            <IconCurrencyDollar size={20} className="text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">All-time</p>
        </div>

        <div className="bg-white rounded-sm p-6 shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Successful</p>
            <IconCheck size={20} className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{successfulPayments}</p>
          <p className="text-xs text-gray-500 mt-1">Completed payments</p>
        </div>

        <div className="bg-white rounded-sm p-6 shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <IconClock size={20} className="text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{pendingPayments}</p>
          <p className="text-xs text-gray-500 mt-1">Processing</p>
        </div>

        <div className="bg-white rounded-sm p-6 shadow-sm border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Failed</p>
            <IconX size={20} className="text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{failedPayments}</p>
          <p className="text-xs text-gray-500 mt-1">Unsuccessful</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-sm p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by course or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <div className="relative">
              <IconFilter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-sm shadow-sm overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center">
            <IconReceipt size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Your payment history will appear here'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-sm mr-3">
                          <IconReceipt size={16} className="text-purple-600" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {payment.transactionId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {payment.courseTitle}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${payment.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">{payment.currency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(payment.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.receipt && payment.status === 'completed' && (
                        <button
                          onClick={() => window.open(payment.receipt, '_blank')}
                          className="inline-flex items-center text-blue-600 hover:text-blue-700"
                        >
                          <IconDownload size={16} className="mr-1" />
                          Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentPaymentsTab;
