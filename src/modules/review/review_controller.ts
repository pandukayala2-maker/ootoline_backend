import { NextFunction, Request, Response } from 'express';
import { NotFoundError, ServerIssueError } from '../../common/base_error';
import { baseResponse } from '../../middleware/response_handler';
import OrderServices from '../order/order_services';
import { ReviewDocument } from './review_model';
import ReviewServices from './review_services';

class ReviewController {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        const review: ReviewDocument = req.body;
        review.user_id = res.locals.id;
        const order = await OrderServices.findById(review.order_id.toString());
        if (!order || order?.user_id != review.user_id) if (!order) throw new NotFoundError('You Cant review this product');
        const data = await ReviewServices.create(review);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError());
    };

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const reviewDoc: ReviewDocument = req.body;
        const id: string = req.params.id ?? req.body._id;
        const data = await ReviewServices.update(reviewDoc, id);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating'));
    };

    static find = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        if (req.query.name) query.name = RegExp(`^${req.query.name}`, 'i');
        if (req.query.type) query.type = req.query.type;
        const data: ReviewDocument[] = await ReviewServices.find(query);
        return baseResponse({ res: res, data: data });
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id ?? req.body._id;
        const data = await ReviewServices.update({ deleted_at: new Date() }, id);
        return data ? baseResponse({ res: res, message: 'Successfully Deleted' }) : next(new ServerIssueError('Error while deleting'));
    };
}

export default ReviewController;
