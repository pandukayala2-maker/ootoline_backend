import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import { validateId } from '../../middleware/payload_handler';
import JWTToken from '../../utils/tokens';
import OrderController from './order_controller';
import OrderValidation from './order_validation';

const router = Router();

router.get('/success', asyncHandler(OrderController.createOrderWithPayment));
router.get('/failed', asyncHandler(OrderController.delete));

router.post('/', JWTToken.validateAccessToken, OrderValidation.create, asyncHandler(OrderController.create));
router.get('/:id', JWTToken.validateAccessToken, asyncHandler(OrderController.find));
router.get('/', JWTToken.validateAccessToken, asyncHandler(OrderController.find));
router.patch('/:id', JWTToken.validateAccessToken, asyncHandler(OrderController.updateOrder));
router.patch('/tracker/:id', validateId, JWTToken.vendorAccessToken, OrderValidation.tracker, asyncHandler(OrderController.addTracker));
router.delete('/tracker/:id', validateId, JWTToken.vendorAccessToken, OrderValidation.trackerRemoev, asyncHandler(OrderController.removeTracker));

// router.get('/user/:id', asyncHandler(OrderController.findByUser));
// router.get('/', asyncHandler(OrderController.findAllOrders));
// router.get('/vendor/:id', asyncHandler(OrderController.findByVendor));
// router.get('/total/user/:id', asyncHandler(OrderController.totalOrdersByUser));

export default router;
