import BaseValidator from '../../common/base_validator';
import CustomErrorHandler from '../../middleware/error_handler';

class UadminValidations extends BaseValidator {
    static create = [this.nameField(), CustomErrorHandler.requestValidator];
}

export default UadminValidations;
