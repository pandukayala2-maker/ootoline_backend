import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import MediaHandler from '../../middleware/media_handler';
import { validateId } from '../../middleware/payload_handler';
import JWTToken from '../../utils/tokens';
import BrandController from './brand_controller';
import BrandValidations from './brand_validations';

const router = Router();

router.get('/', asyncHandler(BrandController.find));
router.post('/', JWTToken.adminAccessToken, MediaHandler.singleMediaHandler, BrandValidations.create, asyncHandler(BrandController.create));
router.patch('/:id', validateId, JWTToken.adminAccessToken, MediaHandler.singleMediaHandler, asyncHandler(BrandController.update));
router.delete('/:id', validateId, JWTToken.adminAccessToken, asyncHandler(BrandController.delete));

export default router;
