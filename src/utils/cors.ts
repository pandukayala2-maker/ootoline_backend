import { NextFunction, Request, Response } from 'express';

export default function corsMiddleware(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // if (req.method === 'OPTIONS') {
    //     return res.status(200).json({});
    // }
    next();
}
