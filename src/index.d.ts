// TypeScript declarations for call2me-sdk.
// These are hand-written and intentionally loose (most payloads are
// pass-through to the REST API) to keep the surface flexible while
// still giving editor autocomplete on the resource names.

declare module "call2me-sdk" {
  export type Severity = "critical" | "error" | "warning" | "info" | "debug";

  export interface EventOptions {
    source?: string;
    severity?: Severity;
    meta?: Record<string, unknown>;
    tenant?: string;
    sessionId?: string;
    fingerprint?: string;
  }

  export interface EventQuery {
    severity?: Severity;
    type?: string;
    fingerprint?: string;
    hours?: number;
    limit?: number;
  }

  export class Call2Me {
    constructor(apiKey: string, baseUrl?: string);
    agents: {
      list(limit?: number, offset?: number): Promise<any>;
      get(id: string): Promise<any>;
      create(data: Record<string, unknown>): Promise<any>;
      update(id: string, data: Record<string, unknown>): Promise<any>;
      delete(id: string): Promise<any>;
      duplicate(id: string): Promise<any>;
      stats(id: string, days?: number): Promise<any>;
      globalStats(): Promise<any>;
    };
    calls: {
      list(limit?: number, offset?: number, agentId?: string | null): Promise<any>;
      get(id: string): Promise<any>;
      end(id: string): Promise<any>;
      recording(id: string): Promise<any>;
    };
    knowledgeBases: any;
    wallet: {
      balance(): Promise<any>;
      transactions(limit?: number): Promise<any>;
    };
    campaigns: any;
    schedules: any;
    phoneNumbers: any;
    sipTrunks: any;
    apiKeys: {
      list(): Promise<any>;
      create(data: Record<string, unknown>): Promise<any>;
      revoke(id: string): Promise<any>;
      delete(id: string): Promise<any>;
    };
    users: any;
    widgets: any;
    voices: any;
    chats: any;
    payments: any;
    events: {
      report(type: string, message: string, options?: EventOptions): Promise<any>;
      query(q?: EventQuery): Promise<any>;
    };
    voiceSessions: {
      create(agentId: string, context?: Record<string, unknown> | null, opts?: { external_user_id?: string; metadata?: Record<string, unknown>; max_duration_sec?: number }): Promise<any>;
      get(roomName: string): Promise<any>;
    };
    endUsers: {
      createToken(externalId: string, opts?: { scopes?: string[]; expires_in?: number; agent_ids?: string[] }): Promise<any>;
    };
    webhooks: {
      set(webhookUrl: string, webhookSecret?: string): Promise<any>;
      get(): Promise<any>;
    };
  }
}
