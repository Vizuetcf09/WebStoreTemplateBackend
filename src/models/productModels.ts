import { ObjectId } from "mongodb";
import MongoDBClient from "../config/mongoDBClient.ts";
import type { Product } from "../types/productTypes.ts";

class ProductModels {

  async create(product: Product) {
    const db = MongoDBClient.db;

    if (!db) {
      throw new Error('Database not initialized');
    }

    const productsCollection = db.collection('products');
    return await productsCollection.insertOne(product);
  }

  async update() {
    const db = MongoDBClient.db;

    if (!db) {
      throw new Error('Database not initialized');
    }

    const productsCollection = db.collection('products');
    // return await productsCollection.updateOne();
  }

  async delete() {
    const db = MongoDBClient.db;

    if (!db) {
      throw new Error('Database not initialized');
    }

    const productsCollection = db.collection('products');
    return await productsCollection.deleteOne();
  }

  async getAll() {
    const db = MongoDBClient.db;

    if (!db) {
      throw new Error('Database not initialized');
    }

    const productsCollection = db.collection('products');
    return await productsCollection.find({}).toArray();
  }

  async getOne(id: Product["id"]) {
    const db = MongoDBClient.db;

    if (!db) {
      throw new Error('Database not initialized');
    }

    const productsCollection = db.collection('products');
    const result = await productsCollection.findOne({ _id: new ObjectId(id) });
    return result;
  }

}

export default new ProductModels();