import { body } from 'express-validator';
import BaseValidator from '../../common/base_validator';

class WishlistValidations extends BaseValidator {
    static create = [
        body('car').optional().isMongoId().withMessage('Invalid car ID'),
        body('vendor').optional().isMongoId().withMessage('Invalid vendor ID'),
        body('product').optional().isMongoId().withMessage('Invalid product ID'),
        body().custom((value, { req }) => {
            if (!req.body.car && !req.body.vendor && !req.body.product) {
                throw new Error('At least one of car, vendor, or product ID is required');
            }
            return true;
        })
    ];
}

export default WishlistValidations;
