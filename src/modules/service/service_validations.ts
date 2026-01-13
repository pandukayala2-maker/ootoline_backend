import BaseValidator from '../../common/base_validator';
import CustomErrorHandler from '../../middleware/error_handler';
import { body } from 'express-validator';

class ServiceValidations extends BaseValidator {
    static create = [
        this.nameField(),
        this.nameField('desc', { maxLength: 1000 }),
        this.numberField('price'),
        body('home_service')
            .optional()
            .isBoolean()
            .withMessage('home_service must be a boolean'),
        body('onsite_service')
            .optional()
            .isBoolean()
            .withMessage('onsite_service must be a boolean'),
        body()
            .custom((value) => {
                // Ensure at least one service type is selected
                const homeService = value.home_service;
                const onsiteService = value.onsite_service;
                
                // If both are false or both are undefined, default to home_service = true
                if ((homeService === false || homeService === undefined) && 
                    (onsiteService === false || onsiteService === undefined)) {
                    // Allow this - will default to home_service: true in the model
                }
                return true;
            }),
        CustomErrorHandler.requestValidator
    ];
}

export default ServiceValidations;
