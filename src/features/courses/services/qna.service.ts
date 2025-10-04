// Q&A API service functions
const API_BASE = (import.meta.env.VITE_API_URL as string) || '/api';

export interface CreateQuestionRequest {
  title: string;
  content: string;
}

export interface CreateAnswerRequest {
  content: string;
}

export interface VoteRequest {
  value: 1 | -1;
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

export async function voteOnQuestion(courseId: string, questionId: string, data: VoteRequest) {
  const response = await fetch(`${API_BASE}/courses/${courseId}/questions/${questionId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to vote: ${response.status}`);
  }

  return response.json();
}
