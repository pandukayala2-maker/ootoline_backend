import { Types } from 'mongoose';

export const matchId = (id: string) => ({
    $match: {
        _id: new Types.ObjectId(id)
    }
});

export const categoryLookup = () => ({
    $lookup: {
        from: 'categories',
        localField: 'category_id',
        foreignField: '_id',
        as: 'category',
        pipeline: [{ $project: { id: '$_id', _id: 0, name: 1 } }]
    }
});

export const vendorLookUp = () => ({
    $lookup: {
        from: 'vendors',
        localField: 'vendor_id',
        foreignField: '_id',
        as: 'vendor',
        pipeline: [
            { $project: { id: '$_id', _id: 0, email: 1, company_name: 1, owner_name: 1, country: 1, image: 1, phone: 1, from_time: 1, to_time: 1 } }
        ]
    }
});

export const brandLookUp = () => ({
    $lookup: {
        from: 'brands',
        localField: 'brand_id',
        foreignField: '_id',
        as: 'brand',
        pipeline: [{ $project: { id: '$_id', _id: 0, name: 1 } }]
    }
});

export const authLookUp = () => ({
    $lookup: {
        from: 'auths',
        localField: '_id',
        foreignField: '_id',
        as: 'auth',
        pipeline: [{ $project: { id: '$_id', _id: 0, is_disabled: 1 } }]
    }
});

export const productLookUp = () => ({
    $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'vendor_id',
        as: 'products'
    }
});

export const reviewsLookup = () => ({
    $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'product_id',
        as: 'reviews',
        pipeline: [
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [{ $project: { id: '$_id', _id: 0, first_name: 1, last_name: 1, image: 1 } }]
                }
            },
            { $project: { id: '$_id', _id: 0, rating: 1, review: 1, order_id: 1, user: 1 } }
        ]
    }
});

export const calculateRating = () => ({
    $addFields: {
        rating: {
            $cond: {
                if: { $gt: [{ $size: '$reviews' }, 0] },
                then: { $avg: '$reviews.rating' },
                else: 0
            }
        }
    }
});
