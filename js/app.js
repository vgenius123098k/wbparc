import { CONFIG } from './config.js';
import { api } from './api.js';
import { state, setState, subscribe, persistChat } from './store.js';
import { initTelegram, hideBackButton, hideMainButton, safeUser } from './telegram.js';
import { destroyCharts } from './charts.js';
import { getRouteFromHash, renderRoute, setActiveNav } from './router.js';

const toast = document.getElementById('toast');

const services = {
  charts: null,
  handlers: {},
};

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => (toast.hidden = true), 2200);
}

services.charts = await import('./charts.js');

services.handlers = {
  async refreshAll() {
    try {
      setState({ loading: true, error: null });
      const [auth, dashboard, products, report] = await Promise.all([
        api.authTelegram().catch(() => ({ ok: false })),
        api.getDashboard(),
        api.syncProducts(),
        api.getDailyReport().catch(() => null),
      ]);

      const profile = auth?.user || { ...safeUser(), connected: CONFIG.USE_MOCK, last_sync: new Date().toLocaleString('ru-RU') };

      setState({
        user: profile,
        dashboard,
        products,
        dailyReport: report,
        loading: false,
      });

      showToast('Данные обновлены');
      await routeRender();
    } catch (error) {
      console.error(error);
      setState({ error: error.message, loading: false });
      showToast('Ошибка обновления');
    }
  },

  async syncProducts() {
    try {
      const products = await api.syncProducts();
      setState({ products });
      showToast('Товары синхронизированы');
      await routeRender();
    } catch (error) {
      showToast('Не удалось синхронизировать товары');
    }
  },

  async runAnalysis() {
    try {
      const analysis = await api.analyze({});
      setState({ dashboard: analysis });
      showToast('Анализ готов');
      await routeRender();
    } catch (error) {
      showToast('Не удалось запустить анализ');
    }
  },

  async sendChat(text) {
    const nextChat = [...state.chat, { role: 'user', text }];
    setState({ chat: nextChat });
    persistChat(nextChat);
    await routeRender();

    try {
      const res = await api.askAI(text);
      const updated = [...nextChat, { role: 'ai', text: res.answer || res.reply || 'Ответ получен' }];
      setState({ chat: updated });
      persistChat(updated);
      await routeRender();
    } catch (error) {
      const updated = [...nextChat, { role: 'ai', text: 'Брат, сейчас не получилось получить ответ от backend.' }];
      setState({ chat: updated });
      persistChat(updated);
      await routeRender();
    }
  },

  async clearChat() {
    setState({ chat: [] });
    persistChat([]);
    await routeRender();
  },
};

async function routeRender() {
  destroyCharts();
  const route = getRouteFromHash();
  await renderRoute(route, state, services);
}

function bindNav() {
  document.querySelectorAll('.bottom-nav a').forEach((a) => {
    a.addEventListener('click', async () => {
      setActiveNav(a.dataset.route);
    });
  });
}

async function bootstrap() {
  initTelegram();
  hideBackButton();
  hideMainButton();
  bindNav();

  document.getElementById('refreshBtn').addEventListener('click', () => services.handlers.refreshAll());

  subscribe(() => {});

  if (!location.hash) location.hash = `#/${state.route || 'home'}`;
  await services.handlers.refreshAll();

  window.addEventListener('hashchange', async () => {
    await routeRender();
  });

  showToast(CONFIG.USE_MOCK ? 'Mock-режим включён' : 'Подключение к backend');
}

bootstrap();
