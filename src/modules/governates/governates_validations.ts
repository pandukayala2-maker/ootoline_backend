import BaseValidator from '../../common/base_validator';
import CustomErrorHandler from '../../middleware/error_handler';

class GovernateValidations extends BaseValidator {
    static create = [this.nameField(), this.numberField('value'), CustomErrorHandler.requestValidator];
}

export default GovernateValidations;
