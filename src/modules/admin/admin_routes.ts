import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import { validateId } from '../../middleware/payload_handler';
import JWTToken from '../../utils/tokens';
import UadminController from './admin_controller';
import UadminValidations from './admin_validations';

const router = Router();

router.get('/', JWTToken.validateAccessToken, asyncHandler(UadminController.find));
router.post('/', JWTToken.validateAccessToken, UadminValidations.create, asyncHandler(UadminController.create));
router.patch('/:id', validateId, JWTToken.validateAccessToken, asyncHandler(UadminController.update));
router.delete('/:id', validateId, JWTToken.validateAccessToken, asyncHandler(UadminController.delete));

export default router;
