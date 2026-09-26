const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { normalizeLanguage, normalizeTripsAndTransports, validateLeadPayload } = require('./src/domain');

const PORT = Number(process.env.PORT || 3000);
const CRM_BASE_URL = process.env.CRM_BASE_URL || '';
const CRM_API_TOKEN = process.env.CRM_API_TOKEN || '';
const CRM_CONTENT_PATH = process.env.CRM_CONTENT_PATH || '/api/public/offers';
const CRM_LEADS_PATH = process.env.CRM_LEADS_PATH || '/api/leads';

const STATIC_DIR = path.join(__dirname, 'public');
const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

function json(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let settled = false;
    const fail = (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };

    req.on('data', (chunk) => {
      if (body.length + chunk.length > 1_000_000) {
        fail(new Error('Payload too large.'));
        req.pause();
        return;
      }
      body += chunk;
    });
    req.on('end', () => {
      if (settled) return;
      try {
        settled = true;
        resolve(body ? JSON.parse(body) : {});
      } catch {
        fail(new Error('Invalid JSON body.'));
      }
    });
    req.on('error', fail);
  });
}

function getCrmHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (CRM_API_TOKEN) {
    headers.Authorization = 'Bearer ' + CRM_API_TOKEN;
  }
  return headers;
}

async function fetchContentFromCrm(language) {
  if (!CRM_BASE_URL) {
    return {
      trips: [],
      transports: [],
    };
  }

  const url = new URL(CRM_CONTENT_PATH, CRM_BASE_URL);
  url.searchParams.set('lang', language);

  const response = await fetch(url, {
    headers: getCrmHeaders(),
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`CRM content request failed with status ${response.status}`);
  }

  const data = await response.json();
  return normalizeTripsAndTransports(data);
}

async function sendLeadToCrm(lead) {
  if (!CRM_BASE_URL) {
    return { accepted: true, mode: 'stub' };
  }

  const url = new URL(CRM_LEADS_PATH, CRM_BASE_URL);
  const response = await fetch(url, {
    method: 'POST',
    headers: getCrmHeaders(),
    body: JSON.stringify(lead),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`CRM lead request failed with status ${response.status}: ${details.slice(0, 200)}`);
  }

  const contentType = response.headers.get('content-type') || '';
  return contentType.includes('application/json') ? response.json() : { accepted: true };
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      json(res, 404, { error: 'Not found' });
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': CONTENT_TYPES[extension] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(data);
  });
}

function resolvePublicFile(requestPath) {
  if (requestPath === '/' || requestPath === '/pl' || requestPath === '/pl/') {
    return path.join(STATIC_DIR, 'pl', 'index.html');
  }

  if (requestPath === '/en' || requestPath === '/en/') {
    return path.join(STATIC_DIR, 'en', 'index.html');
  }

  const relativePath = requestPath.replace(/^\/+/, '');
  const cleanedPath = path.normalize(relativePath);
  return path.resolve(STATIC_DIR, cleanedPath);
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && requestUrl.pathname === '/api/content') {
    try {
      const language = normalizeLanguage(requestUrl.searchParams.get('lang'));
      const data = await fetchContentFromCrm(language);
      json(res, 200, data);
    } catch (error) {
      json(res, 502, { error: 'Cannot fetch CRM content.', details: error.message });
    }
    return;
  }

  if (req.method === 'POST' && requestUrl.pathname === '/api/leads') {
    try {
      const payload = await parseBody(req);
      const validation = validateLeadPayload(payload);
      if (!validation.valid) {
        json(res, 400, { error: validation.error });
        return;
      }

      try {
        const crmResult = await sendLeadToCrm(validation.lead);
        json(res, 200, { ok: true, crmResult });
      } catch (error) {
        json(res, 502, { error: 'Cannot send lead to CRM.', details: error.message });
      }
    } catch (error) {
      json(res, 400, { error: error.message || 'Invalid request payload.' });
    }
    return;
  }

  const filePath = resolvePublicFile(requestUrl.pathname);
  if (!filePath.startsWith(STATIC_DIR)) {
    json(res, 403, { error: 'Forbidden' });
    return;
  }

  serveFile(res, filePath);
});

if (require.main === module) {
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = { server };
