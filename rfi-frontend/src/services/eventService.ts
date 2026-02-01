// Event types
export interface EventImage {
  id: number;
  imageUrl: string;
  caption: string;
  orderIndex: number;
}

export interface EventSection {
  id: number;
  sectionType: string;
  title: string;
  content: string;
  orderIndex: number;
}

export interface Event {
  id: number;
  title: string;
  slug: string;
  date: string;
  location: string;
  category: string;
  summary: string;
  description: string;
  attendeeCount?: number;
  videoUrl?: string;
  images: EventImage[];
  sections: EventSection[];
  createdAt: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

export const eventService = {
  // Get all events
  async getAllEvents(): Promise<Event[]> {
    const response = await fetch(`${API_BASE_URL}/events`);
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return response.json();
  },

  // Get event by ID
  async getEventById(id: number): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch event');
    }
    return response.json();
  },

  // Get events by category
  async getEventsByCategory(category: string): Promise<Event[]> {
    const response = await fetch(`${API_BASE_URL}/events?category=${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch events by category');
    }
    return response.json();
  },

  // Get all categories
  async getCategories(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/events/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },
};
