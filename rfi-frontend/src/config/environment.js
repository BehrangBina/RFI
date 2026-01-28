// Environment configuration
const config = {
  development: {
    apiBaseUrl: 'https://localhost:7265/api',
  },
  production: {
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'https://api.riseforiran.org/api',
  },
};

const environment = process.env.NODE_ENV || 'development';

export default config[environment];
