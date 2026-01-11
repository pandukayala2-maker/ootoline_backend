import { VehicleMakeDocument, VehicleMakeModel, VehicleModelDocument, VehicleModelModel } from './vehicle_model';

class VehicleServices {
    static createMake = async (data: VehicleMakeDocument) => await VehicleMakeModel.create(data);

    static updateMake = async (data: Partial<VehicleMakeDocument>, id: string) => await VehicleMakeModel.findByIdAndUpdate(id, data, { new: true });

    static findMake = async (filter: any): Promise<VehicleMakeDocument[]> => await VehicleMakeModel.find(filter);

    static findByIdMake = async (filter: string) => await VehicleMakeModel.findById(filter);

    static deleteMake = async (id: string) => await VehicleMakeModel.findByIdAndDelete(id);

    static createModel = async (data: VehicleModelDocument): Promise<VehicleModelDocument> => await VehicleModelModel.create(data);

    static updateModel = async (data: Partial<VehicleModelDocument>, id: string) =>
        await VehicleModelModel.findByIdAndUpdate(id, data, { new: true });

    static findModel = async (filter: any): Promise<VehicleModelDocument[]> => await VehicleModelModel.find(filter);

    static findByIdModel = async (filter: string) => await VehicleModelModel.findById(filter);

    static deleteModel = async (id: string) => await VehicleModelModel.findByIdAndDelete(id);
}

export default VehicleServices;
