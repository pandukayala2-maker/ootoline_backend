import { CategoryDocument, CategoryModel } from './category_model';

class CategoryServices {
    static create = async (data: CategoryDocument): Promise<CategoryDocument> => await CategoryModel.create(data);

    static update = async (data: Partial<CategoryDocument>, id: string) => await CategoryModel.findByIdAndUpdate(id, data, { new: true });

    static find = async (filter: any) => await CategoryModel.find(filter);

    static findById = async (id: string): Promise<CategoryDocument | null> => await CategoryModel.findById(id);

    static findByVendor = async (id: string) => await CategoryModel.find({ vendor_id: id });

    static delete = async (id: string) => await CategoryModel.findByIdAndDelete(id);
}

export default CategoryServices;
