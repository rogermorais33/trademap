import { Express } from 'express';
import { fileRoutes } from './fileRoutes';
import { referenceRoutes } from './referenceRoutes';
import { productRoutes } from './productRoutes';

export function setupRoutes(app: Express): void {
  // Register routes for file handling
  fileRoutes(app);

  // Register routes for reference data (reporters, partners, motc)
  referenceRoutes(app);

  // Register routes for product and service data
  productRoutes(app);
}
