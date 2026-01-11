import BaseValidator from '../../common/base_validator';
import CustomErrorHandler from '../../middleware/error_handler';

class ServiceValidations extends BaseValidator {
    static create = [this.nameField(), this.nameField('desc', { maxLength: 1000 }), this.numberField('price'), CustomErrorHandler.requestValidator];
}

export default ServiceValidations;
