import { Request, Response } from 'express';
import { UserTypeEnum } from '../../constant/enum';
import { baseResponse } from '../../middleware/response_handler';
import DashboardServices from './dashboard_services';

class DashboardController {
    static find = async (req: Request, res: Response) => {
        let vendor_id = typeof req.query.vendor_id === 'string' ? req.query.vendor_id : undefined;
        if (res.locals.usertype === UserTypeEnum.vendor) {
            vendor_id = res.locals.id;
        }
        const sales = await DashboardServices.totalOrderSales(vendor_id);
        const monthlySales = await DashboardServices.salesByYear(vendor_id);
        const counts = await DashboardServices.getCounts(vendor_id);

        return baseResponse({ res, data: { ...sales, ...counts, monthlySales } });
    };
}

export default DashboardController;
