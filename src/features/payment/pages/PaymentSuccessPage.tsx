import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { IconCheck, IconBook } from '@tabler/icons-react';
import { verifyPayment } from '../../courses/services/payment.service';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [enrollmentData, setEnrollmentData] = useState<{
    courseId: string;
    message: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setError('Invalid payment session');
      setIsVerifying(false);
      return;
    }

    const verify = async () => {
      try {
        setIsVerifying(true);
        const result = await verifyPayment(sessionId);
        
        if (result.success && result.enrolled) {
          setEnrollmentData({
            courseId: result.courseId,
            message: result.message,
          });
        } else {
          setError('Payment verification failed');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('Failed to verify payment. Please contact support.');
      } finally {
        setIsVerifying(false);
      }
    };

    verify();
  }, [searchParams]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-green-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we confirm your enrollment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-200 p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Verification Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link
              to="/courses"
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200"
            >
              Browse Courses
            </Link>
            <a
              href="mailto:support@askyourtutor.com"
              className="block w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-gray-50 flex items-center justify-center px-3 sm:px-4 py-4">
      <div className="max-w-lg w-full">
        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-md border border-green-200 overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 sm:px-6 py-4 sm:py-5 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-2.5 sm:mb-3">
              <IconCheck size={24} className="sm:w-7 sm:h-7 text-green-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 !text-white">Payment Successful</h1>
            <p className="text-green-50 text-xs sm:text-sm !text-green-50">You're enrolled in the course</p>
          </div>

          {/* Success Body */}
          <div className="px-4 sm:px-6 py-4">
            <p className="text-gray-600 text-xs sm:text-sm text-center mb-4">
              Your enrollment is confirmed. You now have lifetime access to all course materials.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-xs sm:text-sm">What's Next?</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-700 text-xs">
                <li className="flex items-start gap-2">
                  <IconCheck size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Access all lessons and materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Track your learning progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Download resources and materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Get support from instructors</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => enrollmentData?.courseId && navigate(`/course/${enrollmentData.courseId}`)}
                className="w-full bg-green-600 text-white px-4 py-2 sm:py-2.5 rounded-lg font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm"
              >
                <IconBook size={16} />
                Start Learning
              </button>
              
              <Link
                to="/student/dashboard"
                className="block w-full border border-green-300 text-green-700 px-4 py-2 sm:py-2.5 rounded-lg font-medium hover:bg-green-50 transition-all text-center text-xs sm:text-sm"
              >
                Go to Dashboard
              </Link>
            </div>

            <div className="text-center pt-3 mt-3 border-t border-gray-200">
              <p className="text-[10px] sm:text-xs text-gray-500">
                Confirmation email sent to your address
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-3 text-center">
          <p className="text-gray-600 text-[10px] sm:text-xs">
            Need help? <a href="mailto:support@askyourtutor.com" className="text-green-600 hover:underline font-medium">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
