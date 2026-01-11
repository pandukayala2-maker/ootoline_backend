import { body } from 'express-validator';
import CustomErrorHandler from '../../middleware/error_handler';

class CartValidations {
    static validate = [
        body('cart_items').notEmpty().withMessage('cart items is required.'),
        body('cart_items.*.quantity').notEmpty().withMessage('quantity is required.'),
        body('cart_items.*.product').notEmpty().withMessage('product id is required.'),
        CustomErrorHandler.requestValidator
    ];
}

export default CartValidations;
