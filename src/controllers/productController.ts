import { Request, Response } from "express";
import ProductModels from "../models/productModels.js";
import type { Product } from "../types/productTypes.js";

class ProductController {

  constructor() { }

  // CRUD controlers

  // CREATE a new product controler
  async createProduct(req: Request, res: Response) {
    try {
      const data = await ProductModels.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // READ controllers

  // Get all products controller
  async getAll(req: Request, res: Response) {
    try {
      const data = await ProductModels.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send(error);

    }
  }

  // Get a single product by ID controller
  async getOne(req: Request<{ id: Product["id"] }>, res: Response) {
    try {
      const { id } = req.params;
      const data = await ProductModels.getOne(id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // UPDATE a product controller
  async updateProduct(req: Request<{ id: Product["id"] }>, res: Response) {
    try {
      const id = req.params.id;
      const data = await ProductModels.update(id, req.body);
      res.status(200).json(data,);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // DELETE a product controller
  async deleteProduct(req: Request<{ id: Product["id"] }>, res: Response) {
    try {
      const id = req.params.id;
      const data = await ProductModels.delete(id);
      res.status(206).json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  }
  
}

export default new ProductController();