export default async function analyticsView(state) {
  const d = state.dashboard;
  if (!d) {
    return `<section class="card skeleton" style="height: 340px;"></section>`;
  }

  return `
    <section class="card">
      <h2>Аналитика</h2>
      <p>Три графика: прибыль, цена и прогноз на 7 дней.</p>
    </section>

    <section class="card">
      <h3>Динамика прибыли</h3>
      <div class="chart-wrap"><canvas id="profitChart"></canvas></div>
    </section>

    <section class="card">
      <h3>Динамика цены</h3>
      <div class="chart-wrap"><canvas id="priceChart"></canvas></div>
    </section>

    <section class="card">
      <h3>Прогноз на 7 дней</h3>
      <div class="chart-wrap"><canvas id="forecastChart"></canvas></div>
    </section>
  `;
}

export function afterRender(state, services) {
  const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const d = state.dashboard;
  if (!d) return;

  services.charts.renderAnalyticsCharts({
    labels,
    profit: d.trend || [],
    price: d.prices || [],
    forecast: d.forecast || [],
  });
}
