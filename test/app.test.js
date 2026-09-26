const test = require('node:test');
const assert = require('node:assert/strict');
const { getContentLists, getUiText, submitLead } = require('../public/app');

test('getContentLists returns arrays for valid and invalid shapes', () => {
  assert.deepEqual(getContentLists({ trips: [{ id: 1 }], transports: [{ id: 2 }] }), {
    trips: [{ id: 1 }],
    transports: [{ id: 2 }],
  });

  assert.deepEqual(getContentLists({ trips: {}, transports: 'x' }), {
    trips: [],
    transports: [],
  });
});

test('getUiText uses language-specific dataset labels', () => {
  const pl = {
    dataset: {
      emptyTrips: 'Brak dostępnych wyjazdów.',
      emptyTransports: 'Brak dostępnych transportów.',
      loadError: 'Nie udało się pobrać danych z CRM.',
      sendingLabel: 'Wysyłanie zgłoszenia...',
      successLabel: 'Dziękujemy za kontakt. Odezwiemy się wkrótce.',
      errorLabel: 'Nie udało się wysłać formularza.',
    },
  };

  const en = {
    dataset: {
      emptyTrips: 'No trips available.',
      emptyTransports: 'No transports available.',
      loadError: 'Could not load CRM data.',
      sendingLabel: 'Sending...',
      successLabel: 'Thanks for contacting us.',
      errorLabel: 'Could not send the form.',
    },
  };

  assert.equal(getUiText(pl).emptyTrips, 'Brak dostępnych wyjazdów.');
  assert.equal(getUiText(pl).loadError, 'Nie udało się pobrać danych z CRM.');
  assert.equal(getUiText(en).emptyTrips, 'No trips available.');
  assert.equal(getUiText(en).loadError, 'Could not load CRM data.');
});

test('submitLead returns success for ok JSON response', async () => {
  const fetchMock = async () => ({
    ok: true,
    headers: { get: () => 'application/json' },
    json: async () => ({ ok: true }),
    text: async () => '',
  });

  const result = await submitLead({ name: 'A' }, fetchMock);
  assert.deepEqual(result, { ok: true, result: { ok: true } });
});

test('submitLead returns error for non-ok responses', async () => {
  const fetchMock = async () => ({
    ok: false,
    headers: { get: () => 'application/json' },
    json: async () => ({ error: 'Bad request' }),
    text: async () => '',
  });

  const result = await submitLead({ name: 'A' }, fetchMock);
  assert.deepEqual(result, { ok: false, error: 'Bad request' });
});
