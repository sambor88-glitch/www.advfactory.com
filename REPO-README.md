# Advfactory---www

Nowa strona advfactory połączona z CRM. Zatwierdzony kierunek: **Propozycja B** (ciemny, kinowy).

## `deploy/` — klikalny prototyp (25.09.2026)

Statyczny prototyp strony PL wraz z panelem CRM do zarządzania jej treścią. Same pliki HTML — nic nie trzeba budować.

| Adres | Zawartość |
|---|---|
| `/` | strona główna PL — Propozycja B |
| `/widoki` | wszystkie podstrony (`#/wyprawy`, `#/transport`, `#/panel`, `#/kontakt` …); indeks pod przyciskiem siatki |
| `/mapa-strony` | architektura serwisu i źródła danych |
| `/en` | strona EN (poprzedni styl — do przerobienia na B) |
| `/mapa-transportow` | mapa kierunków transportu |
| `/stany` | stany błędów i ładowania |
| `/crm/wyprawy` · `/crm/transport` | oferta — źródło danych dla strony |
| `/crm/edytor` | **edytor treści** — wszystko poza ofertą, PL/EN, szkic → Publikuj |
| `/crm/tresci` | FAQ, relacje, opinie |
| `/crm/zainteresowani` · `/crm/ustawienia` · `/crm/leady-www` | powiadomienia · ustawienia · lead w Skrzynce |

`deploy/vercel.json` włącza `cleanUrls` i nagłówek `X-Robots-Tag: noindex`.

Szczegóły publikacji: [`deploy/README.md`](deploy/README.md).

### Zależności zewnętrzne
Zdjęcia z `advfactory.com`, fonty z Google Fonts (Anton, Archivo, IBM Plex Mono), `mapa-transportow` ładuje d3/topojson z unpkg i granice z jsdelivr.

### Ograniczenia prototypu
Dane przykładowe, brak bazy. Formularze nic nie wysyłają (docelowo POST /leads → Skrzynka CRM).
