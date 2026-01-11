import { NextFunction, Request, Response } from 'express';
import { ServerIssueError } from '../../common/base_error';
import { baseResponse } from '../../middleware/response_handler';
import { BrandDocument } from './brand_model';
import BrandServices from './brand_services';

class BrandController {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        const Brand: BrandDocument = req.body;
        const data = await BrandServices.create(Brand);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError());
    };

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const BrandDoc: BrandDocument = req.body;
        const id: string = req.params.id ?? req.body._id;
        const data = await BrandServices.update(BrandDoc, id);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating'));
    };

    static find = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        if (req.query.name) query.name = RegExp(`^${req.query.name}`, 'i');
        if (req.query.type) query.type = req.query.type;
        const data: BrandDocument[] = await BrandServices.find(query);
        return baseResponse({ res: res, data: data });
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id ?? req.body._id;
        const data = await BrandServices.update({ deleted_at: new Date() }, id);
        return data ? baseResponse({ res: res, message: 'Successfully Deleted' }) : next(new ServerIssueError('Error while deleting'));
    };
}

export default BrandController;
