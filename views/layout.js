function renderCostWidget(budgetStatus) {
  return `
    <div class="relative" id="cost-widget">
      <a href="/setup" class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium transition-all flex items-center gap-1 text-gray-400">
        <span>💰</span><span class="hidden sm:inline">Loading...</span>
      </a>
    </div>
  `;
}

export function layout(title, content, options = {}) {
  // loggedIn defaults to true for protected pages (most pages require auth)
  // Only the landing page explicitly passes loggedIn: false when user is not logged in
  const { includeTopBar = false, backLink = null, showAssistant = true, profile = null, showSafetyBar = false, loggedIn = true, gatewayRunning = false, budgetStatus = null } = options;
  
  const showActiveButtons = loggedIn;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - LobsterSandbox</title>
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/tailwind.css">
  <style>
    body {
      font-family: 'Nunito', sans-serif;
    }
    .font-display {
      font-family: 'Nunito', sans-serif;
    }
    .lobster-gradient {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
    }
    .card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    }
    .logo-text {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    
    /* Lobster Assistant Styles */
    .lobster-assistant {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
    }
    .lobster-bubble {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(220, 38, 38, 0.4);
      transition: transform 0.2s, box-shadow 0.2s;
      font-size: 32px;
    }
    .lobster-bubble:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 24px rgba(220, 38, 38, 0.5);
    }
    .lobster-bubble.active {
      transform: scale(0.95);
    }
    .lobster-chat {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 380px;
      max-height: 500px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
    }
    .lobster-chat.open {
      display: flex;
    }
    .lobster-chat-header {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .lobster-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      max-height: 320px;
      min-height: 200px;
    }
    .lobster-message {
      margin-bottom: 12px;
      display: flex;
      gap: 8px;
    }
    .lobster-message.assistant {
      flex-direction: row;
    }
    .lobster-message.user {
      flex-direction: row-reverse;
    }
    .lobster-message-content {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
    }
    .lobster-message.assistant .lobster-message-content {
      background: #f3f4f6;
      color: #1f2937;
    }
    .lobster-message.user .lobster-message-content {
      background: #dc2626;
      color: white;
    }
    
    /* Markdown rendering styles */
    .lobster-message-content h1,
    .lobster-message-content h2,
    .lobster-message-content h3 {
      font-weight: 700;
      margin: 8px 0 4px 0;
      line-height: 1.3;
    }
    .lobster-message-content h1 { font-size: 16px; }
    .lobster-message-content h2 { font-size: 14px; color: #374151; }
    .lobster-message-content h3 { font-size: 13px; color: #4b5563; }
    .lobster-message-content p {
      margin: 6px 0;
    }
    .lobster-message-content ul,
    .lobster-message-content ol {
      margin: 6px 0;
      padding-left: 16px;
    }
    .lobster-message-content li {
      margin: 3px 0;
    }
    .lobster-message-content strong {
      font-weight: 700;
    }
    .lobster-message-content em {
      font-style: italic;
    }
    .lobster-message-content code {
      background: #e5e7eb;
      padding: 1px 4px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 12px;
    }
    .lobster-message-content pre {
      background: #1f2937;
      color: #f3f4f6;
      padding: 8px 10px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 6px 0;
      font-size: 11px;
    }
    .lobster-message-content pre code {
      background: transparent;
      padding: 0;
      color: inherit;
    }
    .lobster-message-content hr {
      border: none;
      border-top: 1px solid #d1d5db;
      margin: 8px 0;
    }
    .lobster-message-content a {
      color: #dc2626;
      text-decoration: underline;
    }
    .lobster-chat-input {
      border-top: 1px solid #e5e7eb;
      padding: 12px;
      display: flex;
      gap: 8px;
    }
    .lobster-chat-input input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
    }
    .lobster-chat-input input:focus {
      border-color: #dc2626;
    }
    .lobster-chat-input button {
      padding: 10px 16px;
      background: #dc2626;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
    }
    .lobster-chat-input button:hover {
      background: #b91c1c;
    }
    .lobster-chat-input button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 10px 14px;
    }
    .typing-indicator span {
      width: 8px;
      height: 8px;
      background: #9ca3af;
      border-radius: 50%;
      animation: typing 1.4s infinite;
    }
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }
    
    /* Shimmer animation for progress bar */
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .animate-shimmer {
      animation: shimmer 2s infinite;
    }
    
    /* Pulse animation for attention */
    @keyframes pulse-ring {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(1.5); opacity: 0; }
    }
    .lobster-bubble::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #ef4444;
      animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      z-index: -1;
    }
  </style>
</head>
<body class="bg-gray-50 min-h-screen font-body">
  <!-- Safety Bar - Always visible -->
  <div class="bg-gray-900 text-white py-2 px-4 flex items-center justify-between sticky top-0 z-50">
    <div class="flex items-center gap-3">
      <a href="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span class="text-xl">🦞</span>
        <span class="logo-text text-base hidden sm:inline">LobsterSandbox</span>
      </a>
      <div class="hidden md:flex items-center gap-3 ml-4 text-sm">
        <a href="/status" class="text-gray-300 hover:text-white font-medium">Status</a>
        <a href="/setup" class="text-gray-300 hover:text-white font-medium">Setup</a>
        <a href="/guide" class="text-gray-300 hover:text-white font-medium">Guide</a>
        <a href="/missions" class="text-gray-300 hover:text-white font-medium">Missions</a>
        <a href="/pricing" class="text-gray-300 hover:text-white font-medium">Pricing</a>
        <a href="https://lobstersandbox--mlb5asox3so-prod.cloud.modelence.app" target="_blank" class="text-gray-300 hover:text-white font-medium">API</a>
        <a href="/profile" class="text-gray-300 hover:text-white font-medium">Profile</a>
      </div>
    </div>
    <div class="flex items-center gap-2">
      ${loggedIn ? renderCostWidget(budgetStatus) : ''}
      ${showActiveButtons ? `
      <button onclick="killSwitch()" aria-label="Kill Switch - Stop gateway immediately" class="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1">
        <span aria-hidden="true">⚡</span><span class="hidden sm:inline">Kill Switch</span>
      </button>
      <button onclick="wipeAll()" aria-label="Wipe - Reset all configuration" class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1">
        <span aria-hidden="true">🗑</span><span class="hidden sm:inline">Wipe</span>
      </button>
      ` : `
      <span class="px-3 py-1.5 bg-gray-600 text-gray-400 rounded-lg text-xs font-medium flex items-center gap-1 cursor-not-allowed" title="Login required">
        <span aria-hidden="true">⚡</span><span class="hidden sm:inline">Kill Switch</span>
      </span>
      <span class="px-3 py-1.5 bg-gray-600 text-gray-400 rounded-lg text-xs font-medium flex items-center gap-1 cursor-not-allowed" title="Login required">
        <span aria-hidden="true">🗑</span><span class="hidden sm:inline">Wipe</span>
      </span>
      `}
    </div>
  </div>
  
  ${includeTopBar ? `
  <div class="bg-gray-800 text-white py-2 px-4 flex items-center justify-center gap-4 text-sm">
    ${backLink ? `<a href="${backLink}" class="text-gray-300 hover:text-white font-medium">&larr; Back</a>` : ''}
    ${profile && profile !== 'safe' ? `<a href="/channels" class="text-gray-300 hover:text-white font-medium">Channels</a>` : ''}
    ${profile && profile !== 'safe' ? `<a href="/tools" class="text-gray-300 hover:text-white font-medium">Tools</a>` : ''}
    <a href="/openclaw" class="text-gray-300 hover:text-white font-medium">Control UI</a>
  </div>
  ` : ''}
  ${content}
  
  <!-- Global Safety Scripts -->
  <script>
    async function getCsrfToken() {
      try {
        const res = await fetch('/api/csrf-token');
        if (!res.ok) return null;
        const data = await res.json();
        return data.token;
      } catch {
        return null;
      }
    }
    
    function toggleCostDropdown() {
      const dropdown = document.getElementById('cost-dropdown');
      if (dropdown) {
        dropdown.classList.toggle('hidden');
      }
    }
    
    document.addEventListener('click', function(e) {
      const widget = document.getElementById('cost-widget');
      const dropdown = document.getElementById('cost-dropdown');
      if (widget && dropdown && !widget.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
    
    async function loadBudgetStatus() {
      const widget = document.getElementById('cost-widget');
      if (!widget) return;
      
      try {
        const res = await fetch('/api/budget');
        if (!res.ok) {
          widget.innerHTML = '<a href="/setup" class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium transition-all flex items-center gap-1 text-gray-400"><span>💰</span><span class="hidden sm:inline">No budget set</span></a>';
          return;
        }
        const status = await res.json();
        
        if (!status.hasBudget) {
          widget.innerHTML = '<a href="/setup" class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium transition-all flex items-center gap-1 text-gray-400"><span>💰</span><span class="hidden sm:inline">No budget set</span></a>';
          return;
        }
        
        const { used, limit, percentage, todayCost, model, alertLevel } = status;
        
        let barColor = 'bg-green-500';
        let textColor = 'text-green-400';
        if (percentage >= 80) {
          barColor = 'bg-red-500';
          textColor = 'text-red-400';
        } else if (percentage >= 50) {
          barColor = 'bg-yellow-500';
          textColor = 'text-yellow-400';
        }
        
        const usedFormatted = used.toFixed(2);
        const limitFormatted = limit.toFixed(0);
        const todayFormatted = todayCost.toFixed(2);
        const modelDisplay = model ? model.split('/').pop() : 'Unknown';
        
        widget.innerHTML = \`
          <button onclick="toggleCostDropdown()" class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium transition-all flex flex-col items-start gap-0.5">
            <span class="\${textColor}">💰 $\${usedFormatted} / $\${limitFormatted}</span>
            <div class="w-full h-0.5 bg-gray-600 rounded-full overflow-hidden" style="min-width: 60px;">
              <div class="h-full \${barColor} transition-all duration-500" style="width: \${Math.min(100, percentage)}%"></div>
            </div>
          </button>
          <div id="cost-dropdown" class="hidden absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50">
            <div class="text-sm text-gray-800 space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-500">Today:</span>
                <span class="font-medium">$\${todayFormatted}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Total:</span>
                <span class="font-medium">$\${usedFormatted} / $\${limitFormatted} limit</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Model:</span>
                <span class="font-medium">\${modelDisplay}</span>
              </div>
              <div class="pt-2 border-t border-gray-100">
                <a href="/setup" class="text-red-500 hover:text-red-600 text-xs font-medium">Change budget →</a>
              </div>
              <div class="bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2">
                <p class="text-xs text-amber-700">⚠️ <strong>Estimates only.</strong> Check your API provider dashboard for exact billing.</p>
              </div>
            </div>
          </div>
        \`;
        
        if (alertLevel === 'warning') {
          showToast('You\\'ve used 75% of your sandbox budget.', 'warning');
        } else if (alertLevel === 'critical') {
          showToast('⚠️ Approaching budget limit. 90% of your budget used.', 'critical');
        } else if (alertLevel === 'exceeded') {
          showBudgetExceededModal(usedFormatted, limitFormatted);
        }
      } catch (err) {
        console.error('Failed to load budget status:', err);
      }
    }
    
    function showToast(message, level) {
      const existingToast = document.getElementById('budget-toast');
      if (existingToast) existingToast.remove();
      
      const bgColor = level === 'critical' ? 'bg-orange-500' : 'bg-yellow-500';
      const toast = document.createElement('div');
      toast.id = 'budget-toast';
      toast.className = \`fixed top-16 left-1/2 transform -translate-x-1/2 \${bgColor} text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm font-medium\`;
      toast.textContent = message;
      document.body.appendChild(toast);
      
      setTimeout(() => toast.remove(), 8000);
    }
    
    function showBudgetExceededModal(used, limit) {
      const existingModal = document.getElementById('budget-modal');
      if (existingModal) return;
      
      const modal = document.createElement('div');
      modal.id = 'budget-modal';
      modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
      modal.innerHTML = \`
        <div class="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl">
          <h2 class="text-xl font-bold text-red-600 mb-3">🛑 Budget Limit Reached</h2>
          <p class="text-gray-600 mb-4">Your sandbox has been paused to prevent unexpected charges. You've used $\${used} of your $\${limit} budget.</p>
          <div class="flex flex-col gap-2">
            <a href="/setup" class="w-full px-4 py-2 bg-lobster-600 hover:bg-lobster-700 text-white rounded-xl font-medium text-center transition-all">Increase Budget</a>
            <button onclick="wipeAll()" class="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-all">Wipe & Start Fresh</button>
            <button onclick="document.getElementById('budget-modal').remove()" class="w-full px-4 py-2 text-gray-500 hover:text-gray-700 font-medium transition-all">Keep Paused</button>
          </div>
        </div>
      \`;
      document.body.appendChild(modal);
    }
    
    document.addEventListener('DOMContentLoaded', loadBudgetStatus);
    
    async function killSwitch() {
      if (!confirm('⚡ KILL SWITCH\\n\\nThis will immediately stop the OpenClaw gateway.\\n\\nContinue?')) return;
      
      try {
        const csrfToken = await getCsrfToken();
        if (!csrfToken) {
          alert('Session expired. Please log in again.');
          window.location.href = '/setup';
          return;
        }
        
        const res = await fetch('/api/gateway/stop', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
          body: JSON.stringify({ csrf_token: csrfToken })
        });
        const data = await res.json();
        if (data.success) {
          alert('✅ Gateway stopped. Your sandbox is now safe.');
          location.reload();
        } else {
          alert('Error: ' + (data.error || 'Failed to stop gateway'));
        }
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
    
    async function wipeAll() {
      const typedConfirm = prompt('🗑 WIPE EVERYTHING\\n\\nThis will:\\n• Stop the gateway\\n• Delete all configuration\\n• Reset your sandbox completely\\n\\nType WIPE to confirm:');
      if (typedConfirm !== 'WIPE') {
        if (typedConfirm !== null) alert('You must type WIPE exactly to confirm.');
        return;
      }
      
      const password = prompt('Enter your setup password to confirm wipe:');
      if (!password) return;
      
      try {
        const csrfToken = await getCsrfToken();
        if (!csrfToken) {
          alert('Session expired. Please log in again.');
          window.location.href = '/setup';
          return;
        }
        
        const res = await fetch('/api/wipe-all', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
          body: JSON.stringify({ csrf_token: csrfToken, password })
        });
        const data = await res.json();
        if (data.success) {
          alert('✅ Everything wiped. Returning to fresh start.');
          window.location.href = '/';
        } else {
          alert('Error: ' + (data.error || 'Failed to wipe'));
        }
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
  </script>
  
  ${showAssistant ? `
  <!-- Lobster Assistant -->
  <div class="lobster-assistant" id="lobster-assistant">
    <div class="lobster-chat" id="lobster-chat">
      <div class="lobster-chat-header">
        <span style="font-size: 28px;">🦞</span>
        <div>
          <div class="font-semibold">Larry</div>
          <div class="text-xs opacity-80">Your LobsterSandbox Guide</div>
        </div>
      </div>
      <div class="lobster-chat-messages" id="lobster-messages">
        <div class="lobster-message assistant">
          <div class="lobster-message-content">
            Hey there! 👋 I'm Larry the Lobster, your LobsterSandbox guide. I can help you set up OpenClaw, understand the features, or troubleshoot any issues. What would you like to know?
          </div>
        </div>
      </div>
      <div class="lobster-chat-input">
        <input type="text" id="lobster-input" placeholder="Ask me anything..." onkeypress="if(event.key==='Enter')sendLobsterMessage()">
        <button onclick="sendLobsterMessage()" id="lobster-send">Send</button>
      </div>
    </div>
    <div class="lobster-bubble" id="lobster-toggle" onclick="toggleLobsterChat()">
      🦞
    </div>
  </div>
  
  <script>
    let chatOpen = false;
    let isTyping = false;
    
    function toggleLobsterChat() {
      chatOpen = !chatOpen;
      document.getElementById('lobster-chat').classList.toggle('open', chatOpen);
      document.getElementById('lobster-toggle').classList.toggle('active', chatOpen);
      if (chatOpen) {
        document.getElementById('lobster-input').focus();
      }
    }
    
    function parseMarkdown(text) {
      let html = text;
      
      // Code blocks
      html = html.replace(/\\\`\\\`\\\`([\\s\\S]*?)\\\`\\\`\\\`/g, '<pre><code>$1</code></pre>');
      html = html.replace(/\\\`([^\\\`]+)\\\`/g, '<code>$1</code>');
      
      // Headers
      html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
      html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
      html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
      
      // Bold and italic
      html = html.replace(/\\*\\*([^*]+)\\*\\*/g, '<strong>$1</strong>');
      html = html.replace(/\\*([^*]+)\\*/g, '<em>$1</em>');
      
      // Horizontal rule
      html = html.replace(/^---$/gm, '<hr>');
      
      // Lists - convert bullets and numbers to list items
      html = html.replace(/^[•] (.+)$/gm, '<li>$1</li>');
      html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
      html = html.replace(/^\\* (.+)$/gm, '<li>$1</li>');
      html = html.replace(/^\\d+\\. (.+)$/gm, '<li>$1</li>');
      
      // URLs
      html = html.replace(/(https?:\\/\\/[^\\s<)]+)/g, '<a href="$1" target="_blank">link</a>');
      
      // Paragraphs and line breaks
      html = html.replace(/\\n\\n/g, '</p><p>');
      html = html.replace(/\\n/g, '<br>');
      html = '<p>' + html + '</p>';
      
      // Clean up paragraph wrapping around block elements
      html = html.replace(/<p><h/g, '<h');
      html = html.replace(/<\\/h(\\d)><\\/p>/g, '</h$1>');
      html = html.replace(/<p><hr><\\/p>/g, '<hr>');
      html = html.replace(/<p><pre>/g, '<pre>');
      html = html.replace(/<\\/pre><\\/p>/g, '</pre>');
      
      // Wrap consecutive list items in ul
      html = html.replace(/<br><li>/g, '<li>');
      html = html.replace(/<\\/li><br>/g, '</li>');
      html = html.replace(/(<li>[\\s\\S]*?<\\/li>)/g, '<ul>$1</ul>');
      html = html.replace(/<\\/ul><ul>/g, '');
      
      return html;
    }
    
    function addMessage(content, role) {
      const messagesDiv = document.getElementById('lobster-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = 'lobster-message ' + role;
      const displayContent = role === 'assistant' ? parseMarkdown(content) : content;
      messageDiv.innerHTML = '<div class="lobster-message-content">' + displayContent + '</div>';
      messagesDiv.appendChild(messageDiv);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    
    function showTyping() {
      const messagesDiv = document.getElementById('lobster-messages');
      const typingDiv = document.createElement('div');
      typingDiv.id = 'typing-indicator';
      typingDiv.className = 'lobster-message assistant';
      typingDiv.innerHTML = '<div class="lobster-message-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
      messagesDiv.appendChild(typingDiv);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    
    function hideTyping() {
      const typing = document.getElementById('typing-indicator');
      if (typing) typing.remove();
    }
    
    async function sendLobsterMessage() {
      const input = document.getElementById('lobster-input');
      const message = input.value.trim();
      if (!message || isTyping) return;
      
      input.value = '';
      addMessage(message, 'user');
      
      isTyping = true;
      document.getElementById('lobster-send').disabled = true;
      showTyping();
      
      try {
        const csrfToken = await getCsrfToken();
        if (!csrfToken) {
          hideTyping();
          addMessage('Please log in first to chat with me!', 'assistant');
          isTyping = false;
          document.getElementById('lobster-send').disabled = false;
          return;
        }
        const response = await fetch('/api/assistant/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
          body: JSON.stringify({ message, csrf_token: csrfToken })
        });
        const data = await response.json();
        hideTyping();
        addMessage(data.response || 'Sorry, I had trouble understanding that. Please try again!', 'assistant');
      } catch (err) {
        hideTyping();
        addMessage('Oops! Something went wrong. Please try again in a moment.', 'assistant');
      }
      
      isTyping = false;
      document.getElementById('lobster-send').disabled = false;
    }
  </script>
  ` : ''}
  <!-- Share Modal -->
  <div id="share-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden" onclick="if(event.target === this) closeShareModal()">
    <div class="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl w-full">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-display font-bold text-gray-800">📤 Share LobsterSandbox</h2>
        <button onclick="closeShareModal()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>
      <p class="text-gray-600 mb-6">Help someone else try OpenClaw safely.</p>
      
      <div class="flex flex-wrap gap-3 mb-6">
        <button onclick="copyShareLink()" id="share-copy-btn" class="flex-1 min-w-[120px] px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
          📋 Copy Link
        </button>
        <a href="https://twitter.com/intent/tweet?text=I%27m%20testing%20OpenClaw%20without%20risking%20my%20real%20accounts%20using%20LobsterSandbox%20%F0%9F%A6%9E&url=https://lobstersandbox.com" target="_blank" class="flex-1 min-w-[120px] px-4 py-3 bg-black hover:bg-gray-800 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2">
          𝕏 Twitter
        </a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://lobstersandbox.com" target="_blank" class="flex-1 min-w-[120px] px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2">
          LinkedIn
        </a>
        <a href="https://www.reddit.com/submit?url=https://lobstersandbox.com&title=LobsterSandbox%20-%20Try%20OpenClaw%20without%20risking%20your%20real%20accounts" target="_blank" class="flex-1 min-w-[120px] px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2">
          Reddit
        </a>
      </div>
      
      <div class="bg-gray-50 rounded-xl p-4">
        <p class="text-xs text-gray-500 mb-2">Or copy this message:</p>
        <p id="share-message-text" class="text-sm text-gray-700 leading-relaxed">I'm testing OpenClaw without risking my real accounts. LobsterSandbox gives you throwaway account setup, API cost controls, and a Kill Switch. 🦞 https://lobstersandbox.com</p>
        <button onclick="copyShareMessage()" class="mt-3 text-sm text-red-500 hover:text-red-600 font-medium">📋 Copy message</button>
      </div>
    </div>
  </div>
  
  <script>
    let shareUrl = 'https://lobstersandbox.com';
    let shareMessage = "I'm testing OpenClaw without risking my real accounts. LobsterSandbox gives you throwaway account setup, API cost controls, and a Kill Switch. 🦞 https://lobstersandbox.com";
    
    function openShareModal(customUrl, customMessage) {
      if (customUrl) shareUrl = customUrl;
      if (customMessage) {
        shareMessage = customMessage;
        document.getElementById('share-message-text').textContent = customMessage;
      }
      document.getElementById('share-modal').classList.remove('hidden');
    }
    
    function closeShareModal() {
      document.getElementById('share-modal').classList.add('hidden');
    }
    
    async function copyShareLink() {
      try {
        await navigator.clipboard.writeText(shareUrl);
        const btn = document.getElementById('share-copy-btn');
        btn.innerHTML = '✅ Copied!';
        setTimeout(() => { btn.innerHTML = '📋 Copy Link'; }, 2000);
      } catch (err) {
        alert('Copy failed: ' + err.message);
      }
    }
    
    async function copyShareMessage() {
      try {
        await navigator.clipboard.writeText(shareMessage);
        alert('Message copied!');
      } catch (err) {
        alert('Copy failed: ' + err.message);
      }
    }
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeShareModal();
    });
  </script>

  <footer class="text-center text-xs text-gray-400 py-6 space-y-2">
    <div class="flex flex-wrap justify-center gap-4 mb-2">
      <a href="/" class="hover:text-gray-600">Home</a>
      <a href="/guide" class="hover:text-gray-600">Burner Stack Guide</a>
      <a href="/deploy" class="hover:text-gray-600">Deploy</a>
      <a href="https://lobstersandbox--mlb5asox3so-prod.cloud.modelence.app" target="_blank" class="hover:text-gray-600">API Portal</a>
      <a href="/compare" class="hover:text-gray-600">Why LobsterSandbox?</a>
      <a href="https://docs.openclaw.ai/" target="_blank" class="hover:text-gray-600">OpenClaw Docs</a>
      <span class="mx-1 text-gray-300">|</span>
      <a href="/graduate" class="hover:text-gray-600">🎓 Graduate</a>
    </div>
    <div class="mb-2">Built by lobster lovers for the OpenClaw community. <button onclick="openShareModal()" class="text-red-400 hover:text-red-500 font-medium">📤 Share LobsterSandbox</button></div>
    <div>LobsterSandbox v1.2.3</div>
    <div>Unofficial community tool. Not affiliated with OpenClaw.</div>
    <div>Bring your own API keys. Do not connect sensitive accounts on day one.</div>
  </footer>
</body>
</html>`;
}
