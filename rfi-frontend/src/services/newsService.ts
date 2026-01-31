import { NewsArticle } from '../types/News';

const API_BASE_URL = 'http://localhost:5000/api';

export const newsService = {
  async getAllNews(): Promise<NewsArticle[]> {
    const response = await fetch(`${API_BASE_URL}/news`);
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    return response.json();
  },

  async getNewsById(id: number): Promise<NewsArticle> {
    const response = await fetch(`${API_BASE_URL}/news/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch news article');
    }
    return response.json();
  }
};
