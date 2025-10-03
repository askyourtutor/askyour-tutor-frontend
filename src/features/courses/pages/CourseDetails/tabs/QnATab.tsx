import React from 'react';
import { IconChevronDown, IconChevronUp, IconMessageCircle } from '@tabler/icons-react';
import type { CourseQuestion } from '../../../types/course.types';

interface QnATabProps {
  questions: CourseQuestion[];
}

const QnATab: React.FC<QnATabProps> = ({ questions }) => {
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
          <button className="text-[10px] sm:text-xs md:text-sm text-purple-600 hover:text-purple-700 font-bold bg-purple-50 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-sm hover:bg-purple-100 transition-all border border-purple-200">
            Ask a Question
          </button>
          <button className="text-[10px] sm:text-xs md:text-sm text-gray-700 hover:text-gray-900 font-semibold border border-gray-300 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-sm bg-white">
            Sort: Top
          </button>
        </div>
      </div>

      {/* Questions List (API-driven) */}
      {questions.length === 0 ? (
        <div className="bg-white rounded-sm p-6 border border-gray-200 text-center text-gray-600">
          No questions yet. Be the first to ask!
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <div key={q.id} className="bg-white rounded-sm p-4 sm:p-5 border border-gray-200 hover:border-purple-200 transition-all">
              <div className="flex gap-4">
                {/* Vote Section */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-gray-100 hover:bg-purple-100 flex items-center justify-center transition-colors">
                    <IconChevronUp size={16} className="sm:w-[18px] sm:h-[18px] text-gray-600" />
                  </button>
                  <span className="text-lg font-bold text-gray-900">{q.votes ?? 0}</span>
                  <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-gray-100 hover:bg-purple-100 flex items-center justify-center transition-colors">
                    <IconChevronDown size={16} className="sm:w-[18px] sm:h-[18px] text-gray-600" />
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
                    <button className="text-[10px] sm:text-xs text-purple-600 hover:text-purple-700 font-semibold">
                      View {q.answers?.length ?? 0} {q.answers && q.answers.length === 1 ? 'answer' : 'answers'} →
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                    <button className="hover:text-purple-600 transition-colors font-medium text-[10px] sm:text-xs">
                      <IconMessageCircle size={14} className="inline mr-1" />
                      {q.answers?.length ?? 0} {q.answers && q.answers.length === 1 ? 'Answer' : 'Answers'}
                    </button>
                    <button className="hover:text-purple-600 transition-colors font-medium text-[10px] sm:text-xs">Reply</button>
                  </div>
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
