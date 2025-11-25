import MongoDBClient from "../config/mongoDBClient.ts";

class ProductModels {

  async create(product: any) {
    const productsCollection = MongoDBClient.db.collection('products');
    const result = await productsCollection.insertOne(product);
  }

}

export default new ProductModels();