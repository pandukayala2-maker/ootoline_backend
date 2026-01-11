import BaseValidator from '../../common/base_validator';
import ErrorHandler from '../../middleware/error_handler';

export default class ProductValidations extends BaseValidator {
    static create = [
        this.nameField('name'),
        this.nameField('desc', { maxLength: 1000 }),
        this.nameField('origin'),
        this.nameField('port_number'),
        this.numberField('price'),
        this.objectField('specification', { isMap: true }),
        this.mongoIdField('vendor_id'),

        ErrorHandler.requestValidator
    ];
}
