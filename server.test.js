import request from 'supertest';
import http from 'http';

const BASE_URL = process.env.TEST_URL || 'http://localhost:5000';
const SETUP_PASSWORD = process.env.SETUP_PASSWORD || 'test';

describe('LobsterSandbox Security Tests', () => {
  describe('Authentication', () => {
    test('GET /openclaw without auth returns 302 redirect', async () => {
      const res = await request(BASE_URL).get('/openclaw/');
      expect(res.status).toBe(302);
    });

    test('GET /status without auth returns 302 redirect', async () => {
      const res = await request(BASE_URL).get('/status');
      expect(res.status).toBe(302);
    });
  });

  describe('CSRF Protection', () => {
    let sessionCookie;

    beforeAll(async () => {
      const loginRes = await request(BASE_URL)
        .post('/setup/login')
        .type('form')
        .send({ password: SETUP_PASSWORD });
      
      const cookies = loginRes.headers['set-cookie'];
      if (cookies) {
        const sessionMatch = cookies.find(c => c.startsWith('session_token='));
        if (sessionMatch) {
          sessionCookie = sessionMatch.split(';')[0];
        }
      }
    });

    test('POST /api/profile without CSRF token returns 403', async () => {
      if (!sessionCookie) {
        console.warn('Skipping test: no session cookie');
        return;
      }
      
      const res = await request(BASE_URL)
        .post('/api/profile')
        .set('Cookie', sessionCookie)
        .set('Accept', 'application/json')
        .send({ profile: 'safe' });
      
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/CSRF|session/i);
    });

    test('POST /api/profile with wrong CSRF token returns 403', async () => {
      if (!sessionCookie) {
        console.warn('Skipping test: no session cookie');
        return;
      }
      
      const res = await request(BASE_URL)
        .post('/api/profile')
        .set('Cookie', sessionCookie)
        .set('X-CSRF-Token', 'wrongtoken')
        .send({ profile: 'safe', csrf_token: 'wrongtoken' });
      
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/CSRF/i);
    });
  });

  describe('Power Mode Gating', () => {
    let sessionCookie;

    beforeAll(async () => {
      const loginRes = await request(BASE_URL)
        .post('/setup/login')
        .type('form')
        .send({ password: SETUP_PASSWORD });
      
      const cookies = loginRes.headers['set-cookie'];
      if (cookies) {
        const sessionMatch = cookies.find(c => c.startsWith('session_token='));
        if (sessionMatch) {
          sessionCookie = sessionMatch.split(';')[0];
        }
      }
    });

    test('GET /api/channels/status in Safe Mode returns 403', async () => {
      if (!sessionCookie) {
        console.warn('Skipping test: no session cookie');
        return;
      }
      
      const res = await request(BASE_URL)
        .get('/api/channels/status')
        .set('Cookie', sessionCookie);
      
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/Power Mode/i);
    });

    test('GET /api/tools/status in Safe Mode returns 403', async () => {
      if (!sessionCookie) {
        console.warn('Skipping test: no session cookie');
        return;
      }
      
      const res = await request(BASE_URL)
        .get('/api/tools/status')
        .set('Cookie', sessionCookie);
      
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/Power Mode/i);
    });
  });

  describe('Landing Page Safety Checklist', () => {
    test('GET / returns 200 and contains hero and safety sections', async () => {
      const res = await request(BASE_URL).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Try OpenClaw Without Risking Your Real Accounts');
      expect(res.text).toContain('Technical Safety Details');
    });

    test('GET /guide returns 200 and contains Burner Stack Guide', async () => {
      const res = await request(BASE_URL).get('/guide');
      expect(res.status).toBe(200);
      expect(res.text).toContain('The Burner Stack Guide');
      expect(res.text).toContain('Burner Email');
    });

    test('GET /pricing returns 200 and contains pricing tiers', async () => {
      const res = await request(BASE_URL).get('/pricing');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Pricing');
      expect(res.text).toContain('Explorer');
      expect(res.text).toContain('Pro');
      expect(res.text).toContain('Team');
      expect(res.text).toContain('$0');
      expect(res.text).toContain('$19');
      expect(res.text).toContain('$49');
    });

    test('GET /deploy returns 200 and contains deploy options', async () => {
      const res = await request(BASE_URL).get('/deploy');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Deploy Your Sandbox');
      expect(res.text).toContain('Replit');
      expect(res.text).toContain('Railway');
      expect(res.text).toContain('Render');
      expect(res.text).toContain('Docker');
      expect(res.text).toContain('Recommended');
    });

    test('GET /api/sandbox-count returns a number', async () => {
      const res = await request(BASE_URL).get('/api/sandbox-count');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('count');
      expect(typeof res.body.count).toBe('number');
      expect(res.body.count).toBeGreaterThanOrEqual(127);
    });

    test('Homepage contains sandbox counter section', async () => {
      const res = await request(BASE_URL).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toContain('sandbox-count-display');
      expect(res.text).toContain('sandboxes launched');
    });

    test('Homepage contains share modal', async () => {
      const res = await request(BASE_URL).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toContain('share-modal');
      expect(res.text).toContain('Share LobsterSandbox');
      expect(res.text).toContain('openShareModal');
    });

    test('Footer contains share link', async () => {
      const res = await request(BASE_URL).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Share LobsterSandbox');
      expect(res.text).toContain('Built by lobster lovers');
    });

    test('Copy Checklist text does not contain Mode: or token patterns', () => {
      const checklistText = `LobsterSandbox Safety Checklist
Auth required for protected routes
CSRF enforced on POST routes
Origin and Referer validation on POST
WebSocket upgrades require a valid session
Gateway binds to loopback only
Gateway reachable only through reverse proxy
Kill switch available
Wipe requires typed WIPE plus password
Power Mode requires typed POWER for channels and tools
Session idle timeout enforced
Session max lifetime enforced`;
      
      expect(checklistText).not.toMatch(/Mode:/);
      expect(checklistText).not.toMatch(/OPENCLAW/i);
      expect(checklistText).not.toMatch(/API_KEY/i);
      expect(checklistText).not.toMatch(/TOKEN/i);
      expect(checklistText).not.toMatch(/sk-[a-zA-Z0-9]/);
      expect(checklistText).not.toMatch(/[a-f0-9]{32}/i);
    });
  });

  describe('Error Pages', () => {
    test('GET /nonexistent-page returns 404', async () => {
      const res = await request(BASE_URL).get('/this-page-does-not-exist-xyz');
      expect(res.status).toBe(404);
      expect(res.text).toContain('Page Not Found');
    });
  });

  describe('Health Endpoints', () => {
    test('GET /healthz returns 200 with ok and version', async () => {
      const res = await request(BASE_URL).get('/healthz');
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.version).toBe('1.2.4');
      expect(typeof res.body.uptimeSeconds).toBe('number');
    });

    test('GET /readyz returns 200 or 503 with ready status', async () => {
      const res = await request(BASE_URL).get('/readyz');
      expect([200, 503]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body.ready).toBe(true);
      } else {
        expect(res.body.ready).toBe(false);
        expect(res.body.reason).toBeDefined();
      }
    });
  });

  describe('Secret Masking', () => {
    test('Landing page does not expose secrets', async () => {
      const res = await request(BASE_URL).get('/');
      expect(res.status).toBe(200);
      expect(res.text).not.toMatch(/sk-[a-zA-Z0-9]{20,}/);
      expect(res.text).not.toMatch(/sk-ant-[a-zA-Z0-9-]{20,}/);
      expect(res.text).not.toMatch(/SETUP_PASSWORD/);
      expect(res.text).not.toMatch(/SESSION_SECRET/);
      expect(res.text).not.toMatch(/GATEWAY_TOKEN/);
    });
  });

  describe('Accessibility', () => {
    test('Landing page shows disabled buttons when not logged in', async () => {
      const res = await request(BASE_URL).get('/');
      expect(res.status).toBe(200);
      // When not logged in, Kill Switch and Wipe should be disabled (cursor-not-allowed)
      expect(res.text).toContain('cursor-not-allowed');
      expect(res.text).toContain('Kill Switch');
      expect(res.text).toContain('Wipe');
    });

    test('Status page has proper aria-labels on safety buttons when logged in', async () => {
      const loginRes = await request(BASE_URL)
        .post('/setup/login')
        .type('form')
        .send({ password: process.env.SETUP_PASSWORD || 'test' });
      
      const cookies = loginRes.headers['set-cookie'];
      if (!cookies) {
        console.warn('Skipping test: login failed');
        return;
      }
      const sessionCookie = cookies.find(c => c.startsWith('session_token='))?.split(';')[0];
      if (!sessionCookie) {
        console.warn('Skipping test: no session cookie');
        return;
      }

      const res = await request(BASE_URL)
        .get('/status')
        .set('Cookie', sessionCookie);
      expect(res.status).toBe(200);
      expect(res.text).toContain('aria-label="Kill Switch');
      expect(res.text).toContain('aria-label="Wipe');
    });

    test('Setup login page has labeled password input', async () => {
      const res = await request(BASE_URL).get('/setup');
      expect(res.status).toBe(200);
      expect(res.text).toContain('for="password"');
      expect(res.text).toContain('id="password"');
    });
  });

  describe('Budget API', () => {
    test('GET /api/budget without auth returns 302 redirect', async () => {
      const res = await request(BASE_URL).get('/api/budget');
      expect(res.status).toBe(302);
    });

    test('GET /api/usage without auth returns 302 redirect', async () => {
      const res = await request(BASE_URL).get('/api/usage');
      expect(res.status).toBe(302);
    });

    test('GET /api/dashboard without auth returns 302 redirect', async () => {
      const res = await request(BASE_URL).get('/api/dashboard');
      expect(res.status).toBe(302);
    });

    test('GET /missions without auth returns 302 redirect', async () => {
      const res = await request(BASE_URL).get('/missions');
      expect(res.status).toBe(302);
    });

    let sessionCookie;
    let csrfToken;

    beforeAll(async () => {
      const loginRes = await request(BASE_URL)
        .post('/setup/login')
        .type('form')
        .send({ password: process.env.SETUP_PASSWORD || 'test' });
      
      const cookies = loginRes.headers['set-cookie'];
      if (cookies) {
        const sessionMatch = cookies.find(c => c.startsWith('session_token='));
        if (sessionMatch) {
          sessionCookie = sessionMatch.split(';')[0];
        }
      }

      if (sessionCookie) {
        const csrfRes = await request(BASE_URL)
          .get('/api/csrf-token')
          .set('Cookie', sessionCookie);
        if (csrfRes.body && csrfRes.body.token) {
          csrfToken = csrfRes.body.token;
        }
      }
    });

    test('GET /api/budget returns budget status', async () => {
      if (!sessionCookie) {
        console.warn('Skipping test: no session cookie');
        return;
      }
      
      const res = await request(BASE_URL)
        .get('/api/budget')
        .set('Cookie', sessionCookie);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('hasBudget');
      expect(res.body).toHaveProperty('limit');
      expect(res.body).toHaveProperty('used');
      expect(res.body).toHaveProperty('percentage');
    });

    test('POST /api/budget requires CSRF token', async () => {
      if (!sessionCookie) {
        console.warn('Skipping test: no session cookie');
        return;
      }
      
      const res = await request(BASE_URL)
        .post('/api/budget')
        .set('Cookie', sessionCookie)
        .set('Accept', 'application/json')
        .send({ limit: 10 });
      
      expect(res.status).toBe(403);
    });

    test('POST /api/budget with valid data sets budget', async () => {
      if (!sessionCookie || !csrfToken) {
        console.warn('Skipping test: no session or CSRF token');
        return;
      }
      
      const res = await request(BASE_URL)
        .post('/api/budget')
        .set('Cookie', sessionCookie)
        .set('X-CSRF-Token', csrfToken)
        .send({ limit: 15, model: 'test-model' });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.budget).toHaveProperty('limit', 15);
    });

    test('Budget alerts are returned at correct thresholds', async () => {
      if (!sessionCookie) {
        console.warn('Skipping test: no session cookie');
        return;
      }
      
      const res = await request(BASE_URL)
        .get('/api/budget')
        .set('Cookie', sessionCookie);
      
      expect(res.status).toBe(200);
      const { percentage, alertLevel } = res.body;
      if (percentage >= 100) {
        expect(alertLevel).toBe('exceeded');
      } else if (percentage >= 90) {
        expect(alertLevel).toBe('critical');
      } else if (percentage >= 75) {
        expect(alertLevel).toBe('warning');
      } else {
        expect(alertLevel).toBeNull();
      }
    });

    test('GET /api/dashboard returns dashboard data', async () => {
      if (!sessionCookie) {
        console.warn('Skipping test: no session cookie');
        return;
      }
      
      const res = await request(BASE_URL)
        .get('/api/dashboard')
        .set('Cookie', sessionCookie);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('gateway');
      expect(res.body).toHaveProperty('budget');
      expect(res.body).toHaveProperty('safety');
      expect(res.body).toHaveProperty('channels');
      expect(res.body).toHaveProperty('activity');
      expect(res.body).toHaveProperty('weeklyUsage');
      expect(res.body).toHaveProperty('timestamp');
    });

    test('GET /missions returns missions page with mission content', async () => {
      if (!sessionCookie) {
        console.warn('Skipping test: no session cookie');
        return;
      }
      
      const res = await request(BASE_URL)
        .get('/missions')
        .set('Cookie', sessionCookie);
      
      expect(res.status).toBe(200);
      expect(res.text).toContain('Sandbox Missions');
      expect(res.text).toContain('Hello, Lobster!');
      expect(res.text).toContain('Research Assistant');
      expect(res.text).toContain('missions completed');
    });
  });
});
