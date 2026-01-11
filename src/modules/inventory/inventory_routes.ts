import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import { validateId } from '../../middleware/payload_handler';
import JWTToken from '../../utils/tokens';
import InventoryController from './inventory_controller';
import InventoryValidations from './inventory_validations';

const router = Router();

router.get('/', JWTToken.vendorAccessToken, asyncHandler(InventoryController.find));
router.post('/', JWTToken.vendorAccessToken, InventoryValidations.create, asyncHandler(InventoryController.create));
router.patch('/:id', validateId, JWTToken.vendorAccessToken, asyncHandler(InventoryController.update));
router.delete('/:id', validateId, JWTToken.vendorAccessToken, asyncHandler(InventoryController.delete));

export default router;
