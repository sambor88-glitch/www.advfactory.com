# www.advfactory.com

Nowa strona ADV Factory z integracją CRM:

- zbieranie leadów przez formularz (`POST /api/leads`),
- pobieranie list wyjazdów i transportów (`GET /api/content?lang=pl|en`),
- dwie wersje językowe przygotowane pod SEO (`/pl` i `/en`, `hreflang`, `canonical`).

## Konfiguracja

Wymagany Node.js 18+.

Zmienne środowiskowe:

- `PORT` (domyślnie `3000`)
- `CRM_BASE_URL` (np. `https://crm.example.com`)
- `CRM_API_TOKEN` (opcjonalnie)
- `CRM_CONTENT_PATH` (domyślnie `/api/public/offers`)
- `CRM_LEADS_PATH` (domyślnie `/api/leads`)

## Uruchomienie

```bash
npm install
npm run dev
```

## Testy

```bash
npm test
```
