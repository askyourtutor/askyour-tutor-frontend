import React, { useState } from 'react';
import { IconMessageCircle, IconChevronDown, IconUser, IconClock, IconArrowRight } from '@tabler/icons-react';
import type { CourseQuestion } from '../../../types/course.types';
import { createQuestion, createAnswer, listAllQuestions } from '../../../services/qna.service';

interface QnATabProps {
  questions: CourseQuestion[];
  courseId: string;
}

const QnATab: React.FC<QnATabProps> = ({ questions, courseId }) => {
  const [showAskForm, setShowAskForm] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [localQuestions, setLocalQuestions] = useState<CourseQuestion[]>(questions);
  const [visibleCount, setVisibleCount] = useState<number>(5);
  // Removed voting; keep UI simple

  // Update local questions when props change
  React.useEffect(() => {
    let cancelled = false;
    async function loadAll() {
      try {
        if (!courseId) return;
        const res = await listAllQuestions(courseId);
        if (!cancelled && res?.data && Array.isArray(res.data)) {
          setLocalQuestions(res.data as CourseQuestion[]);
          setVisibleCount(5);
          return;
        }
      } catch {
        /* ignore and fallback */
      }
      // fallback to preview questions prop
      if (!cancelled) {
        setLocalQuestions(questions);
        setVisibleCount(5);
      }
    }
    loadAll();
    return () => { cancelled = true; };
  }, [courseId, questions]);

  const handleAskQuestion = async () => {
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await createQuestion(courseId, {
        title: newQuestion.title.trim(),
        content: newQuestion.content.trim(),
      });
      
      // Add new question to local state immediately
      const newQ: CourseQuestion = {
        id: response.data.id,
        title: response.data.title,
        content: response.data.content,
        tags: [],
        answers: [],
        createdAt: response.data.createdAt,
      };
      setLocalQuestions([newQ, ...localQuestions]);
      setVisibleCount((c) => Math.max(5, Math.min(c + 1, localQuestions.length + 1)));
      
      setNewQuestion({ title: '', content: '' });
      setShowAskForm(false);
    } catch (error) {
      console.error('Failed to submit question:', error);
      alert('Failed to post question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Voting removed

  const handleReply = async (questionId: string) => {
    if (!replyContent.trim()) return;
    
    try {
      const response = await createAnswer(courseId, questionId, {
        content: replyContent.trim(),
      });
      
      // Add new answer to local state immediately
      setLocalQuestions(prev => prev.map(q => {
        if (q.id === questionId) {
          const newAnswer = {
            id: response.data.id,
            authorName: 'Tutor',
            content: response.data.content,
            createdAt: response.data.createdAt,
          };
          return {
            ...q,
            answers: [...(q.answers || []), newAnswer],
          };
        }
        return q;
      }));
      
      setReplyContent('');
      setReplyingTo(null);
      
      // Auto-expand the question to show the new answer
      setExpandedQuestions(prev => {
        const newSet = new Set(prev);
        newSet.add(questionId);
        return newSet;
      });
    } catch (error) {
      console.error('Failed to reply:', error);
      alert('Failed to post answer. Please try again.');
    }
  };

  const toggleExpanded = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Q&A Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-purple-100 rounded-sm flex items-center justify-center">
            <IconMessageCircle size={16} className="sm:w-[18px] sm:h-[18px] md:w-6 md:h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Student Q&A</h3>
            <p className="text-xs sm:text-sm text-gray-600">Ask questions and get help from peers and the tutor</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowAskForm(!showAskForm)}
            className="text-[10px] sm:text-xs md:text-sm text-purple-600 hover:text-purple-700 font-bold bg-purple-50 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-sm hover:bg-purple-100 transition-all border border-purple-200"
          >
            {showAskForm ? 'Cancel' : 'Ask a Question'}
          </button>
          <button className="text-[10px] sm:text-xs md:text-sm text-gray-700 hover:text-gray-900 font-semibold border border-gray-300 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-sm bg-white">
            Sort: Top
          </button>
        </div>
      </div>

      {/* Inline Ask Question Form */}
      {showAskForm && (
        <div className="bg-white rounded-sm p-4 sm:p-5 border border-purple-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <IconMessageCircle size={16} className="text-purple-600" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm sm:text-base">Ask a New Question</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Title
              </label>
              <input
                type="text"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                placeholder="What's your question about?"
                className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Details
              </label>
              <textarea
                value={newQuestion.content}
                onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                placeholder="Provide more details about your question..."
                className="w-full p-3 border border-gray-300 rounded-sm text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={4}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleAskQuestion}
              disabled={!newQuestion.title.trim() || !newQuestion.content.trim() || isSubmitting}
              className="bg-purple-600 text-white py-2 px-4 rounded-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? 'Posting...' : 'Post Question'}
            </button>
            <button
              onClick={() => {
                setShowAskForm(false);
                setNewQuestion({ title: '', content: '' });
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-sm font-medium hover:bg-gray-100 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Questions List (API-driven) */}
      {localQuestions.length === 0 ? (
        <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconMessageCircle size={32} className="text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions yet</h3>
          <p className="text-gray-600 mb-4">Be the first to ask a question and help build this learning community!</p>
          <button 
            onClick={() => setShowAskForm(true)}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-all"
          >
            <IconArrowRight size={16} />
            Ask the First Question
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {localQuestions.slice(0, visibleCount).map((q) => (
            <div key={q.id} className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200">
              {/* Question Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <IconUser size={14} className="sm:w-4 sm:h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1.5 hover:text-purple-600 cursor-pointer leading-tight">
                    {q.title}
                  </h4>
                  {q.content && (
                    <p className="text-xs sm:text-sm text-gray-700 mb-2.5 leading-relaxed">{q.content}</p>
                  )}
                  
                  {/* Question Meta */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2.5">
                    <div className="flex items-center gap-1">
                      <IconClock size={12} />
                      <span>Asked recently</span>
                    </div>
                    {q.tags && q.tags.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        {q.tags.map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full font-medium text-xs">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button 
                      onClick={() => toggleExpanded(q.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md font-medium text-xs sm:text-sm transition-all duration-200 ${
                        expandedQuestions.has(q.id) 
                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'
                      }`}
                    >
                      <IconMessageCircle size={14} />
                      <span className="hidden xs:inline">{expandedQuestions.has(q.id) ? 'Hide' : 'View'} {q.answers?.length ?? 0} {q.answers && q.answers.length === 1 ? 'Answer' : 'Answers'}</span>
                      <span className="xs:hidden">{q.answers?.length ?? 0}</span>
                      <IconChevronDown size={12} className={`transition-transform ${expandedQuestions.has(q.id) ? 'rotate-180' : ''}`} />
                    </button>
                    <button 
                      onClick={() => setReplyingTo(replyingTo === q.id ? null : q.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-purple-600 text-white rounded-md font-medium text-xs sm:text-sm hover:bg-purple-700 transition-all duration-200"
                    >
                      <IconArrowRight size={12} />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              </div>
                  
              {/* Expanded Answers */}
              {expandedQuestions.has(q.id) && q.answers && q.answers.length > 0 && (
                <div className="mt-4 pl-4 sm:pl-5 border-l-2 border-purple-200 space-y-2.5">
                  <h5 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2">Answers ({q.answers.length})</h5>
                  {q.answers.map((answer) => (
                    <div key={answer.id} className="bg-gradient-to-r from-purple-50 to-purple-25 rounded-lg p-3 border border-purple-100">
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-white">T</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <p className="text-xs sm:text-sm font-semibold text-gray-900">{answer.authorName}</p>
                            <span className="text-xs text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-full font-medium">Tutor</span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{answer.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Reply Form */}
              {replyingTo === q.id && (
                <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-gray-25 rounded-lg border border-gray-200">
                  <h5 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2">Write your answer</h5>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Share your knowledge and help other students..."
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    rows={3}
                  />
                  <div className="flex items-center gap-2 mt-2.5">
                    <button
                      onClick={() => handleReply(q.id)}
                      disabled={!replyContent.trim()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <IconArrowRight size={12} />
                      Post Answer
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent('');
                      }}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-100 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < localQuestions.length && (
        <div className="text-center pt-4">
          <button
            onClick={() => setVisibleCount((c) => Math.min(c + 5, localQuestions.length))}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 px-4 py-2 rounded-lg font-medium text-xs sm:text-sm hover:from-purple-100 hover:to-purple-200 transition-all border border-purple-200 shadow-sm hover:shadow-md"
          >
            <span>Load More Questions</span>
            <IconChevronDown size={14} />
          </button>
        </div>
      )}
      
    </div>
  );
};

export default QnATab;
