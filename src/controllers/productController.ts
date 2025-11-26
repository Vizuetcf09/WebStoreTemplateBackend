import type { Request, Response } from "express";
import ProductModels from "../models/productModels.ts";
import type { Product } from "../types/productTypes.ts";

class ProductController {

  constructor() { }

  async createProduct(req: Request, res: Response) {
    try {
      const data = await ProductModels.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async readProduct(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "readProduct-ok" });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "updateProduct-ok" });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "deleteProduct-ok" });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const data = await ProductModels.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send(error);

    }
  }

  async getOneProduct(req: Request<{ id: Product["id"] }>, res: Response) {
    try {
      const { id } = req.params;
      const data = await ProductModels.getOne(id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  }

}

export default new ProductController();