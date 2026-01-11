import { Schema, Types, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';

interface WishlistDocument extends BaseDocument {
    product: Types.ObjectId[];
    vendor: Types.ObjectId[];
    car: Types.ObjectId[];
    service: Types.ObjectId[];
}

const wishlistSchema = new Schema<WishlistDocument>({
    product: [{ type: Schema.Types.ObjectId, ref: 'products' }],
    vendor: [{ type: Schema.Types.ObjectId, ref: 'vendors' }],
    car: [{ type: Schema.Types.ObjectId, ref: 'cars' }],
    service: [{ type: Schema.Types.ObjectId, ref: 'services' }]
});

wishlistSchema.add(baseSchema);

const WishlistModel = model<WishlistDocument>('wishlists', wishlistSchema);

export { WishlistDocument, WishlistModel };
