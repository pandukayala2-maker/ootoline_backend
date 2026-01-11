import BaseValidator from '../../common/base_validator';
import ErrorHandler from '../../middleware/error_handler';

export default class ReviewValidations extends BaseValidator {
    static create = [
        this.numberField('rating', { min: 0, max: 5 }),
        this.nameField('review', { maxLength: 500 }),
        this.mongoIdField('vendor_id'),

        this.anyOneRequiredMongoId(['order_id', 'booking_id']),
        this.anyOneRequiredMongoId(['product_id', 'service_id']),

        ErrorHandler.requestValidator
    ];
}
