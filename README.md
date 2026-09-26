# ADVfactory — publikacja na Vercel

Folder gotowy do wrzucenia w całości. Nic nie trzeba budować — same pliki HTML. Stan na 25.09.2026 (Propozycja B).

## Najszybciej (bez terminala)
1. vercel.com → **Add New… → Project**.
2. Przeciągnij cały folder `deploy` (drag & drop, static site).
3. Dostajesz adres `https://cos.vercel.app`.

## Z terminala
```
npm i -g vercel
cd deploy
vercel --prod
```

## Adresy po publikacji (cleanUrls: bez `.html`)
**Strona (Propozycja B — zatwierdzona)**
- `/` — strona startowa PL (hero z parallaxem, manifest, live z CRM, wyprawy, transport, galeria)
- `/widoki` — wszystkie podstrony w jednym pliku z routingiem: `/widoki#/wyprawy`, `#/wyprawy/[slug]`, `#/wyprawy/archiwum`, `#/transport`, `#/transport/[slug]`, `#/transport/wycena`, `#/transport/dokumenty`, `#/relacje`, `#/relacje/[slug]`, `#/opinie`, `#/o-nas`, `#/faq`, `#/kontakt`, `#/dziekujemy`, `#/panel/logowanie`, `#/panel/reset`, `#/panel`, `#/panel/transport`, `#/panel/platnosci`, `#/panel/dokumenty`, `#/panel/checklista`, `#/panel/watek`, `#/panel/ustawienia`, `#/polityka-prywatnosci`, `#/regulamin`, `#/cookies`, 404. Przycisk siatki w lewym dolnym rogu = indeks widoków.
- `/mapa-strony` — mapa serwisu (architektura, źródła danych)
- `/en` — strona EN (poprzednia wersja wizualna — do przerobienia na B)
- `/mapa-transportow` — mapa kierunków (D3), iframe w stronie
- `/stany` — stany błędów i ładowania

**CRM**
- `/crm/wyprawy` · `/crm/transport` — oferta (źródło danych dla strony)
- `/crm/edytor` — **Edytor treści** (wszystko poza ofertą; PL/EN; szkic → Publikuj)
- `/crm/tresci` — FAQ, relacje, opinie
- `/crm/zainteresowani` · `/crm/ustawienia` · `/crm/leady-www`

## Uwagi
- Zdjęcia ładują się z advfactory.com — potrzebny internet. Fonty z Google Fonts.
- `vercel.json` ustawia `noindex`.
- Formularze nic nie wysyłają — prototyp. Docelowo: POST /leads → Skrzynka CRM.
- **Edycja treści działa w prototypie**: `/crm/edytor` → zmień → „Publikuj” → `/` i `/widoki` czytają nowe teksty (localStorage tej przeglądarki). Przycisk „tresci.json” pobiera plik, który docelowo serwuje CRM.
- `podglad.html` (stary indeks) usunięty — punktem wejścia jest `/`.

- `/brand-kit` — brand kit v2 (znak, sygnet, tła, sociale, stopka e-mail); zdjęcia bazowe w `assets/brand/`.
