import dotenv from 'dotenv';

dotenv.config();

export default class Config {
    static readonly _APP_ENV: string = process.env.ENV || 'development';
    static readonly _PORT: string = process.env.PORT || '4321';
    static readonly _APP_URL: string = process.env.APP_URL || '';
    static readonly _BASIC_AUTH_USER: string = process.env.BASIC_AUTH_USERNAME || '';
    static readonly _BASIC_AUTH_PASS: string = process.env.BASIC_AUTH_PASSWORD || '';

    static readonly _DB_URL: string = process.env.DATABASE_URL || '';
    static readonly _DB_NAME: string = process.env.DATABASE_NAME || '';
    static readonly _DB_USER: string = process.env.DATABASE_USER_NAME || '';
    static readonly _DB_PASS: string = process.env.DATABASE_PASSWORD || '';
    static readonly _MASTER_DB: string = process.env.MASTER_DATABASE || '';
    static readonly _ADMIN_DB: string = process.env.ADMIN_DATABASE || '';

    static readonly _APP_ACCESSTOKEN: string = process.env.ACCESS_TOKEN_SECRET || '';
    static readonly _APP_REFRESHTOKEN: string = process.env.REFRESH_TOKEN_SECRET || '';
    static readonly _APP_ACCESSTOKEN_TIMEOUT: string = process.env.ACCESS_TOKEN_SECRET_TIMEOUT || '10s';
    static readonly _APP_REFRESHTOKEN_TIMEOUT: string = process.env.REFRESH_TOKEN_SECRET_TIMEOUT || '600m';

    static readonly _EMAIL_VERIFY_TOKEN: string = process.env.VERIFICATION_EMAIL_TOKEN_SECRET || '';
    static readonly _OTP_TOKEN: string = process.env.OTP_TOKEN_SECRET || '';

    static readonly _STATIC_PATH: string = process.env.STATIC_PATH || '';

    static readonly _SMTP_EMAIL_USERNAME: string = process.env.SMTP_EMAIL_USERNAME || '';
    static readonly _SMTP_EMAIL_PASSWORD: string = process.env.SMTP_EMAIL_PASSWORD || '';

    static readonly _UPAYMENT_API_KEY: string = process.env.UPAYMENT_API_KEY || '';
    static readonly _UPAYMENT_DEV_API_KEY: string = process.env.UPAYMENT_DEV_API_KEY || '';

    static readonly _TWILIO_ACCOUNT_SID: string = process.env.TWILIO_ACCOUNT_SID || '';
    static readonly _TWILIO_AUTH_TOKEN: string = process.env.TWILIO_AUTH_TOKEN || '';
    static readonly _TWILIO_PHONE_NUMBER: string = process.env.TWILIO_PHONE_NUMBER || '';
    static readonly _TWILIO_SERVICE_SID: string = process.env.TWILIO_SERVICE_SID || '';
}
