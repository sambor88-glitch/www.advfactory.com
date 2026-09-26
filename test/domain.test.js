const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeLanguage, normalizeTripsAndTransports, validateLeadPayload } = require('../src/domain');

test('normalizeLanguage defaults to pl', () => {
  assert.equal(normalizeLanguage('xx'), 'pl');
  assert.equal(normalizeLanguage(undefined), 'pl');
  assert.equal(normalizeLanguage('en'), 'en');
});

test('validateLeadPayload validates required fields', () => {
  assert.equal(validateLeadPayload({}).valid, false);
  assert.equal(validateLeadPayload({ name: 'A', email: 'wrong' }).valid, false);

  const result = validateLeadPayload({ name: 'John', email: 'john@example.com', language: 'en' });
  assert.equal(result.valid, true);
  assert.equal(result.lead.language, 'en');
});

test('normalizeTripsAndTransports ensures array shape', () => {
  assert.deepEqual(normalizeTripsAndTransports({}), { trips: [], transports: [] });
  assert.deepEqual(
    normalizeTripsAndTransports({ trips: [{ title: 'Trip 1' }], transports: [{ title: 'Bus' }] }),
    {
      trips: [{ title: 'Trip 1' }],
      transports: [{ title: 'Bus' }],
    },
  );
});
