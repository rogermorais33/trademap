import { Express } from 'express';
import { getReporters, getPartners, getMotc, getCustomsCodes } from '../controllers/referenceController';

export function referenceRoutes(app: Express): void {
  app.get('/reporters', getReporters);
  app.get('/partners', getPartners);
  app.get('/custom_code', getCustomsCodes);
  app.get('/motc', getMotc);
}
