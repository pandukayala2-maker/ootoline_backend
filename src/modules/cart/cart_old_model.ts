// import { Model, Schema, Types, model } from 'mongoose';
// import { BaseDocument, baseSchema } from '../../common/base_model';

// interface OrderItem {
//     pid: Types.ObjectId;
//     qty: number;
//     productName: string;
//     price: number;
// }

// interface CartDocument extends BaseDocument {
//     products: OrderItem[];
//     user_id: Types.ObjectId;
//     total: number;
// }

// const CartSchema = new Schema<CartDocument>({
//     user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
//     products: [
//         {
//             pid: { type: Schema.Types.ObjectId, ref: 'products' },
//             qty: { type: Number },
//             productName: { type: String },
//             price: { type: Number }
//         }
//     ],
//     total: { type: Number }
// });

// CartSchema.add(baseSchema);

// const CartModel: Model<CartDocument> = model<CartDocument>('carts', CartSchema);

// export { CartDocument, CartModel };
