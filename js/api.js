import { CONFIG } from './config.js';
import { getInitData } from './telegram.js';
import { mockRequest } from './mock.js';

async function request(path, options = {}) {
  if (CONFIG.USE_MOCK) {
    const type = path.replace('/api/v1/', '');
    if (type === 'auth/telegram') return mockRequest('auth', options.body);
    if (type === 'products/sync') return mockRequest('products', options.body);
    if (type === 'dashboard') return mockRequest('dashboard', options.body);
    if (type === 'analyze') return mockRequest('analyze', options.body);
    if (type === 'ask-ai') return mockRequest('ask-ai', options.body);
    if (type === 'daily-report') return mockRequest('daily-report', options.body);
    return {};
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    'X-Telegram-Init-Data': getInitData(),
  };

  const res = await fetch(`${CONFIG.BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  authTelegram: () => request('/api/v1/auth/telegram', { method: 'POST', body: {} }),
  syncProducts: () => request('/api/v1/products/sync', { method: 'POST', body: {} }),
  getDashboard: () => request('/api/v1/dashboard'),
  analyze: (payload) => request('/api/v1/analyze', { method: 'POST', body: payload }),
  askAI: (message) => request('/api/v1/ask-ai', { method: 'POST', body: { message } }),
  getDailyReport: () => request('/api/v1/daily-report'),
};
