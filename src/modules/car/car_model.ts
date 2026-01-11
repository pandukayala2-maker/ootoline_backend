import { Schema, Types, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';
import { PaintReworkEnum } from '../../constant/enum';

interface CarDocument extends BaseDocument {
    name: string;
    car_type: string;
    car_make: string;
    car_model: string;
    year: number;
    color: string;
    registration_number: string;
    km: number;
    engine_number: string;
    chassis_number: string;
    fuel_type: string;
    transmission_type: string;

    number_of_seats: number;
    interior_color: string;
    condition: string;
    paint_rework: PaintReworkEnum;
    payment_type: string;
    sold: boolean;

    image_list: string[];
    rc: string;
    insurance: string;
    pollution: string;
    seller_name: string;
    selling_price: number;
    postal_code: string;
    city: string;
    street: string;
    phone_number: string;
    country: string;

    user_id: Types.ObjectId;
}

const carSchema = new Schema<CarDocument>({
    name: { type: String, trim: true },
    car_type: { type: String },
    car_make: { type: String },
    car_model: { type: String },
    year: { type: Number },
    color: { type: String },
    registration_number: { type: String },
    km: { type: Number },
    engine_number: { type: String },
    chassis_number: { type: String },
    fuel_type: { type: String },
    transmission_type: { type: String },

    number_of_seats: { type: Number },
    interior_color: { type: String },
    condition: { type: String },
    paint_rework: { type: String, enum: Object.values(PaintReworkEnum) },
    payment_type: { type: String },
    sold: { type: Boolean },

    image_list: { type: [String] },
    rc: { type: String },
    insurance: { type: String },
    pollution: { type: String },
    seller_name: { type: String },
    selling_price: { type: Number },
    postal_code: { type: String },
    city: { type: String },
    street: { type: String },
    phone_number: { type: String },
    country: { type: String },
    user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true }
});

carSchema.add(baseSchema);

carSchema.set('toJSON', {
    versionKey: false,
    virtuals: true,
    // Use loose typings here to avoid TS incompatibilities with Mongoose internals
    transform: (doc: any, ret: any, options: any) => {
        const baseTransform = baseSchema.get('toJSON')?.transform as any;

        if (typeof baseTransform === 'function') {
            ret.user = ret.user_id;
            delete ret.user_id;
            return baseTransform(doc, ret, options);
        }
    }
});

const CarModel = model<CarDocument>('cars', carSchema);

export { CarDocument, CarModel };

// export { CarConditionType, CarDocument, CarModel, CarType, FuelType, PaymentType, TransmissionType };
