import { Schema, Types, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';
import { VendorDocument } from '../vendor/vendor_model';

enum CategoryType {
    spare = 'spare',
    service = 'service'
}

interface CategoryDocument extends BaseDocument {
    name: string;
    other_name: string;
    image: string;
    alt_image: string;
    desc: string;
    type: CategoryType;
    vendor_id: Types.ObjectId | VendorDocument;
}

const CategorySchema = new Schema<CategoryDocument>({
    name: { type: String, trim: true, required: true },
    other_name: { type: String },
    image: { type: String },
    alt_image: { type: String },
    desc: { type: String, required: true },
    type: { type: String, enum: Object.values(CategoryType), required: true },
    vendor_id: { type: Schema.Types.ObjectId, ref: 'vendors' }
});

CategorySchema.add(baseSchema);

CategorySchema.index({ name: 1, deleted_at: 1 }, { unique: true });

const CategoryModel = model<CategoryDocument>('categories', CategorySchema);

export { CategoryDocument, CategoryModel };
