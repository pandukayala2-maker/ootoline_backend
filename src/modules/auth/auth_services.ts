import { AuthDocument, AuthModel } from './auth_model';

class AuthService {
    static create = async (data: Partial<AuthDocument>): Promise<AuthDocument> => AuthModel.create(data);

    static update = async (data: Partial<AuthDocument>, id: string) => AuthModel.findByIdAndUpdate(id, data, { new: true, context: 'vendorUpdate' });

    static find = async (filter?: any) => AuthModel.find(filter);

    static findById = async (id: string) => AuthModel.findById(id);

    static findOne = async (filter: any) => AuthModel.findOne(filter);

    static deletebyId = async (id: string) => AuthModel.findByIdAndDelete(id);

    static aggregateFind = [
        {
            $lookup: {
                from: 'auths',
                localField: '_id',
                foreignField: '_id',
                as: 'authData'
            }
        },
        {
            $unwind: '$authData'
        },
        {
            $match: {
                'authData.deleted_at': { $eq: null },
                'authData.is_disabled': false
            }
        },
        {
            $project: {
                id: '$_id',
                _id: 0,
                first_name: 1,
                last_name: 1,
                email: 1,
                phone: 1,
                loyalty_points: 1,
                image: 1
            }
        }
    ];
}

export default AuthService;
