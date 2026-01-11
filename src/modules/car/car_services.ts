import { CarDocument, CarModel } from './car_model';

class CarServices {
    static create = async (data: CarDocument): Promise<CarDocument> => await CarModel.create(data);

    static update = async (data: Partial<CarDocument>, id: string) => await CarModel.findByIdAndUpdate(id, data, { new: true });

    static find = async (filter: any): Promise<CarDocument[]> =>
        await CarModel.find(filter)
            .select('car_type car_make car_model year seller_name selling_price image_list phone_number user_id')
            .populate({ path: 'user_id', select: 'first_name last_name phone _id' })
            .exec();

    static findById = async (filter: string) => await CarModel.findById(filter).populate('user_id').exec();

    static delete = async (id: string) => await CarModel.findByIdAndDelete(id);
}

export default CarServices;
