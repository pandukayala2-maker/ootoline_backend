import { NextFunction, Request, Response } from 'express';
import { NotFoundError, ServerIssueError } from '../../common/base_error';
import { baseResponse } from '../../middleware/response_handler';
import { CarDocument } from './car_model';
import CarServices from './car_services';

class CarController {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        const car: CarDocument = req.body;
        car.user_id = res.locals.id;
        const data = await CarServices.create(car);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError());
    };

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const carDoc: CarDocument = req.body;
        const id: string = req.params.id ?? req.body._id;
        const data = await CarServices.update(carDoc, id);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating'));
    };

    static find = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        if (req.query.name) query.name = RegExp(`^${req.query.name}`, 'i');
        if (req.query.type) query.type = req.query.type;
        if (req.query.user_id) query.user_id = req.query.user_id;
        // console.log(query);
        // user_id: { $ne: res.locals.id }
        const data: CarDocument[] = await CarServices.find(query);
        return baseResponse({ res: res, data: data });
    };

    static findById = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id ?? req.body._id;
        const data: CarDocument | null = await CarServices.findById(id);
        if (!data) throw new NotFoundError('product not found');
        return baseResponse({ res: res, data: data });
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id ?? req.body._id;
        const data = await CarServices.update({ deleted_at: new Date() }, id);
        return data ? baseResponse({ res: res, message: 'Successfully Deleted' }) : next(new ServerIssueError('Error while deleting'));
    };
}

export default CarController;
