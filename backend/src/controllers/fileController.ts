import { Request, Response } from 'express';
import { QueryParams, RequestBody } from '../types';
import { fetchData, generateURLs } from '../services/comtradeService';
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
  } catch {
    console.log('Data:', data);
    console.error('Error writing file');
  }
};

export const getFile = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const file = await getFileFromDatabase(Number(id));

    res.setHeader('Content-Type', file.tipo);
    res.setHeader('Content-Disposition', `attachment; filename=${file.nome}`);
    res.send(file.conteudo);
  } catch (error) {
    res.status(500).send('Erro ao recuperar o arquivo.');
  }
};

export const manyFilesZip = async (req: Request<{}, {}, RequestBody, QueryParams>, res: Response) => {
  let data = [];
  try {
    await generateURLs(req.body, res);
  } catch (error) {
    console.error('Request failed:', error);
  }
}
