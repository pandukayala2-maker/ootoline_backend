import { NextFunction, Request, Response } from 'express';
import winston from 'winston';
import { EnvEnum } from '../constant/enum';
import Config from '../config/dot_config';

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(({ level, message }) => `[${level}] ${message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'info.log', level: 'warn' })
    ]
});

if (Config._APP_ENV === EnvEnum.production) {
    logger.level = 'error';
    logger.format = winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp }) => `[${level}] ${timestamp} ${message}`)
    );
}

export const apiRequestInfo = (req: Request, res: Response, next: NextFunction) => {
    logger.info('-----------------------------------------------------------');
    logger.warn({
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        query: req.query,
        ip: req.ip,
        origin: req.headers.origin
    });
    next();
};
