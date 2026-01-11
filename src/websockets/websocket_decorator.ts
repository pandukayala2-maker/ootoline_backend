import { WebSocketManager } from './websocket_manager';

export function WebSocketBroadcast(path: string, eventName: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const result = await originalMethod.apply(this, args);
            const webSocketManager = WebSocketManager.getInstance();
            webSocketManager.broadcast(path, { event: eventName, data: result });
            return result;
        };

        return descriptor;
    };
}
