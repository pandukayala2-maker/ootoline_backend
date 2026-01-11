import Config from '../config/dot_config';

class SMSService {
    // Simple SMS logging for frontend Firebase implementation
    static async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
        console.log(`📱 ===== SMS MESSAGE (Frontend Firebase) =====`);
        console.log(`📞 To: ${phoneNumber}`);
        console.log(`💬 Message: ${message}`);
        console.log(`🔧 Implementation: Frontend Firebase Auth`);
        console.log(`ℹ️ SMS will be sent by Flutter app using Firebase Auth`);
        console.log(`📱 ==============================================`);
        
        // Always return true since frontend will handle SMS
        return true;
    }

    // Send OTP specifically
    static async sendOTP(phoneNumber: string, otpCode: string): Promise<boolean> {
        const message = `Your AutoLine verification code is: ${otpCode}. This code will expire in 5 minutes.`;
        return await this.sendSMS(phoneNumber, message);
    }
}

export default SMSService;