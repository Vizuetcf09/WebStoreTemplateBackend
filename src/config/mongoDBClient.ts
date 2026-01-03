import mongoose from 'mongoose';

class MongoDBClient {

  private connected: boolean = false;

  constructor() {
    console.log("Connecting to MongoDB.");
  }

  async connectDB() {
    const URI = process.env.MONGODB_URI;

    if (!URI) throw new Error("MONGODB_URI is not defined.");

    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(URI);
  }

  async disconnectDB() {
    try {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    }
    catch (error) {
      console.error("Error disconnecting from MongoDB:", error);
    }
  }

  isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

}

export default new MongoDBClient();
