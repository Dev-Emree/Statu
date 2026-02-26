import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  sendHeartbeat(data: any) {
    if (this.server) {
      this.server.emit('heartbeat', data);
    }
  }

  sendIncident(data: any) {
    if (this.server) {
      this.server.emit('incident', data);
    }
  }
}
