function normalizeLanguage(value) {
  return value === 'en' ? 'en' : 'pl';
}

function validateLeadPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'Invalid payload.' };
  }

  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim();
  const phone = String(payload.phone || '').trim();
  const message = String(payload.message || '').trim();
  const language = normalizeLanguage(payload.language);

  if (!name) {
    return { valid: false, error: 'Name is required.' };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: 'Valid email is required.' };
  }

  return {
    valid: true,
    lead: { name, email, phone, message, language },
  };
}

function normalizeTripsAndTransports(data) {
  const trips = Array.isArray(data?.trips) ? data.trips : [];
  const transports = Array.isArray(data?.transports) ? data.transports : [];
  return { trips, transports };
}

module.exports = {
  normalizeLanguage,
  normalizeTripsAndTransports,
  validateLeadPayload,
};
