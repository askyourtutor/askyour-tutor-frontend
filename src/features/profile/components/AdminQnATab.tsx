import { useState, useEffect } from 'react';
import { 
  IconMessageCircle, 
  IconSearch, 
  IconFilter,
  IconClock,
  IconCheck,
  IconUser,
  IconMail,
  IconBook,
  IconChevronDown,
  IconChevronUp
} from '@tabler/icons-react';
import tutorDashboardService, { type TutorQuestion } from '../../../shared/services/tutorDashboardService';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';

const AdminQnATab: React.FC = () => {
  const [questions, setQuestions] = useState<TutorQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'PENDING' | 'ANSWERED'>('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    answered: 0
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const allQuestions = await tutorDashboardService.getQuestions();
      setQuestions(allQuestions);
      
      // Calculate stats
      const pending = allQuestions.filter(q => q.status === 'PENDING').length;
      const answered = allQuestions.filter(q => q.status === 'ANSWERED').length;
      setStats({
        total: allQuestions.length,
        pending,
        answered
      });
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerQuestion = async (questionId: string, answer: string) => {
    try {
      await tutorDashboardService.answerQuestion(questionId, answer);
      // Refresh questions
      await loadQuestions();
    } catch (error) {
      console.error('Error answering question:', error);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || q.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading questions..." />;
  }

  return (
    <div className="space-y-4 p-3 sm:p-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-sm border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Total Questions</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-sm flex items-center justify-center">
              <IconMessageCircle size={20} className="text-blue-600 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-600 mt-1">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-sm flex items-center justify-center">
              <IconClock size={20} className="text-orange-600 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Answered</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">{stats.answered}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-sm flex items-center justify-center">
              <IconCheck size={20} className="text-green-600 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-sm border border-gray-200 p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <IconSearch size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <IconFilter size={16} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'PENDING' | 'ANSWERED')}
              className="px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ANSWERED">Answered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-sm border border-gray-200">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <IconMessageCircle size={48} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Questions Found</h3>
            <p className="text-sm text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No questions have been asked yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                onAnswer={handleAnswerQuestion}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface QuestionCardProps {
  question: TutorQuestion;
  onAnswer: (questionId: string, answer: string) => Promise<void>;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onAnswer(question.id, answerText);
      setIsAnswering(false);
      setAnswerText('');
      setIsExpanded(false);
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="hover:bg-gray-50 transition-colors">
      {/* Main Row - Always Visible */}
      <div 
        className="p-3 sm:p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <IconUser size={18} className="text-purple-600 sm:w-5 sm:h-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                  {question.studentName}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                  {question.question}
                </p>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-sm font-medium ${
                  question.status === 'PENDING' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {question.status === 'PENDING' ? 'Pending' : 'Answered'}
                </span>
                {isExpanded ? (
                  <IconChevronUp size={18} className="text-gray-400" />
                ) : (
                  <IconChevronDown size={18} className="text-gray-400" />
                )}
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <IconClock size={12} />
                Asked {new Date(question.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric'
                })}
              </span>
              {question.status === 'ANSWERED' && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <IconCheck size={12} />
                    {question.answer ? `View ${question.answer.split(' ').length > 20 ? '1' : '1'} Answer` : 'View Answer'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-100">
          <div className="pt-3 sm:pt-4 space-y-3">
            {/* Full Question Details */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <IconMail size={14} className="text-gray-400" />
                  {question.studentEmail}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <IconBook size={14} className="text-gray-400" />
                  {question.courseName}
                </span>
                {question.subject && (
                  <>
                    <span>•</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-sm font-medium">
                      {question.subject}
                    </span>
                  </>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-sm p-3 border border-gray-200">
                <p className="text-xs sm:text-sm text-gray-500 font-medium mb-1">Question:</p>
                <p className="text-sm sm:text-base text-gray-900 leading-relaxed">{question.question}</p>
              </div>
            </div>

            {/* Answer Section */}
            {question.answer ? (
              <div className="bg-green-50 border border-green-200 rounded-sm p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-semibold text-green-900 flex items-center gap-1.5">
                    <IconCheck size={16} />
                    Answer
                  </p>
                  {question.answeredAt && (
                    <p className="text-xs text-green-700">
                      {new Date(question.answeredAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">{question.answer}</p>
              </div>
            ) : isAnswering ? (
              <div className="border border-gray-200 rounded-sm p-3 space-y-3">
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Write your answer here..."
                  className="w-full p-3 text-sm border border-gray-300 rounded-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubmitAnswer();
                    }}
                    disabled={!answerText.trim() || isSubmitting}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600 text-white rounded-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-xs sm:text-sm transition-colors"
                  >
                    {isSubmitting ? 'Submitting...' : 'Reply'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAnswering(false);
                      setAnswerText('');
                    }}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 font-medium text-xs sm:text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAnswering(true);
                }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600 text-white rounded-sm hover:bg-purple-700 font-medium text-xs sm:text-sm transition-colors flex items-center gap-1.5"
              >
                <IconMessageCircle size={16} />
                Reply
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQnATab;
