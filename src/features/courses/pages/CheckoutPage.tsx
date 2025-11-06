import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { 
  IconArrowLeft, 
  IconBook, 
  IconClock, 
  IconUsers, 
  IconShieldCheck,
  IconCreditCard,
  IconLock
} from '@tabler/icons-react';
import { getCourseById } from '../services/course.service';
import { createCheckoutSession } from '../services/payment.service';
import type { ApiCourse } from '../types/course.types';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { getAvatarUrl } from '../../../shared/utils/url';

const CheckoutPage = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const loadCourse = async () => {
      if (!courseId) return;
      try {
        setIsLoading(true);
        const data = await getCourseById(courseId);
        if (data) {
          setCourse(data);
        } else {
          setError('Course not found');
        }
      } catch (err) {
        console.error('Failed to load course:', err);
        setError('Failed to load course details');
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseId, user, navigate]);

  const handleCheckout = async () => {
    if (!courseId || !course) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { sessionUrl } = await createCheckoutSession(courseId);
      // Redirect to Stripe checkout
      window.location.href = sessionUrl;
    } catch (err) {
      console.error('Checkout failed:', err);
      setError('Failed to initiate checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <IconBook size={40} className="text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Something went wrong</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <IconArrowLeft size={20} />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const totalDuration = course.lessons.reduce((sum, l) => sum + (l.duration || 0), 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors text-sm font-medium"
          >
            <IconArrowLeft size={18} />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Left Column - Course Details */}
          <div className="lg:col-span-3">
            
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
              <p className="text-gray-600 text-sm">Review your order and complete payment</p>
            </div>

            {/* Course Card */}
            <div className="mb-8">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Course Details</h2>
              <div className="border border-gray-200 rounded-sm p-5">
                <div className="flex gap-5">
                  <img
                    src={course.image || '/assets/img/course/default.jpg'}
                    alt={course.title}
                    className="w-24 h-24 rounded-sm object-cover flex-shrink-0 bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <IconBook size={14} className="text-blue-600" />
                        {course.lessons.length} Lessons
                      </span>
                      <span className="flex items-center gap-1.5">
                        <IconClock size={14} className="text-green-600" />
                        {totalDuration} Min
                      </span>
                      {course.studentsCount && (
                        <span className="flex items-center gap-1.5">
                          <IconUsers size={14} className="text-purple-600" />
                          {course.studentsCount.toLocaleString()} Students
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructor */}
            <div className="mb-8">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Instructor</h2>
              <div className="border border-gray-200 rounded-sm p-5">
                <div className="flex items-center gap-4">
                  <img
                    src={getAvatarUrl(course.tutor.avatar)}
                    alt={course.tutor.name}
                    className="w-14 h-14 rounded-sm object-cover bg-gray-100"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{course.tutor.name}</h3>
                    <p className="text-sm text-gray-500">Course Instructor</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="mb-8">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">What's Included</h2>
              <div className="border border-gray-200 rounded-sm p-5">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <IconShieldCheck size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Lifetime Access</p>
                      <p className="text-xs text-gray-500 mt-0.5">Learn at your own pace, anytime</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <IconShieldCheck size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">All Course Materials</p>
                      <p className="text-xs text-gray-500 mt-0.5">Videos, resources, and downloads</p>
                    </div>
                  </div>
                  {course.certificateAvailable && (
                    <div className="flex items-start gap-3">
                      <IconShieldCheck size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Certificate of Completion</p>
                        <p className="text-xs text-gray-500 mt-0.5">Earn your certificate</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-sm border border-blue-100">
              <IconLock size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900">
                Secure payment processing powered by Stripe. Your payment information is encrypted and never stored.
              </p>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Order Summary</h2>
              
              <div className="border border-gray-200 rounded-sm">
                {/* Price Breakdown */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Course Price</span>
                    <span className="text-sm font-medium text-gray-900">${course.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-blue-600">${course.price.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">One-time payment · No subscription</p>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="px-6 pb-4">
                    <div className="p-3 bg-red-50 rounded-sm border border-red-100">
                      <p className="text-xs text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* Payment Button */}
                <div className="p-6 pt-0">
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white px-6 py-4 rounded-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <IconCreditCard size={18} />
                        Continue to Payment
                      </>
                    )}
                  </button>
                </div>

                {/* Footer Info */}
                <div className="px-6 pb-6 pt-2 border-t border-gray-200">
                  <div className="space-y-2 text-center">
                    <p className="text-xs text-gray-600 font-medium">30-day money-back guarantee</p>
                    <p className="text-xs text-gray-400">Powered by Stripe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
