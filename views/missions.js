import { layout } from './layout.js';

const MISSIONS = [
  {
    id: 'hello-lobster',
    emoji: '🌊',
    title: 'Hello, Lobster!',
    difficulty: 'Beginner',
    time: '~2 min',
    cost: '~$0.02',
    requires: 'Nothing (uses built-in WebChat)',
    description: 'Say hi to your AI agent through the built-in WebChat. No accounts or channels needed — just type and go.',
    steps: [
      'Click "Open Control UI" in the LobsterSandbox nav bar (or go to /openclaw)',
      'In the Control UI, find the WebChat tab',
      'Type: "Hi! Tell me 3 interesting facts about lobsters."',
      'Try: "What kinds of things can you help me with?"',
      'Try: "Write me a haiku about trying something new."',
      'You just chatted with your own AI agent! Mark this mission complete.'
    ],
    notes: [],
    larry: "🦞 You did it! Your first conversation with your own AI agent. Not so scary, right?"
  },
  {
    id: 'research-assistant',
    emoji: '🔍',
    title: 'Research Assistant',
    difficulty: 'Beginner',
    time: '~5 min',
    cost: '~$0.10',
    requires: 'Nothing (WebChat only)',
    description: 'Ask OpenClaw to research any topic and summarize what it finds. See how it gathers and synthesizes information.',
    steps: [
      'Open the Control UI WebChat',
      'Try: "Research the latest news about [pick any topic you care about] and give me a 3-bullet summary."',
      'Follow up: "What are the different perspectives on this?"',
      'Try: "Find me 3 good sources about [topic] and summarize each one."',
      'Notice how it structures information and cites what it finds.'
    ],
    notes: [
      { type: 'info', text: 'Web search works best with the Brave Search API skill enabled. Without it, OpenClaw uses its built-in knowledge, which is still useful but won\'t have the latest news.' }
    ],
    larry: "🦞 You now have a research assistant that works 24/7. Imagine what this does for your workflow."
  },
  {
    id: 'personal-scribe',
    emoji: '📝',
    title: 'Personal Scribe',
    difficulty: 'Beginner',
    time: '~5 min',
    cost: '~$0.08',
    requires: 'Nothing (WebChat only)',
    description: 'Have OpenClaw draft emails, blog posts, or messages for you. See how it handles different writing styles.',
    steps: [
      'Open the Control UI WebChat',
      'Try: "Draft a professional email to my team about postponing tomorrow\'s meeting to next week. Keep it brief and friendly."',
      'Follow up: "Make it more casual" or "Add a note about bringing agenda items"',
      'Try something different: "Write a 200-word blog post introduction about [any topic you like]."',
      'Try: "Now rewrite that in a more conversational tone."'
    ],
    notes: [],
    larry: "🦞 You just got a writing assistant that adapts to any tone. No more staring at blank screens."
  },
  {
    id: 'discord-buddy',
    emoji: '💬',
    title: 'Discord Buddy',
    difficulty: 'Intermediate',
    time: '~15 min',
    cost: '~$0.10',
    requires: 'Discord account (create one with your burner email if needed)',
    description: 'Connect OpenClaw to Discord and chat with it from there. Your first external channel — the agent leaves the sandbox chat and enters a real platform.',
    steps: [
      'If you don\'t have a Discord account, create one at discord.com using your burner email',
      'Create a new Discord server (or use a test server you already have)',
      'Go to discord.com/developers/applications → "New Application" → Give it a name',
      'Go to the "Bot" section → Click "Add Bot" → Copy the bot token',
      'Under "Privileged Gateway Intents," enable Message Content Intent',
      'Go to OAuth2 → URL Generator → Select "bot" scope and "Send Messages" + "Read Messages" permissions → Copy the generated URL → Open it to invite the bot to your server',
      'In the OpenClaw Control UI, go to Settings or Channels → Discord → Enter the bot token',
      'Send a message in your Discord server mentioning the bot or via DM',
      'You should get a response from OpenClaw in Discord!'
    ],
    notes: [
      { type: 'info', text: 'For the full Discord setup guide, see docs.openclaw.ai → Channels → Discord' }
    ],
    larry: "🦞 Your AI agent just left the chat box and entered the real world. This is where it starts getting fun."
  },
  {
    id: 'cron-master',
    emoji: '⏰',
    title: 'Cron Master',
    difficulty: 'Intermediate',
    time: '~10 min',
    cost: '~$0.15',
    requires: 'Nothing (WebChat only)',
    description: 'Set up an automated scheduled task. Have OpenClaw do something on its own every day without you asking.',
    steps: [
      'Open the Control UI WebChat',
      'Try: "Set up a daily task: every morning at 9am, give me a motivational quote and tell me what day it is and any notable events happening today."',
      'Or try: "Every day at 5pm, remind me to wrap up work and list anything I told you about during the day."',
      'Check the Cron section in the Control UI to see your scheduled task listed',
      'Wait for it to trigger (or ask OpenClaw "show me my scheduled tasks" to verify it\'s set up)'
    ],
    notes: [
      { type: 'warning', text: 'Cron jobs use API credits each time they run. A simple daily task costs ~$0.01-0.05 per run. A job running every hour would cost ~$0.24-1.20/day. Keep an eye on your budget tracker.' }
    ],
    larry: "🦞 Your agent now does things while you sleep. Welcome to the future. Just watch that budget."
  },
  {
    id: 'skill-builder',
    emoji: '🧠',
    title: 'Skill Builder',
    difficulty: 'Intermediate',
    time: '~15 min',
    cost: '~$0.25',
    requires: 'Nothing (WebChat only)',
    description: 'Ask OpenClaw to create a brand new skill for itself. Watch it literally extend its own capabilities. This is the "whoa" moment.',
    steps: [
      'Open the Control UI WebChat',
      'Try: "Create a new skill called \'dice-roller\' that lets me roll dice. I should be able to say \'roll 3d6\' and get individual results plus a total."',
      'Test it: "Roll 2d20" — it should use the new skill',
      'Try another: "Create a skill that converts between currencies using current exchange rates."',
      'Check the Skills section in the Control UI to see your custom skills listed',
      'Skills are stored in your sandbox workspace — they\'re included if you Wipe.'
    ],
    notes: [
      { type: 'info', text: 'Custom skills are saved in the agent workspace at ~/.openclaw/workspace/skills/. Browse community skills at clawhub.com for inspiration.' }
    ],
    larry: "🦞 You just taught your AI agent a new trick and it learned it. Now imagine what else you could build. Check out clawhub.com for ideas."
  }
];

function renderMissionCard(mission, index) {
  const difficultyColor = mission.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';
  
  const stepsHtml = mission.steps.map((step, i) => `
    <li class="flex gap-3 items-start">
      <span class="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">${i + 1}</span>
      <span class="text-gray-700">${step}</span>
    </li>
  `).join('');
  
  const notesHtml = mission.notes.map(note => {
    const noteColor = note.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-blue-50 border-blue-200 text-blue-800';
    const noteIcon = note.type === 'warning' ? '⚠️' : 'ℹ️';
    return `
      <div class="${noteColor} border rounded-lg p-3 text-sm">
        <span>${noteIcon}</span> ${note.text}
      </div>
    `;
  }).join('');
  
  return `
    <div class="card p-0 overflow-hidden transition-all duration-300" id="mission-card-${mission.id}" data-mission-id="${mission.id}">
      <div class="p-5">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <span class="text-3xl">${mission.emoji}</span>
            <div>
              <h3 class="font-display font-bold text-gray-800 text-lg">${mission.title}</h3>
              <span class="${difficultyColor} text-xs font-medium px-2 py-0.5 rounded-full">${mission.difficulty}</span>
            </div>
          </div>
          <div id="mission-complete-badge-${mission.id}" class="hidden">
            <span class="text-green-500 text-2xl">✓</span>
          </div>
        </div>
        
        <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span>⏱️ ${mission.time}</span>
          <span>💰 ${mission.cost}</span>
        </div>
        
        <p class="text-sm text-gray-500 mb-3">
          <strong>Requires:</strong> ${mission.requires}
        </p>
        
        <p class="text-gray-600 mb-4">${mission.description}</p>
        
        <button 
          onclick="toggleMission('${mission.id}')" 
          id="mission-toggle-${mission.id}"
          class="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
        >
          <span id="mission-btn-text-${mission.id}">Start Mission</span>
          <span id="mission-btn-arrow-${mission.id}" class="transition-transform">→</span>
        </button>
      </div>
      
      <div id="mission-steps-${mission.id}" class="hidden border-t border-gray-100 bg-gray-50 p-5">
        <h4 class="font-semibold text-gray-800 mb-4">Steps:</h4>
        <ol class="space-y-3 mb-6">
          ${stepsHtml}
        </ol>
        
        ${notesHtml ? `<div class="space-y-3 mb-6">${notesHtml}</div>` : ''}
        
        <label class="flex items-center gap-3 p-4 bg-white rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group border border-gray-200">
          <input 
            type="checkbox" 
            id="mission-checkbox-${mission.id}" 
            onchange="handleMissionComplete('${mission.id}')" 
            class="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500 cursor-pointer"
          >
          <span class="font-medium text-gray-700 group-hover:text-gray-900">✅ Mark as complete</span>
        </label>
        
        <div id="mission-larry-${mission.id}" class="hidden mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-800 font-medium">${mission.larry}</p>
        </div>
      </div>
    </div>
  `;
}

export function missionsPage(options = {}) {
  const { loggedIn = false, gatewayRunning = false } = options;
  
  const missionCards = MISSIONS.map((mission, index) => renderMissionCard(mission, index)).join('');
  
  const content = `
  <div class="min-h-screen flex flex-col items-center px-4 py-8">
    <div class="w-full max-w-4xl">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4">
          🎯 Sandbox Missions
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Guided tutorials to see what OpenClaw can do. Each mission shows estimated time and cost so you know exactly what to expect.
        </p>
      </div>
      
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-8 sticky top-14 z-40">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-gray-700" id="missions-progress-text">0 of 6 missions completed</span>
          <span class="text-xs text-gray-400">Progress saved in browser</span>
        </div>
        <div class="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div id="missions-progress-bar" class="h-full bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 transition-all duration-700 ease-out relative" style="width: 0%">
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>
      
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        ${missionCards}
      </div>
      
      <div class="card p-6 text-center bg-gray-50">
        <p class="text-gray-600 mb-2">More missions coming soon! All activity stays in your sandbox — hit Wipe anytime for a fresh start.</p>
        <p class="text-gray-500 text-sm">💡 Have an idea for a mission? Tell Larry in the chat!</p>
      </div>
      
    </div>
  </div>
  
  <div id="larry-toast" class="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 max-w-md text-center hidden transition-all duration-300 opacity-0">
    <div class="flex items-center gap-3">
      <span class="text-3xl">🦞</span>
      <p id="larry-toast-message" class="font-medium"></p>
    </div>
  </div>
  
  <script>
    const MISSION_IDS = ${JSON.stringify(MISSIONS.map(m => m.id))};
    const MISSION_LARRY = ${JSON.stringify(Object.fromEntries(MISSIONS.map(m => [m.id, m.larry])))};
    
    function getCompletedMissions() {
      try {
        const stored = localStorage.getItem('lobstersandbox_missions');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    
    function saveCompletedMissions(completed) {
      try {
        localStorage.setItem('lobstersandbox_missions', JSON.stringify(completed));
      } catch {
      }
    }
    
    function updateProgress() {
      const completed = getCompletedMissions();
      const count = completed.length;
      const total = MISSION_IDS.length;
      const pct = (count / total) * 100;
      
      document.getElementById('missions-progress-text').textContent = count + ' of ' + total + ' missions completed';
      document.getElementById('missions-progress-bar').style.width = pct + '%';
      
      MISSION_IDS.forEach(id => {
        const card = document.getElementById('mission-card-' + id);
        const badge = document.getElementById('mission-complete-badge-' + id);
        const checkbox = document.getElementById('mission-checkbox-' + id);
        const larryBox = document.getElementById('mission-larry-' + id);
        
        if (completed.includes(id)) {
          card.classList.add('ring-2', 'ring-green-400', 'bg-green-50/50');
          badge.classList.remove('hidden');
          if (checkbox) checkbox.checked = true;
          if (larryBox) larryBox.classList.remove('hidden');
        } else {
          card.classList.remove('ring-2', 'ring-green-400', 'bg-green-50/50');
          badge.classList.add('hidden');
          if (checkbox) checkbox.checked = false;
          if (larryBox) larryBox.classList.add('hidden');
        }
      });
    }
    
    function toggleMission(id) {
      const stepsEl = document.getElementById('mission-steps-' + id);
      const btnText = document.getElementById('mission-btn-text-' + id);
      const btnArrow = document.getElementById('mission-btn-arrow-' + id);
      const btn = document.getElementById('mission-toggle-' + id);
      
      const isOpen = !stepsEl.classList.contains('hidden');
      
      if (isOpen) {
        stepsEl.classList.add('hidden');
        btnText.textContent = 'Start Mission';
        btnArrow.style.transform = 'rotate(0deg)';
        btn.classList.remove('bg-gray-500', 'hover:bg-gray-600');
        btn.classList.add('bg-red-500', 'hover:bg-red-600');
      } else {
        stepsEl.classList.remove('hidden');
        btnText.textContent = 'Hide Steps';
        btnArrow.style.transform = 'rotate(90deg)';
        btn.classList.remove('bg-red-500', 'hover:bg-red-600');
        btn.classList.add('bg-gray-500', 'hover:bg-gray-600');
      }
    }
    
    function handleMissionComplete(id) {
      const checkbox = document.getElementById('mission-checkbox-' + id);
      const completed = getCompletedMissions();
      
      if (checkbox.checked) {
        if (!completed.includes(id)) {
          completed.push(id);
          saveCompletedMissions(completed);
          showLarryToast(MISSION_LARRY[id]);
        }
      } else {
        const idx = completed.indexOf(id);
        if (idx > -1) {
          completed.splice(idx, 1);
          saveCompletedMissions(completed);
        }
      }
      
      updateProgress();
    }
    
    function showLarryToast(message) {
      const toast = document.getElementById('larry-toast');
      const msgEl = document.getElementById('larry-toast-message');
      
      msgEl.textContent = message;
      toast.classList.remove('hidden');
      
      setTimeout(() => {
        toast.classList.remove('opacity-0');
        toast.classList.add('opacity-100');
      }, 10);
      
      setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
        setTimeout(() => {
          toast.classList.add('hidden');
        }, 300);
      }, 6000);
    }
    
    document.addEventListener('DOMContentLoaded', updateProgress);
  </script>
  `;
  
  return layout('Sandbox Missions', content, { loggedIn, gatewayRunning });
}
