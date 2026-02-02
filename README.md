# LobsterSandbox 🦞 v1.2.3

A safe sandbox launcher for [OpenClaw](https://openclaw.ai/) - try OpenClaw without touching your real accounts.

## What is LobsterSandbox?

LobsterSandbox is a simple web interface that lets non-technical users set up OpenClaw in minutes using a clean setup wizard. It runs the OpenClaw gateway inside a safe sandbox environment with:

- **Safe Mode by default** - Channels disabled until you're ready
- **Kill Switch** - Stop the gateway instantly from any page
- **Wipe & Reset** - Delete everything and start fresh anytime
- **Loopback binding** - Gateway only accessible locally
- **Token authentication** - Every request requires a token

## Safety Profiles

LobsterSandbox uses a two-tier safety system:

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

## Quick Start

### 1. Set Up Secrets

In your Replit project, add these secrets:

| Secret | Description |
|--------|-------------|
| `SETUP_PASSWORD` | Password to access the setup wizard |
| `SESSION_SECRET` | Secret for session encryption |
| `OPENCLAW_GATEWAY_TOKEN` | A long random token for gateway authentication |

### 2. Run the App

Click the **Run** button in Replit.

### 3. Configure OpenClaw

1. Open `/setup` in your browser
2. Enter the setup password
3. Review the Sandbox Identity Playbook (use separate accounts!)
4. Choose your AI provider (OpenAI, Anthropic, Google, etc.)
5. Paste your API key
6. Select a model
7. Click **Run Setup**
8. Choose your Safety Profile (Safe Mode recommended)
9. Click **Start Gateway**

### 4. Use the Control UI

Open `/openclaw` to access the OpenClaw Control UI through the secure reverse proxy.

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
| `/healthz` | Health check endpoint (returns 200 if server is up) |
| `/readyz` | Readiness check (200 if setup complete and gateway reachable) |

## What Safe Mode Blocks

When in Safe Mode, these routes and APIs return 403:
- `/channels` page
- `/tools` page
- `/api/channels/*` endpoints
- `/api/tools/*` endpoints

Switch to Power Mode from `/profile` to unlock channels and tools.

## Sandbox Identity Playbook

Before connecting any accounts, follow these guidelines:

- **Email**: Use a secondary inbox you control, not your main email
- **Phone**: Use a spare number via eSIM or second device
- **Billing**: Use a separate card with a low spending limit

Do NOT connect your main accounts on day 1.

## Security Features

- All routes except landing and health checks require authentication
- CSRF protection on all POST routes (returns friendly error page on failure)
- Origin/Referer validation on POST requests
- Gateway binds to loopback only (127.0.0.1)
- Token authentication required for gateway access
- API keys are never logged or displayed (masked to last 8 chars)
- Rate limiting on sensitive endpoints (10 per 15 min)
- Secure session handling with idle timeout (30 min) and max lifetime (12 hours)
- WebSocket upgrade authentication at HTTP server level

## Health Endpoints

For uptime monitoring and load balancers:

- `GET /healthz` - Returns 200 with `{ ok: true, version, uptimeSeconds }` if server is running
- `GET /readyz` - Returns 200 if setup is complete AND gateway is reachable, otherwise 503

Example:
```bash
curl https://your-app.replit.app/healthz
# {"ok":true,"version":"1.2.2","uptimeSeconds":3600}

curl https://your-app.replit.app/readyz
# {"ready":true} or {"ready":false,"reason":"Gateway not reachable"}
```

## Accessibility

- All form inputs have proper `<label>` elements
- Icon-only buttons have `aria-label` attributes for screen readers
- Keyboard navigation supported throughout the app

## Deployment

**Important**: This app must be deployed as a VM, not autoscale.

The app is stateful - it stores profile, logs, and configuration in `./data`. Autoscale would break persistence.

## Troubleshooting

### Gateway won't start
- Check that setup completed successfully
- View logs at `/status` for error details
- Try running "Quick Verify" from the status page

### Can't access /openclaw
- Make sure the gateway is running (check status page)
- Try stopping and restarting the gateway

### Channels blocked
- You're in Safe Mode. Go to `/profile` and switch to Power Mode.
- Type "POWER" to confirm.

### API key errors
- Verify your API key is valid and has the correct permissions
- Make sure you selected the right provider

### Need to start fresh
- Use "Wipe" button in the top bar
- Type "WIPE" and enter your password to confirm
- This removes all configuration and logs

## Testing

Run the security test suite:

```bash
npm test
```

Tests cover:
- Auth redirect for protected routes
- CSRF 403 for POST without token
- Power Mode gating for channel/tool APIs
- Health endpoints (/healthz, /readyz)
- Secret masking in HTML output
- Accessibility (aria-labels, labeled inputs)

**Manual WebSocket test**: Open an incognito window and try to connect to `/openclaw`. You should NOT receive `101 Switching Protocols` without a valid session.

## Documentation

- [OpenClaw Getting Started](https://docs.openclaw.ai/start/getting-started)
- [OpenClaw Setup Wizard](https://docs.openclaw.ai/start/wizard)
- [OpenAI Provider](https://docs.openclaw.ai/providers/openai)
- [OpenRouter Provider](https://docs.openclaw.ai/providers/openrouter)
- [CLI Reference](https://docs.openclaw.ai/cli)
- [Gateway CLI](https://docs.openclaw.ai/cli/gateway)
- [Security](https://docs.openclaw.ai/cli/security)
- [FAQ](https://docs.openclaw.ai/help/faq)

## License

MIT
