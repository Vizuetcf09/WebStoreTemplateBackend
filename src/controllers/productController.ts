import express from "express";
import type { Request as ExpressRequest, Response as ExpressResponse } from "express";
import ProductModels from "../models/productModels.js";
import type { Product } from "../types/productTypes.js";

class ProductController {

  constructor() { }

  // CRUD controlers

  // CREATE a new product controler
  async createProduct(req: ExpressRequest, res: ExpressResponse) {
    try {
      const data = await ProductModels.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // READ controllers

  // Get all products controller
  async getAll(req: ExpressRequest, res: ExpressResponse) {
    try {
      const data = await ProductModels.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send(error);

    }
  }

  // Get a single product by ID controller
  async getOne(req: ExpressRequest<{ id: Product["id"] }>, res: ExpressResponse) {
    try {
      const { id } = req.params;
      const data = await ProductModels.getOne(id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // UPDATE a product controller
  async updateProduct(req: ExpressRequest<{ id: Product["id"] }>, res: ExpressResponse) {
    try {
      const id = req.params.id;
      const data = await ProductModels.update(id, req.body);
      res.status(200).json(data,);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // DELETE a product controller
  async deleteProduct(req: ExpressRequest<{ id: Product["id"] }>, res: ExpressResponse) {
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