const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockDashboard = {
  revenue: 1384000,
  profit: 312000,
  expected_profit_delta: 47200,
  top_risk_product: 'Коврик EVA',
  recommended_actions: [
    'Поднять цену на 3.4%',
    'Пополнить остатки',
    'Снизить ставку рекламы',
  ],
  trend: [150, 168, 162, 185, 210, 228, 240],
  prices: [2090, 2090, 2140, 2140, 2190, 2190, 2190],
  forecast: [312000, 320000, 329000, 337000, 346000, 355000, 359200],
};

export const mockProducts = [
  {
    id: 1,
    title: 'Коврик EVA',
    sku: 'EVA-001',
    current_price: 2090,
    recommended_price: 2190,
    margin: 32.4,
    expected_profit_delta: 18200,
    risk: 'medium',
  },
  {
    id: 2,
    title: 'Органайзер на полку',
    sku: 'ORG-044',
    current_price: 1490,
    recommended_price: 1590,
    margin: 28.1,
    expected_profit_delta: 9400,
    risk: 'low',
  },
  {
    id: 3,
    title: 'Складной контейнер',
    sku: 'CNT-120',
    current_price: 1890,
    recommended_price: 1790,
    margin: 21.2,
    expected_profit_delta: -4200,
    risk: 'high',
  },
];

export const mockDailyReport = {
  title: 'Утренний отчёт',
  date: new Date().toLocaleDateString('ru-RU'),
  summary: 'Брат, по двум товарам можно поднять цену без потери продаж. Один SKU надо срочно защитить от просадки.',
  items: [
    { label: 'Риск SKU', value: 'CNT-120' },
    { label: 'Потенциал доп. прибыли', value: '+47 200 ₽' },
    { label: 'Сигнал на действие', value: 'Повысь цену на 3 позиции' },
  ],
};

export const mockAIAnswer = (message) => ({
  answer:
    `Брат, смотри: по твоему запросу есть понятный ход.\n\n` +
    `Сейчас главный риск — товары с просадкой маржи. ` +
    `Если зайти на цену аккуратно, можно быстро вернуть часть прибыли без сильного удара по конверсии.\n\n` +
    `Запрос: "${message}"\n` +
    `Рекомендация: начни с самого маржинального SKU и проверь конкурентов по нему.`,
});

export async function mockRequest(type, payload = {}) {
  await delay(350 + Math.random() * 500);

  switch (type) {
    case 'auth':
      return {
        ok: true,
        user: {
          id: 123456789,
          username: 'seller_pro',
          first_name: 'Брат',
          last_sync: new Date().toLocaleString('ru-RU'),
          connected: true,
        },
      };
    case 'dashboard':
      return mockDashboard;
    case 'products':
      return mockProducts;
    case 'analyze':
      return {
        ...mockDashboard,
        product: payload.product || mockProducts[0],
      };
    case 'ask-ai':
      return mockAIAnswer(payload.message || '');
    case 'daily-report':
      return mockDailyReport;
    default:
      return {};
  }
}
