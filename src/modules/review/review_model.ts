import { Model, model, Schema, Types } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';

interface ReviewDocument extends BaseDocument {
    user_id: Types.ObjectId;
    product_id: Types.ObjectId;
    service_id: Types.ObjectId;
    order_id: Types.ObjectId;
    booking_id: Types.ObjectId;
    vendor_id: Types.ObjectId;
    rating: number;
    review: string;
}

const ReviewSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'users' },
    product_id: { type: Schema.Types.ObjectId, ref: 'products' },
    service_id: { type: Schema.Types.ObjectId, ref: 'services' },
    order_id: { type: Schema.Types.ObjectId, ref: 'orders' },
    booking_id: { type: Schema.Types.ObjectId, ref: 'bookings' },
    vendor_id: { type: Schema.Types.ObjectId, ref: 'vendors' },
    rating: { type: Number, min: 0, max: 5, default: 0, required: true },
    review: { type: String, required: true }
});

ReviewSchema.add(baseSchema);

const ReviewModel: Model<ReviewDocument> = model<ReviewDocument>('reviews', ReviewSchema);

export { ReviewDocument, ReviewModel };
