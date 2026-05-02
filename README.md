# AI Ценник + Аналитик — Mini App v1

## Что внутри
- HTML5 / CSS3 / Vanilla JS
- Telegram WebApp SDK-safe слой
- Mock-режим по умолчанию
- SPA router
- Chart.js
- PWA shell
- GitHub Pages friendly structure

## Локальный запуск
```bash
python -m http.server 5173
```
Открыть:
`http://localhost:5173`

## Переключение на backend
В `js/config.js`:
```js
USE_MOCK: false,
BASE_URL: 'https://your-backend-domain.com'
```

## GitHub Pages
1. Пушнуть проект в репозиторий.
2. Включить Pages через GitHub Actions.
3. Домен сайта будет доступен в Settings → Pages.

## Telegram Mini App
Использовать опубликованный GitHub Pages URL в настройках BotFather как Web App URL.
