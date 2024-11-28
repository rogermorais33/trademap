import { Request, Response } from 'express';
import { QueryParams, RequestBody } from '../types';
import { fetchData, generateURLs, getFilteredData } from '../services/comtradeService';
import { getFileFromDatabase, writeToCsv, writeToExcel } from '../services/fileService';

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
    console.log(`${fileFormat} file saved successfully`)
  } catch {
    console.log('Data:', data);
    console.error('Error writing file');
  }
};

export const handleComtradeExportFromDb = async (req: Request<{}, {}, RequestBody, QueryParams>, res: Response) => {
  let dt = [];
  try {
    dt = await getFilteredData(req.body);
  } catch (error) {
    console.error('Request failed:', error);
  }
  try {
    const fileFormat = req.query.format || 'csv';
    if (fileFormat === 'xlsx') {
      console.log("Downloading excel from database")
      await writeToExcel(dt, res);
    } else {
      console.log("Downloading csv from database", dt)
      await writeToCsv(dt, res);
    }
    console.log(`${fileFormat} file saved successfully`)
  } catch {
    console.log('Data:', dt);
    console.error('Error writing file');
  }
};

export const getFile = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const file = await getFileFromDatabase(Number(id));

    res.setHeader('Content-Type', file.type);
    res.setHeader('Content-Disposition', `attachment; filename=${file.name}`);
    res.send(file.content);
  } catch (error) {
    res.status(500).send('Error retrieving file.');
  }
};

export const manyFilesZip = async (req: Request<{}, {}, RequestBody, QueryParams>, res: Response) => {
  try {
    await generateURLs(req.body, res, req.query.format);
  } catch (error) {
    console.error('Request failed:', error);
  }
};
