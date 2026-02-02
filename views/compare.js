import { layout } from './layout.js';

export function comparePage(options = {}) {
  const content = `
    <div class="max-w-6xl mx-auto px-4 py-12">
      
      <!-- Page Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4">Why LobsterSandbox?</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">There are many ways to run OpenClaw. Here's how LobsterSandbox compares.</p>
      </div>
      
      <!-- Comparison Table -->
      <div class="card overflow-hidden mb-16">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left font-semibold text-gray-700 px-4 py-4 bg-gray-50 min-w-[180px]">Feature</th>
                <th class="text-left font-semibold text-gray-700 px-4 py-4 bg-lobster-50 border-l border-lobster-100 min-w-[160px]">
                  <span class="text-lobster-600">🦞 LobsterSandbox</span>
                </th>
                <th class="text-left font-semibold text-gray-600 px-4 py-4 bg-gray-50 min-w-[160px]">OpenClaw Direct</th>
                <th class="text-left font-semibold text-gray-600 px-4 py-4 bg-gray-50 min-w-[160px]">DigitalOcean 1-Click</th>
                <th class="text-left font-semibold text-gray-600 px-4 py-4 bg-gray-50 min-w-[160px]">Docker Self-Host</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              
              <!-- Row 1: Technical knowledge needed -->
              <tr>
                <td class="px-4 py-4 font-medium text-gray-700 bg-gray-50">Technical knowledge needed</td>
                <td class="px-4 py-4 bg-lobster-50/50 border-l border-lobster-100">
                  <div class="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>✅</span>
                    <span class="font-medium">None — guided wizard</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>❌</span>
                    <span>Node.js, CLI, terminal</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>❌</span>
                    <span>SSH, server admin</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>❌</span>
                    <span>Docker, Compose, CLI</span>
                  </div>
                </td>
              </tr>
              
              <!-- Row 2: Account separation guidance -->
              <tr>
                <td class="px-4 py-4 font-medium text-gray-700 bg-gray-50">Account separation guidance</td>
                <td class="px-4 py-4 bg-lobster-50/50 border-l border-lobster-100">
                  <div class="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>✅</span>
                    <span class="font-medium">Built-in Burner Stack Guide</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>❌</span>
                    <span>Not included</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>❌</span>
                    <span>Not included</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>❌</span>
                    <span>Not included</span>
                  </div>
                </td>
              </tr>
              
              <!-- Row 3: Kill Switch -->
              <tr>
                <td class="px-4 py-4 font-medium text-gray-700 bg-gray-50">Kill Switch</td>
                <td class="px-4 py-4 bg-lobster-50/50 border-l border-lobster-100">
                  <div class="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>✅</span>
                    <span class="font-medium">Always visible, one click</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>⚠️</span>
                    <span>Manual process stop</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>⚠️</span>
                    <span>Destroy droplet</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>⚠️</span>
                    <span>docker stop command</span>
                  </div>
                </td>
              </tr>
              
              <!-- Row 4: Full environment wipe -->
              <tr>
                <td class="px-4 py-4 font-medium text-gray-700 bg-gray-50">Full environment wipe</td>
                <td class="px-4 py-4 bg-lobster-50/50 border-l border-lobster-100">
                  <div class="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>✅</span>
                    <span class="font-medium">One click + confirmation</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>⚠️</span>
                    <span>Delete ~/.openclaw/ manually</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>⚠️</span>
                    <span>Destroy and rebuild droplet</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>⚠️</span>
                    <span>Remove container + volumes</span>
                  </div>
                </td>
              </tr>
              
              <!-- Row 5: Safe Mode by default -->
              <tr>
                <td class="px-4 py-4 font-medium text-gray-700 bg-gray-50">Safe Mode by default</td>
                <td class="px-4 py-4 bg-lobster-50/50 border-l border-lobster-100">
                  <div class="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>✅</span>
                    <span class="font-medium">Yes — agent asks before acting</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>❌</span>
                    <span>Must configure manually</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>❌</span>
                    <span>Must configure manually</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>❌</span>
                    <span>Must configure manually</span>
                  </div>
                </td>
              </tr>
              
              <!-- Row 6: API cost controls -->
              <tr>
                <td class="px-4 py-4 font-medium text-gray-700 bg-gray-50">API cost controls</td>
                <td class="px-4 py-4 bg-lobster-50/50 border-l border-lobster-100">
                  <div class="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>🔜</span>
                    <span class="font-medium">Budget caps coming soon</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>❌</span>
                    <span>Not included</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>❌</span>
                    <span>Not included</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>❌</span>
                    <span>Not included</span>
                  </div>
                </td>
              </tr>
              
              <!-- Row 7: Time to first chat -->
              <tr>
                <td class="px-4 py-4 font-medium text-gray-700 bg-gray-50">Time to first chat</td>
                <td class="px-4 py-4 bg-lobster-50/50 border-l border-lobster-100">
                  <div class="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>✅</span>
                    <span class="font-medium">Under 5 minutes</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>❌</span>
                    <span>30-60 minutes</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>⚠️</span>
                    <span>15-20 minutes</span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg inline-flex">
                    <span>⚠️</span>
                    <span>20-30 minutes</span>
                  </div>
                </td>
              </tr>
              
              <!-- Row 8: Cost -->
              <tr>
                <td class="px-4 py-4 font-medium text-gray-700 bg-gray-50">Cost</td>
                <td class="px-4 py-4 bg-lobster-50/50 border-l border-lobster-100">
                  <div class="font-medium text-lobster-600">Free tier available</div>
                </td>
                <td class="px-4 py-4 text-gray-600">Free + API costs</td>
                <td class="px-4 py-4 text-gray-600">$24/mo + API costs</td>
                <td class="px-4 py-4 text-gray-600">Free + hosting + API costs</td>
              </tr>
              
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Positioning Statement -->
      <div class="card p-8 text-center mb-12">
        <h2 class="text-2xl font-display font-bold text-gray-800 mb-4">We're not replacing these tools — we're the on-ramp</h2>
        <p class="text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          LobsterSandbox doesn't host OpenClaw infrastructure. We guide you through safe setup and wrap it with safety controls. Once you're comfortable, you can graduate to a full production setup on your own hardware or any cloud provider. Think of us as the training wheels that make the scary part easy.
        </p>
        <a href="/setup" class="inline-flex items-center justify-center px-8 py-4 lobster-gradient hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl text-lg">
          🚀 Start Your Safe Setup
        </a>
      </div>
      
      <!-- Back to home -->
      <div class="text-center">
        <a href="/" class="text-gray-500 hover:text-gray-700 text-sm">&larr; Back to homepage</a>
      </div>
      
    </div>
  `;
  
  return layout('Why LobsterSandbox', content, { loggedIn: false, ...options });
}
