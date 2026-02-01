import { spawn, exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const OPENCLAW_HOME = process.env.OPENCLAW_HOME || './data/home';
const OPENCLAW_LOG = process.env.OPENCLAW_LOG || './data/logs/openclaw.log';
const OPENCLAW_PORT = parseInt(process.env.OPENCLAW_PORT || '18789', 10);
const OPENCLAW_BIND = process.env.OPENCLAW_BIND || '127.0.0.1';
const OPENCLAW_GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN;

let gatewayProcess = null;
let storedApiKey = null;

function getCliPath() {
  const localPath = path.join(process.cwd(), 'node_modules', '.bin', 'openclaw');
  return 'openclaw';
}

function maskSecrets(text) {
  if (!text) return text;
  
  let masked = text;
  
  if (storedApiKey && storedApiKey.length > 8) {
    const escaped = storedApiKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    masked = masked.replace(new RegExp(escaped, 'g'), '[REDACTED_API_KEY]');
  }
  
  if (OPENCLAW_GATEWAY_TOKEN && OPENCLAW_GATEWAY_TOKEN.length > 8) {
    const escaped = OPENCLAW_GATEWAY_TOKEN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    masked = masked.replace(new RegExp(escaped, 'g'), '[REDACTED_TOKEN]');
  }
  
  masked = masked.replace(/sk-[a-zA-Z0-9]{20,}/g, '[REDACTED_OPENAI_KEY]');
  masked = masked.replace(/sk-ant-[a-zA-Z0-9-]{20,}/g, '[REDACTED_ANTHROPIC_KEY]');
  masked = masked.replace(/sk-or-[a-zA-Z0-9-]{20,}/g, '[REDACTED_OPENROUTER_KEY]');
  masked = masked.replace(/[a-zA-Z0-9_-]{32,}/g, (match) => {
    if (match.includes('REDACTED')) return match;
    if (/^[a-f0-9]+$/i.test(match)) return match;
    return '[REDACTED_KEY]';
  });
  
  return masked;
}

async function ensureDirectories() {
  await fs.mkdir(path.dirname(OPENCLAW_LOG), { recursive: true });
  await fs.mkdir(OPENCLAW_HOME, { recursive: true });
}

async function appendLog(data) {
  try {
    await ensureDirectories();
    const maskedData = maskSecrets(data);
    await fs.appendFile(OPENCLAW_LOG, maskedData);
  } catch (err) {
    console.error('Failed to write log:', err.message);
  }
}

function runCommand(args, options = {}) {
  return new Promise(async (resolve, reject) => {
    await ensureDirectories();
    
    const cli = getCliPath();
    const env = {
      ...process.env,
      HOME: path.resolve(OPENCLAW_HOME),
      OPENCLAW_HOME: path.resolve(OPENCLAW_HOME),
      ...(options.extraEnv || {}),
    };
    
    const timestamp = new Date().toISOString();
    await appendLog(`\n[${timestamp}] Running: openclaw ${args.join(' ')}\n`);
    
    const proc = spawn(cli, args, {
      env,
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
      ...options
    });
    
    let stdout = '';
    let stderr = '';
    
    proc.stdout.on('data', async (data) => {
      const text = data.toString();
      stdout += text;
      await appendLog(text);
    });
    
    proc.stderr.on('data', async (data) => {
      const text = data.toString();
      stderr += text;
      await appendLog(text);
    });
    
    proc.on('close', (code) => {
      resolve({
        code,
        stdout: maskSecrets(stdout),
        stderr: maskSecrets(stderr),
        success: code === 0
      });
    });
    
    proc.on('error', (err) => {
      reject(err);
    });
  });
}

export async function getVersion() {
  try {
    const result = await runCommand(['--version']);
    return result.stdout.trim() || result.stderr.trim() || 'Unknown';
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

export async function isConfigured() {
  try {
    const configPath = path.join(OPENCLAW_HOME, '.openclaw', 'openclaw.json');
    await fs.access(configPath);
    return true;
  } catch {
    return false;
  }
}

export async function runOnboard(provider, apiKey, model) {
  storedApiKey = apiKey;
  
  const envVarMap = {
    synthetic: 'SYNTHETIC_API_KEY',
    gemini: 'GEMINI_API_KEY', 
    moonshot: 'MOONSHOT_API_KEY',
    minimax: 'MINIMAX_API_KEY'
  };
  
  const needsEnvConfig = ['gemini', 'moonshot', 'minimax'];
  
  if (needsEnvConfig.includes(provider)) {
    await configureEnvProvider(provider, apiKey);
    await setDefaultModel(model);
    await appendLog(`[INFO] Configured ${provider} via environment variable. Use 'openclaw configure' for advanced setup.\n`);
    return { 
      success: true, 
      stdout: `${provider} configured via API key. Model set to ${model}.`,
      stderr: '',
      code: 0
    };
  }
  
  const args = [
    'onboard',
    '--non-interactive',
    '--mode', 'local',
    '--flow', 'quickstart',
    '--gateway-port', OPENCLAW_PORT.toString(),
    '--gateway-bind', 'loopback',
    '--gateway-auth', 'token',
    '--gateway-token', OPENCLAW_GATEWAY_TOKEN,
    '--skip-skills'
  ];
  
  switch (provider) {
    case 'openai':
      args.push('--openai-api-key', apiKey);
      break;
    case 'anthropic':
      args.push('--anthropic-api-key', apiKey);
      break;
    case 'openrouter':
      args.push('--auth-choice', 'apiKey');
      args.push('--token-provider', 'openrouter');
      args.push('--token', apiKey);
      break;
    case 'opencode-zen':
      args.push('--auth-choice', 'opencode-zen');
      args.push('--opencode-zen-api-key', apiKey);
      break;
    case 'vercel':
      args.push('--auth-choice', 'ai-gateway-api-key');
      args.push('--ai-gateway-api-key', apiKey);
      break;
    case 'synthetic':
      args.push('--auth-choice', 'synthetic-api-key');
      break;
    default:
      throw new Error('Unknown provider: ' + provider);
  }
  
  const runOptions = {};
  
  if (envVarMap[provider]) {
    runOptions.extraEnv = { [envVarMap[provider]]: apiKey };
    await configureEnvProvider(provider, apiKey);
  }
  
  const result = await runCommand(args, runOptions);
  
  if (result.success && model) {
    await setDefaultModel(model);
  }
  
  return result;
}

async function setDefaultModel(model) {
  try {
    const configDir = path.join(OPENCLAW_HOME, '.openclaw');
    const configPath = path.join(configDir, 'openclaw.json');
    
    await fs.mkdir(configDir, { recursive: true });
    
    let config = {};
    
    try {
      const configData = await fs.readFile(configPath, 'utf-8');
      config = JSON.parse(configData);
    } catch {
      await appendLog(`[INFO] Creating new config file\n`);
    }
    
    if (!config.agents) config.agents = {};
    if (!config.agents.defaults) config.agents.defaults = {};
    if (!config.agents.defaults.model) config.agents.defaults.model = {};
    config.agents.defaults.model.primary = model;
    
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    await appendLog(`[INFO] Set default model to: ${model}\n`);
  } catch (err) {
    await appendLog(`[WARN] Could not set default model: ${err.message}\n`);
  }
}

async function configureEnvProvider(provider, apiKey) {
  const envVarMap = {
    synthetic: 'SYNTHETIC_API_KEY',
    gemini: 'GEMINI_API_KEY',
    moonshot: 'MOONSHOT_API_KEY',
    minimax: 'MINIMAX_API_KEY'
  };
  
  const envVar = envVarMap[provider];
  if (!envVar) return;
  
  try {
    const configDir = path.join(OPENCLAW_HOME, '.openclaw');
    const configPath = path.join(configDir, 'openclaw.json');
    
    await fs.mkdir(configDir, { recursive: true });
    
    let config = {};
    
    try {
      const configData = await fs.readFile(configPath, 'utf-8');
      config = JSON.parse(configData);
    } catch {
      config = {};
    }
    
    if (!config.env) config.env = {};
    config.env[envVar] = apiKey;
    
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    await appendLog(`[INFO] Configured ${provider} environment variable\n`);
  } catch (err) {
    await appendLog(`[WARN] Could not configure ${provider}: ${err.message}\n`);
  }
}

export function isGatewayRunning() {
  return gatewayProcess !== null && !gatewayProcess.killed;
}

export async function startGateway() {
  if (isGatewayRunning()) {
    return { success: true, message: 'Gateway is already running' };
  }
  
  const configured = await isConfigured();
  if (!configured) {
    return { success: false, message: 'OpenClaw is not configured. Please run setup first.' };
  }
  
  await ensureDirectories();
  
  const cli = getCliPath();
  const env = {
    ...process.env,
    HOME: path.resolve(OPENCLAW_HOME),
    OPENCLAW_HOME: path.resolve(OPENCLAW_HOME),
  };
  
  const args = [
    'gateway',
    '--port', OPENCLAW_PORT.toString(),
    '--bind', 'loopback',
    '--auth', 'token',
    '--token', OPENCLAW_GATEWAY_TOKEN,
    '--verbose'
  ];
  
  const timestamp = new Date().toISOString();
  await appendLog(`\n[${timestamp}] Starting gateway: openclaw ${args.join(' ').replace(OPENCLAW_GATEWAY_TOKEN, '[TOKEN]')}\n`);
  
  gatewayProcess = spawn(cli, args, {
    env,
    cwd: process.cwd(),
    stdio: ['pipe', 'pipe', 'pipe'],
    detached: false
  });
  
  gatewayProcess.stdout.on('data', async (data) => {
    await appendLog(data.toString());
  });
  
  gatewayProcess.stderr.on('data', async (data) => {
    await appendLog(data.toString());
  });
  
  gatewayProcess.on('close', async (code) => {
    await appendLog(`[INFO] Gateway process exited with code ${code}\n`);
    gatewayProcess = null;
  });
  
  gatewayProcess.on('error', async (err) => {
    await appendLog(`[ERROR] Gateway process error: ${err.message}\n`);
    gatewayProcess = null;
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (isGatewayRunning()) {
    return { success: true, message: 'Gateway started successfully' };
  } else {
    return { success: false, message: 'Gateway failed to start. Check logs for details.' };
  }
}

export async function stopGateway() {
  if (!isGatewayRunning()) {
    return { success: true, message: 'Gateway is not running' };
  }
  
  await appendLog(`[INFO] Stopping gateway...\n`);
  
  gatewayProcess.kill('SIGTERM');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (gatewayProcess && !gatewayProcess.killed) {
    gatewayProcess.kill('SIGKILL');
  }
  
  gatewayProcess = null;
  
  return { success: true, message: 'Gateway stopped' };
}

export async function runQuickVerify() {
  const results = [];
  
  const status = await runCommand(['status']);
  results.push({ command: 'openclaw status', ...status });
  
  const health = await runCommand(['health']);
  results.push({ command: 'openclaw health', ...health });
  
  const audit = await runCommand(['security', 'audit', '--deep']);
  results.push({ command: 'openclaw security audit --deep', ...audit });
  
  return results;
}

export async function runSecurityAudit() {
  return await runCommand(['security', 'audit', '--deep']);
}

export async function runSecurityFix() {
  return await runCommand(['security', 'audit', '--fix']);
}

export async function runHealth() {
  return await runCommand(['health']);
}

export async function wipeEverything() {
  await stopGateway();
  
  const resetResult = await runCommand(['reset', '--scope', 'full', '--yes', '--non-interactive']);
  
  try {
    await fs.rm(OPENCLAW_HOME, { recursive: true, force: true });
    await fs.rm(path.dirname(OPENCLAW_LOG), { recursive: true, force: true });
    await ensureDirectories();
  } catch (err) {
    console.error('Error cleaning directories:', err.message);
  }
  
  storedApiKey = null;
  
  return { ...resetResult, message: 'Everything has been wiped' };
}

export async function getLogs(lines = 200) {
  try {
    const content = await fs.readFile(OPENCLAW_LOG, 'utf-8');
    const allLines = content.split('\n');
    const lastLines = allLines.slice(-lines).join('\n');
    return maskSecrets(lastLines);
  } catch (err) {
    return 'No logs available yet.';
  }
}

export function getGatewayUrl() {
  return `http://127.0.0.1:${OPENCLAW_PORT}`;
}

export function getGatewayPort() {
  return OPENCLAW_PORT;
}

export async function getChannelStatus() {
  try {
    const configDir = path.join(OPENCLAW_HOME, '.openclaw');
    const configPath = path.join(configDir, 'openclaw.json');
    
    let config = {};
    try {
      const configData = await fs.readFile(configPath, 'utf-8');
      config = JSON.parse(configData);
    } catch {
      return { whatsapp: { connected: false }, telegram: { connected: false } };
    }
    
    const channels = config.channels || {};
    
    return {
      whatsapp: {
        connected: !!channels.whatsapp?.enabled,
        dmPolicy: channels.whatsapp?.dmPolicy || 'pairing'
      },
      telegram: {
        connected: !!channels.telegram?.enabled && !!channels.telegram?.botToken,
        tokenMasked: channels.telegram?.botToken ? '••••••••' + channels.telegram.botToken.slice(-8) : '',
        dmPolicy: channels.telegram?.dmPolicy || 'pairing'
      }
    };
  } catch (err) {
    await appendLog(`[WARN] Could not get channel status: ${err.message}\n`);
    return { whatsapp: { connected: false }, telegram: { connected: false } };
  }
}

export async function configureChannel(channel, options) {
  try {
    const configDir = path.join(OPENCLAW_HOME, '.openclaw');
    const configPath = path.join(configDir, 'openclaw.json');
    
    await fs.mkdir(configDir, { recursive: true });
    
    let config = {};
    try {
      const configData = await fs.readFile(configPath, 'utf-8');
      config = JSON.parse(configData);
    } catch {
      config = {};
    }
    
    if (!config.channels) config.channels = {};
    
    if (channel === 'telegram') {
      const existingTelegram = config.channels.telegram || {};
      config.channels.telegram = {
        enabled: true,
        botToken: options.keepExistingToken ? existingTelegram.botToken : (options.botToken || existingTelegram.botToken),
        dmPolicy: options.dmPolicy || existingTelegram.dmPolicy || 'pairing',
        groups: existingTelegram.groups || { '*': { requireMention: true } }
      };
      await appendLog(`[INFO] Configured Telegram channel\n`);
    } else if (channel === 'whatsapp') {
      config.channels.whatsapp = {
        enabled: true,
        dmPolicy: options.dmPolicy || 'pairing',
        ...options
      };
      await appendLog(`[INFO] Configured WhatsApp channel\n`);
    }
    
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    return { success: true, message: `${channel} configured successfully` };
  } catch (err) {
    await appendLog(`[ERROR] Could not configure ${channel}: ${err.message}\n`);
    return { success: false, error: err.message };
  }
}

export async function disconnectChannel(channel) {
  try {
    const configDir = path.join(OPENCLAW_HOME, '.openclaw');
    const configPath = path.join(configDir, 'openclaw.json');
    
    let config = {};
    try {
      const configData = await fs.readFile(configPath, 'utf-8');
      config = JSON.parse(configData);
    } catch {
      return { success: true, message: 'Channel not configured' };
    }
    
    if (config.channels && config.channels[channel]) {
      delete config.channels[channel];
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
      await appendLog(`[INFO] Disconnected ${channel} channel\n`);
    }
    
    return { success: true, message: `${channel} disconnected` };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function startWhatsAppLogin() {
  const result = await runCommand(['channels', 'login', '--channel', 'whatsapp', '--qr-only']);
  
  if (result.success && result.stdout) {
    const qrMatch = result.stdout.match(/data:image\/png;base64,[A-Za-z0-9+/=]+/);
    if (qrMatch) {
      return { success: true, qrCode: qrMatch[0] };
    }
  }
  
  return { 
    success: false, 
    error: result.stderr || 'Could not generate QR code. Make sure gateway is running.' 
  };
}

export async function getPairingRequests() {
  const result = await runCommand(['pairing', 'list', '--json']);
  
  if (result.success && result.stdout) {
    try {
      const data = JSON.parse(result.stdout);
      return { success: true, requests: data.requests || [] };
    } catch {
      return { success: true, requests: [] };
    }
  }
  
  return { success: true, requests: [] };
}

export async function approvePairing(channel, code) {
  const result = await runCommand(['pairing', 'approve', channel, code]);
  return { 
    success: result.success, 
    message: result.success ? 'Pairing approved' : (result.stderr || 'Failed to approve')
  };
}

export async function denyPairing(channel, code) {
  const result = await runCommand(['pairing', 'deny', channel, code]);
  return { 
    success: result.success, 
    message: result.success ? 'Pairing denied' : (result.stderr || 'Failed to deny')
  };
}

export { maskSecrets };
