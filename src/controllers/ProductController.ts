import type { Request, Response } from 'express';
import { ProductModel } from '../models/ProductModel.ts';

export class ProductController {

  // GET /products
  public async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductModel.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving products', error });
    }
  }
}