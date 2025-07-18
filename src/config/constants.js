// API Configuration Constants
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000',
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      PROFILE: '/api/auth/profile',
      SEED_ADMIN: '/api/auth/seed-admin'
    },
    USERS: '/api/users',
    PRODUCTS: '/api/products',
    ORDERS: '/api/orders',
    SUPPLIERS: '/api/suppliers',
    HEALTH: '/api/health'
  }
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'ERP System',
  VERSION: '1.0.0',
  DESCRIPTION: 'Enterprise Resource Planning System'
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#1a237e',
  SECONDARY: '#ff6f00',
  SUCCESS: '#2e7d32',
  WARNING: '#ed6c02',
  ERROR: '#d32f2f',
  INFO: '#0288d1'
}; 