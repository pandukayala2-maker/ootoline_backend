import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import BaseError, { BadRequestError, InvalidEndPointError, MongoError } from '../common/base_error';
import MediaHandler from './media_handler';
import { baseResponse } from './response_handler';
import { logger } from '../utils/logger';

class ErrorHandler {
    static errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
        logger.error({
            message: 'ERROR',
            method: req.method,
            url: req.originalUrl,
            body: req.body,
            form: req.files,
            query: req.query,
            ip: req.ip,
            origin: req.headers.origin,
            stack: err.stack
        });
        logger.error(err.stack);
        if (err instanceof BaseError) return baseResponse({ res: res, code: err.code, message: err.message });
        if ((err as any).code) return baseResponse({ res: res, code: 500, message: new MongoError((err as any).code).message });
        return baseResponse({ res: res, code: 500, message: err.message });
    };

    static invalidEndPointHandler = (req: Request, res: Response, next: NextFunction) => {
        if (req.originalUrl && req.originalUrl.split('/').pop() === 'favicon.ico') {
            return res.sendStatus(204);
        }
        return next(new InvalidEndPointError());
    };

    static requestValidator = (req: Request, res: Response, next: NextFunction): any => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            MediaHandler.deleteUploadedFiles(req);
            const missingParams = error.array().map((item) => item.msg);
            const errorMessage = `missing parameter ${missingParams.join(', ')}`;
            return next(new BadRequestError(errorMessage));
        }
        next();
    };
}

export default ErrorHandler;
