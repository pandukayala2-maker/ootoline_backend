import { NextFunction, Request, Response } from 'express';
import { ServerIssueError } from '../../common/base_error';
import { baseResponse } from '../../middleware/response_handler';
import { GovernateDocument } from './governates_model';
import GovernateServices from './governates_services';

class GovernateController {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        const governates: GovernateDocument = req.body;
        governates.vendor_id = res.locals.id;
        const data = await GovernateServices.create(governates);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError());
    };

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const governates: GovernateDocument = req.body;
        const id: string = req.params.id ?? req.body.id;
        governates.vendor_id = res.locals.id;
        const data = await GovernateServices.update(governates, id);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating'));
    };

    static find = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        if (req.query.name) query.name = RegExp(`^${req.query.name}`, 'i');
        if (req.query.type) query.type = req.query.type;
        const data: GovernateDocument[] = await GovernateServices.find(query);
        return baseResponse({ res: res, data: data });
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id ?? req.body.id;
        const data = await GovernateServices.delete(id);
        return data ? baseResponse({ res: res, message: 'Successfully Deleted' }) : next(new ServerIssueError('Error while deleting'));
    };
}

export default GovernateController;
