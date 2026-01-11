import BaseValidator from '../../common/base_validator';
import ErrorHandler from '../../middleware/error_handler';

export default class OrderValidation extends BaseValidator {
    static create = [this.mongoIdField('address_id'), ErrorHandler.requestValidator];

    static tracker = [this.nameField('status'), ErrorHandler.requestValidator];

    static trackerRemoev = [this.mongoIdField('tracker_id'), ErrorHandler.requestValidator];
}
