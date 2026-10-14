// Browser voice session helper (LiveKit). `Room` is livekit-client's Room class.
export function startVoiceSession(opts: {
  url: string;
  token: string;
  Room: any;
  onConnected?: (room: any) => void;
  onDisconnected?: (reason?: unknown) => void;
}): Promise<any>;
