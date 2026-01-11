import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import MediaHandler from '../../middleware/media_handler';
import { validateId } from '../../middleware/payload_handler';
import JWTToken from '../../utils/tokens';
import CategoryController from './category_controller';
import CategoryValidations from './category_validation';

const router = Router();

router.get('/', asyncHandler(CategoryController.find));
router.post(
    '/',
    JWTToken.adminAccessToken,
    MediaHandler.multiMediaHandler(['image', 'alt_image']),
    CategoryValidations.create,
    asyncHandler(CategoryController.create)
);
router.patch(
    '/:id',
    validateId,
    JWTToken.adminAccessToken,
    MediaHandler.multiMediaHandler(['image', 'alt_image']),
    asyncHandler(CategoryController.update)
);
router.delete('/:id', validateId, JWTToken.adminAccessToken, asyncHandler(CategoryController.delete));

export default router;
