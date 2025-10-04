import React, { useState } from 'react';
import { IconStar, IconChevronDown, IconUser, IconShieldCheck } from '@tabler/icons-react';
import type { ApiCourse, CourseReview, CreateReviewRequest } from '../../../types/course.types';
import { useAuth } from '../../../../../shared/contexts/AuthContext';
import { getCourseReviews, createReview } from '../../../services/reviews.service';

interface ReviewsTabProps {
  course: ApiCourse;
  renderStars: (rating: number) => React.ReactNode;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ course, renderStars }) => {
  const { user } = useAuth();
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [allReviews, setAllReviews] = useState<CourseReview[]>(course.reviews || []);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newReview, setNewReview] = useState<CreateReviewRequest>({
    rating: 5,
    title: '',
    content: ''
  });

  // Check if user can write a review (enrolled student who hasn't reviewed yet)
  const canWriteReview = user?.role === 'STUDENT' && !allReviews.some(r => r.studentId === user.id);

  const handleWriteReview = () => {
    if (!user) {
      // Could redirect to login or show message
      return;
    }
    setShowWriteForm(true);
  };

  const handleSubmitReview = async () => {
    if (!newReview.rating || !course.id) return;
    
    setIsSubmitting(true);
    try {
      const response = await createReview(course.id, newReview);
      
      // Add new review to the top of the list
      setAllReviews([response.data, ...allReviews]);
      
      // Reset form and close form
      setNewReview({ rating: 5, title: '', content: '' });
      setShowWriteForm(false);
      
      // Optionally show success message
    } catch (error) {
      console.error('Failed to submit review:', error);
      // Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadMoreReviews = async () => {
    if (isLoadingMore || !hasMoreReviews) return;
    
    setIsLoadingMore(true);
    try {
      const response = await getCourseReviews(course.id, currentPage + 1, 10);
      
      if (response.data.length === 0) {
        setHasMoreReviews(false);
      } else {
        setAllReviews([...allReviews, ...response.data]);
        setCurrentPage(currentPage + 1);
        setHasMoreReviews(response.pagination.page < response.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to load more reviews:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 animate-fadeIn">
      {/* Reviews Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 md:gap-0">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-amber-100 rounded-sm flex items-center justify-center">
              <IconStar size={16} className="sm:w-[18px] sm:h-[18px] md:w-6 md:h-6 text-amber-600" />
            </div>
            <span>Student Reviews</span>
          </h3>
          {typeof course.reviewsCount === 'number' && (
            <p className="text-xs sm:text-sm text-gray-600">Based on {course.reviewsCount} reviews</p>
          )}
        </div>
        {canWriteReview && (
          <button 
            onClick={handleWriteReview}
            className="text-[10px] sm:text-xs md:text-sm text-blue-600 hover:text-blue-700 font-bold bg-blue-50 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-sm hover:bg-blue-100 transition-all border border-blue-200 self-start sm:self-auto"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Rating Summary */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-sm p-3 sm:p-4 md:p-6 border border-amber-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {/* Overall Rating */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-amber-600 mb-1.5 sm:mb-2">{course.rating.toFixed(1)}</div>
            <div className="flex items-center gap-1 mb-2">{renderStars(course.rating)}</div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Overall Course Rating</p>
          </div>

          {/* Rating Breakdown */}
          {course.reviewBreakdown && (
            <div className="space-y-1.5 sm:space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const percentage = course.reviewBreakdown?.[rating] ?? 0;
                return (
                  <div key={rating} className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-0.5 sm:gap-1 w-12 sm:w-14 md:w-16">
                      <span className="text-xs sm:text-sm font-semibold text-gray-700">{rating}</span>
                      <IconStar size={12} className="sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-500" />
                    </div>
                    <div className="flex-1 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="text-xs text-gray-600 font-medium w-8 text-right">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Reviews List */}
      {allReviews.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900">Recent Reviews</h4>
          <div className="space-y-4">
            {allReviews.map((review) => (
              <div key={review.id} className="bg-white border border-gray-200 rounded-sm p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Student Avatar */}
                  <div className="flex-shrink-0">
                    {review.studentAvatar ? (
                      <img 
                        src={review.studentAvatar} 
                        alt={review.studentName}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <IconUser size={20} className="text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-semibold text-gray-900 text-sm sm:text-base">
                            {review.studentName}
                          </h5>
                          {review.isVerified && (
                            <IconShieldCheck size={16} className="text-green-600" title="Verified Student" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {review.title && (
                      <h6 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                        {review.title}
                      </h6>
                    )}

                    {review.content && (
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                        {review.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write Review Form (Inline) */}
      {showWriteForm && (
        <div className="bg-blue-50 rounded-sm p-4 sm:p-5 md:p-6 border border-blue-100 animate-fadeIn">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-5">Write a Review</h4>
          
          <div className="space-y-4 sm:space-y-5">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Rating *
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="transition-all hover:scale-110"
                    type="button"
                  >
                    <IconStar 
                      size={28}
                      className={star <= newReview.rating 
                        ? 'text-amber-400 fill-amber-400' 
                        : 'text-gray-300 hover:text-amber-300'
                      }
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {newReview.rating} star{newReview.rating !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Review Title (Optional)
              </label>
              <input
                type="text"
                value={newReview.title || ''}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                placeholder="Summarize your experience..."
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={100}
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Review Content (Optional)
              </label>
              <textarea
                value={newReview.content || ''}
                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                placeholder="Share your detailed experience with this course..."
                rows={5}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1.5">
                {(newReview.content || '').length}/500 characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowWriteForm(false)}
                type="button"
                className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={isSubmitting || !newReview.rating}
                type="button"
                className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {hasMoreReviews && (
        <div className="text-center pt-3 sm:pt-4">
          <button 
            onClick={loadMoreReviews}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-sm font-bold text-[11px] sm:text-xs md:text-sm hover:from-gray-200 hover:to-gray-300 transition-all border border-gray-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isLoadingMore ? 'Loading...' : 'Load More Reviews'}</span>
            {!isLoadingMore && <IconChevronDown size={14} className="sm:w-4 sm:h-4" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
