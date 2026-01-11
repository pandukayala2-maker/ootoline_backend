import { brandLookUp, calculateRating, categoryLookup, matchId, reviewsLookup, vendorLookUp } from '../../common/base_query';
import { ProductDocument, ProductModel } from './product_model';

class ProductServices {
    static create = async (data: ProductDocument): Promise<ProductDocument> => await ProductModel.create(data);

    static find = async (filter: any, categorize: boolean = false, stock?: string | undefined): Promise<ProductDocument[]> => {
        const query = ProductModel.find(filter)
            .populate({ path: 'brand_id', select: '_id name' })
            .populate({ path: 'vendor_id', select: '_id company_name' })
            .select('id name rating price image_list discount stock vendor_id other_name');
        if (categorize) query.populate({ path: 'category_id', select: '_id name' });
        if (stock !== undefined) {
            if (stock === 'true') query.sort('stock');
            if (stock === 'false') query.sort('-stock');
        }
        return await query;
    };

    static findById = async (id: string): Promise<ProductDocument | null> => {
        const pipeline: any[] = [];
        pipeline.push(matchId(id), categoryLookup(), brandLookUp(), reviewsLookup(), calculateRating(), vendorLookUp());
        pipeline.push({ $unwind: { path: '$vendor', preserveNullAndEmptyArrays: true } });
        pipeline.push({
            $addFields: {
                id: '$_id',
                sold_price: '$price',
                price: {
                    $cond: {
                        if: { $gt: ['$discount', 0] },
                        then: {
                            $round: [{ $subtract: ['$price', { $multiply: [{ $divide: ['$discount', 100] }, '$price'] }] }, 2]
                        },
                        else: '$price'
                    }
                }
            }
        });
        pipeline.push({
            $lookup: {
                from: 'products',
                localField: 'variants',
                foreignField: '_id',
                as: 'variants',
                pipeline: [
                    {
                        $project: {
                            id: '$_id',
                            _id: 0,
                            image_list: 1,
                            name: 1
                        }
                    }
                ]
            }
        });
        pipeline.push({
            $project: {
                _id: 0,
                category_id: 0,
                brand_id: 0,
                vendor_id: 0,
                __v: 0
            }
        });
        const data: ProductDocument[] = await ProductModel.aggregate(pipeline);
        return data.length > 0 ? data[0] : null;
    };

    static update = async (data: Partial<ProductDocument>, id: string): Promise<ProductDocument | null> =>
        await ProductModel.findByIdAndUpdate(id, data, { new: true });

    static updateStock = async (productId: string, qty: number): Promise<ProductDocument | null> =>
        await ProductModel.findByIdAndUpdate(productId, { $inc: { stock: qty } }, { new: true });

    static delete = async (id: string): Promise<ProductDocument | null> => await ProductModel.findByIdAndDelete(id);
}

export default ProductServices;
