import { Schema, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';

interface UserDocument extends BaseDocument {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    loyalty_points?: number;
}

const userSchema = new Schema<UserDocument>({
    email: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    phone: { type: String },
    loyalty_points: { type: Number, default: 0 }
});

userSchema.add(baseSchema);

const UserModel = model<UserDocument>('users', userSchema);

export { UserDocument, UserModel };
