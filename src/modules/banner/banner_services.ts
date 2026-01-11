import { FilterQuery } from 'mongoose';
import { BannerDocument, BannerModel } from './banner_model';

class BannerServices {
    static create = async (data: BannerDocument): Promise<BannerDocument> => await BannerModel.create(data);

    static update = async (data: Partial<BannerDocument>, id: string) => await BannerModel.findByIdAndUpdate(id, data, { new: true });

    static find = async (filter: FilterQuery<BannerDocument> = {}) => await BannerModel.find(filter).sort({ created_at: -1 });

    static findById = async (id: string): Promise<BannerDocument | null> => await BannerModel.findById(id);

    static findByVendor = async (id: string) => await BannerModel.find({ vendor_id: id });

    static delete = async (id: string) => await BannerModel.findByIdAndDelete(id);
}

export default BannerServices;
