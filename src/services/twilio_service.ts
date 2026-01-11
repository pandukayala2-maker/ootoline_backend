import twilio from 'twilio';
import Config from '../config/dot_config';

class TwilioService {
    private accountSid = Config._TWILIO_ACCOUNT_SID as string;
    private authToken = Config._TWILIO_AUTH_TOKEN as string;
    private fromNumber = Config._TWILIO_PHONE_NUMBER as string;
    private serviceId = Config._TWILIO_SERVICE_SID as string;

    private client = twilio(this.accountSid, this.authToken);

    // Send SMS with custom OTP message
    static sendCustomOTP = async (phoneNumber: string, otpCode: string): Promise<void> => {
        const service = new TwilioService();
        try {
            const message = `Your AutoLine verification code is: ${otpCode}. This code will expire in 5 minutes.`;
            
            const response = await service.client.messages.create({
                body: message,
                from: service.fromNumber,
                to: phoneNumber
            });
            
            console.log(`✅ SMS sent to ${phoneNumber}: ${response.sid}`);
            console.log(`📱 OTP ${otpCode} delivered via SMS`);
        } catch (error) {
            console.error('❌ Error sending SMS:', error);
            throw error;
        }
    };

    // Original Twilio Verify API methods (keeping for compatibility)
    static sendOTP = async (phoneNumber: string): Promise<void> => {
        const service = new TwilioService();
        try {
            const response = await service.client.verify.v2.services(service.serviceId).verifications.create({
                to: phoneNumber,
                channel: 'sms'
            });
            console.log(`OTP sent to ${phoneNumber}: Status - ${response.status}`);
            console.log('SMS sent successfully!', response.sid);
        } catch (error) {
            console.error('Error sending SMS:', error);
            throw error;
        }
    };

    static verifyOTP = async (phoneNumber: string, otpCode: string): Promise<boolean> => {
        const service = new TwilioService();
        try {
            const response = await service.client.verify.v2.services(service.serviceId).verificationChecks.create({
                to: phoneNumber,
                code: otpCode
            });

            console.log(`OTP verification for ${phoneNumber}: Status - ${response.status}`);
            return response.status === 'approved';
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return false;
        }
    };
}

export default TwilioService;
