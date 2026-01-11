import { NextFunction, Request, Response } from 'express';
import { ServerIssueError } from '../../common/base_error';
import { baseResponse } from '../../middleware/response_handler';
import { WishlistDocument, WishlistModel } from './wishlist_model';
import WishlistServices from './wishlist_services';

class WishlistController {
    static addFav = async (req: Request, res: Response, next: NextFunction) => {
        const cart: WishlistDocument = req.body;
        const id: string = res.locals.id;
        const data = await WishlistServices.addFav(cart, id);
        if (!data) throw new ServerIssueError('server issue');
        return baseResponse({ res: res, data: data, message: 'Created Updated' });
    };

    static findFav = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = res.locals.id;
        const data: WishlistDocument | null = await WishlistServices.findFav(id);
        return baseResponse({ res: res, data: data });
    };
}

export default WishlistController;
