import { CONFIG } from './config.js';

const listeners = new Set();

const initialState = {
  user: null,
  dashboard: null,
  products: [],
  chat: JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.CHAT) || '[]'),
  dailyReport: null,
  loading: true,
  route: localStorage.getItem(CONFIG.STORAGE_KEYS.LAST_ROUTE) || 'home',
  error: null,
};

export const state = structuredClone(initialState);

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setState(partial) {
  Object.assign(state, partial);
  listeners.forEach((fn) => fn(state));
}

export function persistChat(chat) {
  localStorage.setItem(CONFIG.STORAGE_KEYS.CHAT, JSON.stringify(chat));
}

export function persistRoute(route) {
  localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_ROUTE, route);
}

export function resetState() {
  Object.assign(state, structuredClone(initialState));
  listeners.forEach((fn) => fn(state));
}
