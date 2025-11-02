import { 
  IconMessageCircle, 
  IconSearch, 
  IconClock,
  IconCheck,
  IconUser,
  IconBook
} from '@tabler/icons-react';
import { useState } from 'react';

interface Question {
  id: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  subject: string;
  question: string;
  answer?: string | null;
  status: 'PENDING' | 'ANSWERED';
  createdAt: string;
  answeredAt?: string | null;
}

interface TutorQATabProps {
  questions: Question[];
  onAnswerQuestion: (questionId: string, answer: string) => void;
}

function TutorQATab({ questions, onAnswerQuestion }: TutorQATabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'ANSWERED'>('ALL');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState<{ [key: string]: string }>({});

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || question.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = questions.filter(q => q.status === 'PENDING').length;
  const answeredCount = questions.filter(q => q.status === 'ANSWERED').length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleSubmitAnswer = (questionId: string) => {
    const answer = answerText[questionId];
    if (answer && answer.trim()) {
      onAnswerQuestion(questionId, answer.trim());
      setAnswerText(prev => ({ ...prev, [questionId]: '' }));
      setExpandedQuestion(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Q&A Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">TOTAL QUESTIONS</p>
              <p className="text-2xl font-bold text-blue-600 mt-0.5">{questions.length}</p>
            </div>
            <IconMessageCircle size={32} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">PENDING</p>
              <p className="text-2xl font-bold text-yellow-600 mt-0.5">{pendingCount}</p>
            </div>
            <IconClock size={32} className="text-yellow-200" />
          </div>
        </div>

        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">ANSWERED</p>
              <p className="text-2xl font-bold text-green-600 mt-0.5">{answeredCount}</p>
            </div>
            <IconCheck size={32} className="text-green-200" />
          </div>
        </div>
      </div>

      {/* Header with Search and Filters */}
      <div className="bg-white rounded-sm border border-gray-200 p-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Questions & Answers</h1>
            <p className="text-xs text-gray-500 mt-0.5">{filteredQuestions.length} of {questions.length} questions</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <IconSearch size={14} className="absolute left-2 top-2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 pr-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-56"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="px-2 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ANSWERED">Answered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <div 
              key={question.id}
              className="bg-white rounded-sm border border-gray-200 overflow-hidden hover:border-blue-300 transition-all"
            >
              {/* Question Header */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconUser size={20} className="text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {question.studentName}
                        </h3>
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded border ${
                          question.status === 'PENDING' 
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                            : 'bg-green-50 text-green-700 border-green-200'
                        }`}>
                          {question.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <IconBook size={12} />
                        <span>{question.courseName}</span>
                        <span>•</span>
                        <IconClock size={12} />
                        <span>{formatDate(question.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question Content */}
                <div className="bg-gray-50 rounded p-3 mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Question:</p>
                  <p className="text-sm text-gray-900">{question.question}</p>
                </div>

                {/* Existing Answer */}
                {question.status === 'ANSWERED' && question.answer && (
                  <div className="bg-green-50 rounded p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <IconCheck size={14} className="text-green-600" />
                      <p className="text-sm font-medium text-green-700">Your Answer:</p>
                      {question.answeredAt && (
                        <span className="text-xs text-green-600 ml-auto">
                          {formatDate(question.answeredAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-900">{question.answer}</p>
                  </div>
                )}

                {/* Answer Section for Pending Questions */}
                {question.status === 'PENDING' && (
                  <div>
                    {expandedQuestion === question.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={answerText[question.id] || ''}
                          onChange={(e) => setAnswerText(prev => ({ ...prev, [question.id]: e.target.value }))}
                          placeholder="Type your answer here..."
                          rows={4}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSubmitAnswer(question.id)}
                            disabled={!answerText[question.id]?.trim()}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                          >
                            Submit Answer
                          </button>
                          <button
                            onClick={() => {
                              setExpandedQuestion(null);
                              setAnswerText(prev => ({ ...prev, [question.id]: '' }));
                            }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setExpandedQuestion(question.id)}
                        className="w-full px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded hover:bg-blue-100 transition-colors"
                      >
                        Answer Question
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-sm border border-gray-200 p-12 text-center">
            <IconMessageCircle size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No questions found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TutorQATab;
