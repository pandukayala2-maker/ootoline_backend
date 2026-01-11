import { Document, Schema } from 'mongoose';

const baseSchema = new Schema(
    {
        deleted_at: { type: Date },
        is_disabled: { type: Boolean, default: false }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

baseSchema.set('toJSON', {
    versionKey: false,
    transform: (_doc, ret, _options) => {
        const newObj: any = {
            id: ret._id,
            ...ret
        };
        delete newObj._id;
        delete newObj.__v;
        delete newObj.deleted_at;
        return newObj;
    }
});

baseSchema.pre('find', function (next) {
    this.where('deleted_at').exists(false);
    next();
});

interface BaseDocument extends Document {
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    is_disabled?: boolean;
}

export { BaseDocument, baseSchema };
