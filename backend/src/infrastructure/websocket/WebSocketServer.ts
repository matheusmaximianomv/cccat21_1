import WebSocket, { Server } from "ws";

export default interface WebSocketServer {
  broadcast(message: any): Promise<void>;
}

export class WSSAdapter implements WebSocketServer {

  private wss: Server;
  private connections: any[];
  
  constructor(port: number) {
    this.wss = new WebSocket.Server({ port });
    this.connections = [];
    this.wss.on("connection", (ws) => {
      this.connections.push(ws);
    });
  }

  public async broadcast(message: any): Promise<void> {
    for (const connection of this.connections) {
      connection.send(Buffer.from(JSON.stringify({ message })));
    }
  }
}