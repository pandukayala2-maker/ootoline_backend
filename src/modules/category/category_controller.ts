import { NextFunction, Request, Response } from 'express';
import { ServerIssueError } from '../../common/base_error';
import { baseResponse } from '../../middleware/response_handler';
import { CategoryDocument } from './category_model';
import ProfessionsServices from './category_services';

class CategoryController {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        const profession: CategoryDocument = req.body;
        const data = await ProfessionsServices.create(profession);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError());
    };

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const professionDoc: CategoryDocument = req.body;
        const id: string = req.params.id ?? req.body._id;
        const data = await ProfessionsServices.update(professionDoc, id);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating'));
    };

    static find = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        if (req.query.name) query.name = RegExp(`^${req.query.name}`, 'i');
        if (req.query.type) query.type = req.query.type;
        if (req.query.vendor_id) query.vendor_id = req.query.vendor_id;
        const data: CategoryDocument[] = await ProfessionsServices.find(query);
        return baseResponse({ res: res, data: data });
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id ?? req.body._id;
        const data = await ProfessionsServices.update({ deleted_at: new Date() }, id);
        return data ? baseResponse({ res: res, message: 'Successfully Deleted' }) : next(new ServerIssueError('Error while deleting'));
    };
}

export default CategoryController;
