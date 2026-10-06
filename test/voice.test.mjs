import assert from 'node:assert';
import { test } from 'node:test';

test('voiceSessions.create posts to /v1/voice/sessions', async () => {
  const { Call2Me } = await import('../src/index.js');
  let seen;
  global.fetch = async (url, opts) => {
    seen = { url: url.toString(), method: opts.method, body: opts.body };
    return { ok: true, status: 200, json: async () => ({ token: 't', url: 'wss://x', room_name: 'agent_a_1', session_limit_sec: 3600 }) };
  };
  const c = new Call2Me('sk_test');
  const out = await c.voiceSessions.create('agent_abc', { name: 'Ada' });
  assert.equal(seen.method, 'POST');
  assert.ok(seen.url.endsWith('/v1/voice/sessions'));
  assert.ok(seen.body.includes('agent_abc'));
  assert.equal(out.room_name, 'agent_a_1');
});

test('startVoiceSession connects room and enables mic', async () => {
  const { startVoiceSession } = await import('../src/voice.js');
  const calls = [];
  class FakeRoom {
    on() { return this; }
    async connect(url, token) { calls.push(['connect', url, token]); }
    get localParticipant() { return { setMicrophoneEnabled: async (v) => calls.push(['mic', v]) }; }
    disconnect() { calls.push(['disconnect']); }
  }
  const s = await startVoiceSession({ url: 'wss://x', token: 't', Room: FakeRoom });
  assert.deepEqual(calls[0], ['connect', 'wss://x', 't']);
  assert.deepEqual(calls.find((c) => c[0] === 'mic'), ['mic', true]);
  s.stop();
  assert.ok(calls.some((c) => c[0] === 'disconnect'));
});
