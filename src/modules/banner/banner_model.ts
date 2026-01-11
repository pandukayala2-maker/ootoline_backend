import { Schema, Types, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';
import { ApprovalStatusEnum } from '../../constant/enum';

interface BannerDocument extends BaseDocument {
    name: string;
    image: string;
    from_date: Date;
    to_date: Date;
    vendor_id: Types.ObjectId;
    status: ApprovalStatusEnum;
}

const BannerSchema = new Schema<BannerDocument>({
    name: { type: String, trim: true, required: true },
    image: { type: String, required: true },
    from_date: { type: Date, required: true },
    to_date: { type: Date, required: true },
    status: { type: String, enum: Object.values(ApprovalStatusEnum), default: ApprovalStatusEnum.pending },
    vendor_id: { type: Schema.Types.ObjectId, ref: 'vendors' }
});

BannerSchema.add(baseSchema);

BannerSchema.index({ name: 1, deleted_at: 1 }, { unique: true });

const BannerModel = model<BannerDocument>('banners', BannerSchema);

export { BannerDocument, BannerModel };
