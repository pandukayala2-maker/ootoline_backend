import basicAuth from 'basic-auth';
import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { BadRequestError, NoContentError, UnauthorizedError } from '../common/base_error';
import Config from '../config/dot_config';

function isEmpty(obj: any): boolean {
    return !Object.keys(obj).length;
}

const isFormData = (req: Request): boolean => {
    if (req.is('multipart/form-data')) {
        return true;
    }
    return false;
};

export const payloadHandler = (req: Request, res: Response, next: NextFunction) => {
    if (
        isEmpty(req.body) &&
        !isFormData(req) &&
        isEmpty(req.query) &&
        isEmpty(req.params) &&
        req.method !== 'GET' &&
        req.method !== 'DELETE' &&
        req.method !== 'PATCH'
    ) {
        return next(new NoContentError());
    }
    next();
};

export const validateId = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isValidObjectId(id)) return next(new BadRequestError('Invalid ID'));
    next();
};

export const basicAuthHandler = (req: Request, res: Response, next: NextFunction) => {
    const user = basicAuth(req);

    console.log(user);

    if (!user || !user.name || !user.pass) {
        res.set('WWW-Authenticate', 'Basic realm="example"');
        return next(new UnauthorizedError());
    }

    const validUsername = Config._BASIC_AUTH_USER;
    const validPassword = Config._BASIC_AUTH_PASS;

    if (user.name === validUsername && user.pass === validPassword) {
        return next();
    } else {
        res.set('WWW-Authenticate', 'Basic realm="example"');
        return next(new UnauthorizedError());
    }
};
