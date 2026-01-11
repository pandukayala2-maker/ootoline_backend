import { BrandDocument, BrandModel } from './brand_model';

class BrandServices {
    static create = async (data: BrandDocument): Promise<BrandDocument> => await BrandModel.create(data);

    static update = async (data: Partial<BrandDocument>, id: string) => await BrandModel.findByIdAndUpdate(id, data, { new: true });

    static find = async (filter: any): Promise<BrandDocument[]> => await BrandModel.find(filter);

    static findById = async (filter: string) => await BrandModel.findById(filter);

    static delete = async (id: string) => await BrandModel.findByIdAndDelete(id);
}

export default BrandServices;
