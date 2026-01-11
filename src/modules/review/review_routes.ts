import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import MediaHandler from '../../middleware/media_handler';
import { validateId } from '../../middleware/payload_handler';
import JWTToken from '../../utils/tokens';
import ReviewController from './review_controller';
import ReviewValidations from './review_validation';

const router = Router();

router.get('/', asyncHandler(ReviewController.find));
router.post('/', JWTToken.validateAccessToken, ReviewValidations.create, asyncHandler(ReviewController.create));
router.patch('/:id', validateId, JWTToken.vendorAccessToken, MediaHandler.singleMediaHandler, asyncHandler(ReviewController.update));
router.delete('/:id', validateId, JWTToken.vendorAccessToken, asyncHandler(ReviewController.delete));

export default router;
