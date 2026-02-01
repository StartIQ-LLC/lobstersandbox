# LobsterSandbox

## Overview
LobsterSandbox is a safe sandbox launcher for OpenClaw. It provides a web-based setup wizard and management interface for running OpenClaw in a secure, isolated environment within Replit.

**Core Promise:** "Try OpenClaw safely without getting wrecked."

## Who It's For
- Non-technical users who want to try AI agents without risking their accounts
- Developers testing OpenClaw integrations in an isolated environment
- Anyone who wants a safety-first on-ramp to AI agent technology

## What We Do NOT Do
- We do not create email accounts for you
- We do not create phone numbers for you
- We do not ask for your main accounts on day 1
- We do not auto-connect to your real WhatsApp or Telegram
- We do not store your API keys outside your sandbox

## Project Structure

```
├── server.js           # Express server with all routes and reverse proxy
├── lib/
│   ├── openclaw.js     # OpenClaw CLI helpers and gateway management
│   └── assistant.js    # Larry the Lobster AI assistant (Anthropic)
├── views/
│   ├── layout.js       # Base HTML layout template with top bar navigation and chat assistant
│   ├── landing.js      # Landing page view with Safety Checklist
│   ├── setup.js        # Setup wizard views (login + wizard) with Sandbox Identity Playbook
│   ├── status.js       # Status page view with Safe Mode/Power Mode awareness
│   ├── profile.js      # Safety Profile selector (Safe Mode vs Power Mode)
│   ├── channels.js     # Channel setup (WhatsApp, Telegram, Discord, pairing) - Power Mode only
│   └── tools.js        # Web tools setup (Brave Search, Perplexity) - Power Mode only
├── public/
│   └── favicon.png     # Lobster favicon
├── data/
│   ├── home/           # OpenClaw configuration directory (OPENCLAW_HOME)
│   ├── logs/           # OpenClaw log files
│   └── profile.json    # Safety profile storage
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
7. Wipe and reset functionality (requires password confirmation)
8. Larry the Lobster - AI-powered assistant with knowledge of all providers, channels, and setup

## Environment Variables
- `PORT` - Server port (default: 5000, provided by Replit)
- `SETUP_PASSWORD` - Required password for setup access
- `SESSION_SECRET` - Required for session management
- `OPENCLAW_GATEWAY_TOKEN` - Required token for gateway authentication
- `OPENCLAW_PORT` - Gateway port (default: 18789)
- `OPENCLAW_BIND` - Gateway bind address (default: loopback)
- `OPENCLAW_HOME` - OpenClaw config directory (default: ./data/home)
- `OPENCLAW_LOG` - Log file path (default: ./data/logs/openclaw.log)

## Routes

### Public Routes
- `GET /` - Landing page (no auth required)

### Protected Routes (require login)
- `GET /setup` - Setup wizard
- `POST /setup/login` - Password login
- `POST /setup/run` - Run OpenClaw onboarding
- `GET /status` - System status and logs
- `GET /profile` - Safety Profile selector (Safe Mode vs Power Mode)
- `POST /api/profile` - Set safety profile
- `GET /channels` - Channel setup - **blocked in Safe Mode**
- `GET /tools` - Web tools setup - **blocked in Safe Mode**
- `GET /openclaw/*` - Reverse proxy to OpenClaw Control UI
- `POST /api/gateway/start` - Start gateway
- `POST /api/gateway/stop` - Stop gateway (CSRF protected)
- `GET /api/health` - Get health status
- `GET /api/logs` - Get last 200 log lines
- `GET /api/csrf-token` - Get CSRF token for destructive actions
- `POST /api/verify` - Run quick verify
- `POST /api/security/audit` - Run security audit
- `POST /api/security/fix` - Run security fix
- `POST /api/wipe-all` - Wipe everything (CSRF + password confirmation required)
- `POST /api/assistant/chat` - Chat with Larry the Lobster assistant

### Channel APIs (Power Mode only)
- `GET /api/channels/status` - Get channel connection status
- `POST /api/channels/whatsapp/login` - Start WhatsApp QR login
- `POST /api/channels/telegram/configure` - Configure Telegram bot
- `POST /api/channels/discord/configure` - Configure Discord bot
- `POST /api/channels/:channel/disconnect` - Disconnect a channel
- `GET /api/pairing/list` - List pending pairing requests
- `POST /api/pairing/approve` - Approve a pairing request
- `POST /api/pairing/deny` - Deny a pairing request

### Tools APIs (Power Mode only)
- `GET /api/tools/status` - Get web tools status
- `POST /api/tools/web-search/configure` - Configure web search (Brave/Perplexity)
- `POST /api/tools/web-search/disable` - Disable web search

## Security

### Authentication & Authorization
- All routes except landing page require login
- Session-based authentication with secure cookies
- Rate limiting on login and API endpoints

### CSRF Protection
- CSRF tokens required for ALL POST routes (not just destructive actions)
- Tokens generated per session, validated server-side via X-CSRF-Token header
- Origin/Referer validation as additional defense layer

### Wipe Protection
- Password re-confirmation required to wipe
- Double-layer protection against accidental data loss

### Gateway Security
- Gateway binds to loopback only (127.0.0.1)
- Token authentication on all gateway requests
- Token injected server-side, never exposed to client

### Secret Safety
- API keys masked in logs and UI (shows last 8 chars only)
- Larry assistant never receives raw env vars or unmasked logs
- No secrets stored outside the sandbox

## Deployment
- **Type**: VM (persistent instance)
- **Reason**: App stores state in ./data (profile, logs, config)
- **Command**: `node server.js`
- **Port**: 5000

## OpenClaw Config Paths
**In this Replit environment:**
- Config directory: `./data/home/` (set via OPENCLAW_HOME)
- Config file: `./data/home/openclaw.json`
- Credentials: `./data/home/credentials/`
- Workspace: `./data/home/workspace/`
- Logs: `./data/logs/openclaw.log`

**Default OpenClaw paths (outside Replit):**
- Config: `~/.openclaw/openclaw.json`
- Credentials: `~/.openclaw/credentials/`
- Workspace: `~/.openclaw/workspace/`

## Recent Changes

### v1.2 Security Hardening (February 2026)
- All routes except landing now require authentication
- CSRF protection added to ALL POST routes (not just Kill Switch/Wipe)
- Password re-confirmation required for Wipe Everything
- /tools blocked in Safe Mode (like /channels)
- Deployment changed from autoscale to VM for stateful persistence
- Added /api/csrf-token endpoint for client-side CSRF handling
- Added Origin/Referer validation middleware for POST requests
- Security headers: X-Frame-Options: DENY, CSP frame-ancestors: 'none'
- Session cookies: httpOnly, sameSite: lax, secure in production
- Secret masking covers all command strings, stdout/stderr, and logs

### v1.1 Strategic Pivot - Safety Sandbox Playbook (February 2026)
- Epic A: Safety Profile Selector with Safe Mode (default) vs Power Mode
- Epic B: Sandbox Identity Playbook cards (Email, Phone, Billing separation)
- Epic C: Redesigned landing page with Safety Checklist
- Epic D: Persistent top bar with Kill Switch and Wipe buttons
- Epic E: Remote Access Hardening section (Tailscale, Cloudflare Tunnel)
- Epic F: Safe Mode enforcement - channels hidden until Power Mode
- Profile stored in profile.json, wipe resets profile

### v1.0 Initial Features (February 2026)
- 9 AI provider support
- Larry the Lobster AI assistant
- WhatsApp, Telegram, Discord channel setup
- Brave Search and Perplexity web tools
- Gateway management with reverse proxy
