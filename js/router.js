import { persistRoute } from './store.js';
import { haptic } from './telegram.js';

const routes = {
  home: () => import('./views/home.js'),
  products: () => import('./views/products.js'),
  analytics: () => import('./views/analytics.js'),
  ai: () => import('./views/ai.js'),
  profile: () => import('./views/profile.js'),
};

export function getRouteFromHash() {
  const hash = location.hash.replace('#/', '') || 'home';
  return routes[hash] ? hash : 'home';
}

export function setActiveNav(route) {
  document.querySelectorAll('.bottom-nav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === route);
  });
}

export async function renderRoute(route, appState, services) {
  const normalized = routes[route] ? route : 'home';
  persistRoute(normalized);
  setActiveNav(normalized);
  haptic('selectionChanged');

  const mod = await routes[normalized]();
  const view = mod.default;
  const html = await view(appState, services);
  document.getElementById('app').innerHTML = html;
  if (mod.afterRender) await mod.afterRender(appState, services);
}

export function navigate(route) {
  location.hash = `#/${route}`;
}
