import { useSearchParams, Link, useNavigate } from 'react-router';
import { IconX, IconArrowLeft, IconBook } from '@tabler/icons-react';

const PaymentCancelPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get('course_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Cancel Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Cancel Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-12 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <IconX size={48} className="text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">Payment Cancelled</h1>
            <p className="text-red-100 text-lg">Your enrollment was not completed</p>
          </div>

          {/* Cancel Body */}
          <div className="px-8 py-10">
            <div className="text-center mb-8">
              <p className="text-gray-600 text-lg mb-6">
                No charges have been made to your account. You can return to the course page and try again whenever you're ready.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Why Enroll?</h3>
                <ul className="text-left space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <IconBook size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Get lifetime access to all course materials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <IconBook size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Learn at your own pace, anytime, anywhere</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <IconBook size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Download resources and study materials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <IconBook size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>30-day money-back guarantee</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                {courseId ? (
                  <>
                    <button
                      onClick={() => navigate(`/course/${courseId}`)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <IconArrowLeft size={24} />
                      Return to Course
                    </button>
                    
                    <button
                      onClick={() => navigate(`/checkout/${courseId}`)}
                      className="w-full border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200"
                    >
                      Try Again
                    </button>
                  </>
                ) : (
                  <Link
                    to="/courses"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <IconBook size={24} />
                    Browse Courses
                  </Link>
                )}
              </div>
            </div>

            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                Have questions about the course or payment?
              </p>
              <a 
                href="mailto:support@askyourtutor.com" 
                className="text-blue-600 hover:underline font-medium text-sm"
              >
                Contact our support team
              </a>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-6 text-center space-y-3">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <IconArrowLeft size={20} />
            <span className="font-medium">Explore other courses</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
