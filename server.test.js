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
});
