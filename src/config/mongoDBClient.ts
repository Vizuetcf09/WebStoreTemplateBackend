import { Db, MongoClient } from 'mongodb';
import 'dotenv/config';

class MongoDBClient {
  public client: MongoClient;
  public db!: Db;

  constructor() {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) throw new Error("MONGODB_URI is not defined.");
    
    this.client = new MongoClient(uri);
  }

  async connectDB() {
    try {
      await this.client.connect();
      this.db = this.client.db('webstore');
      console.log("Connected to MongoDB successfully.");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
    }
  }

}

export default new MongoDBClient();
