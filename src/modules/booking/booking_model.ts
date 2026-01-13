import { model, Schema, Types } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';
import { OrderStatusEnum } from '../../constant/enum';
import { AddOnDocument, addOnSchema } from '../service/service_model';
interface BookingDocument extends BaseDocument {
    booking_no: string;
    booking_date: Date;
    time_slot?: {
        startTime: Date;
        endTime: Date;
    };
    service_type?: string;
    address_id?: Types.ObjectId;
    governate_charge?: number;
    user_id: Types.ObjectId;
    vendor_id: Types.ObjectId;
    service_id: Types.ObjectId;
    add_on: AddOnDocument[];
    status: OrderStatusEnum;
    total_price: number;

    description: string;
    payment_id: string;
    result: string;
    post_date: string;
    tran_id: string;
    ref: string;
    track_id: string;
    auth: string;
    order_id: string;
    requested_order_id: string;
    refund_order_id: string;
    payment_type: string;
    invoice_id: string;
    transaction_date: string;
    receipt_id: string;
}

const bookingSchema = new Schema<BookingDocument>({
    booking_no: { type: String },
    booking_date: { type: Date },
    time_slot: {
        startTime: { type: Date },
        endTime: { type: Date }
    },
    service_type: { type: String, enum: ['home_service', 'onsite'], default: 'home_service' },
    address_id: { type: Schema.Types.ObjectId, ref: 'addresses' },
    governate_charge: { type: Number, default: 0 },
    user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    vendor_id: { type: Schema.Types.ObjectId, ref: 'vendors', required: true },
    service_id: { type: Schema.Types.ObjectId, ref: 'services' },
    add_on: { type: [addOnSchema] },
    status: { type: String, enum: Object.values(OrderStatusEnum), default: OrderStatusEnum.pending },
    total_price: { type: Number },

    description: { type: String },
    payment_id: { type: String },
    result: { type: String },
    post_date: { type: String },
    tran_id: { type: String },
    ref: { type: String },
    track_id: { type: String },
    auth: { type: String },
    order_id: { type: String },
    requested_order_id: { type: String },
    refund_order_id: { type: String },
    payment_type: { type: String },
    invoice_id: { type: String },
    transaction_date: { type: String },
    receipt_id: { type: String }
});

bookingSchema.add(baseSchema);

bookingSchema.set('toJSON', {
    versionKey: false,
    transform: (doc, ret, options) => {
        const baseTransform = baseSchema.get('toJSON')?.transform;

        if (typeof baseTransform === 'function') {
            ret.user = ret.user_id;
            ret.vendor = ret.vendor_id;
            ret.service = ret.service_id;
            delete ret.user_id;
            delete ret.vendor_id;
            delete ret.service_id;
            return baseTransform(doc, ret, options);
        }
    }
});

const BookingModel = model<BookingDocument>('bookings', bookingSchema);

export { BookingDocument, BookingModel };
