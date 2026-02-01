export function layout(title, content, options = {}) {
  const { includeTopBar = false, backLink = null, showAssistant = true, profile = null, showSafetyBar = false } = options;
  
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
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            display: ['Nunito', 'sans-serif'],
            body: ['Nunito', 'sans-serif'],
          },
          colors: {
            lobster: {
              50: '#fef2f2',
              100: '#fee2e2',
              200: '#fecaca',
              300: '#fca5a5',
              400: '#f87171',
              500: '#ef4444',
              600: '#dc2626',
              700: '#b91c1c',
              800: '#991b1b',
              900: '#7f1d1d',
            }
          }
        }
      }
    }
  </script>
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
        <a href="/profile" class="text-gray-300 hover:text-white font-medium">Profile</a>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button onclick="killSwitch()" class="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1">
        <span>⚡</span><span class="hidden sm:inline">Kill Switch</span>
      </button>
      <button onclick="wipeAll()" class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1">
        <span>🗑</span><span class="hidden sm:inline">Wipe</span>
      </button>
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
      const confirmed = confirm('🗑 WIPE EVERYTHING\\n\\nThis will:\\n• Stop the gateway\\n• Delete all configuration\\n• Reset your sandbox completely\\n\\nThis cannot be undone. Continue?');
      if (!confirmed) return;
      
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
        const response = await fetch('/api/assistant/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
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
</body>
</html>`;
}
