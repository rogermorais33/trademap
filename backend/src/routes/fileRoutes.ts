import { Express } from 'express';
import { handleComtradeExport } from '../controllers/fileController';

export function fileRoutes(app: Express): void {
  app.post('/convert', handleComtradeExport);
}
