import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import JWTToken from '../../utils/tokens';
import DashboardController from './dashboard_controller';

const router = Router();

router.get('/', JWTToken.vendorAccessToken, asyncHandler(DashboardController.find));
// router.get('/vendor/:id', AuthHandler.validateAccessToken, asyncHandler(DashboardController.getVendorsDashboardData));

export default router;
