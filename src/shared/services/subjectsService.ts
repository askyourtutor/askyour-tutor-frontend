import { apiFetch } from './api';

export interface Subject {
  id: string;
  name: string;
  category: string;
  description?: string | null;
}

/**
 * Get all active subjects
 */
export const getSubjects = async (): Promise<Subject[]> => {
  const response = await apiFetch<{ subjects: Subject[] }>('/subjects');
  return response.subjects;
};

const subjectsService = {
  getSubjects,
};

export default subjectsService;