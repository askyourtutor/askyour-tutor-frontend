import React, { useState } from 'react';
import { IconThumbUp, IconThumbDown, IconMessageCircle, IconChevronDown } from '@tabler/icons-react';
import type { CourseQuestion } from '../../../types/course.types';
import { createQuestion, createAnswer, voteOnQuestion } from '../../../services/qna.service';

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
  const [userVotes, setUserVotes] = useState<Record<string, 1 | -1>>({}); // Track user's votes per question

  // Update local questions when props change
  React.useEffect(() => {
    setLocalQuestions(questions);
  }, [questions]);

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
        votes: 0,
        answers: [],
        createdAt: response.data.createdAt,
      };
      setLocalQuestions([newQ, ...localQuestions]);
      
      setNewQuestion({ title: '', content: '' });
      setShowAskForm(false);
    } catch (error) {
      console.error('Failed to submit question:', error);
      alert('Failed to post question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (questionId: string, value: 1 | -1) => {
    const currentVote = userVotes[questionId];
    
    // Determine the new vote state
    let newVote: 1 | -1 | null = value;
    let voteDelta = value;
    
    if (currentVote === value) {
      // Clicking same vote again = remove vote
      newVote = null;
      voteDelta = (value === 1 ? -1 : 1) as 1 | -1; // Reverse the vote
    } else if (currentVote) {
      // Switching from upvote to downvote or vice versa
      voteDelta = (value === 1 ? 2 : -2) as 1 | -1; // e.g., switching from down to up = +2
    }
    
    try {
      await voteOnQuestion(courseId, questionId, { value });
      
      // Update local vote tracking
      setUserVotes(prev => {
        const updated = { ...prev };
        if (newVote === null) {
          delete updated[questionId];
        } else {
          updated[questionId] = newVote;
        }
        return updated;
      });
      
      // Update vote count in local state
      setLocalQuestions(prev => prev.map(q => 
        q.id === questionId 
          ? { ...q, votes: (q.votes ?? 0) + voteDelta }
          : q
      ));
    } catch (error) {
      console.error('Failed to vote:', error);
      alert('Failed to vote. Please try again.');
    }
  };

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
        <div className="bg-white rounded-sm p-6 border border-gray-200 text-center text-gray-600">
          No questions yet. Be the first to ask!
        </div>
      ) : (
        <div className="space-y-3">
          {localQuestions.map((q) => (
            <div key={q.id} className="bg-white rounded-sm p-4 sm:p-5 border border-gray-200 hover:border-purple-200 transition-all">
              <div className="flex gap-4">
                {/* Vote Section */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <button 
                    onClick={() => handleVote(q.id, 1)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-sm flex items-center justify-center transition-colors ${
                      userVotes[q.id] === 1 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-gray-100 hover:bg-purple-100 text-gray-600'
                    }`}
                    title="Like"
                  >
                    <IconThumbUp size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  <span className={`text-lg font-bold ${
                    (q.votes ?? 0) > 0 ? 'text-purple-600' : 
                    (q.votes ?? 0) < 0 ? 'text-red-600' : 
                    'text-gray-900'
                  }`}>
                    {q.votes ?? 0}
                  </span>
                  <button 
                    onClick={() => handleVote(q.id, -1)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-sm flex items-center justify-center transition-colors ${
                      userVotes[q.id] === -1 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-gray-100 hover:bg-red-100 text-gray-600'
                    }`}
                    title="Dislike"
                  >
                    <IconThumbDown size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1.5 hover:text-purple-600 cursor-pointer">
                    {q.title}
                  </h4>
                  {q.content && (
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">{q.content}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      {q.tags?.map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-sm font-semibold">
                          {t}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => toggleExpanded(q.id)}
                      className="text-[10px] sm:text-xs text-purple-600 hover:text-purple-700 font-semibold"
                    >
                      {expandedQuestions.has(q.id) ? 'Hide' : 'View'} {q.answers?.length ?? 0} {q.answers && q.answers.length === 1 ? 'answer' : 'answers'} →
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                    <button 
                      onClick={() => toggleExpanded(q.id)}
                      className={`hover:text-purple-600 transition-colors font-medium text-[10px] sm:text-xs ${
                        expandedQuestions.has(q.id) ? 'text-purple-600' : ''
                      }`}
                    >
                      <IconMessageCircle size={14} className="inline mr-1" />
                      {expandedQuestions.has(q.id) ? 'Hide' : 'Show'} {q.answers?.length ?? 0} {q.answers && q.answers.length === 1 ? 'Answer' : 'Answers'}
                    </button>
                    <button 
                      onClick={() => setReplyingTo(replyingTo === q.id ? null : q.id)}
                      className="hover:text-purple-600 transition-colors font-medium text-[10px] sm:text-xs"
                    >
                      Reply
                    </button>
                  </div>
                  
                  {/* Expanded Answers */}
                  {expandedQuestions.has(q.id) && q.answers && q.answers.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-purple-100 space-y-3">
                      {q.answers.map((answer) => (
                        <div key={answer.id} className="bg-gray-50 rounded-sm p-3">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-semibold text-purple-600">T</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-900 mb-1">{answer.authorName}</p>
                              <p className="text-sm text-gray-700">{answer.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Reply Form */}
                  {replyingTo === q.id && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-sm border border-gray-200">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write your answer..."
                        className="w-full p-2 border border-gray-300 rounded-sm text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleReply(q.id)}
                          disabled={!replyContent.trim()}
                          className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Post Answer
                        </button>
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                          className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded-sm hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      <div className="text-center pt-3 sm:pt-4">
        <button className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-sm font-bold text-[11px] sm:text-xs md:text-sm hover:from-purple-200 hover:to-purple-300 transition-all border border-purple-300 shadow-sm hover:shadow-md">
          <span>Load More Questions</span>
          <IconChevronDown size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div>
      
    </div>
  );
};

export default QnATab;
