import mongoose, { Schema, Types } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';

interface CartItem extends BaseDocument {
    quantity: number;
    product: Types.ObjectId;
    vendor: Types.ObjectId;
}

interface CartDocument extends BaseDocument {
    cart_items: CartItem[];
}
const cartItemSchema = new Schema<CartItem>({
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendor',
        required: true
    }
});

const cartSchema = new mongoose.Schema<CartDocument>({
    cart_items: [cartItemSchema]
});

cartSchema.add(baseSchema);

const CartModel = mongoose.model<CartDocument>('Cart', cartSchema);

export { CartDocument, CartItem, CartModel };
