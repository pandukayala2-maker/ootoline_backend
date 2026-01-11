import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import { validateId } from '../../middleware/payload_handler';
import JWTToken from '../../utils/tokens';
import AddressController from './address_controller';
import AddressValidations from './address_validation';

const router = Router();

router.post('/', JWTToken.validateAccessToken, AddressValidations.create, asyncHandler(AddressController.create));
router.get('/', JWTToken.validateAccessToken, asyncHandler(AddressController.find));
router.patch('/:id', validateId, JWTToken.validateAccessToken, asyncHandler(AddressController.update));
router.delete('/:id', validateId, JWTToken.validateAccessToken, asyncHandler(AddressController.delete));

export default router;
