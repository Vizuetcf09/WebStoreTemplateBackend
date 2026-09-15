import type { ProductTypes } from "../types/products/productTypes.js";
import productSchemas from "../schemas/productSchemas.js";

type PaginatedQuery = {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
};

class ProductModels {

  async create(product: Record<string, unknown>) {
    return await productSchemas.create(product);
  }

  async getAll() {
    return await productSchemas.find({
      status: { $nin: ['inactive', 'deleted'] }
    }).sort({ createdAt: -1 });
  }

  async getPaginated({ search = '', category = '', status = 'all', page = 1, limit = 10 }: PaginatedQuery) {
    const filter: Record<string, unknown> = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      productSchemas.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit),
      productSchemas.countDocuments(filter)
    ]);

    return {
      items,
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit))
    };
  }

  async getDistinctCategories() {
    return await productSchemas.distinct('category', { status: { $ne: 'deleted' } });
  }

  async getOne(id: ProductTypes["id"]) {
    return await productSchemas.findById(id);
  }

  async update(id: ProductTypes["id"], product: Record<string, unknown>) {
    return await productSchemas.findByIdAndUpdate(id, product, { new: true, runValidators: true });
  }

  async delete(id: ProductTypes["id"]) {
    return await productSchemas.findByIdAndUpdate(
      id,
      { status: 'deleted', deletedAt: new Date() },
      { new: true }
    );
  }

  async hardDelete(id: ProductTypes["id"]) {
    return await productSchemas.findByIdAndDelete(id);
  }

  async findByPrintfulIds(ids: number[]) {
    return await productSchemas.find({ printfulId: { $in: ids } }).select('_id printfulId name status price costPrice');
  }

  async findOneAndUpdate(filter: any, update: any, options: any = {}) {
    return await productSchemas.findOneAndUpdate(filter, update, options);
  }

  async findOne(filter: any) {
    return await productSchemas.findOne(filter);
  }
}

export default new ProductModels();
