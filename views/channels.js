import { layout } from './layout.js';

export function channelsPage(channelStatus = {}) {
  const { whatsapp = {}, telegram = {}, discord = {} } = channelStatus;
  
  const content = `
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">🦞</div>
        <h1 class="logo-text text-3xl text-gray-800">Channel <span class="text-lobster-600">Setup</span></h1>
        <p class="text-gray-500 mt-2">Connect messaging platforms to your OpenClaw assistant</p>
      </div>
      
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p class="text-amber-800 text-sm flex items-start gap-2">
          <span class="text-lg">⚠️</span>
          <span><strong>Important:</strong> Complete the AI provider setup first before connecting channels. Channels require a running gateway.</span>
        </p>
      </div>
      
      <!-- WhatsApp Section -->
      <div class="card p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl">📱</div>
            <div>
              <h2 class="font-display font-semibold text-gray-800">WhatsApp</h2>
              <p class="text-sm text-gray-500">Connect via WhatsApp Web</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full ${whatsapp.connected ? 'bg-green-500' : 'bg-gray-300'}"></span>
            <span class="text-sm text-gray-600">${whatsapp.connected ? 'Connected' : 'Not connected'}</span>
          </div>
        </div>
        
        <div class="bg-gray-50 rounded-xl p-4 mb-4">
          <h3 class="font-medium text-gray-800 mb-2">Setup Instructions</h3>
          <ol class="text-sm text-gray-600 space-y-2">
            <li class="flex gap-2"><span class="font-semibold text-lobster-600">1.</span> Get a separate phone number (eSIM recommended)</li>
            <li class="flex gap-2"><span class="font-semibold text-lobster-600">2.</span> Click "Start WhatsApp Login" below to show QR code</li>
            <li class="flex gap-2"><span class="font-semibold text-lobster-600">3.</span> Open WhatsApp → Settings → Linked Devices</li>
            <li class="flex gap-2"><span class="font-semibold text-lobster-600">4.</span> Scan the QR code with your phone</li>
          </ol>
        </div>
        
        <div id="whatsapp-qr-container" class="hidden mb-4">
          <div class="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
            <div id="whatsapp-qr" class="mb-3">
              <div class="text-gray-400">Loading QR code...</div>
            </div>
            <p class="text-sm text-gray-500">Scan this QR code with WhatsApp</p>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <button onclick="startWhatsAppLogin()" id="whatsapp-login-btn" class="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium shadow-md transition-all">
            📷 Start WhatsApp Login
          </button>
          <button onclick="disconnectChannel('whatsapp')" class="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-sm font-medium transition-all ${whatsapp.connected ? '' : 'hidden'}" id="whatsapp-disconnect-btn">
            Disconnect
          </button>
        </div>
        <div id="whatsapp-result" class="mt-3 text-sm"></div>
      </div>
      
      <!-- Telegram Section -->
      <div class="card p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl">✈️</div>
            <div>
              <h2 class="font-display font-semibold text-gray-800">Telegram</h2>
              <p class="text-sm text-gray-500">Connect via Bot API</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full ${telegram.connected ? 'bg-green-500' : 'bg-gray-300'}"></span>
            <span class="text-sm text-gray-600">${telegram.connected ? 'Connected' : 'Not connected'}</span>
          </div>
        </div>
        
        <div class="bg-gray-50 rounded-xl p-4 mb-4">
          <h3 class="font-medium text-gray-800 mb-2">Setup Instructions</h3>
          <ol class="text-sm text-gray-600 space-y-2">
            <li class="flex gap-2"><span class="font-semibold text-lobster-600">1.</span> Open Telegram and chat with <a href="https://t.me/BotFather" target="_blank" class="text-blue-600 hover:underline">@BotFather</a></li>
            <li class="flex gap-2"><span class="font-semibold text-lobster-600">2.</span> Send /newbot and follow the prompts</li>
            <li class="flex gap-2"><span class="font-semibold text-lobster-600">3.</span> Copy the bot token (looks like 123456789:ABC-DEF...)</li>
            <li class="flex gap-2"><span class="font-semibold text-lobster-600">4.</span> Paste the token below and click Save</li>
          </ol>
        </div>
        
        <div class="mb-4">
          <label for="telegram-token" class="block text-sm font-medium text-gray-700 mb-2">Bot Token</label>
          <input type="password" id="telegram-token" placeholder="123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
          ${telegram.tokenMasked ? `<p class="text-xs text-green-600 mt-2">✓ Token configured: ${telegram.tokenMasked}</p>` : ''}
          <p class="text-xs text-gray-500 mt-1">🔒 Your token is stored securely and never logged. ${telegram.connected ? 'Leave empty to keep current token.' : ''}</p>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">DM Policy</label>
          <select id="telegram-dm-policy" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white">
            <option value="pairing" ${telegram.dmPolicy === 'pairing' ? 'selected' : ''}>Pairing (recommended) - Unknown users get a pairing code</option>
            <option value="allowlist" ${telegram.dmPolicy === 'allowlist' ? 'selected' : ''}>Allowlist - Only pre-approved users can chat</option>
            <option value="open" ${telegram.dmPolicy === 'open' ? 'selected' : ''}>Open - Anyone can chat (not recommended)</option>
          </select>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <button onclick="saveTelegramConfig()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-md transition-all">
            💾 Save Telegram Config
          </button>
          <button onclick="disconnectChannel('telegram')" class="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-sm font-medium transition-all ${telegram.connected ? '' : 'hidden'}" id="telegram-disconnect-btn">
            Disconnect
          </button>
        </div>
        <div id="telegram-result" class="mt-3 text-sm"></div>
      </div>
      
      <!-- Discord Section -->
      <div class="card p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white text-xl">🎮</div>
            <div>
              <h2 class="font-display font-semibold text-gray-800">Discord</h2>
              <p class="text-sm text-gray-500">Connect via Bot API</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full ${discord.connected ? 'bg-green-500' : 'bg-gray-300'}"></span>
            <span class="text-sm text-gray-600">${discord.connected ? 'Connected' : 'Not connected'}</span>
          </div>
        </div>
        
        <div class="bg-gray-50 rounded-xl p-4 mb-4">
          <h3 class="font-medium text-gray-800 mb-2">Setup Instructions</h3>
          <ol class="text-sm text-gray-600 space-y-2">
            <li class="flex gap-2"><span class="font-semibold text-lobster-600">1.</span> Go to <a href="https://discord.com/developers/applications" target="_blank" class="text-indigo-600 hover:underline">Discord Developer Portal</a></li>
            <li class="flex gap-2"><span class="font-semibold text-lobster-600">2.</span> Click "New Application" and give it a name</li>
            <li class="flex gap-2"><span class="font-semibold text-lobster-600">3.</span> Go to Bot → Add Bot → Copy the token</li>
            <li class="flex gap-2"><span class="font-semibold text-lobster-600">4.</span> Enable "Message Content Intent" under Privileged Intents</li>
            <li class="flex gap-2"><span class="font-semibold text-lobster-600">5.</span> Paste the token below and click Save</li>
          </ol>
        </div>
        
        <div class="mb-4">
          <label for="discord-token" class="block text-sm font-medium text-gray-700 mb-2">Bot Token</label>
          <input type="password" id="discord-token" placeholder="MTIzNDU2Nzg5MDEyMzQ1Njc4OQ..."
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
          ${discord.tokenMasked ? `<p class="text-xs text-green-600 mt-2">✓ Token configured: ${discord.tokenMasked}</p>` : ''}
          <p class="text-xs text-gray-500 mt-1">🔒 Your token is stored securely and never logged. ${discord.connected ? 'Leave empty to keep current token.' : ''}</p>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">DM Policy</label>
          <select id="discord-dm-policy" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white">
            <option value="pairing" ${discord.dmPolicy === 'pairing' ? 'selected' : ''}>Pairing (recommended) - Unknown users get a pairing code</option>
            <option value="allowlist" ${discord.dmPolicy === 'allowlist' ? 'selected' : ''}>Allowlist - Only pre-approved users can chat</option>
            <option value="open" ${discord.dmPolicy === 'open' ? 'selected' : ''}>Open - Anyone can chat (not recommended)</option>
          </select>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <button onclick="saveDiscordConfig()" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-md transition-all">
            💾 Save Discord Config
          </button>
          <button onclick="disconnectChannel('discord')" class="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-sm font-medium transition-all ${discord.connected ? '' : 'hidden'}" id="discord-disconnect-btn">
            Disconnect
          </button>
        </div>
        <div id="discord-result" class="mt-3 text-sm"></div>
      </div>
      
      <!-- Pairing Requests Section -->
      <div class="card p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-display font-semibold text-gray-800">🔐 Pending Pairing Requests</h2>
          <button onclick="refreshPairingRequests()" class="text-sm text-lobster-600 hover:text-lobster-700 font-medium">↻ Refresh</button>
        </div>
        
        <div id="pairing-list" class="space-y-3">
          <div class="text-gray-500 text-sm text-center py-4">Loading pairing requests...</div>
        </div>
      </div>
      
      <div class="text-center">
        <a href="/setup" class="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Setup</a>
      </div>
    </div>
  </div>
  
  <script>
    async function startWhatsAppLogin() {
      const btn = document.getElementById('whatsapp-login-btn');
      const container = document.getElementById('whatsapp-qr-container');
      const qrDiv = document.getElementById('whatsapp-qr');
      
      btn.disabled = true;
      btn.textContent = '⏳ Starting...';
      container.classList.remove('hidden');
      qrDiv.innerHTML = '<div class="text-gray-400">Generating QR code...</div>';
      
      try {
        const res = await fetch('/api/channels/whatsapp/login', { method: 'POST' });
        const data = await res.json();
        
        if (data.success && data.qrCode) {
          qrDiv.innerHTML = '<img src="' + data.qrCode + '" alt="WhatsApp QR Code" class="mx-auto max-w-xs">';
          showResult('whatsapp-result', 'Scan the QR code with WhatsApp within 60 seconds', 'success');
          pollWhatsAppStatus();
        } else {
          qrDiv.innerHTML = '<div class="text-red-500">' + (data.error || 'Failed to generate QR code') + '</div>';
          showResult('whatsapp-result', data.error || 'Failed to start login', 'error');
        }
      } catch (err) {
        qrDiv.innerHTML = '<div class="text-red-500">Error: ' + err.message + '</div>';
        showResult('whatsapp-result', 'Error: ' + err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = '📷 Start WhatsApp Login';
      }
    }
    
    async function pollWhatsAppStatus() {
      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 2000));
        try {
          const res = await fetch('/api/channels/status');
          const data = await res.json();
          if (data.whatsapp?.connected) {
            showResult('whatsapp-result', '✅ WhatsApp connected successfully!', 'success');
            setTimeout(() => location.reload(), 1500);
            return;
          }
        } catch {}
      }
    }
    
    async function saveTelegramConfig() {
      const token = document.getElementById('telegram-token').value;
      const dmPolicy = document.getElementById('telegram-dm-policy').value;
      const isUpdate = ${telegram.connected ? 'true' : 'false'};
      
      if (!token && !isUpdate) {
        showResult('telegram-result', 'Please enter a bot token', 'error');
        return;
      }
      
      try {
        const payload = { dmPolicy };
        if (token) payload.botToken = token;
        
        const res = await fetch('/api/channels/telegram/configure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (data.success) {
          showResult('telegram-result', '✅ Telegram configured! Restart gateway to apply.', 'success');
        } else {
          showResult('telegram-result', data.error || 'Failed to save config', 'error');
        }
      } catch (err) {
        showResult('telegram-result', 'Error: ' + err.message, 'error');
      }
    }
    
    async function saveDiscordConfig() {
      const token = document.getElementById('discord-token').value;
      const dmPolicy = document.getElementById('discord-dm-policy').value;
      const isUpdate = ${discord.connected ? 'true' : 'false'};
      
      if (!token && !isUpdate) {
        showResult('discord-result', 'Please enter a bot token', 'error');
        return;
      }
      
      try {
        const payload = { dmPolicy };
        if (token) payload.botToken = token;
        
        const res = await fetch('/api/channels/discord/configure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (data.success) {
          showResult('discord-result', '✅ Discord configured! Restart gateway to apply.', 'success');
        } else {
          showResult('discord-result', data.error || 'Failed to save config', 'error');
        }
      } catch (err) {
        showResult('discord-result', 'Error: ' + err.message, 'error');
      }
    }
    
    async function disconnectChannel(channel) {
      if (!confirm('Disconnect ' + channel + '? You will need to reconfigure it.')) return;
      
      try {
        const res = await fetch('/api/channels/' + channel + '/disconnect', { method: 'POST' });
        const data = await res.json();
        showResult(channel + '-result', data.message || 'Disconnected', data.success ? 'success' : 'error');
        if (data.success) setTimeout(() => location.reload(), 1500);
      } catch (err) {
        showResult(channel + '-result', 'Error: ' + err.message, 'error');
      }
    }
    
    async function refreshPairingRequests() {
      const container = document.getElementById('pairing-list');
      container.innerHTML = '<div class="text-gray-400 text-center py-4">Loading...</div>';
      
      try {
        const res = await fetch('/api/pairing/list');
        const data = await res.json();
        
        if (!data.requests || data.requests.length === 0) {
          container.innerHTML = '<div class="text-gray-500 text-sm text-center py-4">No pending pairing requests</div>';
          return;
        }
        
        container.innerHTML = data.requests.map(req => \`
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div>
              <div class="font-medium text-gray-800">\${req.channel} - \${req.identifier}</div>
              <div class="text-xs text-gray-500">Code: \${req.code} | Expires: \${req.expiresIn}</div>
            </div>
            <div class="flex gap-2">
              <button onclick="approvePairing('\${req.channel}', '\${req.code}')" class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium">
                ✓ Approve
              </button>
              <button onclick="denyPairing('\${req.channel}', '\${req.code}')" class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium">
                ✗ Deny
              </button>
            </div>
          </div>
        \`).join('');
      } catch (err) {
        container.innerHTML = '<div class="text-red-500 text-sm text-center py-4">Error loading requests</div>';
      }
    }
    
    async function approvePairing(channel, code) {
      try {
        const res = await fetch('/api/pairing/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel, code })
        });
        const data = await res.json();
        alert(data.message || (data.success ? 'Approved!' : 'Failed'));
        refreshPairingRequests();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
    
    async function denyPairing(channel, code) {
      try {
        const res = await fetch('/api/pairing/deny', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel, code })
        });
        const data = await res.json();
        alert(data.message || (data.success ? 'Denied!' : 'Failed'));
        refreshPairingRequests();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
    
    function showResult(containerId, message, type) {
      const container = document.getElementById(containerId);
      container.classList.remove('hidden', 'bg-green-50', 'text-green-700', 'bg-red-50', 'text-red-700', 'border-green-200', 'border-red-200');
      container.classList.add('border', 'rounded-lg', 'px-3', 'py-2');
      if (type === 'success') {
        container.classList.add('bg-green-50', 'text-green-700', 'border-green-200');
      } else {
        container.classList.add('bg-red-50', 'text-red-700', 'border-red-200');
      }
      container.textContent = message;
    }
    
    refreshPairingRequests();
  </script>
  `;
  
  return layout('Channels', content, { includeTopBar: true });
}
