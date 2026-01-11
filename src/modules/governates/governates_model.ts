import { Schema, Types, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';

interface GovernateDocument extends BaseDocument {
    name: string;
    value: number;
    vendor_id: Types.ObjectId;
}
const governateSchema = new Schema({
    name: { type: String, unique: true, require: true },
    vendor_id: { type: String },
    value: { type: Number }
});

governateSchema.add(baseSchema);

const GovernateModel = model<GovernateDocument>('governates', governateSchema);

export { GovernateDocument, GovernateModel };
