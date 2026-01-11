import BaseValidator from '../../common/base_validator';
import CustomErrorHandler from '../../middleware/error_handler';

class BookingValidations extends BaseValidator {
    static create = [
        this.dateField('booking_date'),
        this.mongoIdField('vendor_id'),
        this.mongoIdField('service_id'),
        this.numberField('total_price'),
        CustomErrorHandler.requestValidator
    ];

    static checkDate = [this.mongoIdField('vendor_id'), this.dateField('booking_date'), CustomErrorHandler.requestValidator];
}

export default BookingValidations;
