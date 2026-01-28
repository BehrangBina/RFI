// Constants for the application
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  EVENTS: '/events',
  EVENT_DETAIL: '/events/:id',
  POSTERS: '/posters',
  DONATE: '/donate',
};

export const API_ENDPOINTS = {
  EVENTS: {
    ALL: '/events',
    BY_ID: (id) => `/events/${id}`,
    UPCOMING: '/events/upcoming',
  },
  DONATIONS: {
    CREATE: '/donations',
    STATS: '/donations/stats',
    RECENT: (count) => `/donations/recent?count=${count}`,
  },
  POSTERS: {
    ALL: '/posters',
    BY_EVENT: (eventId) => `/posters/event/${eventId}`,
    TRACK_DOWNLOAD: (posterId) => `/posters/${posterId}/download`,
  },
  ANALYTICS: {
    BY_COUNTRY: '/analytics/by-country',
    BY_CITY: '/analytics/by-city',
  },
};

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
  },
  slideDown: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
  },
};
