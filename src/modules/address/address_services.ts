import { AddressDocument, AddressModel } from './address_model';

class AddressServices {
    static create = async (data: AddressDocument): Promise<AddressDocument> => await AddressModel.create(data);

    static update = async (data: Partial<AddressDocument>, id: string) => await AddressModel.findByIdAndUpdate(id, data, { new: true });

    static find = async (id: string): Promise<AddressDocument[]> => {
        return await AddressModel.find({ user_id: id }).populate({ path: 'user_id' }).populate({ path: 'governate_id' }).exec();
    };

    static findById = async (id: string): Promise<AddressDocument | null> => {
        return await AddressModel.findById(id).populate({ path: 'user_id' }).populate({ path: 'governate_id' }).exec();
    };

    static delete = async (id: string) => await AddressModel.findByIdAndDelete(id);
}

export default AddressServices;
