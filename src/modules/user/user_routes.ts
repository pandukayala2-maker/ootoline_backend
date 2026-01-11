import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import MediaHandler from '../../middleware/media_handler';
import JWTToken from '../../utils/tokens';
import UserController from './user_controller';

const router = Router();

router.get('/', JWTToken.vendorAccessToken, asyncHandler(UserController.find));
router.get('/:id', JWTToken.validateAccessToken, asyncHandler(UserController.findById));
router.patch('/:id', JWTToken.validateAccessToken, asyncHandler(UserController.update));

export default router;
