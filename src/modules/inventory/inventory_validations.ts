import BaseValidator from '../../common/base_validator';
import ErrorHandler from '../../middleware/error_handler';

class InventoryValidations extends BaseValidator {
    static create = [
        this.listField('inventory_items'),
        this.numberField('inventory_items.*.quantity'),
        this.mongoIdField('inventory_items.*.product_id'),
        this.nameField('desc', { maxLength: 500 }),
        ErrorHandler.requestValidator
    ];
}

export default InventoryValidations;
