import axios from 'axios';
import moment from 'moment';
import { FilterQuery } from 'mongoose';
import { ServerIssueError } from '../../common/base_error';
import Config from '../../config/dot_config';
import { EnvEnum, PaymentChargeType } from '../../constant/enum';
import { UPaymentMerchant, UPaymentRequest, UPaymentService } from '../order/upayement_model';
import ServiceServices from '../service/service_services';
import { UserDocument } from '../user/user_model';
import VendorService from '../vendor/vendor_services';
import { BookingDocument, BookingModel } from './booking_model';

//   booking_no: string;
//     booking_date: Date;
//     user_id: Types.ObjectId;
//     vendor_id: Types.ObjectId;
//     service_id: Types.ObjectId;
//     add_on: AddOnDocument[];
//     status: OrderStatusEnum;
//     total_price: number;

class BookingServices {
    static create = async (data: BookingDocument): Promise<BookingDocument> => await BookingModel.create(data);

    static update = async (id: string, data: Partial<BookingDocument>): Promise<BookingDocument | null> => {
        return await BookingModel.findByIdAndUpdate(id, data, { new: true });
    };

    static find = async (query: FilterQuery<BookingDocument> = {}) => {
        const pipeline: any[] = [];

        if (query && Object.keys(query).length > 0) {
            pipeline.push({ $match: query });
        }

        pipeline.push({
            $lookup: {
                from: 'services',
                localField: 'service_id',
                foreignField: '_id',
                as: 'serviceDetails'
            }
        });

        pipeline.push({
            $addFields: {
                first_image: {
                    $arrayElemAt: [{ $arrayElemAt: ['$serviceDetails.image_list', 0] }, 0]
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
                    statusPriority: {
                        $cond: { if: { $eq: ['$status', 'pending'] }, then: 0, else: 1 }
                    }
                }
            },
            { $sort: { statusPriority: 1, booking_date: 1 } }
        );

        pipeline.push({
            $project: {
                id: '$_id',
                _id: 0,
                booking_no: 1,
                booking_date: 1,
                status: 1,
                total_price: 1,
                created_at: 1,
                image: '$first_image',
                service: { $arrayElemAt: ['$serviceDetails', 0] },
                ...(query.vendor_id ? { user: { $arrayElemAt: ['$userDetails', 0] } } : {})
            }
        });

        // Sort latest first
        pipeline.push({ $sort: { created_at: -1 } });

        console.log(JSON.stringify(pipeline, null, 2));
        return await BookingModel.aggregate(pipeline);
    };

    static findById = async (id: string) =>
        await BookingModel.findById(id)
            .populate({ path: 'user_id', select: 'firstname lastname phone email' })
            .populate({ path: 'vendor_id', select: 'company_name phone' })
            .populate({ path: 'service_id', select: 'name' })
            .sort({ createdAt: -1 })
            .exec();

    static delete = async (id: string) => await BookingModel.findByIdAndDelete(id);

    static findOneAndDelete = async (query: any) => await BookingModel.findOneAndDelete(query);

    static findOneAndUpdate = async (query: any, updateData: any = {}) => {
        return await BookingModel.findOneAndUpdate(query, updateData, { new: true });
    };

    static createBookingNumber = async (): Promise<string> => {
        const currentYear = moment().format('YYYY');
        const currentMonth = moment().format('MM');

        const orderCollectionSize = await BookingModel.countDocuments();
        const orderNumber = `#AOB-${currentYear}${currentMonth}${orderCollectionSize + 1}`;
        return orderNumber;
    };

    static makePayment = async (orderData: BookingDocument, user: UserDocument) => {
        try {
            const vendorID = orderData.vendor_id;
            const vendor = await VendorService.findById(vendorID.toString());
            console.log(vendor);
            if (!vendor || !vendor.iban_number) throw new ServerIssueError('Vendor Not Found');
            console.log('here');
            console.log(orderData);

            const service = await ServiceServices.findById(orderData.service_id.toString());
            const products: UPaymentService = {
                name: service?.name ?? 'service',
                price: service?.price ?? 0,
                date: orderData.booking_date,
                description: 'service booking',
                quantity: 1
            };
            const extraMerchantData: UPaymentMerchant = {
                amount: orderData.total_price,
                knetCharge: vendor.commission ?? 70,
                knetChargeType: PaymentChargeType.percentage,
                ccCharge: vendor.commission ?? 70,
                ccChargeType: PaymentChargeType.percentage,
                ibanNumber: vendor.iban_number
            };

            console.log(extraMerchantData);

            let url: string = 'https://uapi.upayments.com/api/v1/charge';
            let successEndpoint = 'http://192.168.1.98:4321/v1/order/success';
            let failedEndpoint = 'http://192.168.1.98:4321/v1/order/failed';
            let bearerToken = Config._UPAYMENT_API_KEY;

            if (Config._APP_ENV === EnvEnum.production) {
                url = 'https://uapi.upayments.com/api/v1/charge';
                successEndpoint = 'http://hm.api.ansoftt.com:5432/v1/order/success';
                failedEndpoint = 'http://hm.api.ansoftt.com:5432/v1/order/failed';
                bearerToken = Config._UPAYMENT_API_KEY;
            }

            const paymentRequest: Partial<UPaymentRequest> = {
                products: [products],
                order: {
                    id: orderData.id,
                    reference: orderData.booking_no.replaceAll('#', ''),
                    description: 'ootoline',
                    currency: 'KWD',
                    amount: orderData.total_price
                },
                language: 'en',
                reference: { id: orderData.id },
                customer: {
                    uniqueId: orderData.user_id.toString(),
                    name: user.first_name ?? 'george',
                    email: user.email ?? 'gjamesgeorge98@gmail.com',
                    mobile: user.phone ?? '9769870487'
                },
                // extraMerchantData: [extraMerchantData],
                returnUrl: successEndpoint,
                cancelUrl: failedEndpoint,
                notificationUrl: 'https://webhook.site/d7c6e1c8-b98b-4f77-8b51-b487540df336',
                customerExtraData: JSON.stringify({
                    order_id: orderData.id,
                    order_no: orderData.booking_no.replaceAll('#', ''),
                    user_id: orderData.user_id.toString()
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
}

export default BookingServices;
