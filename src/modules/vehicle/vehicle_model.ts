import { Schema, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';

interface VehicleMakeDocument extends BaseDocument {
    name: string;
}

const vehicleMakeSchema = new Schema<VehicleMakeDocument>({
    name: { type: String, trim: true, required: true, unique: true }
});

vehicleMakeSchema.add(baseSchema);

const VehicleMakeModel = model<VehicleMakeDocument>('vmake', vehicleMakeSchema);

export { VehicleMakeDocument, VehicleMakeModel };

interface VehicleModelDocument extends BaseDocument {
    name: string;
    make_id: Schema.Types.ObjectId;
}

const vehicleModelSchema = new Schema<VehicleModelDocument>({
    name: { type: String, trim: true, required: true },
    make_id: { type: Schema.Types.ObjectId, ref: 'vmake', required: true }
});

vehicleModelSchema.add(baseSchema);

const VehicleModelModel = model<VehicleModelDocument>('vmodel', vehicleModelSchema);

export { VehicleModelDocument, VehicleModelModel };
