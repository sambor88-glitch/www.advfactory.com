async function fetchContent(language) {
  const response = await fetch(`/api/content?lang=${encodeURIComponent(language)}`);
  if (!response.ok) {
    throw new Error('Failed to load content');
  }
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Invalid content format');
  }
  return response.json();
}

function getContentLists(data) {
  return {
    trips: Array.isArray(data?.trips) ? data.trips : [],
    transports: Array.isArray(data?.transports) ? data.transports : [],
  };
}

function getUiText(root) {
  return {
    emptyTrips: root.dataset.emptyTrips || 'Brak danych.',
    emptyTransports: root.dataset.emptyTransports || 'Brak danych.',
    loadError: root.dataset.loadError || 'Nie udało się pobrać danych.',
    sendingLabel: root.dataset.sendingLabel || 'Wysyłanie...',
    successLabel: root.dataset.successLabel || 'Dziękujemy!',
    errorLabel: root.dataset.errorLabel || 'Wystąpił błąd.',
  };
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
    const heading = document.createElement('h3');
    heading.textContent = item.title || '';
    const description = document.createElement('p');
    description.textContent = item.description || '';
    article.append(heading, description);
    container.appendChild(article);
  }
}

async function init() {
  const root = document.getElementById('app');
  if (!root) return;

  const language = root.dataset.language || 'pl';
  const tripsNode = document.getElementById('trips-list');
  const transportsNode = document.getElementById('transports-list');
  const uiText = getUiText(root);

  try {
    const data = await fetchContent(language);
    const content = getContentLists(data);
    renderItems(tripsNode, content.trips, uiText.emptyTrips);
    renderItems(transportsNode, content.transports, uiText.emptyTransports);
  } catch (error) {
    renderItems(tripsNode, [], uiText.loadError);
    renderItems(transportsNode, [], uiText.loadError);
  }

  const form = document.getElementById('lead-form');
  const status = document.getElementById('lead-status');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = uiText.sendingLabel;

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
      const contentType = response.headers.get('content-type') || '';
      const result = contentType.includes('application/json')
        ? await response.json()
        : { error: await response.text() };
      if (!response.ok) {
        throw new Error(result.error || 'Unknown error');
      }
      status.textContent = uiText.successLabel;
      form.reset();
    } catch {
      status.textContent = uiText.errorLabel;
    }
  });
}

if (typeof document !== 'undefined') {
  init();
}

if (typeof module !== 'undefined') {
  module.exports = { getContentLists, getUiText };
}
