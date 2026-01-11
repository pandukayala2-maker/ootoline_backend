import * as bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';
import { UserTypeEnum } from '../../constant/enum';
import { VendorModel } from '../vendor/vendor_model';

interface AuthDocument extends BaseDocument {
    email?: string;
    password?: string;
    fcm_token?: string;
    usertype: UserTypeEnum;
    otp?: string;
    otp_created_at?: Date;
    phone?: string;
    is_phone_verified: boolean;
    is_email_verified: boolean;
    last_login?: Date;
    firebase_uid?: string;

    // Instance methods
    comparePassword: (candidatePassword: string) => Promise<boolean>;
    updateLastLogin: () => Promise<void>;
}

const authSchema = new Schema<AuthDocument>({
    email: { type: String },
    password: { type: String },
    fcm_token: { type: String },
    usertype: { type: String, enum: Object.values(UserTypeEnum), default: UserTypeEnum.user },
    otp: { type: String },
    otp_created_at: { type: Date },
    phone: { type: String },
    firebase_uid: { type: String },
    is_email_verified: { type: Boolean, default: false },
    is_phone_verified: { type: Boolean, default: true },
    last_login: { type: Date }
});

authSchema.add(baseSchema);

// authSchema.index({ phone: 1 }, { unique: true, partialFilterExpression: { usertype: 'user' } });

authSchema.set('toJSON', {
    versionKey: false,
    transform: (doc, ret, options) => {
        const baseTransform = baseSchema.get('toJSON')?.transform;
        if (typeof baseTransform === 'function') {
            delete ret.password;
            return baseTransform(doc, ret, options);
        }
    }
});

authSchema.pre('save', async function (next) {
    if (this.usertype === 'user') {
        const existingUser = await AuthModel.findOne({ phone: this.phone, usertype: 'user' });
        if (existingUser && existingUser.id.toString() !== this.id.toString()) {
            return next(new Error('Phone number must be unique for user type "user".'));
        }
    }
    next();
});

authSchema.pre('save', function (next) {
    const data = this as AuthDocument;
    if (data.password == undefined) return next();
    if (!data.isModified('password')) return next();
    const saltRounds: number = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(data.password!, salt, (err, hash) => {
            if (err) return next(err);
            data.password = hash;
            next();
        });
    });
});

authSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password!);
};

authSchema.methods.updateLastLogin = async function (): Promise<void> {
    this.last_login = new Date();
    await this.save();
};

authSchema.post('findOneAndUpdate', async function (doc, next) {
    if (!(this.getOptions().context === 'vendorUpdate')) return next();
    await VendorModel.updateOne({ _id: doc._id }, { $set: { is_disabled: doc.is_disabled } });
});

const AuthModel = model<AuthDocument>('auths', authSchema);
export { AuthDocument, AuthModel };
