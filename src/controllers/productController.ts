import ProductModels from "../models/productModels.ts";

class ProductController {

  constructor() { }

  async createProduct(req: any, res: any) {
    try {
      const data = await ProductModels.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async readProduct(req: any, res: any) {
    try {
      res.status(200).json({ message: "readProduct-ok" });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async updateProduct(req: any, res: any) {
    try {
      res.status(200).json({ message: "updateProduct-ok" });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async deleteProduct(req: any, res: any) {
    try {
      res.status(200).json({ message: "deleteProduct-ok" });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getAllProducts(req: any, res: any) {
    try {
      res.status(200).json({ message: "getAllProducts-ok" });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getOneProduct(req: any, res: any) {
    try {
      res.status(200).json({ message: "getOneProduct-ok" });
    } catch (error) {
      res.status(500).send(error);
    }
  }

}

export default new ProductController();