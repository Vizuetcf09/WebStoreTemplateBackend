import express from 'express';
import type { Application, Request, Response } from 'express';
import { ProductRoutes } from './routes/ProductRoutes.ts';

export class Server {

  public app: Application;
  private port: number;

  constructor(port: number = 3000) {

    this.app = express();
    this.port = port;
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {

    this.app.use(express.json());
  }

  private routes(): void {

    this.app.get('/', (req: Request, res: Response) => {
      res.send('Hello World');
    });

    const router = new ProductRoutes(express.Router());
    this.app.use('/api/products', router.router);
  }

  public startServer(): void {

    this.app.listen(this.port, () => {
      console.log(`🚀 Server running on http://localhost:${this.port}`);
    });
  }
}

const server = new Server();
server.startServer();