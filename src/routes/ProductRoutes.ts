import type { Router } from "express";
import { ProductController } from "../controllers/ProductController.ts";

export class ProductRoutes {

  public router: Router;
  private productController: ProductController;

  constructor(router: Router) {
    this.router = router;
    this.productController = new ProductController();
    this.routesInit();
  }

  private routesInit(): void {
    // GET /products
    this.router.get('/api/products', this.productController.getAllProducts.bind(this.productController));
  }
}


