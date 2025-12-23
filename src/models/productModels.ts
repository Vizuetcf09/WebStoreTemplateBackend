import type { Product } from "../types/productTypes.ts";
import productSchemas from "../schemas/productSchemas.ts";

class ProductModels {

  // CRUD operations models

  // CRETE a new product
  async create(product: Product) {
    return await productSchemas.create(product);
  }

  // READ products

  // Get all products
  async getAll() {
    return await productSchemas.find();
  }

  // Get a single product by ID
  async getOne(id: Product["id"]) {
    return await productSchemas.findById(id);
  }

  // UPDATE a product by ID
  async update(id: Product["id"], product: Product) {
    return await productSchemas.findByIdAndUpdate(id, product, { new: true });
  }


  // DELETE a product by ID
  async delete(id: Product["id"]) {
    return await productSchemas.findByIdAndDelete(id);
  }

}

export default new ProductModels();