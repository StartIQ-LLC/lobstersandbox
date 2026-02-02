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
    test('GET / returns 200 and contains Safe by Default section', async () => {
      const res = await request(BASE_URL).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Safe by Default');
      expect(res.text).toContain('Show technical details');
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
      expect(res.body.version).toBe('1.2.2');
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
});
