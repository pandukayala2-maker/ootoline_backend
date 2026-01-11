import { InventoryDocument, InventoryModel } from './inventory_model';

class InventoryServices {
    static create = async (data: InventoryDocument): Promise<InventoryDocument> => await InventoryModel.create(data);

    static update = async (data: Partial<InventoryDocument>, id: string) => await InventoryModel.findByIdAndUpdate(id, data, { new: true });

    static find = async (filter: any): Promise<InventoryDocument[]> => await InventoryModel.find(filter);

    static findById = async (filter: string) => await InventoryModel.findById(filter);

    static delete = async (id: string) => await InventoryModel.findByIdAndDelete(id);
}

export default InventoryServices;
