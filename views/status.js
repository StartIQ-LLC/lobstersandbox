import { layout } from './layout.js';

export function statusPage(data) {
  const { version, isConfigured, gatewayRunning, logs, health } = data;
  
  const content = `
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">🦞</div>
        <h1 class="logo-text text-3xl text-gray-800">System Status</h1>
        <p class="text-gray-500 mt-2">OpenClaw Sandbox Health & Logs</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="card p-5">
          <div class="text-sm text-gray-500 mb-2">OpenClaw Version</div>
          <div class="font-mono text-sm text-gray-800 font-medium">${version || 'Unknown'}</div>
        </div>
        <div class="card p-5">
          <div class="text-sm text-gray-500 mb-2">Setup Status</div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full ${isConfigured ? 'bg-green-500' : 'bg-red-500'}"></span>
            <span class="font-medium text-gray-800">${isConfigured ? 'Configured' : 'Not Configured'}</span>
          </div>
        </div>
        <div class="card p-5">
          <div class="text-sm text-gray-500 mb-2">Gateway Status</div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full ${gatewayRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}"></span>
            <span class="font-medium text-gray-800">${gatewayRunning ? 'Running' : 'Stopped'}</span>
          </div>
        </div>
      </div>
      
      <div class="card p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-display font-semibold text-gray-800">Health Check</h2>
          <button onclick="refreshHealth()" class="text-sm text-lobster-600 hover:text-lobster-700 font-medium">↻ Refresh</button>
        </div>
        <pre id="health-output" class="bg-gray-100 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-40 text-gray-700">${health || 'Run a health check to see results'}</pre>
      </div>
      
      <div class="card p-6 mb-6">
        <h2 class="font-display font-semibold text-gray-800 mb-4">Security Tools</h2>
        <div class="flex flex-wrap gap-3 mb-4">
          <button onclick="runQuickVerify()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-md transition-all">
            🔍 Quick Verify
          </button>
          <button onclick="runSecurityAudit()" class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium shadow-md transition-all">
            🛡 Security Audit
          </button>
          <button onclick="runSecurityFix()" class="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-medium shadow-md transition-all">
            🔧 Security Fix
          </button>
        </div>
        <div id="security-result" class="hidden bg-gray-100 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-60 text-gray-700"></div>
      </div>
      
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-display font-semibold text-gray-800">Logs <span class="text-gray-400 font-normal text-sm">(Last 200 lines)</span></h2>
          <button onclick="refreshLogs()" class="text-sm text-lobster-600 hover:text-lobster-700 font-medium">↻ Refresh</button>
        </div>
        <pre id="logs-output" class="bg-gray-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96">${logs || 'No logs available'}</pre>
      </div>
      
      <div class="text-center mt-6 flex gap-4 justify-center flex-wrap">
        <a href="/setup" class="text-sm text-lobster-600 hover:text-lobster-700 font-medium">Go to Setup</a>
        <a href="/openclaw" class="text-sm text-gray-600 hover:text-gray-700 font-medium">Open Control UI</a>
        <a href="/" class="text-sm text-gray-500 hover:text-gray-700">&larr; Back to home</a>
      </div>
    </div>
  </div>
  
  <script>
    async function refreshHealth() {
      const output = document.getElementById('health-output');
      output.textContent = '⏳ Loading...';
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        output.textContent = data.stdout || data.stderr || 'No output';
      } catch (err) {
        output.textContent = '❌ Error: ' + err.message;
      }
    }
    
    async function refreshLogs() {
      const output = document.getElementById('logs-output');
      output.textContent = '⏳ Loading...';
      try {
        const res = await fetch('/api/logs');
        const data = await res.json();
        output.textContent = data.logs || 'No logs available';
      } catch (err) {
        output.textContent = '❌ Error: ' + err.message;
      }
    }
    
    async function runQuickVerify() {
      const container = document.getElementById('security-result');
      container.classList.remove('hidden');
      container.textContent = '🔍 Running quick verify...';
      try {
        const res = await fetch('/api/verify', { method: 'POST' });
        const data = await res.json();
        let output = '';
        for (const result of data.results) {
          output += '=== ' + result.command + ' ===\\n';
          output += result.stdout || result.stderr || 'No output';
          output += '\\n\\n';
        }
        container.textContent = output;
      } catch (err) {
        container.textContent = '❌ Error: ' + err.message;
      }
    }
    
    async function runSecurityAudit() {
      const container = document.getElementById('security-result');
      container.classList.remove('hidden');
      container.textContent = '🛡 Running security audit...';
      try {
        const res = await fetch('/api/security/audit', { method: 'POST' });
        const data = await res.json();
        container.textContent = data.stdout || data.stderr || 'No output';
      } catch (err) {
        container.textContent = '❌ Error: ' + err.message;
      }
    }
    
    async function runSecurityFix() {
      const container = document.getElementById('security-result');
      container.classList.remove('hidden');
      container.textContent = '🔧 Running security fix...';
      try {
        const res = await fetch('/api/security/fix', { method: 'POST' });
        const data = await res.json();
        container.textContent = data.stdout || data.stderr || 'No output';
      } catch (err) {
        container.textContent = '❌ Error: ' + err.message;
      }
    }
  </script>
  `;
  
  return layout('Status', content, { includeTopBar: true });
}
