import BaseValidator from '../../common/base_validator';
import ErrorHandler from '../../middleware/error_handler';

export default class AddressValidations extends BaseValidator {
    static create = [
        this.nameField('name'),
        this.nameField('phone'),

        this.nameField('street'),
        this.nameField('city'),
        this.nameField('area'),
        this.nameField('house'),
        this.nameField('postalcode'),

        this.nameField('type'),

        ErrorHandler.requestValidator
    ];
}
