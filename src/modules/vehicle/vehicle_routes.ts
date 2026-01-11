import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import { validateId } from '../../middleware/payload_handler';
import JWTToken from '../../utils/tokens';
import VehicleController from './vehicle_controller';
import VehicleValidations from './vehicle_validations';

const router = Router();

router.get('/make', asyncHandler(VehicleController.findMakes));
router.get('/model', asyncHandler(VehicleController.findModels));

router.post('/make', JWTToken.adminAccessToken, asyncHandler(VehicleController.createMake));
router.post('/model', JWTToken.adminAccessToken, VehicleValidations.createModel, asyncHandler(VehicleController.createModel));

router.patch('/make/:id', validateId, JWTToken.adminAccessToken, asyncHandler(VehicleController.updateMake));
router.patch('/model/:id', validateId, JWTToken.adminAccessToken, asyncHandler(VehicleController.updateModel));

router.delete('/make/:id', validateId, JWTToken.adminAccessToken, asyncHandler(VehicleController.deleteMake));
router.delete('/model/:id', validateId, JWTToken.adminAccessToken, asyncHandler(VehicleController.deleteModel));

export default router;
