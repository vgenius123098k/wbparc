let charts = {};

function baseOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#eef3ff' },
      },
    },
    scales: {
      x: {
        ticks: { color: 'rgba(238,243,255,0.65)' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        ticks: { color: 'rgba(238,243,255,0.65)' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
  };
}

export function destroyCharts() {
  Object.values(charts).forEach((chart) => chart?.destroy?.());
  charts = {};
}

export function renderDashboardChart(canvasId, labels, values) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !window.Chart) return;
  charts[canvasId]?.destroy?.();

  charts[canvasId] = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Прибыль',
        data: values,
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 2,
        fill: true,
      }],
    },
    options: {
      ...baseOptions(),
      plugins: { legend: { display: false } },
    },
  });
}

export function renderAnalyticsCharts(data) {
  const profit = document.getElementById('profitChart');
  const price = document.getElementById('priceChart');
  const forecast = document.getElementById('forecastChart');

  if (!window.Chart) return;

  if (profit) {
    charts.profitChart?.destroy?.();
    charts.profitChart = new Chart(profit, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Прибыль',
          data: data.profit,
          borderWidth: 2,
          tension: 0.35,
          fill: true,
        }],
      },
      options: baseOptions(),
    });
  }

  if (price) {
    charts.priceChart?.destroy?.();
    charts.priceChart = new Chart(price, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Цена',
          data: data.price,
          borderWidth: 2,
          tension: 0.35,
        }],
      },
      options: baseOptions(),
    });
  }

  if (forecast) {
    charts.forecastChart?.destroy?.();
    charts.forecastChart = new Chart(forecast, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Прогноз',
          data: data.forecast,
          borderWidth: 0,
        }],
      },
      options: baseOptions(),
    });
  }
}
