import { useState, useEffect } from 'react';
import { 
  IconMessageCircle, 
  IconSearch, 
  IconFilter,
  IconClock,
  IconCheck,
  IconAlertCircle
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Questions & Answers</h2>
          <p className="text-sm text-gray-600 mt-1">Manage student questions across all courses</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Questions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-sm flex items-center justify-center">
              <IconMessageCircle size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-sm flex items-center justify-center">
              <IconClock size={24} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Answered</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.answered}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-sm flex items-center justify-center">
              <IconCheck size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <IconSearch size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions, students, courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <IconFilter size={18} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'PENDING' | 'ANSWERED')}
              className="px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Questions Found</h3>
            <p className="text-gray-600">
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
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-700">
                  {question.studentName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{question.studentName}</p>
                <p className="text-xs text-gray-500">{question.studentEmail}</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-sm text-gray-600">{question.courseName}</span>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-sm font-medium">
              {question.subject}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(question.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-sm ${
          question.status === 'PENDING' 
            ? 'bg-orange-100 text-orange-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {question.status === 'PENDING' ? (
            <>
              <IconAlertCircle size={16} />
              <span className="text-xs font-medium">Pending</span>
            </>
          ) : (
            <>
              <IconCheck size={16} />
              <span className="text-xs font-medium">Answered</span>
            </>
          )}
        </div>
      </div>

      {/* Question */}
      <div className="mb-4">
        <p className="text-gray-900 leading-relaxed">{question.question}</p>
      </div>

      {/* Answer */}
      {question.answer ? (
        <div className="bg-green-50 border border-green-200 rounded-sm p-4">
          <p className="text-sm font-medium text-green-900 mb-2">Your Answer:</p>
          <p className="text-gray-700">{question.answer}</p>
          {question.answeredAt && (
            <p className="text-xs text-gray-500 mt-2">
              Answered on {new Date(question.answeredAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
        </div>
      ) : isAnswering ? (
        <div className="border border-gray-200 rounded-sm p-4">
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Write your answer..."
            className="w-full p-3 border border-gray-300 rounded-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleSubmitAnswer}
              disabled={!answerText.trim() || isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </button>
            <button
              onClick={() => {
                setIsAnswering(false);
                setAnswerText('');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 font-medium text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAnswering(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 font-medium text-sm"
        >
          Answer Question
        </button>
      )}
    </div>
  );
};

export default AdminQnATab;
