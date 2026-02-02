# 🦞 LobsterSandbox

**Try OpenClaw without risking your real accounts.**

LobsterSandbox is a safety wrapper for [OpenClaw](https://www.openclaw.com) that lets you experiment with AI agents in a secure, isolated environment. Use throwaway accounts, set spending limits, and wipe everything with one click if anything feels off.

[![Deploy on Replit](https://replit.com/badge/github/lobstersandbox/lobstersandbox)](https://replit.com/new/github/lobstersandbox/lobstersandbox)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/lobstersandbox)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/lobstersandbox/lobstersandbox)

## Features

- **Burner Stack Guide** - Step-by-step instructions for setting up throwaway accounts
- **API Cost Tracking** - Real-time monitoring of AI model costs across 9 providers
- **Budget Alerts** - Get warned before you overspend, with optional auto-pause
- **Kill Switch** - Instantly stop the gateway with one click
- **Wipe Everything** - Nuclear option to delete all data and start fresh
- **Guided Missions** - 6 interactive tutorials to learn OpenClaw safely
- **Safe Mode / Power Mode** - Choose your comfort level

## Requirements

- Node.js 22+
- OpenClaw CLI (`npm install -g openclaw`)
- API key from your preferred AI provider (Anthropic, OpenAI, Google, etc.)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SETUP_PASSWORD` | Yes | Password to access the sandbox |
| `OPENCLAW_GATEWAY_TOKEN` | Yes | Auth token for the gateway (generate a random string) |
| `SESSION_SECRET` | Yes | Secret for session signing (generate a random 32+ char string) |
| `PORT` | No | Server port (default: 5000) |
| `LOG_LEVEL` | No | Logging level (default: info) |

## Quick Start

### Option 1: Deploy to Cloud (Recommended)

Click one of the deploy buttons above to launch on Replit, Railway, or Render.

### Option 2: Run Locally

```bash
git clone https://github.com/lobstersandbox/lobstersandbox.git
cd lobstersandbox

npm install

cp .env.example .env

npm run dev
```

### Option 3: Docker

```bash
git clone https://github.com/lobstersandbox/lobstersandbox.git
cd lobstersandbox

cp .env.example .env

docker-compose up -d
```

Visit `http://localhost:5000` and enter your setup password.

## Safety Profiles

### Safe Mode (Default)
- Control UI only - no channels connected
- Allowlist enabled by default
- Approval required for actions
- Kill Switch visible on every page
- Best for first-time users

### Power Mode
- Channels enabled (WhatsApp, Telegram, Discord)
- Web tools enabled (Brave Search, Perplexity)
- Fewer confirmation prompts
- Still keeps loopback + token security
- Requires typing "POWER" to enable

## Project Structure

```
lobstersandbox/
├── server.js          # Express server and API routes
├── lib/
│   ├── openclaw.js    # OpenClaw CLI and gateway management
│   ├── budget.js      # API cost tracking and budget alerts
│   ├── assistant.js   # Larry the Lobster AI helper
│   └── logger.js      # Structured logging
├── views/             # Server-rendered HTML pages
├── data/              # Persistent storage (JSON files)
└── public/            # Static assets
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/setup` | Setup wizard (password protected) |
| `/status` | System status, health checks, and logs |
| `/profile` | Safety Profile selector |
| `/channels` | Channel setup (Power Mode only) |
| `/tools` | Web tools setup (Power Mode only) |
| `/openclaw` | OpenClaw Control UI (reverse proxied) |
| `/healthz` | Health check endpoint |
| `/readyz` | Readiness check |

## Security

- All API keys are stored locally and never transmitted
- Gateway binds to loopback only (127.0.0.1)
- Session-based auth with CSRF protection
- Secrets masked in logs and UI
- Password required for destructive operations
- Rate limiting on sensitive endpoints
- WebSocket upgrade authentication

## Deployment

**Important**: This app must be deployed as a VM, not autoscale.

The app is stateful - it stores profile, logs, and configuration in `./data`. Autoscale would break persistence.

## Testing

```bash
npm test
```

## License

MIT License - See [LICENSE](LICENSE) for details.

## Disclaimer

LobsterSandbox is an unofficial community tool. It is not affiliated with, endorsed by, or connected to OpenClaw or its creators. Use at your own risk. Always review the Burner Stack Guide before connecting any accounts.

---

Made with 🦞 by the community
