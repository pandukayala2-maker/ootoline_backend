import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import { validateId } from '../../middleware/payload_handler';
import JWTToken from '../../utils/tokens';
import BookingController from './booking_controller';
import BookingValidations from './booking_validations';

const router = Router();

router.get('/success', asyncHandler(BookingController.createBookingWithPayment));
router.get('/failed', asyncHandler(BookingController.delete));

router.get('/', JWTToken.validateAccessToken, asyncHandler(BookingController.find));
router.get('/:id', JWTToken.validateAccessToken, asyncHandler(BookingController.find));

router.post('/', JWTToken.validateAccessToken, BookingValidations.create, asyncHandler(BookingController.create));
router.post('/check', BookingValidations.checkDate, asyncHandler(BookingController.checkDataAvailabity));
router.patch('/:id', validateId, JWTToken.validateAccessToken, asyncHandler(BookingController.update));
router.delete('/:id', validateId, JWTToken.validateAccessToken, asyncHandler(BookingController.delete));

export default router;
