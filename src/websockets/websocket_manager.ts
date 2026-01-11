import { WebSocket } from 'ws';

export class WebSocketManager {
    private static instance: WebSocketManager;
    private clients: Map<string, Set<WebSocket>>;

    private constructor() {
        this.clients = new Map();
    }

    public static getInstance(): WebSocketManager {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager();
        }
        return WebSocketManager.instance;
    }

    public addClient(ws: WebSocket, path: string) {
        if (!this.clients.has(path)) {
            this.clients.set(path, new Set());
        }
        this.clients.get(path)!.add(ws);
        ws.on('close', () => {
            this.clients.get(path)!.delete(ws);
        });
    }

    public broadcast(path: string, data: any) {
        const clients = this.clients.get(path) || new Set();
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
}
