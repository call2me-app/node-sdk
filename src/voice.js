// Browser helper for Call2Me headless voice sessions.
// livekit-client is a PEER dependency — pass its `Room` class in (CSP-friendly,
// version-flexible, no CDN). Get {url, token} from voiceSessions.create() server-side.

/**
 * @param {{ url: string, token: string, Room: any, onConnected?: Function, onDisconnected?: Function }} opts
 * @returns {Promise<{ room: any, stop: () => void }>}
 */
export async function startVoiceSession({ url, token, Room, onConnected, onDisconnected }) {
  if (!Room) throw new Error("startVoiceSession: pass the LiveKit `Room` class (import { Room } from 'livekit-client').");
  const room = new Room();
  if (onConnected) room.on('connected', onConnected);
  if (onDisconnected) room.on('disconnected', onDisconnected);
  await room.connect(url, token);
  await room.localParticipant.setMicrophoneEnabled(true);
  return {
    room,
    stop() { room.disconnect(); },
  };
}
