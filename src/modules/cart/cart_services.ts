import { ProductModel } from '../product/product_model';
import { CartDocument, CartItem, CartModel } from './cart_model';

class CartServices {
    // Helper: Enrich vendor in cart_items if missing
    private static async enrichCartItemsWithVendor(cartItems: CartItem[]): Promise<void> {
        await Promise.all(
            cartItems.map(async (item) => {
                if (!item.vendor) {
                    const product = await ProductModel.findById(item.product).select('vendor_id');
                    if (!product || !product.vendor_id) {
                        throw new Error(`Product or vendor not found for product ID: ${item.product}`);
                    }
                    item.vendor = product.vendor_id;
                }
            })
        );
    }

    static addCart = async (cart: CartDocument, userId: string) => {
        const existingCart = await CartModel.findById(userId);

        // Enrich vendor fields before any processing
        await this.enrichCartItemsWithVendor(cart.cart_items);

        if (!existingCart) {
            // Cast to avoid strict ObjectId typing issues; Mongoose will handle string ObjectId
            (cart as any)._id = userId;
            await CartModel.create(cart);
            return await this.findCart(userId);
        }

        for (const newItem of cart.cart_items) {
            const existingItem = existingCart.cart_items.find((item) => item.product.toString() === newItem.product.toString());

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                existingCart.cart_items.push(newItem);
            }
        }

        await existingCart.save();
        return await this.findCart(userId);
    };

    static removeCart = async (cart: CartDocument, userId: string) => {
        const existingCart = await CartModel.findById(userId);
        if (!existingCart) throw new Error('Cart not found');

        for (const itemToRemove of cart.cart_items) {
            const index = existingCart.cart_items.findIndex((item) => item.product.toString() === itemToRemove.product.toString());

            if (index !== -1) {
                const existingItem = existingCart.cart_items[index];

                if (itemToRemove.quantity) {
                    existingItem.quantity -= itemToRemove.quantity;

                    if (existingItem.quantity <= 0) {
                        existingCart.cart_items.splice(index, 1); // Remove item completely
                    }
                } else {
                    existingCart.cart_items.splice(index, 1); // Remove if no quantity specified
                }
            }
        }

        // Re-enrich vendors for any remaining items to avoid validation errors
        await this.enrichCartItemsWithVendor(existingCart.cart_items);

        await existingCart.save();
        return await this.findCart(userId);
    };

    static removeAllCart = async (userId: string) => {
        const existingCart = await CartModel.findById(userId);
        if (!existingCart) throw new Error('Cart not found');

        existingCart.cart_items = [];

        await existingCart.save();
        return await this.findCart(userId);
    };

    static findCart = async (userId: string) => {
        return await CartModel.findById(userId)
            .select('-fav_items')
            .populate({
                path: 'cart_items.product',
                select: 'name price image_list stock vendor_id discount',
                populate: {
                    path: 'vendor_id',
                    select: 'name email iban_number commission'
                }
            })
            .exec();
    };
}

export default CartServices;
