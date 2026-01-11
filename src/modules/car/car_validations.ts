import BaseValidator from '../../common/base_validator';
import { PaintReworkEnum } from '../../constant/enum';
import ErrorHandler from '../../middleware/error_handler';

class CarValidations extends BaseValidator {
    static create = [
        this.nameField('car_type'),
        this.nameField('car_make'),
        this.nameField('car_model'),
        this.numberField('year'),
        this.nameField('color'),
        this.nameField('registration_number'),
        this.numberField('km'),
        this.nameField('engine_number'),
        this.nameField('chassis_number'),
        this.nameField('fuel_type'),
        this.nameField('transmission_type'),
        this.enumField('paint_rework', Object.values(PaintReworkEnum)),

        this.nameField('seller_name'),
        this.numberField('selling_price'),
        // this.nameField('postal_code'),
        this.nameField('street'),
        this.nameField('phone_number'),
        this.nameField('country'),

        ErrorHandler.requestValidator
    ];
}

export default CarValidations;
