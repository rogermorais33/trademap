import { Express } from 'express';
import { getFile, handleComtradeExport } from '../controllers/fileController';

export function fileRoutes(app: Express): void {
  app.post('/convert', handleComtradeExport);
  app.get('/getFile/:id', getFile);
}
