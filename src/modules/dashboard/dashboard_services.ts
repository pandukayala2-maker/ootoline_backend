import { Types } from 'mongoose';
import { BookingModel } from '../booking/booking_model';
import { OrderModel } from '../order/order_model';
import { UserModel } from '../user/user_model';
import { VendorModel } from '../vendor/vendor_model';
import { CategoryModel } from '../category/category_model';

class DashboardServices {
    static totalOrderSales = async (vendor_id?: string) => {
        const orderMatch: any = { status: 'completed' };
        const bookingMatch: any = { status: 'completed' };

        if (vendor_id) {
            orderMatch.vendor_id = new Types.ObjectId(vendor_id);
            bookingMatch.vendor_id = new Types.ObjectId(vendor_id);
        }

        // Orders (Spare parts)
        const orderAgg = await OrderModel.aggregate([
            { $match: orderMatch },
            { $unwind: '$cart_items' },
            {
                $group: {
                    _id: null,
                    totalSparePartSales: { $sum: '$cart_items.price' }
                }
            }
        ]);

        // Bookings (Services)
        const bookingAgg = await BookingModel.aggregate([
            { $match: bookingMatch },
            {
                $group: {
                    _id: null,
                    totalServiceSales: { $sum: '$total_price' }
                }
            }
        ]);

        const totalSparePartSales = orderAgg[0]?.totalSparePartSales || 0;
        const totalServiceSales = bookingAgg[0]?.totalServiceSales || 0;

        return {
            totalSparePartSales,
            totalServiceSales,
            totalSales: totalSparePartSales + totalServiceSales
        };
    };

    static salesByYear = async (vendor_id?: string) => {
        const currentYear = new Date().getFullYear();

        const orderMatch: any = {
            status: 'completed',
            order_date: {
                $gte: new Date(`${currentYear}-01-01`),
                $lte: new Date(`${currentYear}-12-31`)
            }
        };

        const bookingMatch: any = {
            status: 'completed',
            booking_date: {
                $gte: new Date(`${currentYear}-01-01`),
                $lte: new Date(`${currentYear}-12-31`)
            }
        };

        if (vendor_id) {
            orderMatch.vendor_id = new Types.ObjectId(vendor_id);
            bookingMatch.vendor_id = new Types.ObjectId(vendor_id);
        }

        // Orders per month (Spare parts)
        const orderMonthly = await OrderModel.aggregate([
            { $match: orderMatch },
            { $unwind: '$cart_items' },
            {
                $project: {
                    month: { $month: '$order_date' },
                    price: '$cart_items.price'
                }
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: '$price' }
                }
            }
        ]);

        // Bookings per month (Services)
        const bookingMonthly = await BookingModel.aggregate([
            { $match: bookingMatch },
            {
                $project: {
                    month: { $month: '$booking_date' },
                    total_price: 1
                }
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: '$total_price' }
                }
            }
        ]);

        const months = Array.from({ length: 12 }, (_, i) => i + 1);

        const spareParts = months.map((m) => {
            const found = orderMonthly.find((item) => item._id === m);
            return { month: DashboardServices.getMonthName(m), total: found?.total || 0 };
        });

        const services = months.map((m) => {
            const found = bookingMonthly.find((item) => item._id === m);
            return { month: DashboardServices.getMonthName(m), total: found?.total || 0 };
        });

        return {
            spareParts,
            services
        };
    };

    static getMonthName = (month: number): string => {
        const date = new Date();
        date.setMonth(month - 1);
        return date.toLocaleString('default', { month: 'short' }); // Jan, Feb, etc.
    };

    static getCounts = async (vendor_id?: string) => {
        try {
            // For admin (no vendor_id), get total counts
            // For vendors, they only see their own data
            const totalVendors = vendor_id ? 0 : await VendorModel.countDocuments({ deleted_at: null });
            const totalUsers = vendor_id ? 0 : await UserModel.countDocuments({ deleted_at: null });
            const totalCategories = await CategoryModel.countDocuments({ deleted_at: null });
            const totalProducts = await (require('../product/product_model').ProductModel as any).countDocuments({ deleted_at: null });
            const totalServices = await (require('../service/service_model').ServiceModel as any).countDocuments({ deleted_at: null });
            const totalPending = vendor_id 
                ? 0 
                : (await (require('../order/order_model').OrderModel as any).countDocuments({ status: 'pending' })) +
                  (await (require('../booking/booking_model').BookingModel as any).countDocuments({ status: 'pending' }));

            return {
                total_vendors: totalVendors,
                total_users: totalUsers,
                total_categories: totalCategories,
                total_products: totalProducts,
                total_services: totalServices,
                total_pending: totalPending
            };
        } catch (error) {
            console.error('Error getting counts:', error);
            return {
                total_vendors: 0,
                total_users: 0,
                total_categories: 0,
                total_products: 0,
                total_services: 0,
                total_pending: 0
            };
        }
    };
}

export default DashboardServices;
