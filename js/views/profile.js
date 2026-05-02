import { safeUser } from '../telegram.js';

export default async function profileView(state) {
  const user = state.user || safeUser();

  return `
    <section class="card">
      <h2>Профиль</h2>
      <p>Подключение и базовая информация по Telegram-пользователю.</p>
    </section>

    <section class="profile-grid">
      <div class="stat">
        <div class="label">Имя</div>
        <div class="value">${user.first_name || 'Брат'}</div>
      </div>
      <div class="stat">
        <div class="label">Telegram ID</div>
        <div class="value">${user.id || '—'}</div>
      </div>
      <div class="stat">
        <div class="label">Последняя синхронизация</div>
        <div class="value">${user.last_sync || '—'}</div>
      </div>
      <div class="stat">
        <div class="label">Статус подключения</div>
        <div class="value ${user.connected ? 'up' : 'warn'}">${user.connected ? 'Подключено' : 'Mock-режим'}</div>
      </div>
    </section>
  `;
}
