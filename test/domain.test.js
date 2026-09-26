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

  const result = validateLeadPayload({
    name: ' John ',
    email: ' john@example.com ',
    phone: ' 123 ',
    message: ' Hi ',
    language: 'en',
  });
  assert.equal(result.valid, true);
  assert.deepEqual(result.lead, {
    name: 'John',
    email: 'john@example.com',
    phone: '123',
    message: 'Hi',
    language: 'en',
  });
});

test('validateLeadPayload defaults unsupported language to pl', () => {
  const result = validateLeadPayload({ name: 'John', email: 'john@example.com', language: 'de' });
  assert.equal(result.valid, true);
  assert.equal(result.lead.language, 'pl');
});

test('validateLeadPayload handles missing optional fields', () => {
  const result = validateLeadPayload({ name: 'Jane', email: 'jane@example.com' });
  assert.equal(result.valid, true);
  assert.equal(result.lead.phone, '');
  assert.equal(result.lead.message, '');
  assert.equal(result.lead.language, 'pl');
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
