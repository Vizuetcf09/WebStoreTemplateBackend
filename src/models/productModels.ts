import type { ProductTypes } from "../types/products/productTypes.js";
import productSchemas from "../schemas/productSchemas.js";

class ProductModels {

  // CRUD operations models

  // CRETE a new product
  async create(product: ProductTypes) {
    return await productSchemas.create(product);
  }

  // READ products

  // Get all products
  async getAll() {
    return await productSchemas.find();
  }

  // Get a single product by ID
  async getOne(id: ProductTypes["id"]) {
    return await productSchemas.findById(id);
  }

  // UPDATE a product by ID
  async update(id: ProductTypes["id"], product: ProductTypes) {
    return await productSchemas.findByIdAndUpdate(id, product, { new: true });
  }


  // DELETE a product by ID
  async delete(id: ProductTypes["id"]) {
    return await productSchemas.findByIdAndDelete(id);
  }

  // FIND AND UPDATE a product
  async findOneAndUpdate(filter: any, update: any, options: any = {}) {
    return await productSchemas.findOneAndUpdate(filter, update, options);
  }

}

export default new ProductModels();