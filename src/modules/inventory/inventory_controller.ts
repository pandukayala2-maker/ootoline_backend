import { NextFunction, Request, Response } from 'express';
import { ServerIssueError } from '../../common/base_error';
import { baseResponse } from '../../middleware/response_handler';
import ProductServices from '../product/product_services';
import { InventoryDocument } from './inventory_model';
import InventoryServices from './inventory_services';
import { UserTypeEnum } from '../../constant/enum';

class InventoryController {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        let data: InventoryDocument | undefined;
        try {
            const doc: InventoryDocument = req.body;
            doc.vendor_id = res.locals.id;
            data = await InventoryServices.create(doc);
            if (!data) throw new ServerIssueError();
            for (const items of doc.inventory_items) {
                const id = items.product_id.toString();
                const qty = items.quantity;
                const productData = await ProductServices.updateStock(id, qty);
                if (!productData) throw new ServerIssueError();
            }
            return baseResponse({ res: res, data: data });
        } catch (error) {
            if (data) await InventoryServices.delete(data.id);
            next(new ServerIssueError());
        }
    };

    static update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const docDoc: InventoryDocument = req.body;
            const id: string = req.params.id ?? req.body._id;
            
            // Get existing inventory to handle additive quantity updates
            const existingInventory = await InventoryServices.findById(id);
            if (!existingInventory) {
                return next(new ServerIssueError('Inventory not found'));
            }

            // Process inventory items - handle additive quantity updates
            if (docDoc.inventory_items && Array.isArray(docDoc.inventory_items)) {
                docDoc.inventory_items = docDoc.inventory_items.map((newItem: any) => {
                    // Find existing item with same product_id
                    const existingItem = existingInventory.inventory_items.find(
                        (item: any) => item.product_id.toString() === newItem.product_id.toString()
                    );

                    if (existingItem) {
                        // For existing items, add to previous quantity (additive update)
                        return {
                            ...newItem,
                            quantity: (existingItem.quantity || 0) + (newItem.quantity || 0),
                            sold_quantity: newItem.sold_quantity ?? existingItem.sold_quantity ?? 0,
                        };
                    } else {
                        // For new items, use provided quantity as-is
                        return {
                            ...newItem,
                            sold_quantity: newItem.sold_quantity ?? 0,
                        };
                    }
                });
            }

            const data = await InventoryServices.update(docDoc, id);
            return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating'));
        } catch (error) {
            next(new ServerIssueError());
        }
    };

    static find = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        if (req.query.desc) query.desc = RegExp(`^${req.query.desc}`, 'i');
        if (req.query.type) query.type = req.query.type;
        query.vendor_id = res.locals.id;
        const data: InventoryDocument[] = await InventoryServices.find(query);
        return baseResponse({ res: res, data: data });
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id ?? req.body._id;
        const data = await InventoryServices.update({ deleted_at: new Date() }, id);
        return data ? baseResponse({ res: res, message: 'Successfully Deleted' }) : next(new ServerIssueError('Error while deleting'));
    };
}

export default InventoryController;
