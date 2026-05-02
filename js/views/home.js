import { normalizeMoney } from '../config.js';

export default async function homeView(state) {
  const d = state.dashboard;
  if (!d) {
    return `
      <section class="card skeleton" style="height: 220px;"></section>
      <section class="card skeleton" style="height: 140px;"></section>
    `;
  }

  return `
    <section class="card">
      <h2>Доброе утро, брат</h2>
      <p>Вот короткий срез: за 2–3 минуты видно, где поднимать цену и где есть риск просадки.</p>
      <div class="grid-2" style="margin-top:14px;">
        <div class="stat">
          <div class="label">Оборот</div>
          <div class="value">${normalizeMoney(d.revenue)}</div>
        </div>
        <div class="stat">
          <div class="label">Прибыль</div>
          <div class="value">${normalizeMoney(d.profit)}</div>
        </div>
        <div class="stat">
          <div class="label">Прогноз роста</div>
          <div class="value up">+${normalizeMoney(d.expected_profit_delta)}</div>
        </div>
        <div class="stat">
          <div class="label">Риск SKU</div>
          <div class="value warn">${d.top_risk_product}</div>
        </div>
      </div>
    </section>

    <section class="card">
      <h3>AI-инсайт</h3>
      <p>${d.recommended_actions.map((x) => `• ${x}`).join('<br/>')}</p>
      <div class="actions" style="margin-top:14px;">
        <button class="btn" id="runAnalysisBtn">Запустить анализ</button>
        <button class="btn secondary" id="refreshDashboardBtn">Обновить</button>
      </div>
    </section>

    <section class="card">
      <h3>Мини-график прибыли</h3>
      <div class="chart-wrap"><canvas id="homeChart"></canvas></div>
    </section>

    <section class="card">
      <h3>Ключевые цифры</h3>
      <div class="kpis">
        <div class="report-item">
          <div class="badge good">Сильная зона</div>
          <p style="margin-top:8px;">2 SKU можно повысить без сильного падения спроса.</p>
        </div>
        <div class="report-item">
          <div class="badge warn">Точка внимания</div>
          <p style="margin-top:8px;">Один товар требует защиты по цене и остаткам.</p>
        </div>
      </div>
    </section>
  `;
}

export function afterRender(state, services) {
  const d = state.dashboard;
  if (d && window.Chart) {
    services.charts.renderDashboardChart('homeChart', ['1', '2', '3', '4', '5', '6', '7'], d.trend || []);
  }

  document.getElementById('runAnalysisBtn')?.addEventListener('click', async () => {
    await services.handlers.runAnalysis();
  });

  document.getElementById('refreshDashboardBtn')?.addEventListener('click', async () => {
    await services.handlers.refreshAll();
  });
}
