/**
 * Call2Me Node.js SDK — Full API coverage
 *
 * @example
 * const { Call2Me } = require('call2me-sdk');
 * const client = new Call2Me('sk_call2me_...');
 * const agents = await client.agents.list();
 */

class Call2Me {
  constructor(apiKey, baseUrl = 'https://api.call2me.app') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.agents = new AgentsResource(this);
    this.calls = new CallsResource(this);
    this.knowledgeBases = new KnowledgeBaseResource(this);
    this.wallet = new WalletResource(this);
    this.campaigns = new CampaignsResource(this);
    this.schedules = new SchedulesResource(this);
    this.phoneNumbers = new PhoneNumbersResource(this);
    this.sipTrunks = new SipTrunksResource(this);
    this.apiKeys = new ApiKeysResource(this);
    this.users = new UsersResource(this);
    this.widgets = new WidgetsResource(this);
    this.voices = new VoicesResource(this);
    this.chats = new ChatsResource(this);
    this.payments = new PaymentsResource(this);
    // 5 Eki 2026'da eklendi: 278 uçtan yalnız 83'ü kapsanıyordu ve
    // tercümanın 11 ucunun HİÇBİRİ yoktu.
    this.interpreters = new InterpretersResource(this);
    this.numbers = new NumbersResource(this);
    this.sms = new SmsResource(this);
    this.extension = new ExtensionResource(this);
    this.events = new EventsResource(this);
    this.voiceSessions = new VoiceSessionsResource(this);
    this.endUsers = new EndUsersResource(this);
    this.webhooks = new WebhooksResource(this);
  }

  async _request(method, path, body = null, params = null) {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) Object.entries(params).forEach(([k, v]) => { if (v != null) url.searchParams.set(k, v); });
    const opts = { method, headers: { 'Authorization': `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(`Call2Me API Error ${res.status}: ${err.detail || JSON.stringify(err)}`);
    }
    if (res.status === 204) return true;
    return res.json();
  }
}

// ── Agents ──
class AgentsResource {
  constructor(c) { this.c = c; }
  list(limit = 100, offset = 0) { return this.c._request('GET', '/v1/agents', null, { limit, offset }); }
  get(id) { return this.c._request('GET', `/v1/agents/${id}`); }
  create(data) { return this.c._request('POST', '/v1/agents', data); }
  update(id, data) { return this.c._request('PATCH', `/v1/agents/${id}`, data); }
  delete(id) { return this.c._request('DELETE', `/v1/agents/${id}`); }
  duplicate(id) { return this.c._request('POST', `/v1/agents/${id}/duplicate`); }
  stats(id, days = 30) { return this.c._request('GET', `/v1/agents/${id}/stats`, null, { days }); }
  globalStats() { return this.c._request('GET', '/v1/agents/stats/global'); }
}

// ── Calls ──
class CallsResource {
  constructor(c) { this.c = c; }
  list(limit = 50, offset = 0, agentId = null) { return this.c._request('GET', '/v1/calls', null, { limit, offset, agent_id: agentId }); }
  /**
   * Place a REAL outbound call — `to_number` is dialled and charged.
   *
   * `topic` is why the call is being placed; it reaches the agent as
   * `call_purpose` and is woven into both the opening line and the system
   * prompt, so the agent states its reason instead of a generic greeting.
   *
   * Missing from this SDK until 5 Oct 2026 despite the README advertising
   * outbound calling.
   */
  create(data) { return this.c._request('POST', '/v1/calls', temizle(data)); }
  get(id) { return this.c._request('GET', `/v1/calls/${id}`); }
  end(id) { return this.c._request('POST', `/v1/calls/${id}/end`); }
  recording(id) { return this.c._request('GET', `/v1/calls/${id}/recording`); }
}

// ── Knowledge Base ──
class KnowledgeBaseResource {
  constructor(c) { this.c = c; }
  list() { return this.c._request('GET', '/v1/knowledge-base'); }
  get(id) { return this.c._request('GET', `/v1/knowledge-base/${id}`); }
  create(data) { return this.c._request('POST', '/v1/knowledge-base', data); }
  delete(id) { return this.c._request('DELETE', `/v1/knowledge-base/${id}`); }
  addSource(id, data) { return this.c._request('POST', `/v1/knowledge-base/${id}/add-sources`, data); }
  query(id, query, topK = 5) { return this.c._request('POST', `/v1/knowledge-base/${id}/query`, { query, top_k: topK }); }
}

// ── Wallet ──
class WalletResource {
  constructor(c) { this.c = c; }
  balance() { return this.c._request('GET', '/v1/wallet/balance'); }
  transactions(limit = 50, offset = 0) { return this.c._request('GET', '/v1/wallet/transactions', null, { limit, offset }); }
  analytics(days = 30) { return this.c._request('GET', '/v1/wallet/analytics', null, { days }); }
  pricing() { return this.c._request('GET', '/v1/wallet/pricing'); }
}

// ── Campaigns ──
class CampaignsResource {
  constructor(c) { this.c = c; }
  list() { return this.c._request('GET', '/v1/campaigns'); }
  get(id) { return this.c._request('GET', `/v1/campaigns/${id}`); }
  create(data) { return this.c._request('POST', '/v1/campaigns', data); }
  update(id, data) { return this.c._request('PATCH', `/v1/campaigns/${id}`, data); }
  delete(id) { return this.c._request('DELETE', `/v1/campaigns/${id}`); }
  action(id, action) { return this.c._request('POST', `/v1/campaigns/${id}/action`, { action }); }
  start(id) { return this.action(id, 'start'); }
  pause(id) { return this.action(id, 'pause'); }
  resume(id) { return this.action(id, 'resume'); }
  cancel(id) { return this.action(id, 'cancel'); }
  contacts(id) { return this.c._request('GET', `/v1/campaigns/${id}/contacts`); }
}

// ── Schedules ──
class SchedulesResource {
  constructor(c) { this.c = c; }
  list() { return this.c._request('GET', '/v1/schedules'); }
  get(id) { return this.c._request('GET', `/v1/schedules/${id}`); }
  create(data) { return this.c._request('POST', '/v1/schedules', data); }
  update(id, data) { return this.c._request('PATCH', `/v1/schedules/${id}`, data); }
  delete(id) { return this.c._request('DELETE', `/v1/schedules/${id}`); }
  cancel(id) { return this.c._request('POST', `/v1/schedules/${id}/cancel`); }
}

// ── Phone Numbers ──
class PhoneNumbersResource {
  constructor(c) { this.c = c; }
  list() { return this.c._request('GET', '/v1/phone-numbers'); }
  get(number) { return this.c._request('GET', `/v1/phone-numbers/${number}`); }
  create(data) { return this.c._request('POST', '/v1/phone-numbers', data); }
  update(number, data) { return this.c._request('PATCH', `/v1/phone-numbers/${number}`, data); }
  delete(number) { return this.c._request('DELETE', `/v1/phone-numbers/${number}`); }
  bindAgent(number, agentId) { return this.c._request('POST', `/v1/phone-numbers/${number}/bind`, { agent_id: agentId }); }
  unbindAgent(number) { return this.c._request('DELETE', `/v1/phone-numbers/${number}/unbind`); }
}

// ── SIP Trunks ──
class SipTrunksResource {
  constructor(c) { this.c = c; }
  list() { return this.c._request('GET', '/v1/sip-trunks'); }
  get(id) { return this.c._request('GET', `/v1/sip-trunks/${id}`); }
  create(data) { return this.c._request('POST', '/v1/sip-trunks', data); }
  update(id, data) { return this.c._request('PATCH', `/v1/sip-trunks/${id}`, data); }
  delete(id) { return this.c._request('DELETE', `/v1/sip-trunks/${id}`); }
  test(id) { return this.c._request('POST', `/v1/sip-trunks/${id}/test`); }
}

// ── API Keys ──
class ApiKeysResource {
  constructor(c) { this.c = c; }
  list() { return this.c._request('GET', '/v1/api-keys'); }
  create(data) { return this.c._request('POST', '/v1/api-keys', data); }
  revoke(id) { return this.c._request('DELETE', `/v1/api-keys/${id}`); }
  delete(id) { return this.c._request('DELETE', `/v1/api-keys/${id}`); }
  usage(id) { return this.c._request('GET', `/v1/api-keys/${id}/usage`); }
}

// ── Users ──
class UsersResource {
  constructor(c) { this.c = c; }
  me() { return this.c._request('GET', '/v1/users/me'); }
  update(data) { return this.c._request('PATCH', '/v1/users/me', data); }
  stats() { return this.c._request('GET', '/v1/users/me/stats'); }
  usage(days = 30) { return this.c._request('GET', '/v1/users/me/usage', null, { days }); }
  dailyUsage(days = 30) { return this.c._request('GET', '/v1/users/me/usage/daily', null, { days }); }
  branding() { return this.c._request('GET', '/v1/users/me/branding'); }
  updateBranding(data) { return this.c._request('PUT', '/v1/users/me/branding', data); }
  tenantMembers(page = 1, perPage = 20) { return this.c._request('GET', '/v1/users/me/tenant/members', null, { page, per_page: perPage }); }
}

// ── Widgets ──
class WidgetsResource {
  constructor(c) { this.c = c; }
  list() { return this.c._request('GET', '/v1/widgets'); }
  get(id) { return this.c._request('GET', `/v1/widgets/${id}`); }
  create(data) { return this.c._request('POST', '/v1/widgets', data); }
  update(id, data) { return this.c._request('PATCH', `/v1/widgets/${id}`, data); }
  delete(id) { return this.c._request('DELETE', `/v1/widgets/${id}`); }
  chat(id, message, visitorId = null) { return this.c._request('POST', `/v1/widgets/${id}/chat`, { message, visitor_id: visitorId }); }
}

// ── Voices ──
class VoicesResource {
  constructor(c) { this.c = c; }
  list() { return this.c._request('GET', '/v1/voices'); }
  /**
   * Distinct voice providers, derived from the voice list.
   *
   * There is no `/v1/voices/providers` endpoint — this method used to call
   * one and always returned 404 (measured against the live spec, 5 Oct
   * 2026). The provider is a field on each voice, so the list is derived
   * here instead of breaking callers by removing the method.
   *
   * Live values: `elevenlabs` (16 voices), `openai-realtime` (10).
   */
  async providers() {
    const ham = await this.list();
    const sesler = Array.isArray(ham) ? ham : (ham?.voices ?? []);
    return [...new Set(sesler.map((v) => v?.provider).filter(Boolean))].sort();
  }
}

// ── Chats ──
class ChatsResource {
  constructor(c) { this.c = c; }
  // With an eut_ token, external_user_id is taken from the token automatically.
  create(agentId, { title = null, external_user_id = null, metadata = null } = {}) {
    const body = { agent_id: agentId };
    if (title) body.title = title;
    if (external_user_id) body.external_user_id = external_user_id;
    if (metadata) body.metadata = metadata;
    return this.c._request('POST', '/v1/chats', body);
  }
  list(limit = 50, external_user_id = null) { return this.c._request('GET', '/v1/chats', null, { limit, external_user_id }); }
  get(sessionId) { return this.c._request('GET', `/v1/chats/${sessionId}`); }
  // stream=true → server returns text/event-stream (SSE); consume the response body line by line.
  sendMessage(sessionId, content, model = null, stream = false) {
    return this.c._request('POST', `/v1/chats/${sessionId}/messages`, { content, model, stream });
  }
}

// ── Payments ──
/**
 * Drop keys whose value is undefined/null.
 *
 * Optional fields default to undefined, but sending an explicit null is
 * not the same as omitting the field — some endpoints reject it with 422.
 */
function temizle(o) {
  return Object.fromEntries(
    Object.entries(o).filter(([, v]) => v !== undefined && v !== null)
  );
}

/**
 * Live interpreter — two people each speak their own language.
 *
 * Covers both delivery paths: a phone call that dials both sides, and a
 * browser session with a shareable link. None of this existed in the SDK
 * before 5 Oct 2026 even though the interpreter is a headline product.
 */
class InterpretersResource {
  constructor(c) { this.c = c; }
  list(limit = 20, offset = 0) { return this.c._request('GET', '/v1/interpreters', null, { limit, offset }); }
  get(id) { return this.c._request('GET', `/v1/interpreters/${id}`); }
  /** Name and both languages are required. Without `phone_number` only the browser path works. */
  create(data) { return this.c._request('POST', '/v1/interpreters', temizle(data)); }
  update(id, data) { return this.c._request('PATCH', `/v1/interpreters/${id}`, temizle(data)); }
  delete(id) { return this.c._request('DELETE', `/v1/interpreters/${id}`); }
  /** Sessions run through any interpreter on the account. */
  calls(limit = 20, offset = 0) { return this.c._request('GET', '/v1/interpreters/calls', null, { limit, offset }); }
  /** Places a REAL interpreted phone call — both sides dialled and charged. */
  call(id, targetNumber, initiatorNumber) {
    return this.c._request('POST', `/v1/interpreters/${id}/call`,
      temizle({ target_number: targetNumber, initiator_number: initiatorNumber }));
  }
  /** Open or close the browser session link. Places no phone call. */
  enableWeb(id, enabled = true, requiresPasscode) {
    return this.c._request('POST', `/v1/interpreters/${id}/web`,
      temizle({ enabled, requires_passcode: requiresPasscode }));
  }
  endWeb(id) { return this.c._request('POST', `/v1/interpreters/${id}/web/end`); }
  /** Who is connected to the browser session right now. */
  webStatus(id) { return this.c._request('GET', `/v1/interpreters/${id}/web/live`); }
  /** Single-use join passcode for the browser session. */
  createPasscode(id) { return this.c._request('POST', `/v1/interpreters/${id}/web/passcodes`); }
}

/** Searching and buying numbers (distinct from `phoneNumbers`, which manages owned ones). */
class NumbersResource {
  constructor(c) { this.c = c; }
  allowedCountries() { return this.c._request('GET', '/v1/numbers/allowed-countries'); }
  /** Lists purchasable numbers. Does NOT buy anything. */
  search(params) { return this.c._request('GET', '/v1/numbers/search', null, temizle(params)); }
  /** BUYS the number: balance is charged and monthly rent starts. */
  purchase(data) { return this.c._request('POST', '/v1/numbers/purchase', temizle(data)); }
  /** Checkout link — does not charge by itself. */
  checkout(data) { return this.c._request('POST', '/v1/numbers/checkout', temizle(data)); }
  /** PERMANENTLY releases the number; it leaves the account. */
  release(number) { return this.c._request('DELETE', `/v1/numbers/${number}`); }
}

class SmsResource {
  constructor(c) { this.c = c; }
  send(to, text, from) { return this.c._request('POST', '/v1/sms', temizle({ to, text, from })); }
  list(params = {}) { return this.c._request('GET', '/v1/sms', null, temizle(params)); }
}

/** Chrome extension — live translation of a browser tab. Device-scoped. */
class ExtensionResource {
  constructor(c) { this.c = c; }
  config(deviceId) { return this.c._request('GET', '/v1/ext/config', null, { device_id: deviceId }); }
  /** Minutes used and remaining for the account. */
  usage() { return this.c._request('GET', '/v1/ext/usage'); }
  linkRequest(deviceId, email) { return this.c._request('POST', '/v1/ext/link/request', { device_id: deviceId, email }); }
  linkConfirm(token) { return this.c._request('POST', '/v1/ext/link/confirm', { token }); }
  linkStatus(deviceId) { return this.c._request('POST', '/v1/ext/link/status', { device_id: deviceId }); }
  linkAttach(deviceId) { return this.c._request('POST', '/v1/ext/link/attach', { device_id: deviceId }); }
  linkDetach(deviceId) { return this.c._request('POST', '/v1/ext/link/detach', { device_id: deviceId }); }
  sessionStart(data) { return this.c._request('POST', '/v1/ext/session/start', temizle(data)); }
  sessionHeartbeat(deviceId, sessionId, elapsedSeconds) {
    return this.c._request('POST', '/v1/ext/session/heartbeat',
      { device_id: deviceId, session_id: sessionId, elapsed_seconds: elapsedSeconds });
  }
  sessionEnd(deviceId, sessionId, reason) {
    return this.c._request('POST', '/v1/ext/session/end',
      temizle({ device_id: deviceId, session_id: sessionId, reason }));
  }
}

class PaymentsResource {
  constructor(c) { this.c = c; }
  checkout(amount, currency = 'USD') { return this.c._request('POST', '/v1/payments/checkout', { amount, currency }); }
  history(limit = 50) { return this.c._request('GET', '/v1/payments/history', null, { limit }); }
  savedCards() { return this.c._request('GET', '/v1/payments/methods'); }
  autoCharge() { return this.c._request('GET', '/v1/payments/auto-charge'); }
  updateAutoCharge(data) { return this.c._request('PUT', '/v1/payments/auto-charge', data); }
}

// ── Events ──
// POST is public (no auth required); authenticated requests get a higher
// rate ceiling (100/min vs 10/min anon). GET is admin-only.
class EventsResource {
  constructor(c) { this.c = c; }
  report(type, message, { source = 'api', severity, meta, tenant, sessionId, fingerprint } = {}) {
    const body = { type, source, message };
    if (severity) body.severity = severity;
    if (tenant) body.tenant = tenant;
    if (sessionId) body.session_id = sessionId;
    if (fingerprint) body.fingerprint = fingerprint;
    if (meta) body.meta = meta;
    return this.c._request('POST', '/v1/events', body);
  }
  query({ severity, type, fingerprint, hours = 24, limit = 50 } = {}) {
    return this.c._request('GET', '/v1/events', null,
      { severity, type, fingerprint, hours, limit });
  }
}

class VoiceSessionsResource {
  constructor(c) { this.c = c; }
  // Open a headless AI voice session. Returns {token, url, room_name, session_limit_sec}.
  create(agentId, context = null, { external_user_id = null, metadata = null, max_duration_sec = null } = {}) {
    const body = { agent_id: agentId, context };
    if (external_user_id) body.external_user_id = external_user_id;
    if (metadata) body.metadata = metadata;
    if (max_duration_sec) body.max_duration_sec = max_duration_sec;
    return this.c._request('POST', '/v1/voice/sessions', body);
  }
  // Fetch a voice session's detail + transcript. eut_ token → only its own end user.
  get(roomName) { return this.c._request('GET', `/v1/voice/sessions/${encodeURIComponent(roomName)}`); }
}

class WebhooksResource {
  constructor(c) { this.c = c; }
  // Set (or replace) your tenant webhook URL + secret (auto-generated if omitted).
  set(webhookUrl, webhookSecret = null) {
    const body = { webhook_url: webhookUrl };
    if (webhookSecret) body.webhook_secret = webhookSecret;
    return this.c._request('PUT', '/v1/webhooks', body);
  }
  get() { return this.c._request('GET', '/v1/webhooks'); }
}

class EndUsersResource {
  constructor(c) { this.c = c; }
  // Mint an ephemeral end-user token (eut_) to hand to a mobile client.
  // Called with your sk_ key; usage is billed to your (tenant) wallet.
  createToken(externalId, { scopes = null, expires_in = 3600, agent_ids = null } = {}) {
    const body = { expires_in };
    if (scopes) body.scopes = scopes;
    if (agent_ids) body.agent_ids = agent_ids;
    return this.c._request('POST', `/v1/end-users/${encodeURIComponent(externalId)}/tokens`, body);
  }
}

module.exports = { Call2Me };
