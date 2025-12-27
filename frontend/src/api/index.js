import axios from 'axios';

/**
 * API Configuration
 * 
 * PRODUCTION/DOCKER mode (default when built):
 *   - Uses relative URLs (empty base URL)
 *   - All requests go through NGINX on same origin
 *   - NGINX routes /api/* to API Gateway
 * 
 * LOCAL development mode:
 *   - Set VITE_USE_DIRECT=true to call services directly
 *   - Set VITE_USE_GATEWAY=true to call API Gateway directly
 * 
 * Environment Variables (.env file):
 *   VITE_USE_DIRECT=true        # Call services directly (localhost:808x)
 *   VITE_USE_GATEWAY=true       # Call API Gateway directly (localhost:8080)
 *   VITE_API_GATEWAY_URL=http://localhost:8080
 *   VITE_ACCOUNT_API_URL=http://localhost:8081
 *   VITE_TRANSACTION_API_URL=http://localhost:8082
 */

// Check if we're in local development mode
const USE_DIRECT = import.meta.env.VITE_USE_DIRECT === 'true';
const USE_GATEWAY = import.meta.env.VITE_USE_GATEWAY === 'true';

// Determine base URL
let baseUrl = ''; // Default: relative URLs (for Docker/production)

if (USE_DIRECT) {
  // Direct service calls (for local development without Docker)
  // Each API will use its own base URL
} else if (USE_GATEWAY) {
  // API Gateway mode (local development with gateway)
  baseUrl = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080';
}
// else: empty baseUrl = relative URLs (same origin, for Docker/production)

// Direct service URLs (only used when USE_DIRECT is true)
const ACCOUNT_SERVICE_URL = import.meta.env.VITE_ACCOUNT_API_URL || 'http://localhost:8081';
const TRANSACTION_SERVICE_URL = import.meta.env.VITE_TRANSACTION_API_URL || 'http://localhost:8082';

// Determine base URLs for each service
const accountBaseUrl = USE_DIRECT ? ACCOUNT_SERVICE_URL : baseUrl;
const transactionBaseUrl = USE_DIRECT ? TRANSACTION_SERVICE_URL : baseUrl;

// Log configuration (only in development)
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', {
    mode: USE_DIRECT ? 'DIRECT' : USE_GATEWAY ? 'GATEWAY' : 'RELATIVE (Docker/Production)',
    accountBaseUrl: accountBaseUrl || '(same origin)',
    transactionBaseUrl: transactionBaseUrl || '(same origin)'
  });
}

const accountApi$ = axios.create({
  baseURL: accountBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

const transactionApi$ = axios.create({
  baseURL: transactionBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Account API
export const accountApi = {
  getAll: () => accountApi$.get('/api/accounts'),
  getById: (id) => accountApi$.get(`/api/accounts/${id}`),
  getByAccountNumber: (accountNumber) => accountApi$.get(`/api/accounts/number/${accountNumber}`),
  create: (data) => accountApi$.post('/api/accounts', data),
  updateBalance: (id, data) => accountApi$.put(`/api/accounts/${id}/balance`, data),
  delete: (id) => accountApi$.delete(`/api/accounts/${id}`),
};

// Transaction API
export const transactionApi = {
  getAll: () => transactionApi$.get('/api/transactions'),
  getById: (id) => transactionApi$.get(`/api/transactions/${id}`),
  getByAccountNumber: (accountNumber) => transactionApi$.get(`/api/transactions/account/${accountNumber}`),
  transfer: (data) => transactionApi$.post('/api/transactions', data),
};

export default accountApi$;
