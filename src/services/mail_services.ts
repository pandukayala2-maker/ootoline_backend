import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';
import Config from '../config/dot_config';
import AppStrings from '../constant/app_strings';
import { AuthDocument } from '../modules/auth/auth_model';
import { logger } from '../utils/logger';

class MailServices {
    private static imagePath = path.resolve(__dirname, '../../assets/images/logo.png');
    private static imageData = fs.readFileSync(this.imagePath);

    private static transporter = nodemailer.createTransport({
        host: 'ootoline.com',
        port: 465,
        secure: true,
        auth: {
            user: Config._SMTP_EMAIL_USERNAME,
            pass: Config._SMTP_EMAIL_PASSWORD
        }
    });

    private static sendEmail = async (options: { email: string; subject: string; html?: string; text?: string }): Promise<void> => {
        const { email, subject, html, text } = options;
        try {
            const attachments = {
                filename: 'logo.png',
                content: this.imageData,
                encoding: 'base64',
                cid: 'logo'
            };
            const mailOptions = {
                from: `${AppStrings.app_name} - <${Config._SMTP_EMAIL_USERNAME}>`,
                to: email,
                subject,
                text,
                html,
                attachments: [attachments]
            };
            const info = await this.transporter.sendMail(mailOptions);
            logger.info('Message sent:', info.messageId);
        } catch (error) {
            console.log(error);
            logger.error('Error sending email:', error);
        }
    };

    static sendEmailVerificationMail = async (email: string, username: string, otp: string): Promise<void> => {
        try {
            const subject = `Verify Your Email Address - ${AppStrings.app_name}`;
            const templatePath = path.resolve(__dirname, '../../templates/verification_email.html');
            const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
            let htmlTemplateWithData = htmlTemplate;
            const regex = /\{\{([^}]+)\}\}/g;
            htmlTemplateWithData = htmlTemplateWithData.replace(regex, (match, placeholder) => {
                if (placeholder === 'User_Name') return username;
                else if (placeholder === 'App_Name') return AppStrings.app_name;
                else if (placeholder === 'OTP_Code') return otp;
                else if (placeholder === 'X_minutes') return `${AppStrings.otpExpireTime} minutes`;
                else if (placeholder === 'App_Path') return AppStrings.appUrl();
                return match;
            });
            await this.sendEmail({ email: email, html: htmlTemplateWithData, subject: subject });
        } catch (error) {
            console.error('Error sending email:', error);
            throw Error('Something went wrong');
        }
    };

    static sendPasswordResetOtpMail = async (auth: AuthDocument, username: string, otp: string): Promise<void> => {
        try {
            const subject = `Reset Password - ${AppStrings.app_name}`;
            const templatePath = path.resolve(__dirname, '../../templates/reset_password.html');
            const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
            let htmlTemplateWithData = htmlTemplate;
            const regex = /\{\{([^}]+)\}\}/g;
            htmlTemplateWithData = htmlTemplateWithData.replace(regex, (match, placeholder) => {
                if (placeholder === 'User_Name') return username;
                else if (placeholder === 'App_Name') return AppStrings.app_name;
                else if (placeholder === 'OTP_Code') return otp;
                else if (placeholder === 'X_minutes') return `${AppStrings.otpExpireTime} minutes`;
                else if (placeholder === 'App_Path') return AppStrings.appUrl();
                return match;
            });
            await this.sendEmail({ email: auth.email!, html: htmlTemplateWithData, subject: subject });
        } catch (error) {
            console.error('Error sending email:', error);
            throw Error('Something went wrong');
        }
    };

    // static sendEmailVerificationMail = async (payload: IJwtPayload): Promise<void> => {
    //     try {
    //         const subject = `Verify Your Email Address - ${AppStrings.app_name}`;
    //         const templatePath = path.resolve(__dirname, '../../templates/verification_email.html');
    //         const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
    //         const link = JWTToken.generateVerificationLink(payload);
    //         let htmlTemplateWithData = htmlTemplate;
    //         const regex = /\{\{([^}]+)\}\}/g;
    //         htmlTemplateWithData = htmlTemplateWithData.replace(regex, (match, placeholder) => {
    //             if (placeholder === 'verification_link') return link;
    //             else if (placeholder === 'App_Name') return AppStrings.app_name;
    //             else if (placeholder === 'App_Path') return AppStrings.appUrl();
    //             return match;
    //         });
    //         await this.sendEmail({ email: payload.email!, html: htmlTemplateWithData, subject: subject });
    //     } catch (error) {
    //         console.error('Error sending email:', error);
    //         throw Error('Something went wrong');
    //     }
    // };

    // static verifyEmail = async (email: string, otp: number): Promise<void> => {
    //     try {
    //         const subject = 'Verify your email address - GIFT ECOM';

    //         const message = `Dear User\n\nregistering with GIFT ECOM! To complete the registration proccess and ensure the security of your account.\n\nPlease verify your email address by entering the OTP in the app given below.\n ${otp} \n\nBest Regards,\nGIFT ECOM`;

    //         await this.sendEmail(email, subject, message);
    //     } catch (error) {
    //         logger.error('Error while sending email', error);
    //     }
    // };

    // static forgotPasswordMail = async (email: string, otp: number): Promise<void> => {
    //     const subject = 'Resend Password - GIFT ECOM';

    //     const message = `Dear User,\n\nYou have requested to reset your password for your GIFT ECOM account. To proceed with password reset process and ensure the security of your account, please use the OTP provided below within the app.\n\n
    //     OTP: ${otp}\n\n
    //     If you did not request this password reset, please ignore this message or contact our support team immediately.\n\n
    //     Best Regards,\n
    //     GIFT ECOM`;

    //     await this.sendEmail(email, subject, message);
    // };

    static orderSuccessfulEmail = async (email: string, number: string): Promise<void> => {
        try {
            const subject = 'Order Placed Successfully - Autoline';
            const message = `Dear User\n\nthanks for ordering with Autoline! This is your Order Number ${number}. \n\nBest Regards,\nAutomeka`;
            await this.sendEmail({ email: email, subject: subject, text: message });
        } catch (error) {
            console.error('Error sending email:', error);
            throw Error('Something went wrong');
        }
    };

    static orderVendorSuccessfulEmail = async (email: string, number: string): Promise<void> => {
        try {
            const subject = 'Order as been Place in Autoline';
            const message = `Order as been placed by user ${email} order no ${number} . \n\nBest Regards,\nAutomeka`;
            await this.sendEmail({ email: email, subject: subject, text: message });
        } catch (error) {
            console.error('Error sending email:', error);
            throw Error('Something went wrong');
        }
    };

    static bookingSuccessfulEmail = async (email: string, number: string): Promise<void> => {
        try {
            const subject = 'Booking Successfully - Autoline';
            const message = `Dear User\n\nthanks for Booking Service with Autoline! This is your Booking Number ${number}. \n\nBest Regards,\nAutomeka`;
            await this.sendEmail({ email: email, subject: subject, text: message });
        } catch (error) {
            console.error('Error sending email:', error);
            throw Error('Something went wrong');
        }
    };

    static bookinVendorSuccessfulEmail = async (email: string, number: string): Promise<void> => {
        try {
            const subject = 'Booking as been Place in Autoline';
            const message = `Booking as been placed by user ${email} Booking no ${number} . \n\nBest Regards,\nAutomeka`;
            await this.sendEmail({ email: email, subject: subject, text: message });
        } catch (error) {
            console.error('Error sending email:', error);
            throw Error('Something went wrong');
        }
    };
}

export default MailServices;
