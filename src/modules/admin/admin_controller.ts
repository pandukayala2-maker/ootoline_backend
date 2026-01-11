import { NextFunction, Request, Response } from 'express';
import { ServerIssueError } from '../../common/base_error';
import MediaHandler from '../../middleware/media_handler';
import { baseResponse } from '../../middleware/response_handler';
import { UadminDocument } from './admin_model';
import UadminServices from './admin_services';

class UadminController {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        const category: UadminDocument = req.body;
        const data = await UadminServices.create(category);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError());
    };

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const categoryDoc: UadminDocument = req.body;
        const id: string = req.params.id ?? req.body._id;
        const data = await UadminServices.update(categoryDoc, id);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating'));
    };

    static find = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        if (req.query.name) query.name = RegExp(`^${req.query.name}`, 'i');
        if (req.query.type) query.type = req.query.type;
        const data: UadminDocument[] = await UadminServices.find(query);
        return baseResponse({ res: res, data: data });
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id ?? req.body._id;
        const data = await UadminServices.update({ deleted_at: new Date() }, id);
        return data ? baseResponse({ res: res, message: 'Successfully Deleted' }) : next(new ServerIssueError('Error while deleting'));
    };
}

export default UadminController;
