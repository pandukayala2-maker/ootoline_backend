import { Schema, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';

interface BrandDocument extends BaseDocument {
    name: string;
    other_name: string;

    image: string;
}

const brandSchema = new Schema<BrandDocument>({
    name: { type: String, trim: true, required: true },
    other_name: { type: String },
    image: { type: String, trim: true }
});

brandSchema.add(baseSchema);

const BrandModel = model<BrandDocument>('brand', brandSchema);

export { BrandDocument, BrandModel };
