import { layout } from './layout.js';

export function statusPage(data) {
  const { version, isConfigured, gatewayRunning, logs, health, channels = {}, profile = null, infoMessage = null, playbook = {} } = data;
  const { whatsapp = {}, telegram = {}, discord = {} } = channels;
  const isSafeMode = !profile || profile === 'safe';
  
  const content = `
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Dashboard Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="logo-text text-3xl text-gray-800 flex items-center gap-3">
            <span class="text-4xl">📊</span> Sandbox Dashboard
          </h1>
          <p class="text-gray-500 mt-1">Everything happening in your sandbox at a glance.</p>
        </div>
        <div class="mt-4 md:mt-0 text-sm text-gray-400 flex items-center gap-2">
          <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span id="last-updated">Last updated: just now</span>
        </div>
      </div>
      
      <!-- Row 1: Gateway / Budget / Safety -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <!-- Card 1: Gateway Status -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 class="text-sm font-semibold text-gray-600 mb-3">Gateway Status</h3>
          <div id="gateway-status" class="space-y-3">
            <div class="flex items-center gap-3">
              <span class="w-4 h-4 rounded-full ${gatewayRunning ? 'bg-green-500 animate-pulse' : 'bg-red-400'}"></span>
              <span class="text-xl font-bold text-gray-800">${gatewayRunning ? 'Running' : 'Stopped'}</span>
            </div>
            <div class="text-sm text-gray-500" id="gateway-uptime">
              ${gatewayRunning ? 'Checking uptime...' : 'Currently stopped'}
            </div>
            <div class="text-sm text-gray-600 font-mono" id="gateway-version">
              ${version || 'Not connected'}
            </div>
            <div class="text-xs text-green-600 flex items-center gap-1">
              <span>✅</span> Gateway binds to loopback only
            </div>
            ${!gatewayRunning ? `
            <a href="/setup" class="text-xs text-lobster-600 hover:text-lobster-700 font-medium">Start Gateway →</a>
            ` : ''}
          </div>
        </div>
        
        <!-- Card 2: Budget Tracker -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 class="text-sm font-semibold text-gray-600 mb-3">Budget Tracker</h3>
          <div id="budget-tracker" class="space-y-3">
            <div class="text-2xl font-bold text-gray-800" id="budget-display">
              Loading...
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5" id="budget-bar-container">
              <div id="budget-bar" class="h-2.5 rounded-full bg-green-500" style="width: 0%"></div>
            </div>
            <div class="text-sm text-gray-500" id="today-cost">Today: $0.00</div>
            <a href="/setup" class="text-xs text-lobster-600 hover:text-lobster-700 font-medium">Change budget →</a>
          </div>
        </div>
        
        <!-- Card 3: Safety Status -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 class="text-sm font-semibold text-gray-600 mb-3">Safety Status</h3>
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <span class="text-lg">${isSafeMode ? '🟢' : '🟡'}</span>
              <span class="font-bold text-gray-800">${isSafeMode ? 'Safe Mode' : 'Power Mode'}</span>
            </div>
            <div class="text-sm text-gray-600">
              <span class="text-green-600 font-medium">Kill Switch:</span> Ready
            </div>
            <div class="text-sm text-gray-500" id="last-wipe">
              Last wipe: Never wiped
            </div>
            <div class="text-xs text-gray-400">
              Session: Idle 30min / Max 8hr
            </div>
          </div>
        </div>
      </div>
      
      <!-- Row 2: Channels / Recent Activity -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <!-- Card 4: Connected Channels -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 class="text-sm font-semibold text-gray-600 mb-3">Connected Channels</h3>
          <div id="channels-list" class="space-y-2">
            ${isSafeMode ? `
            <p class="text-sm text-gray-500">Channels disabled in Safe Mode.</p>
            <a href="/profile" class="text-xs text-lobster-600 hover:text-lobster-700 font-medium">Switch to Power Mode →</a>
            ` : `
            <div class="flex items-center gap-2 py-1">
              <span class="w-2.5 h-2.5 rounded-full ${whatsapp.connected ? 'bg-green-500' : 'bg-gray-300'}"></span>
              <span class="text-sm text-gray-700">WhatsApp ${whatsapp.connected ? '' : '(not configured)'}</span>
            </div>
            <div class="flex items-center gap-2 py-1">
              <span class="w-2.5 h-2.5 rounded-full ${telegram.connected ? 'bg-green-500' : 'bg-gray-300'}"></span>
              <span class="text-sm text-gray-700">Telegram ${telegram.connected ? '' : '(not configured)'}</span>
            </div>
            <div class="flex items-center gap-2 py-1">
              <span class="w-2.5 h-2.5 rounded-full ${discord.connected ? 'bg-green-500' : 'bg-gray-300'}"></span>
              <span class="text-sm text-gray-700">Discord ${discord.connected ? '' : '(not configured)'}</span>
            </div>
            <p class="text-xs text-gray-400 mt-2">WebChat is available in the Control UI.</p>
            <a href="/openclaw" class="text-xs text-lobster-600 hover:text-lobster-700 font-medium">Manage channels in Control UI →</a>
            `}
          </div>
        </div>
        
        <!-- Card 5: Recent Activity -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 class="text-sm font-semibold text-gray-600 mb-3">Recent Activity</h3>
          <div id="activity-list" class="space-y-2 max-h-48 overflow-y-auto">
            <p class="text-sm text-gray-400">No activity yet. Open the Control UI and start chatting!</p>
          </div>
          <a href="/openclaw" class="text-xs text-lobster-600 hover:text-lobster-700 font-medium mt-3 inline-block">Open Control UI →</a>
        </div>
      </div>
      
      <!-- Row 3: Weekly Usage Chart -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <h3 class="text-sm font-semibold text-gray-600 mb-4">API Usage This Week</h3>
        <div id="weekly-chart" class="h-40 flex items-end justify-between gap-2 px-4">
          <div class="flex-1 flex flex-col items-center">
            <div class="w-full bg-gray-200 rounded-t" style="height: 20px"></div>
            <span class="text-xs text-gray-500 mt-1">Mon</span>
          </div>
          <div class="flex-1 flex flex-col items-center">
            <div class="w-full bg-gray-200 rounded-t" style="height: 20px"></div>
            <span class="text-xs text-gray-500 mt-1">Tue</span>
          </div>
          <div class="flex-1 flex flex-col items-center">
            <div class="w-full bg-gray-200 rounded-t" style="height: 20px"></div>
            <span class="text-xs text-gray-500 mt-1">Wed</span>
          </div>
          <div class="flex-1 flex flex-col items-center">
            <div class="w-full bg-gray-200 rounded-t" style="height: 20px"></div>
            <span class="text-xs text-gray-500 mt-1">Thu</span>
          </div>
          <div class="flex-1 flex flex-col items-center">
            <div class="w-full bg-gray-200 rounded-t" style="height: 20px"></div>
            <span class="text-xs text-gray-500 mt-1">Fri</span>
          </div>
          <div class="flex-1 flex flex-col items-center">
            <div class="w-full bg-gray-200 rounded-t" style="height: 20px"></div>
            <span class="text-xs text-gray-500 mt-1">Sat</span>
          </div>
          <div class="flex-1 flex flex-col items-center">
            <div class="w-full bg-gray-200 rounded-t" style="height: 20px"></div>
            <span class="text-xs text-gray-500 mt-1">Sun</span>
          </div>
        </div>
        <div id="no-usage-message" class="text-center text-sm text-gray-400 py-4">
          No API usage recorded yet. Start chatting to see your usage here.
        </div>
        
        <!-- Usage Table -->
        <div class="overflow-x-auto mt-4">
          <table id="usage-table" class="w-full text-sm hidden">
            <thead class="border-b border-gray-200">
              <tr class="text-left text-gray-500">
                <th class="py-2 font-medium">Date</th>
                <th class="py-2 font-medium text-right">Requests</th>
                <th class="py-2 font-medium text-right">Est. Input Tokens</th>
                <th class="py-2 font-medium text-right">Est. Output Tokens</th>
                <th class="py-2 font-medium text-right">Est. Cost</th>
              </tr>
            </thead>
            <tbody id="usage-table-body" class="text-gray-700">
            </tbody>
            <tfoot class="border-t border-gray-200 font-semibold">
              <tr id="usage-totals">
                <td class="py-2">Total</td>
                <td class="py-2 text-right">0</td>
                <td class="py-2 text-right">0</td>
                <td class="py-2 text-right">0</td>
                <td class="py-2 text-right">$0.00</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      <!-- Advanced Tools (Collapsible) -->
      <details class="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
        <summary class="p-5 cursor-pointer font-semibold text-gray-700 hover:bg-gray-50 rounded-2xl flex items-center gap-2">
          <span>🔧</span> Advanced Tools
          <span class="text-xs text-gray-400 font-normal ml-2">(Health checks, security tools, logs)</span>
        </summary>
        <div class="p-5 pt-0 border-t border-gray-100 mt-2">
          <!-- Safety Score -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-gray-800 flex items-center gap-2">
                <span>🛡️</span> Safety Score
              </h4>
              <button onclick="copySafetySummary()" class="text-xs text-lobster-600 hover:text-lobster-700 font-medium flex items-center gap-1">
                📋 Copy Summary
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div class="flex items-center gap-2 py-1"><span class="text-green-500">✓</span><span class="text-gray-700">Auth required for protected routes</span></div>
              <div class="flex items-center gap-2 py-1"><span class="text-green-500">✓</span><span class="text-gray-700">CSRF enforced on POST routes</span></div>
              <div class="flex items-center gap-2 py-1"><span class="text-green-500">✓</span><span class="text-gray-700">Origin/Referer validation enabled</span></div>
              <div class="flex items-center gap-2 py-1"><span class="text-green-500">✓</span><span class="text-gray-700">WebSocket upgrades require valid session</span></div>
              <div class="flex items-center gap-2 py-1"><span class="text-green-500">✓</span><span class="text-gray-700">Gateway loopback only</span></div>
              <div class="flex items-center gap-2 py-1"><span class="text-green-500">✓</span><span class="text-gray-700">Reverse proxy only (no direct port)</span></div>
              <div class="flex items-center gap-2 py-1"><span class="text-green-500">✓</span><span class="text-gray-700">${isSafeMode ? 'Safe Mode active' : 'Power Mode active'}</span></div>
              <div class="flex items-center gap-2 py-1"><span class="text-green-500">✓</span><span class="text-gray-700">Kill Switch available</span></div>
              <div class="flex items-center gap-2 py-1"><span class="text-green-500">✓</span><span class="text-gray-700">Wipe requires typed WIPE + password</span></div>
              <div class="flex items-center gap-2 py-1"><span class="text-green-500">✓</span><span class="text-gray-700">Power Mode requires typed POWER</span></div>
              <div class="flex items-center gap-2 py-1"><span class="text-green-500">✓</span><span class="text-gray-700">Login rate limiting enabled</span></div>
            </div>
            <div id="copy-result" class="hidden text-xs text-green-600 mt-3"></div>
          </div>
          
          <!-- Sandbox Playbook -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-gray-800 flex items-center gap-2">
                <span>📋</span> Sandbox Playbook
              </h4>
              <div class="flex items-center gap-3">
                <button onclick="resetPlaybook()" class="text-xs text-gray-400 hover:text-gray-600 font-medium">Reset</button>
                <a href="/setup" class="text-xs text-lobster-600 hover:text-lobster-700 font-medium">Full guide →</a>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-3 text-center text-xs">
              <div class="bg-blue-50 rounded-xl p-3">
                <div class="text-lg mb-1">📧</div>
                <div class="font-medium text-gray-700">Email</div>
                <div class="text-gray-500">Use secondary</div>
                <label class="flex items-center justify-center gap-1 mt-2 cursor-pointer">
                  <input type="checkbox" id="playbook-email" onchange="updatePlaybook('email', this.checked)" ${playbook.email ? 'checked' : ''} class="w-4 h-4 text-blue-600 rounded">
                  <span class="text-gray-500">Done</span>
                </label>
              </div>
              <div class="bg-green-50 rounded-xl p-3">
                <div class="text-lg mb-1">📱</div>
                <div class="font-medium text-gray-700">Phone</div>
                <div class="text-gray-500">Use spare #</div>
                <label class="flex items-center justify-center gap-1 mt-2 cursor-pointer">
                  <input type="checkbox" id="playbook-phone" onchange="updatePlaybook('phone', this.checked)" ${playbook.phone ? 'checked' : ''} class="w-4 h-4 text-green-600 rounded">
                  <span class="text-gray-500">Done</span>
                </label>
              </div>
              <div class="bg-purple-50 rounded-xl p-3">
                <div class="text-lg mb-1">💳</div>
                <div class="font-medium text-gray-700">Billing</div>
                <div class="text-gray-500">Set limits</div>
                <label class="flex items-center justify-center gap-1 mt-2 cursor-pointer">
                  <input type="checkbox" id="playbook-billing" onchange="updatePlaybook('billing', this.checked)" ${playbook.billing ? 'checked' : ''} class="w-4 h-4 text-purple-600 rounded">
                  <span class="text-gray-500">Done</span>
                </label>
              </div>
            </div>
          </div>
          
          <!-- Health Check -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-gray-800">Health Check</h4>
              <button onclick="refreshHealth()" class="text-sm text-lobster-600 hover:text-lobster-700 font-medium">↻ Refresh</button>
            </div>
            <pre id="health-output" class="bg-gray-100 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-40 text-gray-700">${health || 'Run a health check to see results'}</pre>
          </div>
          
          <!-- Security Tools -->
          <div class="mb-6">
            <h4 class="font-medium text-gray-800 mb-3">Security Tools</h4>
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
          
          <!-- Remote Access Hardening -->
          <div class="mb-6">
            <h4 class="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <span>🔐</span> Remote Access Hardening
            </h4>
            <p class="text-sm text-gray-600 mb-3">If you need to access your sandbox from outside Replit:</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-teal-50 border border-teal-100 rounded-xl p-4">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-lg">🌐</span>
                  <h5 class="font-semibold text-gray-800">Tailscale</h5>
                  <span class="text-xs bg-teal-600 text-white px-2 py-0.5 rounded-full">Recommended</span>
                </div>
                <ul class="text-xs text-gray-600 space-y-1">
                  <li>• Zero-config private mesh network</li>
                  <li>• No port forwarding needed</li>
                  <li>• Works through NAT/firewalls</li>
                </ul>
                <a href="https://tailscale.com" target="_blank" class="inline-block mt-2 text-xs text-teal-700 hover:text-teal-800 font-medium">Learn more →</a>
              </div>
              <div class="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-lg">☁️</span>
                  <h5 class="font-semibold text-gray-800">Cloudflare Tunnel</h5>
                  <span class="text-xs bg-gray-500 text-white px-2 py-0.5 rounded-full">Advanced</span>
                </div>
                <ul class="text-xs text-gray-600 space-y-1">
                  <li>• Expose services securely via Cloudflare</li>
                  <li>• Requires Cloudflare account</li>
                  <li>• More configuration needed</li>
                </ul>
                <a href="https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/" target="_blank" class="inline-block mt-2 text-xs text-gray-600 hover:text-gray-800 font-medium">Learn more →</a>
              </div>
            </div>
            <p class="text-xs text-amber-700 mt-3 bg-amber-50 p-2 rounded-lg">⚠️ Only expose your sandbox if you understand the risks. Start with local-only access.</p>
          </div>
          
          <!-- Logs -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-gray-800">Logs <span class="text-gray-400 font-normal text-sm">(Last 200 lines)</span></h4>
              <button onclick="refreshLogs()" class="text-sm text-lobster-600 hover:text-lobster-700 font-medium">↻ Refresh</button>
            </div>
            <pre id="logs-output" class="bg-gray-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96">${logs || 'No logs available'}</pre>
          </div>
        </div>
      </details>
      
      <div class="text-center flex gap-4 justify-center flex-wrap">
        <a href="/setup" class="text-sm text-lobster-600 hover:text-lobster-700 font-medium">Go to Setup</a>
        <a href="/openclaw" class="text-sm text-gray-600 hover:text-gray-700 font-medium">Open Control UI</a>
        <a href="/" class="text-sm text-gray-500 hover:text-gray-700">← Back to home</a>
      </div>
    </div>
  </div>
  
  <script>
    let refreshInterval;
    let lastUpdateTime = Date.now();
    
    async function loadDashboard() {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) throw new Error('Failed to load dashboard');
        const data = await res.json();
        updateDashboard(data);
        lastUpdateTime = Date.now();
        updateLastUpdatedText();
      } catch (err) {
        console.error('Dashboard load error:', err);
      }
    }
    
    function updateDashboard(data) {
      // Update Gateway
      if (data.gateway) {
        const gatewayEl = document.getElementById('gateway-uptime');
        if (data.gateway.startedAt) {
          const uptime = formatUptime(data.gateway.startedAt);
          gatewayEl.textContent = 'Up since ' + uptime;
        } else if (!data.gateway.running) {
          gatewayEl.textContent = 'Currently stopped';
        }
      }
      
      // Update Budget
      if (data.budget) {
        const displayEl = document.getElementById('budget-display');
        const barEl = document.getElementById('budget-bar');
        const todayEl = document.getElementById('today-cost');
        
        if (data.budget.hasBudget) {
          displayEl.textContent = '$' + data.budget.used.toFixed(2) + ' / $' + data.budget.limit.toFixed(2);
          barEl.style.width = Math.min(100, data.budget.percentage) + '%';
          
          if (data.budget.percentage < 50) {
            barEl.className = 'h-2.5 rounded-full bg-green-500';
          } else if (data.budget.percentage < 80) {
            barEl.className = 'h-2.5 rounded-full bg-yellow-500';
          } else {
            barEl.className = 'h-2.5 rounded-full bg-red-500';
          }
          
          todayEl.textContent = 'Today: $' + data.budget.todayCost.toFixed(2);
        } else {
          displayEl.textContent = 'No budget configured';
          barEl.style.width = '0%';
          todayEl.innerHTML = '<a href="/setup" class="text-lobster-600 hover:text-lobster-700">Set a budget →</a>';
        }
      }
      
      // Update Last Wipe
      if (data.safety) {
        const wipeEl = document.getElementById('last-wipe');
        if (data.safety.lastWipe) {
          const wipeDate = new Date(data.safety.lastWipe).toLocaleDateString();
          wipeEl.textContent = 'Last wipe: ' + wipeDate;
        }
      }
      
      // Update Activity
      if (data.activity && data.activity.length > 0) {
        const activityEl = document.getElementById('activity-list');
        activityEl.innerHTML = data.activity.map(a => {
          const time = new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const msg = a.message.length > 50 ? a.message.substring(0, 47) + '...' : a.message;
          return '<div class="text-sm text-gray-600 py-1 border-b border-gray-50">' +
            '<span class="text-gray-400">' + time + '</span> — ' +
            '"' + escapeHtml(msg) + '" — ' +
            '<span class="text-gray-400">' + a.channel + '</span> — ' +
            '<span class="text-green-600">~$' + a.cost.toFixed(2) + '</span>' +
          '</div>';
        }).join('');
      }
      
      // Update Weekly Usage
      if (data.weeklyUsage) {
        updateWeeklyChart(data.weeklyUsage);
      }
    }
    
    function updateWeeklyChart(weeklyUsage) {
      const chartEl = document.getElementById('weekly-chart');
      const tableEl = document.getElementById('usage-table');
      const tableBodyEl = document.getElementById('usage-table-body');
      const totalsEl = document.getElementById('usage-totals');
      const noUsageEl = document.getElementById('no-usage-message');
      
      const hasData = weeklyUsage.totals && weeklyUsage.totals.requests > 0;
      
      if (!hasData) {
        noUsageEl.classList.remove('hidden');
        tableEl.classList.add('hidden');
        return;
      }
      
      noUsageEl.classList.add('hidden');
      tableEl.classList.remove('hidden');
      
      const maxCost = Math.max(...weeklyUsage.days.map(d => d.cost), 0.01);
      
      chartEl.innerHTML = weeklyUsage.days.map(day => {
        const height = Math.max(20, (day.cost / maxCost) * 120);
        const barColor = day.cost > 0 ? 'bg-lobster-500' : 'bg-gray-200';
        return '<div class="flex-1 flex flex-col items-center">' +
          '<div class="w-full ' + barColor + ' rounded-t transition-all" style="height: ' + height + 'px"></div>' +
          '<span class="text-xs text-gray-500 mt-1">' + day.dayName + '</span>' +
          (day.cost > 0 ? '<span class="text-xs text-gray-400">$' + day.cost.toFixed(2) + '</span>' : '') +
        '</div>';
      }).join('');
      
      tableBodyEl.innerHTML = weeklyUsage.days.map(day => 
        '<tr class="border-b border-gray-50">' +
          '<td class="py-2">' + day.date + '</td>' +
          '<td class="py-2 text-right">' + day.requests + '</td>' +
          '<td class="py-2 text-right">' + day.inputTokens.toLocaleString() + '</td>' +
          '<td class="py-2 text-right">' + day.outputTokens.toLocaleString() + '</td>' +
          '<td class="py-2 text-right">$' + day.cost.toFixed(2) + '</td>' +
        '</tr>'
      ).join('');
      
      totalsEl.innerHTML = 
        '<td class="py-2 font-semibold">Total</td>' +
        '<td class="py-2 text-right font-semibold">' + weeklyUsage.totals.requests + '</td>' +
        '<td class="py-2 text-right font-semibold">' + weeklyUsage.totals.inputTokens.toLocaleString() + '</td>' +
        '<td class="py-2 text-right font-semibold">' + weeklyUsage.totals.outputTokens.toLocaleString() + '</td>' +
        '<td class="py-2 text-right font-semibold">$' + weeklyUsage.totals.cost.toFixed(2) + '</td>';
    }
    
    function formatUptime(startedAt) {
      const start = new Date(startedAt);
      return start.toLocaleString();
    }
    
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    function updateLastUpdatedText() {
      const el = document.getElementById('last-updated');
      const seconds = Math.floor((Date.now() - lastUpdateTime) / 1000);
      if (seconds < 5) {
        el.textContent = 'Last updated: just now';
      } else if (seconds < 60) {
        el.textContent = 'Last updated: ' + seconds + 's ago';
      } else {
        el.textContent = 'Last updated: ' + Math.floor(seconds / 60) + 'm ago';
      }
    }
    
    async function copySafetySummary() {
      const mode = ${isSafeMode} ? 'Safe Mode' : 'Power Mode';
      const summary = \`LobsterSandbox Safety Summary
Mode: \${mode}
Auth: on
CSRF: on
WS gated: on
Gateway: loopback only
Kill switch: ready
Wipe: typed confirmation\`;
      try {
        await navigator.clipboard.writeText(summary);
        const result = document.getElementById('copy-result');
        result.textContent = '✓ Copied to clipboard!';
        result.classList.remove('hidden');
        setTimeout(() => result.classList.add('hidden'), 2000);
      } catch (err) {
        alert('Copy failed: ' + err.message);
      }
    }
    
    async function updatePlaybook(item, checked) {
      try {
        const csrfToken = await getCsrfToken();
        if (!csrfToken) return;
        await fetch('/api/playbook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
          body: JSON.stringify({ item, checked, csrf_token: csrfToken })
        });
      } catch (err) {
        console.error('Playbook update failed:', err);
      }
    }
    
    async function resetPlaybook() {
      if (!confirm('Reset playbook progress?')) return;
      try {
        const csrfToken = await getCsrfToken();
        if (!csrfToken) return;
        await fetch('/api/playbook/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
          body: JSON.stringify({ csrf_token: csrfToken })
        });
        document.getElementById('playbook-email').checked = false;
        document.getElementById('playbook-phone').checked = false;
        document.getElementById('playbook-billing').checked = false;
      } catch (err) {
        console.error('Playbook reset failed:', err);
      }
    }
    
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
        const csrfToken = await getCsrfToken();
        if (!csrfToken) { container.textContent = '❌ Session expired. Please log in again.'; return; }
        const res = await fetch('/api/verify', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
          body: JSON.stringify({ csrf_token: csrfToken })
        });
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
        const csrfToken = await getCsrfToken();
        if (!csrfToken) { container.textContent = '❌ Session expired. Please log in again.'; return; }
        const res = await fetch('/api/security/audit', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
          body: JSON.stringify({ csrf_token: csrfToken })
        });
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
        const csrfToken = await getCsrfToken();
        if (!csrfToken) { container.textContent = '❌ Session expired. Please log in again.'; return; }
        const res = await fetch('/api/security/fix', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
          body: JSON.stringify({ csrf_token: csrfToken })
        });
        const data = await res.json();
        container.textContent = data.stdout || data.stderr || 'No output';
      } catch (err) {
        container.textContent = '❌ Error: ' + err.message;
      }
    }
    
    // Initialize dashboard
    loadDashboard();
    
    // Auto-refresh every 30 seconds
    refreshInterval = setInterval(() => {
      loadDashboard();
    }, 30000);
    
    // Update "last updated" text every second
    setInterval(updateLastUpdatedText, 1000);
  </script>
  `;
  
  return layout('Dashboard', content, { includeTopBar: true, profile });
}
