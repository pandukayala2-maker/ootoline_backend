import { Schema, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';

interface UadminDocument extends BaseDocument {
    name: string;
}

const adminSchema = new Schema<UadminDocument>({
    name: { type: String, trim: true, required: true }
});

adminSchema.add(baseSchema);

const UadminModel = model<UadminDocument>('admins', adminSchema);

export { UadminDocument, UadminModel };
