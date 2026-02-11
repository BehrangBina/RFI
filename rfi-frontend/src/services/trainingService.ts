import { SubjectCategory, Training } from '../types/Training';

const API_BASE_URL = 'http://localhost:5000/api';

export const trainingService = {
  // Categories
  async getAllCategories(): Promise<SubjectCategory[]> {
    const response = await fetch(`${API_BASE_URL}/training/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch training categories');
    }
    return response.json();
  },

  async getCategoryById(id: number): Promise<SubjectCategory> {
    const response = await fetch(`${API_BASE_URL}/training/categories/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch category');
    }
    return response.json();
  },

  async getCategoryBySlug(slug: string): Promise<SubjectCategory> {
    const response = await fetch(`${API_BASE_URL}/training/categories/slug/${slug}`);
    if (!response.ok) {
      throw new Error('Failed to fetch category');
    }
    return response.json();
  },

  // Trainings
  async getAllTrainings(): Promise<Training[]> {
    const response = await fetch(`${API_BASE_URL}/training`);
    if (!response.ok) {
      throw new Error('Failed to fetch trainings');
    }
    return response.json();
  },

  async getTrainingById(id: number): Promise<Training> {
    const response = await fetch(`${API_BASE_URL}/training/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch training');
    }
    return response.json();
  },

  async getTrainingBySlug(slug: string): Promise<Training> {
    const response = await fetch(`${API_BASE_URL}/training/slug/${slug}`);
    if (!response.ok) {
      throw new Error('Failed to fetch training');
    }
    return response.json();
  },

  async getTrainingsByCategory(categoryId: number): Promise<Training[]> {
    const response = await fetch(`${API_BASE_URL}/training/category/${categoryId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch trainings');
    }
    return response.json();
  }
};
