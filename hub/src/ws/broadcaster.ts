import type { WebSocket } from 'ws';

import type { WsBroadcastMessage } from '../lib/types.js';

const authenticatedClients = new Set<WebSocket>();

/**
 * Add an authenticated client to the broadcast pool.
 * Only call this after the client has been authenticated via the first-message protocol.
 */
export function addAuthenticatedClient(socket: WebSocket): void {
  authenticatedClients.add(socket);

  socket.on('close', () => {
    authenticatedClients.delete(socket);
  });

  socket.on('error', () => {
    authenticatedClients.delete(socket);
  });
}

export function broadcast(
  entity: string,
  action: WsBroadcastMessage['action'],
  id: string,
  data: unknown,
): void {
  const message: WsBroadcastMessage = {
    type: 'mutation',
    entity,
    action,
    id,
    data,
    timestamp: new Date().toISOString(),
  };

  const payload = JSON.stringify(message);

  for (const client of authenticatedClients) {
    if (client.readyState === client.OPEN) {
      client.send(payload);
    }
  }
}
