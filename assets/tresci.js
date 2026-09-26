/* ADVfactory — treści strony (wszystko poza ofertą).
   Źródło docelowe: GET /public/tresci.json (generowane przez Edytor Treści przy „Publikuj”).
   W prototypie: localStorage 'adv.tresci.published' (zapisuje edytor) → fallback: wbudowane wartości domyślne z pliku strony.
   Użycie: const T = window.ADVTresci.get(); T.t('start/hero/title', 'domyślny tekst') */
(function () {
  const KEY_PUB = 'adv.tresci.published', KEY_DRAFT = 'adv.tresci.draft';
  function read(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function make(data, lang) {
    const L = lang || 'pl';
    return {
      raw: data,
      meta: (data && data._meta) || null,
      t(path, fallback) {
        if (!data || !data.sekcje) return fallback;
        const s = data.sekcje[path.split('/').slice(0, 2).join('/')];
        const k = path.split('/')[2];
        if (!s || !s.pola || !(k in s.pola)) return fallback;
        const f = s.pola[k];
        if (f == null) return fallback;
        if (typeof f === 'object' && !Array.isArray(f)) { const v = L === 'en' && f.en ? f.en : f.pl; return v == null || v === '' ? fallback : v; }
        return f;
      },
      list(path, fallback) { const v = this.t(path, null); if (v == null) return fallback; return String(v).split('\n').map(x => x.trim()).filter(Boolean).map(line => line.split('|').map(x => x.trim())); }
    };
  }
  window.ADVTresci = {
    KEY_PUB, KEY_DRAFT,
    get(lang) { return make(read(KEY_PUB), lang); },
    getDraft() { return read(KEY_DRAFT); },
    saveDraft(v) { write(KEY_DRAFT, v); },
    publish(v) { write(KEY_PUB, v); window.dispatchEvent(new CustomEvent('adv:tresci', { detail: v })); },
    onChange(fn) { window.addEventListener('storage', e => { if (e.key === KEY_PUB) fn(read(KEY_PUB)); }); window.addEventListener('adv:tresci', e => fn(e.detail)); },
    download(v, name) { const b = new Blob([JSON.stringify(v, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name || 'tresci.json'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
  };
})();
