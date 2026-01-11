import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import MediaHandler from '../../middleware/media_handler';
import { validateId } from '../../middleware/payload_handler';
import RateLimiter from '../../middleware/rate_limiter';
import JWTToken from '../../utils/tokens';
import authController from './auth_controller';
import AuthValidations from './auth_validation';

const authRouter = Router();

authRouter.get('/:id', JWTToken.adminAccessToken, asyncHandler(authController.getAdminProfile));

authRouter.post('/signin/phone', RateLimiter.otpRateLimit(3, 15 * 60 * 1000), AuthValidations.signInPhone, asyncHandler(authController.phoneSignIn));

authRouter.post('/verifyotp', AuthValidations.verifyOtp, asyncHandler(authController.verifyOtp));

authRouter.post('/verifyfirebaseotp', AuthValidations.token, asyncHandler(authController.verifyFirebaseOtp));

authRouter.post('/signin', AuthValidations.signInEmail, asyncHandler(authController.emailSignIn));

authRouter.post('/signup/vendor', MediaHandler.singleMediaHandler, AuthValidations.signUpVendor, asyncHandler(authController.emailSignUp));

authRouter.patch('/refresh-token', AuthValidations.token, asyncHandler(authController.validateRefreshToken));

authRouter.patch('/send-otp-email/:id', validateId, AuthValidations.sendEmailOtp, asyncHandler(authController.sendOtpEmail));

authRouter.patch('/verify-otp-email/:id', validateId, AuthValidations.verifyEmailOtp, asyncHandler(authController.verifyOtpEmail));

authRouter.patch('/:id', validateId, JWTToken.validateAccessToken, asyncHandler(authController.update));

// authRouter.patch('update-password/:id', validateId, JWTToken.validateAccessToken, asyncHandler(authController.updatePassword));

// authRouter.get('/verify-email/:token', asyncHandler(authController.verifyEmail));
// authRouter.get('/', asyncHandler(authController.findAll));

// authRouter.post('/signup/user', basicAuthHandler, MediaHandler.singleMediaHandler, AuthValidations.signUpUser, asyncHandler(authController.signup));

// authRouter.post('/verify-resetotp', AuthValidations.otpverification, asyncHandler(authController.verifyResetOtp));

// authRouter.patch('/update-password', AuthValidations.updatepassword, asyncHandler(authController.updatePassword));
// authRouter.patch('/:id', validateId, AuthValidations.update, asyncHandler(authController.update));

// authRouter.delete('/:id', validateId, asyncHandler(authController.delete));

export default authRouter;
