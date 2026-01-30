export interface Poster {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  downloadCount: number;
  uploadedAt: string;
  tags?: string;
}

export interface CreatePosterRequest {
  file: File;
  title: string;
  description?: string;
}
