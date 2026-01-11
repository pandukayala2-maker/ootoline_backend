import { Server as HttpsServer } from 'http';
import { WebSocketServer } from 'ws';
import { WebSocketManager } from './websocket_manager';
import { logger } from '../utils/logger';

class WebSocketConfig {
    private server: HttpsServer;

    constructor(server: HttpsServer) {
        this.server = server;

        const wss = new WebSocketServer({ server: this.server });
        const webSocketManager = WebSocketManager.getInstance();

        wss.on('connection', (ws, req) => {
            const path = req.url || '/';
            logger.info(`Client connected to path: ${path}`);
            webSocketManager.addClient(ws, path);
        });

        console.log('WebSocket server initialized.');
    }
}

export default WebSocketConfig;
