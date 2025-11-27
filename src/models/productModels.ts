import { ObjectId } from "mongodb";
import MongoDBClient from "../config/mongoDBClient.ts";
import type { Product } from "../types/productTypes.ts";

class ProductModels {

  // CRUD operations models

  // CRETE a new product
  async create(product: Product) {
    const dbClient = MongoDBClient.db;

    if (!dbClient) {
      throw new Error('Database not initialized');
    }

    const productsCollection = dbClient.collection('products');
    return await productsCollection.insertOne(product);
  }

  // READ products

  // Get all products
  async getAll() {
    const dbClient = MongoDBClient.db;

    if (!dbClient) {
      throw new Error('Database not initialized');
    }

    const productsCollection = dbClient.collection('products');
    return await productsCollection.find({}).toArray();
  }

  // Get a single product by ID
  async getOne(id: Product["id"]) {
    const dbClient = MongoDBClient.db;

    if (!dbClient) {
      throw new Error('Database not initialized');
    }

    const productsCollection = dbClient.collection('products');
    const result = await productsCollection.findOne({ _id: new ObjectId(id) });
    return result;
  }

  // UPDATE a product by ID
  async update(id: Product["id"], product: Product) {
    const dbClient = MongoDBClient.db;

    if (!dbClient) {
      throw new Error('Database not initialized');
    }

    const productsCollection = dbClient.collection('products');
    return await productsCollection.updateOne({ _id: new ObjectId(id) }, { $set: product });
  }


  // DELETE a product by ID
  async delete(id: Product["id"]) {
    const dbClient = MongoDBClient.db;

    if (!dbClient) {
      throw new Error('Database not initialized');
    }

    const productsCollection = dbClient.collection('products');
    return await productsCollection.deleteOne({ _id: new ObjectId(id) });
  }

}

export default new ProductModels();