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
      
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch real payment data from API
      const response = await fetch('/api/payments/my-payments', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }

      const paymentsData = await response.json();
      
      // Transform payments to expected format
      const transformedPayments: Payment[] = paymentsData.map((payment: any) => ({
        id: payment.id,
        transactionId: payment.stripeSessionId || payment.id,
        courseTitle: payment.course?.title || 'Unknown Course',
        amount: payment.amount,
        currency: payment.currency || 'USD',
        status: payment.status,
        paymentMethod: payment.paymentMethod || 'Card',
        createdAt: new Date(payment.createdAt),
        receipt: payment.receiptUrl
      }));
      
      setPayments(transformedPayments);
    } catch (error) {
      console.error('Failed to load payment history:', error);
      setPayments([]);
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
    <div className="space-y-3">
      {/* Stats Cards - Compact */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Total Spent */}
        <div className="bg-white border border-gray-200 rounded-sm p-2 hover:border-purple-400 transition-colors group">
          <div className="flex items-center justify-between mb-1">
            <div className="p-1 bg-gradient-to-br from-purple-50 to-purple-100 rounded group-hover:from-purple-100 group-hover:to-purple-200 transition-colors">
              <IconCurrencyDollar size={14} className="text-purple-600" />
            </div>
            <span className="text-[8px] text-gray-500 uppercase tracking-wide">Total</span>
          </div>
          <div className="text-base font-bold text-gray-900">${totalSpent.toFixed(2)}</div>
          <div className="text-[9px] text-gray-500">All-time</div>
        </div>

        {/* Successful */}
        <div className="bg-white border border-gray-200 rounded-sm p-2 hover:border-green-400 transition-colors group">
          <div className="flex items-center justify-between mb-1">
            <div className="p-1 bg-gradient-to-br from-green-50 to-green-100 rounded group-hover:from-green-100 group-hover:to-green-200 transition-colors">
              <IconCheck size={14} className="text-green-600" />
            </div>
            <span className="text-[8px] text-gray-500 uppercase tracking-wide">Done</span>
          </div>
          <div className="text-base font-bold text-gray-900">{successfulPayments}</div>
          <div className="text-[9px] text-gray-500">Completed</div>
        </div>

        {/* Pending */}
        <div className="bg-white border border-gray-200 rounded-sm p-2 hover:border-yellow-400 transition-colors group">
          <div className="flex items-center justify-between mb-1">
            <div className="p-1 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded group-hover:from-yellow-100 group-hover:to-yellow-200 transition-colors">
              <IconClock size={14} className="text-yellow-600" />
            </div>
            <span className="text-[8px] text-gray-500 uppercase tracking-wide">Wait</span>
          </div>
          <div className="text-base font-bold text-gray-900">{pendingPayments}</div>
          <div className="text-[9px] text-gray-500">Processing</div>
        </div>

        {/* Failed */}
        <div className="bg-white border border-gray-200 rounded-sm p-2 hover:border-red-400 transition-colors group">
          <div className="flex items-center justify-between mb-1">
            <div className="p-1 bg-gradient-to-br from-red-50 to-red-100 rounded group-hover:from-red-100 group-hover:to-red-200 transition-colors">
              <IconX size={14} className="text-red-600" />
            </div>
            <span className="text-[8px] text-gray-500 uppercase tracking-wide">Failed</span>
          </div>
          <div className="text-base font-bold text-gray-900">{failedPayments}</div>
          <div className="text-[9px] text-gray-500">Unsuccessful</div>
        </div>
      </div>

      {/* Filters - Compact */}
      <div className="bg-white border border-gray-200 rounded-sm p-2">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <IconSearch size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search course or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-28">
            <div className="relative">
              <IconFilter size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All</option>
                <option value="completed">Done</option>
                <option value="pending">Wait</option>
                <option value="failed">Fail</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table - Compact */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-8 text-center">
            <IconReceipt size={32} className="mx-auto text-gray-400 mb-2" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">No payments found</h3>
            <p className="text-xs text-gray-600">
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
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide">
                    Transaction
                  </th>
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide">
                    Course
                  </th>
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide">
                    Method
                  </th>
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className="p-1 bg-purple-100 rounded">
                          <IconReceipt size={12} className="text-purple-600" />
                        </div>
                        <div className="text-[10px] font-medium text-gray-900 truncate max-w-[100px]">
                          {payment.transactionId}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-[10px] text-gray-900 truncate max-w-[150px]">
                        {payment.courseTitle}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-xs font-semibold text-gray-900">
                        ${payment.amount.toFixed(2)}
                      </div>
                      <div className="text-[8px] text-gray-500">{payment.currency}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-[10px] text-gray-900">{payment.paymentMethod}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {payment.status === 'completed' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-green-100 text-green-800">
                          <IconCheck size={10} className="mr-0.5" />
                          Done
                        </span>
                      )}
                      {payment.status === 'pending' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-yellow-100 text-yellow-800">
                          <IconClock size={10} className="mr-0.5" />
                          Wait
                        </span>
                      )}
                      {payment.status === 'failed' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-red-100 text-red-800">
                          <IconX size={10} className="mr-0.5" />
                          Fail
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-[10px] text-gray-900">{formatDate(payment.createdAt)}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {payment.receipt && payment.status === 'completed' && (
                        <button
                          onClick={() => window.open(payment.receipt, '_blank')}
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <IconDownload size={12} />
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
