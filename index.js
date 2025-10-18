require('dotenv').config();

const express = require('express');
const axios = require('axios');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const https = require('https');

const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const USER_EMAIL = process.env.USER_EMAIL || 'okeowokabir@gmail.com';
const USER_FULLNAME = process.env.USER_FULLNAME || 'Okeowo Abdulkabir';
const USER_STACK = process.env.USER_STACK || 'Node.js/Express';
const CATFACT_URL = process.env.CATFACT_URL || 'https://catfact.ninja/fact';
const CATFACT_TIMEOUT_MS = process.env.CATFACT_TIMEOUT_MS ? Number(process.env.CATFACT_TIMEOUT_MS) : 2500;
const RATE_LIMIT_WINDOW_MIN = process.env.RATE_LIMIT_WINDOW_MIN ? Number(process.env.RATE_LIMIT_WINDOW_MIN) : 1;
const RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX ? Number(process.env.RATE_LIMIT_MAX) : 60;

app.use(helmet());
app.use(cors()); 
app.use(express.json());
app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MIN * 60 * 1000,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

const keepAliveAgent = new https.Agent({
 keepAlive: true,
  maxSockets: 10,
  maxFreeSockets: 5,
  timeout: 30000,
  keepAliveMsecs: 5000,
})

axios.defaults.httpsAgent = keepAliveAgent;
// Helper: fetch cat fact with timeout and graceful fallback
async function fetchCatFact() {
  try {
    const resp = await axios.get(CATFACT_URL, {
      timeout: CATFACT_TIMEOUT_MS,
      headers: { Accept: 'application/json' }
    });

    // The catfact.ninja returns { fact: "...", length: 123 }
    if (resp && resp.data && typeof resp.data.fact === 'string') {
      return resp.data.fact;
    }

    console.warn('fetchCatFact: unexpected response shape', resp && resp.data);
    return null;
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      console.warn(`fetchCatFact: request timed out after ${CATFACT_TIMEOUT_MS}ms`);
    } else if (err.response) {
      console.warn(`fetchCatFact: non-2xx status ${err.response.status}`);
    } else {
      console.warn('fetchCatFact: network/error', err.message || err);
    }
    return null;
  }
}

// --- Route: GET /me ---
app.get('/me', async (req, res) => {
  const timestamp = new Date().toISOString();
  const fact = await fetchCatFact();

  const responsePayload = {
    status: 'success',
    user: {
      email: USER_EMAIL,
      name: USER_FULLNAME,
      stack: USER_STACK
    },
    timestamp,
    fact: fact || 'Could not fetch a cat fact right now — try again in a moment.'
  };

  // Ensure proper content-type and send
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(responsePayload);
});

// --- Healthcheck (optional) ---
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    up: true,
    timestamp: new Date().toISOString()
  });
});

// --- 404 fallback ---
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Not found' });
});

async function prewarmCatFact() {
  let fact = await fetchCatFact();
  if (fact) {
    console.log('Prewarm successful ✅');
    return;
  }

  // retry once silently
  fact = await fetchCatFact();
  if (fact) {
    console.log('Prewarm successful ✅');
  }
}
prewarmCatFact();
// --- Error handler ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`HNG Stage 0 server running on port http://localhost:${PORT}`);
  console.log(`GET /me -> returns profile + cat fact`);
});
