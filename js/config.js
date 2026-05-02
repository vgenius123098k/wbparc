export const CONFIG = {
  BASE_URL: window.__APP_CONFIG__?.BASE_URL || 'http://localhost:8000',
  USE_MOCK: window.__APP_CONFIG__?.USE_MOCK ?? true,
  STORAGE_KEYS: {
    CHAT: 'aimini.chat.v1',
    PROFILE: 'aimini.profile.v1',
    LAST_ROUTE: 'aimini.route.v1',
  },
  APP_NAME: 'AI Ценник + Аналитик',
};

export function normalizeMoney(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function normalizeNumber(value) {
  return new Intl.NumberFormat('ru-RU').format(Number(value || 0));
}

export function percent(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}
