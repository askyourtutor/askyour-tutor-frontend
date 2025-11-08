import React, { useEffect, useState } from 'react';
import { IconStar } from '@tabler/icons-react';
import type { ApiCourse, CourseReview, CreateReviewRequest } from '../../../types/course.types';
import { getCourseReviews, createReview, updateReview, deleteReview } from '../../../services/reviews.service';
import { useAuth } from '../../../../../shared/contexts/AuthContext';

interface ReviewsTabProps {
  course: ApiCourse;
  renderStars: (rating: number) => React.ReactNode;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ course, renderStars }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState<CreateReviewRequest>({ rating: 5, title: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<CreateReviewRequest>({ rating: 5, title: '', content: '' });
  // Header aggregates (real-time)
  const [headerRating, setHeaderRating] = useState<number>(course.rating ?? 0);
  const [headerCount, setHeaderCount] = useState<number>(typeof course.reviewsCount === 'number' ? course.reviewsCount : 0);
  const [headerBreakdown, setHeaderBreakdown] = useState<Record<number, number> | null>(course.reviewBreakdown ?? null);

  const loadReviews = async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const resp = await getCourseReviews(course.id, pageNum, limit);
      setTotal(resp.pagination.total);
      setHeaderCount(resp.pagination.total);
      setPage(resp.pagination.page);
      setHasMore(resp.pagination.page < resp.pagination.pages);
      
      if (append) {
        setReviews(prev => [...prev, ...resp.data]);
      } else {
        setReviews(resp.data);
      }
    } catch (e) {
      console.error('Failed to load reviews', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load on mount or when course changes
    loadReviews();
    // seed header aggregates from course for first render
    setHeaderRating(course.rating ?? 0);
    setHeaderCount(typeof course.reviewsCount === 'number' ? course.reviewsCount : 0);
    setHeaderBreakdown(course.reviewBreakdown ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id]);

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    try {
      const response = await createReview(course.id, newReview);
      
      // Add new review to local state immediately
      setReviews([response.data, ...reviews]);
      setTotal(prev => prev + 1);
      
      // Update header aggregates in real-time
      if (response.aggregates) {
        setHeaderRating(response.aggregates.avgRating ?? headerRating);
        setHeaderCount(response.aggregates.reviewsCount ?? headerCount);
        setHeaderBreakdown(response.aggregates.reviewBreakdown ?? headerBreakdown);
      }
      
      setNewReview({ rating: 5, title: '', content: '' });
      setShowReviewForm(false);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (r: CourseReview) => {
    setEditingId(r.id);
    setEditDraft({ rating: r.rating, title: r.title || '', content: r.content || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (reviewId: string) => {
    setIsSubmitting(true);
    try {
      const resp = await updateReview(course.id, reviewId, editDraft);
      setReviews(prev => prev.map(r => (r.id === reviewId ? resp.data : r)));
      if (resp.aggregates) {
        setHeaderRating(resp.aggregates.avgRating ?? headerRating);
        setHeaderCount(resp.aggregates.reviewsCount ?? headerCount);
        setHeaderBreakdown(resp.aggregates.reviewBreakdown ?? headerBreakdown);
      }
      setEditingId(null);
    } catch (e) {
      console.error('Failed to update review', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeReview = async (reviewId: string) => {
    try {
      const resp = await deleteReview(course.id, reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      setTotal(prev => Math.max(0, prev - 1));
      
      // Update hasMore based on new total
      const newTotal = total - 1;
      setHasMore(reviews.length - 1 < newTotal);
      
      if (resp.aggregates) {
        setHeaderRating(resp.aggregates.avgRating ?? headerRating);
        setHeaderCount(resp.aggregates.reviewsCount ?? headerCount);
        setHeaderBreakdown(resp.aggregates.reviewBreakdown ?? headerBreakdown);
      }
    } catch (e) {
      console.error('Failed to delete review', e);
    }
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
          <p className="text-xs sm:text-sm text-gray-600">Based on {headerCount} reviews</p>
        </div>
        {/* Only students can write reviews */}
        {user?.role === 'STUDENT' && (
          <button 
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="text-[10px] sm:text-xs md:text-sm text-blue-600 hover:text-blue-700 font-bold bg-blue-50 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-sm hover:bg-blue-100 transition-all border border-blue-200 self-start sm:self-auto"
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        )}
      </div>

      {/* Inline Write Review Form */}
      {showReviewForm && (
        <div className="bg-amber-50 rounded-sm p-3 border border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconStar size={16} className="text-amber-600" />
              <span className="text-sm font-medium text-gray-900">Write a Review</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="hover:scale-105 transition-transform"
                >
                  <IconStar
                    size={16}
                    className={star <= newReview.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <input
            type="text"
            value={newReview.title || ''}
            onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
            placeholder="Review title (optional)"
            className="w-full p-2 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
          />
          
          <textarea
            value={newReview.content || ''}
            onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
            placeholder="Share your thoughts about this course..."
            className="w-full p-2 border border-gray-300 rounded-sm text-sm resize-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            rows={3}
          />
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmitReview}
              disabled={isSubmitting}
              className="bg-amber-600 text-white py-1.5 px-3 rounded-sm text-xs font-medium hover:bg-amber-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              onClick={() => {
                setShowReviewForm(false);
                setNewReview({ rating: 5, title: '', content: '' });
              }}
              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-sm text-xs font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rating Summary */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-sm p-3 sm:p-4 md:p-6 border border-amber-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {/* Overall Rating */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-amber-600 mb-1.5 sm:mb-2">{headerRating.toFixed(1)}</div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Overall Course Rating</p>
          </div>

          {/* Rating Breakdown */}
          {headerBreakdown && (
            <div className="space-y-1.5 sm:space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const percentage = headerBreakdown?.[rating] ?? 0;
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
      <div className="bg-white rounded-sm p-3 sm:p-4 md:p-6 border border-gray-200">
        {total === 0 && !loading && (
          <p className="text-sm text-gray-600">No reviews yet.</p>
        )}
        <div className="space-y-3">
          {reviews.map((r) => {
            const isOwner = user?.id && r.studentId === user.id;
            const isEditing = editingId === r.id;
            return (
              <div key={r.id} className="bg-white rounded-sm border border-gray-200 p-3">
                {!isEditing ? (
                  <>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {renderStars(r.rating)}
                        </div>
                        {r.title && <span className="text-sm font-medium text-gray-900">{r.title}</span>}
                      </div>
                      {isOwner && (
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => startEdit(r)} 
                            className="text-xs text-amber-600 hover:text-amber-700 font-medium px-2 py-1 rounded-sm hover:bg-amber-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => removeReview(r.id)} 
                            className="text-xs text-gray-500 hover:text-red-600 font-medium px-2 py-1 rounded-sm hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {r.content && (
                      <p className="text-sm text-gray-700 mb-2 leading-relaxed">{r.content}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{r.student?.name || 'Student'}</span>
                      <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                  </>
                ) : (
                  <div className="bg-amber-50 rounded-sm p-3 border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconStar size={16} className="text-amber-600" />
                        <span className="text-sm font-medium text-gray-900">Edit Review</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(star => (
                          <button 
                            key={star} 
                            type="button" 
                            className="hover:scale-105 transition-transform" 
                            onClick={() => setEditDraft({ ...editDraft, rating: star })}
                          >
                            <IconStar size={16} className={star <= editDraft.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <input
                      type="text"
                      value={editDraft.title || ''}
                      onChange={(e) => setEditDraft({ ...editDraft, title: e.target.value })}
                      placeholder="Review title (optional)"
                      className="w-full p-2 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    />
                    
                    <textarea
                      value={editDraft.content || ''}
                      onChange={(e) => setEditDraft({ ...editDraft, content: e.target.value })}
                      placeholder="Share your thoughts..."
                      rows={2}
                      className="w-full p-2 border border-gray-300 rounded-sm text-sm resize-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    />

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => saveEdit(r.id)} 
                        disabled={isSubmitting} 
                        className="bg-amber-600 text-white py-1.5 px-3 rounded-sm text-xs font-medium hover:bg-amber-700 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        onClick={cancelEdit} 
                        className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-sm text-xs font-medium hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Load More Button */}
        {hasMore && (
          <div className="text-center pt-4">
            <button
              onClick={() => loadReviews(page + 1, true)}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-sm font-medium hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm border border-amber-300"
            >
              {loading ? 'Loading...' : 'Load More Reviews'}
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default ReviewsTab;
