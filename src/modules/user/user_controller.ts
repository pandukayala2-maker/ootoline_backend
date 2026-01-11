import { NextFunction, Request, Response } from 'express';
import { baseResponse } from '../../middleware/response_handler';

import { NotFoundError, ServerIssueError } from '../../common/base_error';
import AuthService from '../auth/auth_services';
import { UserDocument } from './user_model';
import UserService from './user_services';

class UserController {
    static find = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        if (req.query.search) {
            const search = String(req.query.search).trim();
            query.$or = [
                { first_name: { $regex: new RegExp(search, 'i') } },
                { last_name: { $regex: new RegExp(search, 'i') } },
                { email: { $regex: new RegExp(search, 'i') } },
                { phone: { $regex: new RegExp(search, 'i') } }
            ];
        }
        if (req.query.name) query.type = req.query.name;
        if (req.query.type) query.type = req.query.type;
        const data: UserDocument[] = await UserService.find(query);
        return baseResponse({ res: res, data: data });
    };

    static findById = async (req: Request, res: Response, next: NextFunction) => {
        console.log(res.locals.id);
        const id: string = req.params.id ?? req.params.id ?? req.body.id ?? req.body._id ?? res.locals.id;
        const data: UserDocument | null = await UserService.findById(id);
        if (!data) throw new NotFoundError('User not found');
        const auth = await AuthService.findById(id);
        if (!auth) throw new NotFoundError('User not found');
        const combinedData = { ...auth.toJSON(), ...data.toJSON() };
        return baseResponse({ res: res, data: combinedData });
    };

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const userDoc: UserDocument = req.body;
        const id: string = req.params.id ?? req.body._id;
        const data = await UserService.update(userDoc, id);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating'));
    };
}

export default UserController;
