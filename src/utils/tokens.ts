import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../common/base_error';
import Config from '../config/dot_config';
// import AppStrings from '../constant/app_strings';
import AppStrings from '../constant/app_strings';

import { UserTypeEnum } from '../constant/enum';
import { logger } from './logger';

export interface IJwtPayload {
    email?: string;
    id: string;
    usertype: string;
    phone?: string;
}

class JWTToken {
    private static refreshTokens = new Set<string>();

    static generateToken(data: object, key: jwt.Secret, expireTime?: string | number): string {
        return jwt.sign(data, key, { expiresIn: expireTime ?? `${AppStrings.otpExpireTime}m` });
    }

    static generateAccessToken(data: object): string {
        return this.generateToken(data, Config._APP_ACCESSTOKEN, Config._APP_ACCESSTOKEN_TIMEOUT);
    }

    static generateRefreshToken(data: object): string {
        const token = this.generateToken(data, Config._APP_REFRESHTOKEN, Config._APP_REFRESHTOKEN_TIMEOUT);
        this.refreshTokens.add(token);
        return token;
    }

    static generateVerificationLink(payload: IJwtPayload): string {
        const token = jwt.sign({ id: payload.id, email: payload.email, usertype: payload.usertype }, Config._EMAIL_VERIFY_TOKEN, {
            expiresIn: '60m'
        });
        return `${AppStrings.appUrl()}/v1/auth/verify-email/${token}`;
    }

    /// decode tokens

    static verifyToken(token: string, secretOrPublicKey: jwt.Secret, message?: string): string | jwt.JwtPayload | IJwtPayload {
        try {
            return jwt.verify(token, secretOrPublicKey);
        } catch (error: any) {
            logger.error(error);
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedError(`${message ?? 'Token has expired'}`);
            }
            throw new UnauthorizedError('Invalid token.');
        }
    }

    static decodeReqToken(req: Request, secretOrPublicKey: jwt.Secret): IJwtPayload | null {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new UnauthorizedError();
        return this.verifyToken(token, secretOrPublicKey) as IJwtPayload;
    }

    /// middlewares for validating user access

    private static validateToken(req: Request, res: Response, userType?: UserTypeEnum[]): void {
        const decodedToken = JWTToken.decodeReqToken(req, Config._APP_ACCESSTOKEN);
        if (!decodedToken) throw new UnauthorizedError('Invalid or missing token.');
        const tokenUsertype: string | undefined = decodedToken.usertype;
        if (!tokenUsertype) throw new UnauthorizedError('User type missing in token.');
        if (userType && !userType.includes(tokenUsertype as UserTypeEnum)) throw new UnauthorizedError('User type not authorized.');
        Object.assign(res.locals, {
            usertype: decodedToken.usertype,
            email: decodedToken.email,
            id: decodedToken.id,
            path: req.path,
            phone: decodedToken.phone
        });
    }

    static emptyAccessToken(req: Request, res: Response, next: NextFunction): void {
        const token = req.headers.authorization?.split(' ')[1];
        try {
            if (token) {
                const decodedToken = JWTToken.verifyToken(token, Config._APP_ACCESSTOKEN) as IJwtPayload;
                Object.assign(res.locals, {
                    usertype: decodedToken.usertype,
                    email: decodedToken.email,
                    id: decodedToken.id,
                    path: req.path,
                    phone: decodedToken.phone
                });
            }
        } finally {
            next();
        }
    }

    static validateAccessToken(req: Request, res: Response, next: NextFunction): void {
        JWTToken.validateToken(req, res);
        next();
    }

    static userAccessToken(req: Request, res: Response, next: NextFunction): void {
        JWTToken.validateToken(req, res, [UserTypeEnum.user]);
        next();
    }

    static vendorAccessToken(req: Request, res: Response, next: NextFunction): void {
        JWTToken.validateToken(req, res, [UserTypeEnum.vendor, UserTypeEnum.admin]);
        next();
    }

    static adminAccessToken(req: Request, res: Response, next: NextFunction): void {
        JWTToken.validateToken(req, res, [UserTypeEnum.admin]);
        next();
    }
}

export default JWTToken;
