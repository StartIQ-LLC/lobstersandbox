import express from 'express';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import crypto from 'crypto';

import * as openclaw from './lib/openclaw.js';
import * as assistant from './lib/assistant.js';
import { landingPage } from './views/landing.js';
import { loginPage, setupWizardPage } from './views/setup.js';
import { statusPage } from './views/status.js';

const app = express();
const PORT = process.env.PORT || 5000;
const SETUP_PASSWORD = process.env.SETUP_PASSWORD;
const OPENCLAW_GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN;
const OPENCLAW_PORT = parseInt(process.env.OPENCLAW_PORT || '18789', 10);

if (!SETUP_PASSWORD) {
  console.error('ERROR: SETUP_PASSWORD environment variable is required');
  process.exit(1);
}

if (!OPENCLAW_GATEWAY_TOKEN) {
  console.error('ERROR: OPENCLAW_GATEWAY_TOKEN environment variable is required');
  process.exit(1);
}

const sessionTokens = new Map();

function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

function isAuthenticated(req) {
  const token = req.cookies?.session_token;
  return token && sessionTokens.has(token);
}

function requireAuth(req, res, next) {
  if (isAuthenticated(req)) {
    next();
  } else {
    res.redirect('/setup');
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/favicon.ico', (req, res) => {
  res.redirect('/favicon.png');
});

app.get('/favicon.png', (req, res) => {
  res.sendFile('public/favicon.png', { root: '.' });
});

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  next();
});

const setupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/', (req, res) => {
  res.send(landingPage());
});

app.get('/setup', (req, res) => {
  if (isAuthenticated(req)) {
    Promise.all([openclaw.isConfigured(), Promise.resolve(openclaw.isGatewayRunning())])
      .then(([configured, running]) => {
        res.send(setupWizardPage(configured, running));
      })
      .catch(() => {
        res.send(setupWizardPage(false, false));
      });
  } else {
    res.send(loginPage());
  }
});

app.post('/setup/login', setupLimiter, (req, res) => {
  const { password } = req.body;
  
  if (password === SETUP_PASSWORD) {
    const token = generateSessionToken();
    sessionTokens.set(token, { created: Date.now() });
    res.cookie('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });
    res.redirect('/setup');
  } else {
    res.send(loginPage('Invalid password'));
  }
});

app.post('/setup/run', setupLimiter, requireAuth, async (req, res) => {
  try {
    const { provider, apiKey, model } = req.body;
    
    if (!provider || !apiKey || !model) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    if (!['openai', 'anthropic', 'openrouter'].includes(provider)) {
      return res.status(400).json({ success: false, error: 'Invalid provider' });
    }
    
    const result = await openclaw.runOnboard(provider, apiKey, model);
    res.json({ success: result.success, stdout: result.stdout, stderr: result.stderr });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/status', async (req, res) => {
  try {
    const [version, configured, logs] = await Promise.all([
      openclaw.getVersion(),
      openclaw.isConfigured(),
      openclaw.getLogs(200)
    ]);
    
    res.send(statusPage({
      version,
      isConfigured: configured,
      gatewayRunning: openclaw.isGatewayRunning(),
      logs,
      health: null
    }));
  } catch (err) {
    res.send(statusPage({
      version: 'Error',
      isConfigured: false,
      gatewayRunning: false,
      logs: 'Error loading logs: ' + err.message,
      health: null
    }));
  }
});

app.post('/api/gateway/start', apiLimiter, requireAuth, async (req, res) => {
  try {
    const result = await openclaw.startGateway();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/gateway/stop', apiLimiter, requireAuth, async (req, res) => {
  try {
    const result = await openclaw.stopGateway();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/health', apiLimiter, async (req, res) => {
  try {
    const result = await openclaw.runHealth();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/logs', apiLimiter, async (req, res) => {
  try {
    const logs = await openclaw.getLogs(200);
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/verify', apiLimiter, requireAuth, async (req, res) => {
  try {
    const results = await openclaw.runQuickVerify();
    res.json({ results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/security/audit', apiLimiter, requireAuth, async (req, res) => {
  try {
    const result = await openclaw.runSecurityAudit();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/security/fix', apiLimiter, requireAuth, async (req, res) => {
  try {
    const result = await openclaw.runSecurityFix();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/wipe', apiLimiter, requireAuth, async (req, res) => {
  try {
    const result = await openclaw.wipeEverything();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/assistant/chat', apiLimiter, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }
    const response = await assistant.chat(message);
    res.json({ response });
  } catch (err) {
    console.error('Assistant error:', err.message);
    res.status(500).json({ response: "I'm having trouble right now. Please try again!" });
  }
});

const gatewayProxy = createProxyMiddleware({
  target: `http://127.0.0.1:${OPENCLAW_PORT}`,
  changeOrigin: true,
  ws: true,
  pathRewrite: {
    '^/openclaw': ''
  },
  on: {
    proxyReq: (proxyReq, req, res) => {
      if (OPENCLAW_GATEWAY_TOKEN) {
        proxyReq.setHeader('Authorization', `Bearer ${OPENCLAW_GATEWAY_TOKEN}`);
      }
    },
    error: (err, req, res) => {
      console.error('Proxy error:', err.message);
      if (res.writeHead) {
        res.writeHead(502, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html>
          <head><title>Gateway Not Available</title></head>
          <body style="font-family: system-ui; padding: 40px; text-align: center;">
            <h1>Gateway Not Available</h1>
            <p>The OpenClaw gateway is not running or not configured.</p>
            <p><a href="/setup">Go to Setup</a> | <a href="/status">View Status</a></p>
          </body>
          </html>
        `);
      }
    }
  }
});

app.use('/openclaw', (req, res, next) => {
  if (!openclaw.isGatewayRunning()) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Gateway Not Running - LobsterSandbox</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-50 min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div class="text-6xl mb-4">🦞</div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">Gateway Not Running</h1>
          <p class="text-gray-600 mb-6">Start the gateway from the setup page to use the Control UI.</p>
          <div class="flex gap-4 justify-center">
            <a href="/setup" class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Go to Setup</a>
            <a href="/status" class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg">View Status</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }
  next();
}, gatewayProxy);

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`LobsterSandbox running on http://0.0.0.0:${PORT}`);
  console.log('');
  console.log('Routes:');
  console.log('  /         - Landing page');
  console.log('  /setup    - Setup wizard (password protected)');
  console.log('  /status   - System status and logs');
  console.log('  /openclaw - OpenClaw Control UI (proxied)');
  console.log('');
  
  try {
    const version = await openclaw.getVersion();
    console.log('OpenClaw version:', version);
  } catch (err) {
    console.log('OpenClaw CLI:', err.message);
  }
});
