import axios from 'axios';
import moment from 'moment';
import { FilterQuery } from 'mongoose';
import { ServerIssueError } from '../../common/base_error';
import Config from '../../config/dot_config';
import { EnvEnum, PaymentChargeType } from '../../constant/enum';
import { VendorDocument } from '../vendor/vendor_model';
import { OrderDocument, OrderModel } from './order_model';
import { UPaymentMerchant, UPaymentProduct, UPaymentRequest } from './upayement_model';

class OrderServices {
    static create = async (data: OrderDocument): Promise<OrderDocument> => await OrderModel.create(data);

    static find = async (query: FilterQuery<OrderDocument> = {}) => {
        const pipeline: any[] = [];

        if (query && Object.keys(query).length > 0) pipeline.push({ $match: query });

        pipeline.push({
            $lookup: {
                from: 'products',
                localField: 'cart_items.product',
                foreignField: '_id',
                as: 'productDetails'
            }
        });

        pipeline.push({
            $addFields: {
                first_images: {
                    $map: {
                        input: '$productDetails',
                        as: 'product',
                        in: { $arrayElemAt: ['$$product.image_list', 0] }
                    }
                }
            }
        });

        if (query.vendor_id) {
            pipeline.push({
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            });

            pipeline.push({
                $addFields: {
                    user: {
                        $map: {
                            input: '$userDetails',
                            as: 'user',
                            in: {
                                email: '$$user.email',
                                phone: '$$user.phone',
                                firstname: '$$user.firstname'
                            }
                        }
                    }
                }
            });
        }

        pipeline.push(
            {
                $addFields: {
                    statusPriority: { $cond: { if: { $eq: ['$status', 'pending'] }, then: 0, else: 1 } }
                }
            },
            { $sort: { statusPriority: 1, order_date: 1 } }
        );

        pipeline.push({
            $project: {
                id: '$_id',
                _id: 0,
                order_no: 1,
                order_date: 1,
                status: 1,
                total_price: 1,
                created_at: 1,
                image_list: '$first_images',
                ...(query.vendor_id ? { user: { $arrayElemAt: ['$userDetails', 0] } } : {})
            }
        });

        pipeline.push({ $sort: { created_at: -1 } });

        console.log(pipeline);
        // Execute aggregation
        return await OrderModel.aggregate(pipeline);
    };

    static findOneAndDelete = async (query: any) => await OrderModel.findOneAndDelete(query);

    static findOneAndUpdate = async (query: any) => await OrderModel.findOneAndUpdate(query);

    static findById = async (id: string) =>
        await OrderModel.findById(id)
            .populate('user_id')
            .populate('vendor_id')
            .populate('cart_items.product', 'name price image_list stock')
            .sort({ createdAt: -1 })
            .exec();

    static update = async (id: string, data: Partial<OrderDocument>): Promise<OrderDocument | null> => {
        return await OrderModel.findByIdAndUpdate(id, data, { new: true });
    };

    static createOrderNumber = async (): Promise<string> => {
        const currentYear = moment().format('YYYY');
        const currentMonth = moment().format('MM');

        const orderCollectionSize = await OrderModel.countDocuments();
        const orderNumber = `#AOO-${currentYear}${currentMonth}${orderCollectionSize + 1}`;
        return orderNumber;
    };

    static addTracker = async (status: string, id: string) => {
        const existingOrder = await OrderModel.findById(id).exec();
        if (!existingOrder) throw new Error('Order not found');
        const newTrackerItem: any = {
            status: status,
            datetime: new Date()
        };
        existingOrder.order_tracker.push(newTrackerItem);
        await existingOrder.save();
        return await this.findById(id);
    };

    static removeTracker = async (trackerId: string, orderId: string) => {
        const existingOrder = await OrderModel.findById(orderId).exec();
        if (!existingOrder) throw new Error('Order not found');
        existingOrder.order_tracker = existingOrder.order_tracker.filter((item) => item.id.toString() !== trackerId);
        await existingOrder.save();
        return await this.findById(orderId);
    };

    static makePayment = async (orderData: OrderDocument, email: string) => {
        try {
            const vendor = orderData.vendor_id as unknown as VendorDocument;
            if (!vendor || !vendor.iban_number) throw new ServerIssueError('Vendor Not Found');
            const products: UPaymentProduct[] = orderData.cart_items.map((item) => ({
                name: item.productName,
                price: item.price,
                quantity: item.qty,
                description: 'autoline1'
            }));
            const extraMerchantData: UPaymentMerchant = {
                amount: orderData.total_price,
                knetCharge: vendor.commission ?? 70,
                knetChargeType: PaymentChargeType.percentage,
                ccCharge: vendor.commission ?? 70,
                ccChargeType: PaymentChargeType.percentage,
                ibanNumber: vendor.iban_number
            };

            console.log(extraMerchantData);

            let url: string = 'https://sandboxapi.upayments.com/api/v1/charge';
            let successEndpoint = 'http://192.168.1.98:4321/v1/order/success';
            let failedEndpoint = 'http://192.168.1.98:4321/v1/order/failed';
            let bearerToken = Config._UPAYMENT_DEV_API_KEY;

            if (Config._APP_ENV === EnvEnum.production) {
                url = 'https://uapi.upayments.com/api/v1/charge';
                successEndpoint = 'http://hm.api.ansoftt.com:5432/v1/order/success';
                failedEndpoint = 'http://hm.api.ansoftt.com:5432/v1/order/failed';
                bearerToken = Config._UPAYMENT_API_KEY;
            }

            console.log(url);
            console.log(bearerToken);

            const paymentRequest: Partial<UPaymentRequest> = {
                products: products,
                order: {
                    id: orderData.id,
                    reference: orderData.order_no.replaceAll('#', ''),
                    description: 'autoline',
                    currency: 'KWD',
                    amount: orderData.total_price
                },
                language: 'en',
                reference: { id: orderData.id },
                customer: {
                    uniqueId: orderData.user_id.toString(),
                    name: orderData.address.name,
                    email: email,
                    mobile: orderData.address.phone
                },
                // extraMerchantData: [extraMerchantData],
                returnUrl: successEndpoint,
                cancelUrl: failedEndpoint,
                notificationUrl: 'https://webhook.site/d7c6e1c8-b98b-4f77-8b51-b487540df336',
                customerExtraData: JSON.stringify({
                    order_id: orderData.id,
                    order_no: orderData.order_no.replaceAll('#', ''),
                    user_id: orderData.user_id.toString(),
                    vendor_id: vendor.id
                })
            };
            console.log(paymentRequest);
            const data = JSON.stringify(paymentRequest);
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            const newError: any = error;
            console.log(error);
            console.log(newError.response.data);
            const message: string = newError?.response?.data?.message || '';
            if (message.toLowerCase().includes('ibanNumber')) {
                throw new ServerIssueError('Invalid IBAN number');
            }
            throw error;
        }
    };

    static delete = async (id: string) => await OrderModel.findByIdAndDelete(id);
}

export default OrderServices;
