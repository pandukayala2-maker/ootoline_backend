import { Schema, Types, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';

interface GovernateDocument extends BaseDocument {
    name: string;
    value: number;
    vendor_id?: Types.ObjectId | string | null;
    is_disabled: boolean;
}
const governateSchema = new Schema({
    name: { type: String, require: true },
    vendor_id: { type: String },
    value: { type: Number },
    is_disabled: { type: Boolean, default: false },
});

governateSchema.add(baseSchema);


governateSchema.index({ name: 1, vendor_id: 1 }, { unique: true });

const GovernateModel = model<GovernateDocument>('governates', governateSchema);

export { GovernateDocument, GovernateModel };
