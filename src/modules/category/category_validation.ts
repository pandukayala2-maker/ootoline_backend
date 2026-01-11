import BaseValidator from '../../common/base_validator';
import ErrorHandler from '../../middleware/error_handler';

export default class CategoryValidations extends BaseValidator {
    static create = [this.nameField('name'), this.nameField('type'), this.nameField('desc', { maxLength: 500 }), ErrorHandler.requestValidator];
}
