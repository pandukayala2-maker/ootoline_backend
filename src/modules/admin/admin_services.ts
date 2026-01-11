import { UadminDocument, UadminModel } from './admin_model';

class UadminServices {
    static create = async (data: UadminDocument): Promise<UadminDocument> => await UadminModel.create(data);

    static update = async (data: Partial<UadminDocument>, id: string) => await UadminModel.findByIdAndUpdate(id, data, { new: true });

    static find = async (filter: any): Promise<UadminDocument[]> => await UadminModel.find(filter);

    static findById = async (filter: string) => await UadminModel.findById(filter);

    static delete = async (id: string) => await UadminModel.findByIdAndDelete(id);
}

export default UadminServices;
