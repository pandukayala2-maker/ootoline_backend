import { FilterQuery } from 'mongoose';
import { ReviewDocument, ReviewModel } from './review_model';

class ReviewServices {
    static create = async (data: ReviewDocument): Promise<ReviewDocument> => await ReviewModel.create(data);

    static update = async (data: Partial<ReviewDocument>, id: string) => await ReviewModel.findByIdAndUpdate(id, data, { new: true });

    static find = async (filter: FilterQuery<ReviewDocument> = {}) => await ReviewModel.find(filter);

    static findById = async (id: string): Promise<ReviewDocument | null> => await ReviewModel.findById(id);

    static delete = async (id: string) => await ReviewModel.findByIdAndDelete(id);
}

export default ReviewServices;
