import { Express } from 'express';
import { getProducts, getServices } from '../controllers/productController';

export function productRoutes(app: Express): void {
  app.get('/products', getProducts);
  app.get('/services', getServices);
}
