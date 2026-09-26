async function fetchContent(language) {
  const response = await fetch(`/api/content?lang=${encodeURIComponent(language)}`);
  if (!response.ok) {
    throw new Error('Failed to load content');
  }
  return response.json();
}

function renderItems(container, items, emptyLabel) {
  container.innerHTML = '';
  if (!items.length) {
    const p = document.createElement('p');
    p.textContent = emptyLabel;
    container.appendChild(p);
    return;
  }

  for (const item of items) {
    const article = document.createElement('article');
    article.className = 'card';
    article.innerHTML = `<h3>${item.title || ''}</h3><p>${item.description || ''}</p>`;
    container.appendChild(article);
  }
}

async function init() {
  const root = document.getElementById('app');
  if (!root) return;

  const language = root.dataset.language || 'pl';
  const tripsNode = document.getElementById('trips-list');
  const transportsNode = document.getElementById('transports-list');

  try {
    const data = await fetchContent(language);
    renderItems(tripsNode, Array.isArray(data.trips) ? data.trips : [], root.dataset.emptyTrips || 'Brak danych.');
    renderItems(
      transportsNode,
      Array.isArray(data.transports) ? data.transports : [],
      root.dataset.emptyTransports || 'Brak danych.',
    );
  } catch (error) {
    renderItems(tripsNode, [], root.dataset.loadError || 'Nie udało się pobrać danych.');
    renderItems(transportsNode, [], root.dataset.loadError || 'Nie udało się pobrać danych.');
  }

  const form = document.getElementById('lead-form');
  const status = document.getElementById('lead-status');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = root.dataset.sendingLabel || 'Wysyłanie...';

    const payload = {
      name: form.elements.name.value,
      email: form.elements.email.value,
      phone: form.elements.phone.value,
      message: form.elements.message.value,
      language,
    };

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Unknown error');
      }
      status.textContent = root.dataset.successLabel || 'Dziękujemy!';
      form.reset();
    } catch {
      status.textContent = root.dataset.errorLabel || 'Wystąpił błąd.';
    }
  });
}

init();
