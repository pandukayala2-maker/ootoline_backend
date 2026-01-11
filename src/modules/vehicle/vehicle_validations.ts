import BaseValidator from '../../common/base_validator';
import CustomErrorHandler from '../../middleware/error_handler';

class VehicleValidations extends BaseValidator {
    static createMake = [this.nameField(), CustomErrorHandler.requestValidator];
    static createModel = [this.nameField(), this.mongoIdField('make_id'), CustomErrorHandler.requestValidator];
}

export default VehicleValidations;
