import { Schema, Types, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';

interface ProductDocument extends BaseDocument {
    id: string;
    name: string;
    other_name: string;
    desc: string;
    other_desc: string;

    origin: string;
    port_number: string;

    price: number;
    discount: number;
    rating: number;
    stock: number;

    coming_soon: boolean;
    specification: Record<string, string>;

    image_list?: string[];

    vendor_id: Types.ObjectId;
    category_id?: Types.ObjectId[];
    brand_id?: Types.ObjectId[];
    variants: Types.ObjectId[];
}

const ProductSchema = new Schema<ProductDocument>({
    name: { type: String, required: true },
    other_name: { type: String },
    desc: { type: String, required: true },
    other_desc: { type: String },
    origin: { type: String, required: true },
    port_number: { type: String, required: true },

    price: { type: Number, required: true },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    rating: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },

    coming_soon: { type: Boolean, default: false },
    specification: { type: Map, of: String, default: {} },

    image_list: { type: [String], required: true },

    vendor_id: { type: Schema.Types.ObjectId, ref: 'vendors', required: true },
    category_id: [{ type: Schema.Types.ObjectId, ref: 'categories' }],
    brand_id: [{ type: Schema.Types.ObjectId, ref: 'brand' }],
    variants: [{ type: Schema.Types.ObjectId, ref: 'variants' }]
});

ProductSchema.set('toJSON', {
    versionKey: false,
    virtuals: true,
    transform: (doc, ret, options) => {
        const baseTransform = baseSchema.get('toJSON')?.transform;

        if (typeof baseTransform === 'function') {
            if (ret.discount > 0) {
                ret.price = ret.selling_price;
            }
            delete ret.selling_price;
            ret.category = ret.category_id;
            ret.brand = ret.brand_id;
            ret.vendor = ret.vendor_id;
            delete ret.vendor_id;
            delete ret.category_id;
            delete ret.brand_id;
            return baseTransform(doc, ret, options);
        }
    }
});

ProductSchema.virtual('selling_price').get(function () {
    const discount = this.discount >= 1 && this.discount <= 100 ? this.discount : 0;
    return Math.round((this.price - (this.price * discount) / 100) * 100) / 100;
});

ProductSchema.virtual('sold_price').get(function () {
    return this.price;
});

ProductSchema.pre('save', async function (next) {
    for (const variantId of this.variants) {
        console.log(variantId);
        await ProductModel.updateOne({ _id: variantId }, { $addToSet: { variants: this._id } });
    }
    next();
});

ProductSchema.post('findOneAndUpdate', async function (result) {
    if (result) {
        const updatedProduct = await ProductModel.findById(result._id);
        if (updatedProduct) {
            for (const variantId of updatedProduct.variants) {
                await ProductModel.updateOne({ _id: variantId }, { $addToSet: { variants: updatedProduct._id } });
            }
        }
    }
});

ProductSchema.add(baseSchema);

const ProductModel = model<ProductDocument>('products', ProductSchema);

export { ProductDocument, ProductModel };
