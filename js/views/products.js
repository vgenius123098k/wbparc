import { normalizeMoney, percent } from '../config.js';

function riskBadge(risk) {
  if (risk === 'high') return '<span class="badge bad">Высокий риск</span>';
  if (risk === 'medium') return '<span class="badge warn">Средний риск</span>';
  return '<span class="badge good">Низкий риск</span>';
}

export default async function productsView(state) {
  if (!state.products?.length) {
    return `<section class="card skeleton" style="height: 280px;"></section>`;
  }

  const items = state.products.map((p) => `
    <div class="product-row">
      <div class="product-head">
        <div>
          <div class="product-title">${p.title}</div>
          <div class="product-meta">SKU: ${p.sku}</div>
        </div>
        ${riskBadge(p.risk)}
      </div>
      <div class="grid-2">
        <div class="stat">
          <div class="label">Текущая цена</div>
          <div class="value">${normalizeMoney(p.current_price)}</div>
        </div>
        <div class="stat">
          <div class="label">Рекомендация</div>
          <div class="value up">${normalizeMoney(p.recommended_price)}</div>
        </div>
        <div class="stat">
          <div class="label">Маржа</div>
          <div class="value">${percent(p.margin)}</div>
        </div>
        <div class="stat">
          <div class="label">Доп. прибыль</div>
          <div class="value ${p.expected_profit_delta >= 0 ? 'up' : 'down'}">${normalizeMoney(p.expected_profit_delta)}</div>
        </div>
      </div>
    </div>
  `).join('');

  return `
    <section class="card">
      <h2>Товары</h2>
      <p>Список SKU с точечными рекомендациями. Тапни на товар, чтобы открыть анализ в бэкенде.</p>
      <div class="actions" style="margin-top:14px;">
        <button class="btn" id="syncProductsBtn">Синхронизировать</button>
      </div>
    </section>
    <section class="list">${items}</section>
  `;
}

export function afterRender(state, services) {
  document.getElementById('syncProductsBtn')?.addEventListener('click', async () => {
    await services.handlers.syncProducts();
  });
}
