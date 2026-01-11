import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import JWTToken from '../../utils/tokens';
import WishlistController from './wishlist_controller';
import WishlistValidations from './wishlist_validations';

const router = Router();

router.get('/', JWTToken.userAccessToken, WishlistController.findFav);
router.patch('/', JWTToken.userAccessToken, WishlistValidations.create, WishlistController.addFav);

export default router;
