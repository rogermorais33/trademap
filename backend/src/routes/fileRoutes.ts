import { Express } from 'express';
import { getFile, handleComtradeExport, handleComtradeExportFromDb, manyFilesZip } from '../controllers/fileController';

export function fileRoutes(app: Express): void {
  app.post('/convert', handleComtradeExport);
  app.post('/getDataFromDb', handleComtradeExportFromDb);
  app.get('/getFile/:id', getFile);
  app.post('/downloadZip', manyFilesZip);
}
