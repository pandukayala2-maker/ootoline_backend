import BaseValidator from '../../common/base_validator';
import ErrorHandler from '../../middleware/error_handler';

export default class BannerValidations extends BaseValidator {
    static create = [this.nameField('name'), ErrorHandler.requestValidator];
}
