import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import MediaHandler from '../../middleware/media_handler';
import { validateId } from '../../middleware/payload_handler';
import JWTToken from '../../utils/tokens';
import CarController from './car_controller';
import CarValidations from './car_validations';

const router = Router();

router.get('/', asyncHandler(CarController.find));
router.get('/:id', validateId, asyncHandler(CarController.findById));

router.post(
    '/',
    JWTToken.validateAccessToken,
    MediaHandler.multiMediaHandler(['image', 'rc', 'insurance', 'pollution']),
    CarValidations.create,
    asyncHandler(CarController.create)
);
router.patch('/:id', validateId, JWTToken.validateAccessToken, asyncHandler(CarController.update));
router.delete('/:id', validateId, JWTToken.validateAccessToken, asyncHandler(CarController.delete));

export default router;
