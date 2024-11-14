import { Request, Response } from 'express';
import { QueryParams, RequestBody } from '../types';
import { fetchData } from '../services/comtradeService';
import { writeToCsv, writeToExcel } from '../services/fileService';

export const handleComtradeExport = async (req: Request<{}, {}, RequestBody, QueryParams>, res: Response) => {
  let data = [];
  try {
    data = await fetchData(req.body);
  } catch (error) {
    console.error('Request failed:', error);
  }
  try {
    const fileFormat = req.query.format || 'csv';
    if (fileFormat === 'xlsx') {
      await writeToExcel(data, res);
    } else {
      await writeToCsv(data, res);
    }
  } catch {
    console.log('Data:', data);
    console.error('Error writing file');
  }
};
