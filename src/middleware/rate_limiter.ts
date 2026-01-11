import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../common/base_error';

// Simple in-memory rate limiting for OTP requests
class RateLimiter {
    private static requests = new Map<string, { count: number; resetTime: number }>();
    
    static otpRateLimit = (maxRequests: number = 3, windowMs: number = 15 * 60 * 1000) => {
        return (req: Request, res: Response, next: NextFunction) => {
            const phone = req.body.phone;
            if (!phone) {
                return next();
            }
            
            const now = Date.now();
            const key = `otp:${phone}`;
            const requestData = this.requests.get(key);
            
            if (!requestData || now > requestData.resetTime) {
                // First request or window expired
                this.requests.set(key, {
                    count: 1,
                    resetTime: now + windowMs
                });
                return next();
            }
            
            if (requestData.count >= maxRequests) {
                throw new BadRequestError('Too many OTP requests, please try again later');
            }
            
            // Increment count
            requestData.count++;
            this.requests.set(key, requestData);
            
            next();
        };
    };
    
    // Clean up expired entries periodically
    static cleanup() {
        const now = Date.now();
        for (const [key, data] of this.requests.entries()) {
            if (now > data.resetTime) {
                this.requests.delete(key);
            }
        }
    }
}

// Clean up every 5 minutes
setInterval(() => {
    RateLimiter.cleanup();
}, 5 * 60 * 1000);

export default RateLimiter;
