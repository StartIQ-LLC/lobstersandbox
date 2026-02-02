import { promises as fs } from 'fs';
import path from 'path';

const BUDGET_PATH = './data/budget.json';
const USAGE_PATH = './data/usage.json';
const ACTIVITY_PATH = './data/activity.json';
const DASHBOARD_PATH = './data/dashboard.json';

const PRICING = {
  anthropic: {
    'claude-haiku-4.5': { input: 0.25, output: 1.25 },
    'claude-sonnet-4.5': { input: 3.00, output: 15.00 },
    'claude-opus-4.5': { input: 15.00, output: 75.00 },
    'claude-3-haiku': { input: 0.25, output: 1.25 },
    'claude-3-sonnet': { input: 3.00, output: 15.00 },
    'claude-3-opus': { input: 15.00, output: 75.00 },
  },
  openai: {
    'gpt-4o': { input: 2.50, output: 10.00 },
    'gpt-4o-mini': { input: 0.15, output: 0.60 },
    'gpt-4-turbo': { input: 10.00, output: 30.00 },
    'gpt-4': { input: 30.00, output: 60.00 },
    'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
  },
  gemini: {
    'gemini-2.5-pro': { input: 1.25, output: 10.00 },
    'gemini-2.5-flash': { input: 0.15, output: 0.60 },
    'gemini-1.5-pro': { input: 1.25, output: 5.00 },
    'gemini-1.5-flash': { input: 0.075, output: 0.30 },
  },
  openrouter: {
    'auto': { input: 1.00, output: 3.00 },
    'default': { input: 1.00, output: 3.00 },
  },
  moonshot: {
    'kimi-k2': { input: 0.60, output: 2.40 },
    'moonshot-v1': { input: 0.50, output: 2.00 },
    'default': { input: 0.60, output: 2.40 },
  },
  ollama: {
    'default': { input: 0, output: 0 },
  },
  default: { input: 1.00, output: 4.00 },
};

const BUDGET_PRESETS = {
  tourist: 5,
  recommended: 10,
  power: 20,
};

async function ensureDataDir() {
  await fs.mkdir(path.dirname(BUDGET_PATH), { recursive: true });
}

export async function getBudget() {
  try {
    const data = await fs.readFile(BUDGET_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function setBudget(limit, model = null) {
  await ensureDataDir();
  const budget = {
    limit: parseFloat(limit),
    model,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(BUDGET_PATH, JSON.stringify(budget, null, 2));
  return budget;
}

export async function updateBudgetModel(model) {
  const budget = await getBudget();
  if (!budget) return null;
  budget.model = model;
  budget.updatedAt = new Date().toISOString();
  await fs.writeFile(BUDGET_PATH, JSON.stringify(budget, null, 2));
  return budget;
}

export async function getUsage() {
  try {
    const data = await fs.readFile(USAGE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {
      totalCost: 0,
      todayCost: 0,
      todayDate: new Date().toISOString().split('T')[0],
      requests: [],
    };
  }
}

async function saveUsage(usage) {
  await ensureDataDir();
  await fs.writeFile(USAGE_PATH, JSON.stringify(usage, null, 2));
}

export async function resetUsage() {
  await ensureDataDir();
  const usage = {
    totalCost: 0,
    todayCost: 0,
    todayDate: new Date().toISOString().split('T')[0],
    requests: [],
  };
  await fs.writeFile(USAGE_PATH, JSON.stringify(usage, null, 2));
  return usage;
}

export function estimateTokens(text) {
  if (!text) return 0;
  const str = typeof text === 'string' ? text : JSON.stringify(text);
  return Math.ceil(str.length / 4);
}

export function getPricing(provider, model) {
  const providerPricing = PRICING[provider?.toLowerCase()] || PRICING;
  if (!providerPricing) return PRICING.default;
  
  const modelKey = model?.toLowerCase()?.replace(/[^a-z0-9.-]/g, '') || 'default';
  
  for (const key of Object.keys(providerPricing)) {
    if (modelKey.includes(key) || key.includes(modelKey)) {
      return providerPricing[key];
    }
  }
  
  return providerPricing.default || PRICING.default;
}

export function calculateCost(inputTokens, outputTokens, provider, model) {
  const pricing = getPricing(provider, model);
  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;
  return inputCost + outputCost;
}

export async function recordUsage(inputTokens, outputTokens, provider, model) {
  const cost = calculateCost(inputTokens, outputTokens, provider, model);
  const usage = await getUsage();
  
  const today = new Date().toISOString().split('T')[0];
  if (usage.todayDate !== today) {
    usage.todayDate = today;
    usage.todayCost = 0;
  }
  
  usage.totalCost = (usage.totalCost || 0) + cost;
  usage.todayCost = (usage.todayCost || 0) + cost;
  
  usage.requests.push({
    timestamp: new Date().toISOString(),
    inputTokens,
    outputTokens,
    cost,
    provider,
    model,
  });
  
  if (usage.requests.length > 1000) {
    usage.requests = usage.requests.slice(-500);
  }
  
  await saveUsage(usage);
  
  return { cost, totalCost: usage.totalCost, todayCost: usage.todayCost };
}

export async function getBudgetStatus() {
  const [budget, usage] = await Promise.all([getBudget(), getUsage()]);
  
  if (!budget) {
    return {
      hasBudget: false,
      limit: 0,
      used: 0,
      remaining: 0,
      percentage: 0,
      todayCost: 0,
      model: null,
      alertLevel: null,
    };
  }
  
  const used = usage.totalCost || 0;
  const limit = budget.limit || 10;
  const remaining = Math.max(0, limit - used);
  const percentage = Math.min(100, (used / limit) * 100);
  
  let alertLevel = null;
  if (percentage >= 100) alertLevel = 'exceeded';
  else if (percentage >= 90) alertLevel = 'critical';
  else if (percentage >= 75) alertLevel = 'warning';
  
  return {
    hasBudget: true,
    limit,
    used,
    remaining,
    percentage,
    todayCost: usage.todayCost || 0,
    model: budget.model,
    alertLevel,
  };
}

export async function checkBudgetExceeded() {
  const status = await getBudgetStatus();
  return status.hasBudget && status.percentage >= 100;
}

export async function clearBudgetData() {
  try {
    await fs.rm(BUDGET_PATH, { force: true });
    await fs.rm(USAGE_PATH, { force: true });
    await fs.rm(ACTIVITY_PATH, { force: true });
  } catch (err) {
    console.error('Error clearing budget data:', err.message);
  }
}

// Activity Log (last 10 messages for dashboard)
export async function getActivityLog() {
  try {
    const data = await fs.readFile(ACTIVITY_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { activities: [] };
  }
}

export async function logActivity(message, channel = 'WebChat', cost = 0) {
  await ensureDataDir();
  const activity = await getActivityLog();
  
  activity.activities.unshift({
    timestamp: new Date().toISOString(),
    message: message?.substring(0, 100) || '',
    channel,
    cost,
  });
  
  // Keep only last 10
  activity.activities = activity.activities.slice(0, 10);
  
  await fs.writeFile(ACTIVITY_PATH, JSON.stringify(activity, null, 2));
  return activity;
}

// Dashboard state (gateway uptime, last wipe)
export async function getDashboardState() {
  try {
    const data = await fs.readFile(DASHBOARD_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {
      gatewayStartedAt: null,
      lastWipe: null,
    };
  }
}

export async function setGatewayStarted() {
  await ensureDataDir();
  const state = await getDashboardState();
  state.gatewayStartedAt = new Date().toISOString();
  await fs.writeFile(DASHBOARD_PATH, JSON.stringify(state, null, 2));
  return state;
}

export async function setGatewayStopped() {
  await ensureDataDir();
  const state = await getDashboardState();
  state.gatewayStartedAt = null;
  await fs.writeFile(DASHBOARD_PATH, JSON.stringify(state, null, 2));
  return state;
}

export async function recordWipe() {
  await ensureDataDir();
  const state = await getDashboardState();
  state.lastWipe = new Date().toISOString();
  state.gatewayStartedAt = null;
  await fs.writeFile(DASHBOARD_PATH, JSON.stringify(state, null, 2));
  return state;
}

// Weekly usage (7-day rolling history)
export async function getWeeklyUsage() {
  const usage = await getUsage();
  const requests = usage.requests || [];
  
  const days = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    const dayRequests = requests.filter(r => r.timestamp?.startsWith(dateStr));
    const dayCost = dayRequests.reduce((sum, r) => sum + (r.cost || 0), 0);
    const inputTokens = dayRequests.reduce((sum, r) => sum + (r.inputTokens || 0), 0);
    const outputTokens = dayRequests.reduce((sum, r) => sum + (r.outputTokens || 0), 0);
    
    days.push({
      date: dateStr,
      dayName,
      requests: dayRequests.length,
      inputTokens,
      outputTokens,
      cost: dayCost,
    });
  }
  
  const totals = days.reduce((acc, d) => ({
    requests: acc.requests + d.requests,
    inputTokens: acc.inputTokens + d.inputTokens,
    outputTokens: acc.outputTokens + d.outputTokens,
    cost: acc.cost + d.cost,
  }), { requests: 0, inputTokens: 0, outputTokens: 0, cost: 0 });
  
  return { days, totals };
}

export { PRICING, BUDGET_PRESETS };
