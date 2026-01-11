import { logger } from '../../utils/logger';
import AuthService from '../auth/auth_services';
import { UserDocument, UserModel } from './user_model';

class UserService {
    static create = async (data: Partial<UserDocument>): Promise<UserDocument> => await UserModel.create(data);

    static update = async (data: Partial<UserDocument>, id: string) => await UserModel.findByIdAndUpdate(id, data, { new: true });

    static findOne = async (filter: any) => await UserModel.findOne(filter);

    static find = async (filter: any) => {
        const pipeLine = [
            ...AuthService.aggregateFind,
            {
                $match: filter
            }
        ];
        return await UserModel.aggregate(pipeLine);
    };

    static findById = async (id: string): Promise<UserDocument | null> => await UserModel.findById(id);

    static updateUserLoyaltyPoints = async (points: number, id: any): Promise<void> => {
        try {
            await UserModel.updateOne({ _id: id }, { $inc: { loyalty_points: points } });
        } catch (error) {
            logger.error('Error updating user loyalty points: ', error);
            throw error;
        }
    };

    static deletebyId = async (id: string) => UserModel.findByIdAndDelete(id);
}

export default UserService;
