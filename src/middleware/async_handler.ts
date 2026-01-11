import { NextFunction, Request, Response } from 'express';
import MediaHandler from './media_handler';

const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch((err: any) => {
        MediaHandler.deleteUploadedFiles(req);
        return next(err);
    });

export default asyncHandler;
