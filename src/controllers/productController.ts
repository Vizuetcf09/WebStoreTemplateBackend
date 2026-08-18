import { Request, Response } from "express";
import ProductModels from "../models/productModels.js";

class ProductController {

  constructor() { }

  // CRUD controllers

  // Helper centralizado para respuestas de error
  private handleError(res: Response, error: any, message: string) {
    console.error(`❌ [ProductController Error]: ${message}`, error);
    return res.status(500).json({
      success: false,
      message,
      error: error?.message || error
    });
  }

  // CREATE a new product controller
  async createProduct(req: Request, res: Response) {
    try {
      const data = await ProductModels.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      this.handleError(res, error, "Error al crear producto");
    }
  }

  // READ controllers

  // Get all products controller
  async getAll(req: Request, res: Response) {
    try {
      const data = await ProductModels.getAll();
      res.status(200).json(data);
    } catch (error) {
      this.handleError(res, error, "Error al obtener lista de productos");
    }
  }

  // Get a single product by ID controller
  async getOne(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const data = await ProductModels.getOne(id);
      if (!data) {
        return res.status(404).json({ success: false, message: "Producto no encontrado" });
      }
      res.status(200).json(data);
    } catch (error) {
      this.handleError(res, error, "Error al obtener producto por ID");
    }
  }

  // UPDATE a product controller
  async updateProduct(req: Request<{ id: string }>, res: Response) {
    try {
      const id = req.params.id;
      const data = await ProductModels.update(id, req.body);
      res.status(200).json(data);
    } catch (error) {
      this.handleError(res, error, "Error al actualizar producto");
    }
  }

  // DELETE a product controller
  async deleteProduct(req: Request<{ id: string }>, res: Response) {
    try {
      const id = req.params.id;
      const data = await ProductModels.delete(id);
      res.status(200).json({ success: true, message: "Producto eliminado correctamente", data });
    } catch (error) {
      this.handleError(res, error, "Error al eliminar producto");
    }
  }

}

export default new ProductController();