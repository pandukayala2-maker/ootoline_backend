import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import MediaHandler from '../../middleware/media_handler';
import { validateId } from '../../middleware/payload_handler';
import JWTToken from '../../utils/tokens';
import CategoryController from './banner_controller';
import BannerValidations from './banner_validation';

const router = Router();

router.get('/', JWTToken.emptyAccessToken, asyncHandler(CategoryController.find));
router.post('/', JWTToken.vendorAccessToken, MediaHandler.singleMediaHandler, BannerValidations.create, asyncHandler(CategoryController.create));
router.patch('/:id', validateId, JWTToken.vendorAccessToken, MediaHandler.singleMediaHandler, asyncHandler(CategoryController.update));
router.delete('/:id', validateId, JWTToken.vendorAccessToken, asyncHandler(CategoryController.delete));

export default router;
