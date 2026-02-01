# LobsterSandbox

## Overview
LobsterSandbox is a safe sandbox launcher for OpenClaw. It provides a web-based setup wizard and management interface for running OpenClaw in a secure, isolated environment within Replit.

## Project Structure

```
├── server.js           # Express server with all routes and reverse proxy
├── lib/
│   ├── openclaw.js     # OpenClaw CLI helpers and gateway management
│   └── assistant.js    # Larry the Lobster AI assistant (Anthropic)
├── views/
│   ├── layout.js       # Base HTML layout template with top bar navigation and chat assistant
│   ├── landing.js      # Landing page view
│   ├── setup.js        # Setup wizard views (login + wizard)
│   ├── status.js       # Status page view with channel indicators
│   ├── channels.js     # Channel setup (WhatsApp, Telegram, Discord, pairing)
│   └── tools.js        # Web tools setup (Brave Search, Perplexity)
├── public/
│   └── favicon.png     # Lobster favicon
├── data/
│   ├── home/           # OpenClaw configuration directory (OPENCLAW_HOME)
│   └── logs/           # OpenClaw log files
├── package.json        # Node.js dependencies
└── README.md           # User documentation
```

## Tech Stack
- **Runtime**: Node.js 22
- **Framework**: Express.js
- **Templating**: Server-rendered HTML with Tailwind CSS (CDN)
- **Fonts**: Nunito (all text)
- **Proxy**: http-proxy-middleware with WebSocket support
- **Rate Limiting**: express-rate-limit
- **AI Assistant**: Anthropic Claude Haiku via Replit AI Integrations
- **CLI**: OpenClaw npm package

## Key Features
1. Password-protected setup wizard with 3-step flow
2. Support for 9 AI providers: OpenAI, Anthropic, Google Gemini, OpenRouter, Moonshot AI, MiniMax, OpenCode Zen, Vercel AI, Synthetic
3. OpenClaw gateway management (start/stop/kill)
4. Reverse proxy to OpenClaw Control UI with WebSocket support
5. Secret masking in all logs and UI output
6. Security tools (audit, verify, fix)
7. Wipe and reset functionality
8. Larry the Lobster - AI-powered assistant with knowledge of all providers, channels (WhatsApp, Telegram, etc.), and setup

## Environment Variables
- `PORT` - Server port (default: 5000, provided by Replit)
- `SETUP_PASSWORD` - Required password for setup access
- `OPENCLAW_GATEWAY_TOKEN` - Required token for gateway authentication
- `OPENCLAW_PORT` - Gateway port (default: 18789)
- `OPENCLAW_BIND` - Gateway bind address (default: loopback)
- `OPENCLAW_HOME` - OpenClaw config directory (default: ./data/home)
- `OPENCLAW_LOG` - Log file path (default: ./data/logs/openclaw.log)

## Routes
- `GET /` - Landing page
- `GET /setup` - Setup wizard (password protected)
- `POST /setup/login` - Password login
- `POST /setup/run` - Run OpenClaw onboarding
- `GET /status` - System status and logs
- `GET /channels` - Channel setup (WhatsApp, Telegram, Discord, pairing)
- `GET /tools` - Web tools setup (Brave Search, Perplexity)
- `GET /openclaw/*` - Reverse proxy to OpenClaw Control UI
- `POST /api/gateway/start` - Start gateway
- `POST /api/gateway/stop` - Stop gateway
- `GET /api/health` - Get health status
- `GET /api/logs` - Get last 200 log lines
- `POST /api/verify` - Run quick verify
- `POST /api/security/audit` - Run security audit
- `POST /api/security/fix` - Run security fix
- `POST /api/wipe` - Wipe everything
- `POST /api/assistant/chat` - Chat with Larry the Lobster assistant
- `GET /api/channels/status` - Get channel connection status
- `POST /api/channels/whatsapp/login` - Start WhatsApp QR login
- `POST /api/channels/telegram/configure` - Configure Telegram bot
- `POST /api/channels/:channel/disconnect` - Disconnect a channel
- `POST /api/channels/discord/configure` - Configure Discord bot
- `GET /api/tools/status` - Get web tools status
- `POST /api/tools/web-search/configure` - Configure web search (Brave/Perplexity)
- `POST /api/tools/web-search/disable` - Disable web search
- `GET /api/pairing/list` - List pending pairing requests
- `POST /api/pairing/approve` - Approve a pairing request
- `POST /api/pairing/deny` - Deny a pairing request

## Security
- Gateway binds to loopback only
- Token authentication on gateway
- API keys masked in logs and UI
- Rate limiting on login and API endpoints
- Secure session cookies

## Recent Changes
- Phase 3: Added Web Tools page for Brave Search and Perplexity configuration; added Discord channel support with bot token input and DM policy; added web search enable/disable functionality (February 2026)
- Enhanced Larry's knowledge base with official OpenClaw documentation (docs.openclaw.ai), comprehensive channel guides, pairing system details. Optimized response format for chat bubbles with plain text, numbered steps, and emoji separators (February 2026)
- Phase 2: Added Channels page with WhatsApp QR login, Telegram bot token setup, and pairing approval interface (February 2026)
- Added lobster favicon, switched to Nunito font for friendlier UI (February 2026)
- Phase 1 improvements: Added 6 new AI providers (Gemini, Moonshot, MiniMax, OpenCode Zen, Vercel, Synthetic), updated model names to current versions, fixed config path detection (February 2026)
- Added Larry the Lobster AI assistant powered by Anthropic Claude Haiku (February 2026)
- Configured autoscale deployment (February 2026)
- Initial project setup (February 2026)

## OpenClaw Config Notes
- Config file path: `~/.openclaw/openclaw.json` (not config.json)
- Credentials: `~/.openclaw/credentials/`
- Workspace: `~/.openclaw/workspace/` (contains AGENTS.md, SOUL.md, USER.md, etc.)
- Channel pairing data: `~/.openclaw/credentials/<channel>-pairing.json`
