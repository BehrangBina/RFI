import { Poster, CreatePosterRequest } from '../types/Poster';

const API_URL = 'http://localhost:5000/api';

export const posterService = {
  async getAllPosters(): Promise<Poster[]> {
    const response = await fetch(`${API_URL}/posters`);
    if (!response.ok) throw new Error('Failed to fetch posters');
    return response.json();
  },

  async getPoster(id: number): Promise<Poster> {
    const response = await fetch(`${API_URL}/posters/${id}`);
    if (!response.ok) throw new Error('Failed to fetch poster');
    return response.json();
  },

  async uploadPoster(request: CreatePosterRequest): Promise<Poster> {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('title', request.title);
    if (request.description) {
      formData.append('description', request.description);
    }

    const response = await fetch(`${API_URL}/posters/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload poster');
    return response.json();
  },

  async deletePoster(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/posters/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete poster');
  },

  async incrementDownloadCount(id: number): Promise<{ downloadCount: number }> {
    const response = await fetch(`${API_URL}/posters/${id}/download`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to increment download count');
    return response.json();
  },

  getImageUrl(fileUrl: string): string {
    return `http://localhost:5000${fileUrl}`;
  },
};
