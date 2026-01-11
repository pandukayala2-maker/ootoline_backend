import { Schema, Types, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';

interface InventoryItems extends BaseDocument {
    product_id: Types.ObjectId;
    quantity: number;
}

interface InventoryDocument extends BaseDocument {
    desc: string;
    inventory_items: InventoryItems[];
    vendor_id: Types.ObjectId;
}

const inventorItemSchema = new Schema<InventoryItems>({
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true
    }
});

const inventorySchema = new Schema<InventoryDocument>({
    inventory_items: [inventorItemSchema],
    desc: { type: String, trim: true, required: true },
    vendor_id: { type: Schema.Types.ObjectId, ref: 'vendors', required: true }
});

inventorySchema.add(baseSchema);

const InventoryModel = model<InventoryDocument>('inventories', inventorySchema);

export { InventoryDocument, InventoryModel };
