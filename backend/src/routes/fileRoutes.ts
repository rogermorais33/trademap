import { Express } from 'express';
import { getFile, handleComtradeExport, manyFilesZip } from '../controllers/fileController';

export function fileRoutes(app: Express): void {
  app.post('/convert', handleComtradeExport);
  app.get('/getFile/:id', getFile);
  app.post('/downloadZip', manyFilesZip)
}
