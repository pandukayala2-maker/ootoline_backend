import { Response } from 'express';
import { statusMsgEnum } from '../common/base_error';
import { WebSocketManager } from '../websockets/websocket_manager';

interface IResponse<T> {
    message: string;
    status: boolean;
    data?: T | null;
    error?: any | null;
}

export const baseResponse = <T>(options: { res: Response; data?: T; error?: any; code?: number; message?: string }): Response => {
    const { res, data, error, code = 200, message = statusMsgEnum.success } = options;
    const response: IResponse<T> = {
        message,
        status: code === 200,
        data,
        error
    };
    return res.status(code).json(response);
};

export const webSocketResponse = <T>(options: { res: Response; data?: T; message?: string }): void => {
    const { res, data, message = statusMsgEnum.success } = options;
    const path = res.locals.path;
    const webSocketManager = WebSocketManager.getInstance();
    webSocketManager.broadcast(path, { event: message, data: data });
};
