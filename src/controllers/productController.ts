import { Request, Response } from "express";
import { z } from "zod";
import ProductModels from "../models/productModels.js";
import { productCreateSchema, productQuerySchema, productUpdateSchema } from "../schemas/productValidation.js";

class ProductController {

  constructor() {
    this.createProduct = this.createProduct.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getManage = this.getManage.bind(this);
    this.getOne = this.getOne.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  private handleError(res: Response, error: any, message: string) {
    console.error(`❌ [ProductController Error]: ${message}`, error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        details: error.issues
      });
    }

    return res.status(500).json({
      success: false,
      message,
      error: error?.message || error
    });
  }

  async createProduct(req: Request, res: Response) {
    try {
      const payload = productCreateSchema.parse(req.body);
      const images = payload.images?.length ? payload.images : [payload.imageUrl];

      const data = await ProductModels.create({
        ...payload,
        images,
        source: 'local',
        status: payload.status || 'active'
      });

      res.status(201).json({
        success: true,
        message: 'Producto creado correctamente',
        data
      });
    } catch (error) {
      this.handleError(res, error, "Error al crear producto");
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const data = await ProductModels.getAll();
      res.status(200).json(data);
    } catch (error) {
      this.handleError(res, error, "Error al obtener lista de productos");
    }
  }

  async getManage(req: Request, res: Response) {
    try {
      const query = productQuerySchema.parse(req.query);
      const result = await ProductModels.getPaginated(query);
      const categories = await ProductModels.getDistinctCategories();

      res.status(200).json({
        success: true,
        ...result,
        categories
      });
    } catch (error) {
      this.handleError(res, error, "Error al obtener el catálogo interno");
    }
  }

  async getOne(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const data = await ProductModels.getOne(id);
      if (!data || data.status === 'deleted') {
        return res.status(404).json({ success: false, message: "Producto no encontrado" });
      }
      res.status(200).json(data);
    } catch (error) {
      this.handleError(res, error, "Error al obtener producto por ID");
    }
  }

  async updateProduct(req: Request<{ id: string }>, res: Response) {
    try {
      const id = req.params.id;
      const payload = productUpdateSchema.parse(req.body);

      if (payload.imageUrl && (!payload.images || payload.images.length === 0)) {
        payload.images = [payload.imageUrl];
      }

      const data = await ProductModels.update(id, payload);
      if (!data) {
        return res.status(404).json({ success: false, message: "Producto no encontrado" });
      }

      res.status(200).json({
        success: true,
        message: 'Producto actualizado correctamente',
        data
      });
    } catch (error) {
      this.handleError(res, error, "Error al actualizar producto");
    }
  }

  async deleteProduct(req: Request<{ id: string }>, res: Response) {
    try {
      const id = req.params.id;
      const hard = req.query.hard === 'true';

      const data = hard
        ? await ProductModels.hardDelete(id)
        : await ProductModels.delete(id);

      if (!data) {
        return res.status(404).json({ success: false, message: "Producto no encontrado" });
      }

      res.status(200).json({
        success: true,
        message: hard ? "Producto eliminado permanentemente" : "Producto desactivado correctamente",
        data
      });
    } catch (error) {
      this.handleError(res, error, "Error al eliminar producto");
    }
  }

}

export default new ProductController();
