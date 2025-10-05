// Q&A API service functions
const API_BASE = (import.meta.env.VITE_API_URL as string) || '/api';

export interface CreateQuestionRequest {
  title: string;
  content: string;
}

export interface CreateAnswerRequest {
  content: string;
}


export async function createQuestion(courseId: string, data: CreateQuestionRequest) {
  const response = await fetch(`${API_BASE}/courses/${courseId}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create question: ${response.status}`);
  }

  return response.json();
}

export async function createAnswer(courseId: string, questionId: string, data: CreateAnswerRequest) {
  const response = await fetch(`${API_BASE}/courses/${courseId}/questions/${questionId}/answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create answer: ${response.status}`);
  }

  return response.json();
}

// Voting removed

export async function listAllQuestions(courseId: string) {
  const response = await fetch(`${API_BASE}/courses/${courseId}/questions`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Failed to load questions: ${response.status}`);
  }
  return response.json();
}
