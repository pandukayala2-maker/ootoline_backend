import { NextFunction, Request, Response } from 'express';
import { ServerIssueError } from '../../common/base_error';
import { baseResponse } from '../../middleware/response_handler';
import { VehicleMakeDocument, VehicleModelDocument } from './vehicle_model';
import VehicleServices from './vehicle_services';

class VehicleController {
    static createMake = async (req: Request, res: Response, next: NextFunction) => {
        const vehMake: VehicleMakeDocument = req.body;
        const data = await VehicleServices.createMake(vehMake);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError());
    };

    static createModel = async (req: Request, res: Response, next: NextFunction) => {
        const modelData: VehicleModelDocument = req.body;
        const data = await VehicleServices.createModel(modelData);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError());
    };

    static updateMake = async (req: Request, res: Response, next: NextFunction) => {
        const makeDoc: Partial<VehicleMakeDocument> = req.body;
        const id: string = req.params.id ?? req.body._id;
        const data = await VehicleServices.updateMake(makeDoc, id);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating make'));
    };

    static updateModel = async (req: Request, res: Response, next: NextFunction) => {
        const modelDoc: Partial<VehicleModelDocument> = req.body;
        const id: string = req.params.id ?? req.body._id;
        const data = await VehicleServices.updateModel(modelDoc, id);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating model'));
    };

    static findMakes = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        if (req.query.name) query.name = RegExp(`^${req.query.name}`, 'i');
        const data: VehicleMakeDocument[] = await VehicleServices.findMake(query);
        return baseResponse({ res: res, data: data });
    };

    static findModels = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        if (req.query.name) query.name = RegExp(`^${req.query.name}`, 'i');
        if (req.query.make_id) query.make_id = req.query.make_id;
        const data: VehicleModelDocument[] = await VehicleServices.findModel(query);
        return baseResponse({ res: res, data: data });
    };

    static deleteMake = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id ?? req.body._id;
        const data = await VehicleServices.deleteMake(id);
        return data ? baseResponse({ res: res, message: 'Successfully Deleted Make' }) : next(new ServerIssueError('Error while deleting make'));
    };

    static deleteModel = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id ?? req.body._id;
        const data = await VehicleServices.deleteModel(id);
        return data ? baseResponse({ res: res, message: 'Successfully Deleted Model' }) : next(new ServerIssueError('Error while deleting model'));
    };
}

export default VehicleController;
