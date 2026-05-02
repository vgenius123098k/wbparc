const fallbackTheme = {
  bg_color: '#0b0f17',
  secondary_bg_color: '#101826',
  text_color: '#eef3ff',
  hint_color: 'rgba(238,243,255,0.68)',
  button_color: '#7c5cff',
  button_text_color: '#ffffff',
  bottom_bar_bg_color: '#0b0f17',
};

export function getTelegram() {
  return window.Telegram?.WebApp || null;
}

export function initTelegram() {
  const tg = getTelegram();
  if (tg) {
    tg.ready();
    tg.expand();
    applyTheme(tg.themeParams || fallbackTheme);
    return tg;
  }
  applyTheme(fallbackTheme);
  return null;
}

export function applyTheme(theme) {
  const root = document.documentElement;
  const t = { ...fallbackTheme, ...(theme || {}) };
  root.style.setProperty('--bg', t.bg_color);
  root.style.setProperty('--bg2', t.secondary_bg_color);
  root.style.setProperty('--text', t.text_color);
  root.style.setProperty('--muted', 'rgba(238,243,255,0.68)');
  root.style.setProperty('--accent', t.button_color || '#7c5cff');
}

export function haptic(type = 'selectionChanged') {
  const tg = getTelegram();
  try {
    tg?.HapticFeedback?.[type]?.();
  } catch {}
}

export function safeUser() {
  const tg = getTelegram();
  const user = tg?.initDataUnsafe?.user;
  if (!user) {
    return {
      id: 10001,
      first_name: 'Брат',
      username: 'seller',
    };
  }
  return user;
}

export function openMainButton(text, onClick) {
  const tg = getTelegram();
  if (!tg) return;
  tg.MainButton.setText(text);
  tg.MainButton.onClick(onClick);
  tg.MainButton.show();
}

export function hideMainButton() {
  const tg = getTelegram();
  if (!tg) return;
  tg.MainButton.hide();
}

export function showBackButton(onClick) {
  const tg = getTelegram();
  if (!tg) return;
  tg.BackButton.show();
  tg.BackButton.onClick(onClick);
}

export function hideBackButton() {
  const tg = getTelegram();
  if (!tg) return;
  tg.BackButton.hide();
}

export function getInitData() {
  const tg = getTelegram();
  return tg?.initData || '';
}
