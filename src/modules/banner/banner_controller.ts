import { NextFunction, Request, Response } from 'express';
import { ServerIssueError } from '../../common/base_error';
import { ApprovalStatusEnum, UserTypeEnum } from '../../constant/enum';
import { baseResponse } from '../../middleware/response_handler';
import { BannerDocument } from './banner_model';
import BannersServices from './banner_services';

class BannerController {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        const banner: BannerDocument = req.body;
        banner.vendor_id = res.locals.id;
        const data = await BannersServices.create(banner);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError());
    };

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const bannerDoc: BannerDocument = req.body;
        const id: string = req.params.id ?? req.body._id;
        const data = await BannersServices.update(bannerDoc, id);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating'));
    };

    static find = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        if (req.query.name) query.name = RegExp(`^${req.query.name}`, 'i');
        if (req.query.status) query.status = req.query.status;
        const fromDate = req.query.from_date ? new Date(req.query.from_date as string) : null;
        const toDate = req.query.to_date ? new Date(req.query.to_date as string) : null;
        if (fromDate && toDate) {
            query.from_date = { $gte: fromDate, $lte: toDate };
        } else if (fromDate) {
            query.from_date = { $gte: fromDate };
        } else if (toDate) {
            query.from_date = { $lte: toDate };
        }
        const currentUserType = res.locals.usertype;
        const currentUserId = res.locals.id;
        if (currentUserType === UserTypeEnum.user) {
            const currentDate = new Date();
            query.status = ApprovalStatusEnum.accepted;
            query.from_date = { $lte: currentDate };
        }
        if (currentUserType === UserTypeEnum.vendor) query.vendor_id = currentUserId;
        const data: BannerDocument[] = await BannersServices.find(query);
        return baseResponse({ res: res, data });
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id ?? req.body._id;
        const data = await BannersServices.delete(id);
        return data ? baseResponse({ res: res, message: 'Successfully Deleted' }) : next(new ServerIssueError('Error while deleting'));
    };
}

export default BannerController;
