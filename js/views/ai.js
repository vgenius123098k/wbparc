export default async function aiView(state) {
  const messages = state.chat || [];
  const chatHtml = messages.length
    ? messages.map(renderMessage).join('')
    : `<div class="message ai"><div class="author">AI</div><div class="text">Брат, напиши вопрос по цене, марже или риску товара. Я сразу дам понятный разбор.</div></div>`;

  return `
    <section class="card">
      <h2>AI-чат</h2>
      <p>Память чата хранится локально. Ответы приходят с backend или из mock-режима.</p>
    </section>

    <section class="card">
      <div class="chat" id="chatList">${chatHtml}</div>
    </section>

    <section class="card">
      <div class="actions" style="margin-bottom:10px;">
        <input id="chatInput" class="input" placeholder="Напиши вопрос: что поднять, что защитить, где теряю деньги?" />
      </div>
      <div class="actions">
        <button class="btn" id="sendChatBtn">Отправить</button>
        <button class="btn secondary" id="clearChatBtn">Очистить</button>
      </div>
    </section>
  `;
}

function renderMessage(m) {
  return `
    <div class="message ${m.role}">
      <div class="author">${m.role === 'user' ? 'Ты' : 'AI'}</div>
      <div class="text">${escapeHtml(m.text)}</div>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export function afterRender(state, services) {
  const input = document.getElementById('chatInput');
  const list = document.getElementById('chatList');

  async function send() {
    const text = input.value.trim();
    if (!text) return;

    await services.handlers.sendChat(text);
    input.value = '';
  }

  document.getElementById('sendChatBtn')?.addEventListener('click', send);
  document.getElementById('clearChatBtn')?.addEventListener('click', async () => {
    await services.handlers.clearChat();
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') send();
  });

  list?.scrollTo?.(0, list.scrollHeight);
}
