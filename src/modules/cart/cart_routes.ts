import { Router } from 'express';
import JWTToken from '../../utils/tokens';
import CartController from './cart_controller';
import CartValidations from './cart_validations';

const router = Router();

router.get('/', JWTToken.userAccessToken, CartController.findCart);
router.patch('/', JWTToken.userAccessToken, CartValidations.validate, CartController.addToCart);
router.delete('/', JWTToken.userAccessToken, CartController.removeFromCart);

export default router;
