import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import cookie from 'cookie';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import crypto from 'crypto';

import * as openclaw from './lib/openclaw.js';
import * as assistant from './lib/assistant.js';
import { landingPage } from './views/landing.js';
import { loginPage, setupWizardPage } from './views/setup.js';
import { statusPage } from './views/status.js';
import { channelsPage } from './views/channels.js';
import { toolsPage } from './views/tools.js';
import { profilePage } from './views/profile.js';

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;
const SETUP_PASSWORD = process.env.SETUP_PASSWORD;
const OPENCLAW_GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN;
const OPENCLAW_PORT = parseInt(process.env.OPENCLAW_PORT || '18789', 10);

if (!SETUP_PASSWORD) {
  console.error('ERROR: SETUP_PASSWORD environment variable is required');
  process.exit(1);
}

const SETUP_PASSWORD_HASH = crypto.createHash('sha256').update(SETUP_PASSWORD).digest();

if (!OPENCLAW_GATEWAY_TOKEN) {
  console.error('ERROR: OPENCLAW_GATEWAY_TOKEN environment variable is required');
  process.exit(1);
}

const sessionTokens = new Map();
const csrfTokens = new Map();

function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

function generateCsrfToken(sessionToken) {
  const csrfToken = crypto.randomBytes(32).toString('hex');
  csrfTokens.set(sessionToken, csrfToken);
  return csrfToken;
}

function validateCsrf(req, res, next) {
  const sessionToken = req.cookies?.session_token;
  const csrfToken = req.body?.csrf_token || req.headers['x-csrf-token'];
  
  if (!sessionToken || !csrfTokens.has(sessionToken)) {
    return res.status(403).json({ success: false, error: 'Invalid session' });
  }
  
  if (csrfTokens.get(sessionToken) !== csrfToken) {
    return res.status(403).json({ success: false, error: 'Invalid CSRF token' });
  }
  
  next();
}

function validateOrigin(req, res, next) {
  if (req.method !== 'POST') {
    return next();
  }
  
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const host = req.headers.host;
  
  if (!origin && !referer) {
    return next();
  }
  
  const allowedHost = host?.split(':')[0];
  
  if (origin) {
    try {
      const originHost = new URL(origin).hostname;
      if (originHost !== allowedHost && originHost !== 'localhost' && originHost !== '127.0.0.1') {
        return res.status(403).json({ success: false, error: 'Invalid origin' });
      }
    } catch {
      return res.status(403).json({ success: false, error: 'Invalid origin' });
    }
  }
  
  if (referer && !origin) {
    try {
      const refererHost = new URL(referer).hostname;
      if (refererHost !== allowedHost && refererHost !== 'localhost' && refererHost !== '127.0.0.1') {
        return res.status(403).json({ success: false, error: 'Invalid referer' });
      }
    } catch {
      return res.status(403).json({ success: false, error: 'Invalid referer' });
    }
  }
  
  next();
}

const SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const SESSION_MAX_LIFETIME_MS = 12 * 60 * 60 * 1000;

function isAuthenticated(req) {
  const token = req.cookies?.session_token;
  if (!token || !sessionTokens.has(token)) return false;
  
  const session = sessionTokens.get(token);
  const now = Date.now();
  
  if ((now - session.created) > SESSION_MAX_LIFETIME_MS) {
    sessionTokens.delete(token);
    csrfTokens.delete(token);
    return false;
  }
  
  if (session.lastActivity && (now - session.lastActivity) > SESSION_IDLE_TIMEOUT_MS) {
    sessionTokens.delete(token);
    csrfTokens.delete(token);
    return false;
  }
  
  session.lastActivity = now;
  return true;
}

function requireAuth(req, res, next) {
  if (isAuthenticated(req)) {
    next();
  } else {
    res.clearCookie('session_token');
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
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
  next();
});

app.use(validateOrigin);

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

app.get('/', async (req, res) => {
  const profile = await openclaw.getProfile();
  res.send(landingPage(profile));
});

app.get('/setup', (req, res) => {
  if (isAuthenticated(req)) {
    Promise.all([openclaw.isConfigured(), Promise.resolve(openclaw.isGatewayRunning()), openclaw.getProfile()])
      .then(([configured, running, profile]) => {
        res.send(setupWizardPage(configured, running, profile));
      })
      .catch(() => {
        res.send(setupWizardPage(false, false, null));
      });
  } else {
    res.send(loginPage());
  }
});

function securePasswordCompare(inputPassword) {
  if (!inputPassword) return false;
  const inputHash = crypto.createHash('sha256').update(inputPassword).digest();
  return crypto.timingSafeEqual(inputHash, SETUP_PASSWORD_HASH);
}

app.post('/setup/login', setupLimiter, (req, res) => {
  const { password } = req.body;
  
  if (securePasswordCompare(password)) {
    const token = generateSessionToken();
    sessionTokens.set(token, { created: Date.now(), lastActivity: Date.now() });
    generateCsrfToken(token);
    res.cookie('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 12 * 60 * 60 * 1000
    });
    res.redirect('/setup');
  } else {
    res.send(loginPage('Invalid password'));
  }
});

app.post('/setup/run', setupLimiter, requireAuth, validateCsrf, async (req, res) => {
  try {
    const { provider, apiKey, model } = req.body;
    
    if (!provider || !apiKey || !model) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    const validProviders = ['openai', 'anthropic', 'openrouter', 'gemini', 'moonshot', 'minimax', 'opencode-zen', 'vercel', 'synthetic'];
    if (!validProviders.includes(provider)) {
      return res.status(400).json({ success: false, error: 'Invalid provider' });
    }
    
    const result = await openclaw.runOnboard(provider, apiKey, model);
    res.json({ success: result.success, stdout: result.stdout, stderr: result.stderr });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/status', requireAuth, async (req, res) => {
  try {
    const [version, configured, logs, channels, profile] = await Promise.all([
      openclaw.getVersion(),
      openclaw.isConfigured(),
      openclaw.getLogs(200),
      openclaw.getChannelStatus(),
      openclaw.getProfile()
    ]);
    
    let infoMessage = null;
    if (req.query.info === 'channels_disabled') {
      infoMessage = '<strong>Safe Mode:</strong> Channels are disabled. Switch to Power Mode to connect messaging platforms.';
    } else if (req.query.info === 'tools_disabled') {
      infoMessage = '<strong>Safe Mode:</strong> Web tools are disabled. Switch to Power Mode to enable search tools (they increase risk).';
    }
    
    res.send(statusPage({
      version,
      isConfigured: configured,
      gatewayRunning: openclaw.isGatewayRunning(),
      logs,
      health: null,
      channels,
      profile,
      infoMessage
    }));
  } catch (err) {
    res.send(statusPage({
      version: 'Error',
      isConfigured: false,
      gatewayRunning: false,
      logs: 'Error loading logs: ' + err.message,
      health: null,
      profile: null,
      infoMessage: null
    }));
  }
});

app.post('/api/gateway/start', apiLimiter, requireAuth, validateCsrf, async (req, res) => {
  try {
    const result = await openclaw.startGateway();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/gateway/stop', apiLimiter, requireAuth, validateCsrf, async (req, res) => {
  try {
    const result = await openclaw.stopGateway();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/csrf-token', apiLimiter, requireAuth, (req, res) => {
  const sessionToken = req.cookies?.session_token;
  if (!sessionToken || !csrfTokens.has(sessionToken)) {
    return res.status(403).json({ error: 'No valid session' });
  }
  res.json({ token: csrfTokens.get(sessionToken) });
});

app.get('/api/health', apiLimiter, requireAuth, async (req, res) => {
  try {
    const result = await openclaw.runHealth();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/logs', apiLimiter, requireAuth, async (req, res) => {
  try {
    const logs = await openclaw.getLogs(200);
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/verify', apiLimiter, requireAuth, validateCsrf, async (req, res) => {
  try {
    const results = await openclaw.runQuickVerify();
    res.json({ results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/security/audit', apiLimiter, requireAuth, validateCsrf, async (req, res) => {
  try {
    const result = await openclaw.runSecurityAudit();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/security/fix', apiLimiter, requireAuth, validateCsrf, async (req, res) => {
  try {
    const result = await openclaw.runSecurityFix();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


app.get('/channels', requireAuth, async (req, res) => {
  try {
    const profile = await openclaw.getProfile();
    if (!profile || profile === 'safe') {
      return res.redirect('/status?info=channels_disabled');
    }
    const channelStatus = await openclaw.getChannelStatus();
    res.send(channelsPage(channelStatus, profile));
  } catch (err) {
    res.status(500).send('Error loading channels page');
  }
});

app.get('/tools', requireAuth, async (req, res) => {
  try {
    const profile = await openclaw.getProfile();
    if (!profile || profile === 'safe') {
      return res.redirect('/status?info=tools_disabled');
    }
    const toolsStatus = await openclaw.getWebToolsStatus();
    res.send(toolsPage(toolsStatus, profile));
  } catch (err) {
    res.status(500).send('Error loading tools page');
  }
});

app.get('/profile', requireAuth, async (req, res) => {
  try {
    const currentProfile = await openclaw.getProfile();
    res.send(profilePage(currentProfile));
  } catch (err) {
    res.status(500).send('Error loading profile page');
  }
});

app.post('/api/profile', apiLimiter, requireAuth, validateCsrf, async (req, res) => {
  try {
    const { profile } = req.body;
    if (!profile || !['safe', 'power'].includes(profile)) {
      return res.status(400).json({ success: false, error: 'Invalid profile' });
    }
    const result = await openclaw.setProfile(profile);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/profile', apiLimiter, requireAuth, async (req, res) => {
  try {
    const profile = await openclaw.getProfile();
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/wipe-all', apiLimiter, requireAuth, validateCsrf, async (req, res) => {
  try {
    const { password } = req.body;
    if (password !== SETUP_PASSWORD) {
      return res.status(403).json({ success: false, error: 'Invalid password. Wipe requires password confirmation.' });
    }
    const result = await openclaw.wipeEverything();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/channels/status', apiLimiter, requireAuth, async (req, res) => {
  try {
    const status = await openclaw.getChannelStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/channels/whatsapp/login', apiLimiter, requireAuth, validateCsrf, async (req, res) => {
  try {
    const result = await openclaw.startWhatsAppLogin();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/channels/telegram/configure', apiLimiter, requireAuth, validateCsrf, async (req, res) => {
  try {
    const { botToken, dmPolicy } = req.body;
    const currentStatus = await openclaw.getChannelStatus();
    
    if (!botToken && !currentStatus.telegram?.connected) {
      return res.status(400).json({ success: false, error: 'Bot token is required' });
    }
    const result = await openclaw.configureChannel('telegram', { botToken, dmPolicy, keepExistingToken: !botToken });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/channels/discord/configure', apiLimiter, requireAuth, validateCsrf, async (req, res) => {
  try {
    const { botToken, dmPolicy } = req.body;
    const currentStatus = await openclaw.getChannelStatus();
    
    if (!botToken && !currentStatus.discord?.connected) {
      return res.status(400).json({ success: false, error: 'Bot token is required' });
    }
    const result = await openclaw.configureChannel('discord', { botToken, dmPolicy, keepExistingToken: !botToken });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/tools/web-search/configure', apiLimiter, requireAuth, validateCsrf, async (req, res) => {
  try {
    const { provider, apiKey, model } = req.body;
    const currentStatus = await openclaw.getWebToolsStatus();
    
    if (!apiKey && !currentStatus.webSearch?.enabled) {
      return res.status(400).json({ success: false, error: 'API key is required' });
    }
    const result = await openclaw.configureWebSearch({ provider, apiKey, model });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/tools/web-search/disable', apiLimiter, requireAuth, validateCsrf, async (req, res) => {
  try {
    const result = await openclaw.disableWebSearch();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/tools/status', apiLimiter, requireAuth, async (req, res) => {
  try {
    const status = await openclaw.getWebToolsStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/channels/:channel/disconnect', apiLimiter, requireAuth, validateCsrf, async (req, res) => {
  try {
    const result = await openclaw.disconnectChannel(req.params.channel);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/pairing/list', apiLimiter, requireAuth, async (req, res) => {
  try {
    const result = await openclaw.getPairingRequests();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/pairing/approve', apiLimiter, requireAuth, validateCsrf, async (req, res) => {
  try {
    const { channel, code } = req.body;
    if (!channel || !code) {
      return res.status(400).json({ success: false, error: 'Channel and code are required' });
    }
    const result = await openclaw.approvePairing(channel, code);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/pairing/deny', apiLimiter, requireAuth, validateCsrf, async (req, res) => {
  try {
    const { channel, code } = req.body;
    if (!channel || !code) {
      return res.status(400).json({ success: false, error: 'Channel and code are required' });
    }
    const result = await openclaw.denyPairing(channel, code);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/assistant/chat', apiLimiter, requireAuth, validateCsrf, async (req, res) => {
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

app.use('/openclaw', requireAuth, (req, res, next) => {
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

const server = http.createServer(app);

server.on('upgrade', (req, socket, head) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const sessionToken = cookies.session_token;
  
  if (!sessionToken || !sessionTokens.has(sessionToken)) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }
  
  const session = sessionTokens.get(sessionToken);
  const now = Date.now();
  
  if ((now - session.created) > SESSION_MAX_LIFETIME_MS) {
    sessionTokens.delete(sessionToken);
    csrfTokens.delete(sessionToken);
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }
  
  if (session.lastActivity && (now - session.lastActivity) > SESSION_IDLE_TIMEOUT_MS) {
    sessionTokens.delete(sessionToken);
    csrfTokens.delete(sessionToken);
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }
  
  session.lastActivity = now;
  
  if (!req.url.startsWith('/openclaw')) {
    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
    socket.destroy();
    return;
  }
  
  gatewayProxy.upgrade(req, socket, head);
});

server.listen(PORT, '0.0.0.0', async () => {
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
