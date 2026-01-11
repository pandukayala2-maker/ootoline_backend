import { NextFunction, Request, Response } from 'express';

import { BadRequestError, ServerIssueError } from '../../common/base_error';
import { baseResponse } from '../../middleware/response_handler';
import { CartDocument, CartModel } from './cart_model';
import CartServices from './cart_services';

class CartController {
    static addToCart = async (req: Request, res: Response) => {
        const cart = req.body;
        const id: string = res.locals.id;
        const data = await CartServices.addCart(cart, id);
        if (!data) throw new ServerIssueError('server issue');
        return baseResponse({ res: res, data: data, message: 'Created Susccessfully' });
    };

    static removeFromCart = async (req: Request, res: Response) => {
        const { id } = res.locals;
        const { removeall } = req.query;
        const cart = req.body;

        const document = await CartModel.findById(id);
        if (!document) throw new BadRequestError('Cart not found');
        let data;
        if (removeall) {
            data = await CartServices.removeAllCart(id);
        } else {
            data = await CartServices.removeCart(cart, id);
        }

        if (!data) throw new ServerIssueError('Server issue');
        return baseResponse({ res, data, message: 'Removed Successfully' });
    };

    static findCart = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = res.locals.id;
        const data: CartDocument | null = await CartServices.findCart(id);
        if (data) return baseResponse({ res: res, data: data });
        return baseResponse({ res: res, data: {} });
    };
}

export default CartController;
