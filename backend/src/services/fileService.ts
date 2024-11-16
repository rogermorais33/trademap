import { Response } from 'express';
import ExcelJS from 'exceljs';
import { createObjectCsvWriter } from 'csv-writer';
import db from '../config/db';
import { PoolClient } from 'pg';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

interface CsvData {
  data: any[];
  filename: string;
}

const createTableIfNotExists = async () => {
  const client: PoolClient = await db.connect();

  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS arquivos (
        id SERIAL PRIMARY KEY, 
        nome VARCHAR(255) NOT NULL, 
        tipo TEXT NOT NULL, 
        conteudo BYTEA NOT NULL 
      );
    `;
    await client.query(createTableQuery);
  } catch (err) {
    console.error('Error creating table:', err);
    throw new Error('Error creating table.');
  } finally {
    client.release();
  }
};

const saveFileToDatabase = async (nome: string, tipo: string, conteudo: Buffer) => {
  const client: PoolClient = await db.connect();
  try {
    await createTableIfNotExists();
    const query = 'INSERT INTO arquivos (nome, tipo, conteudo) VALUES ($1, $2, $3)';
    await client.query(query, [nome, tipo, conteudo]);
  } catch (err) {
    console.error('Erro ao salvar arquivo no banco:', err);
    throw new Error('Erro ao salvar arquivo no banco.');
  } finally {
    client.release();
  }
};

export const getFileFromDatabase = async (id: number) => {
  const client: PoolClient = await db.connect();

  try {
    const query = 'SELECT nome, tipo, conteudo FROM arquivos WHERE id = $1';
    const result = await client.query(query, [id]);

    if (result.rows.length > 0) {
      return result.rows[0];  // Retorna o arquivo encontrado
    }

    throw new Error('Arquivo não encontrado.');
  } catch (err) {
    console.error('Erro ao recuperar arquivo do banco:', err);
    throw new Error('Erro ao recuperar arquivo.');
  } finally {
    client.release();
  }
};

export const writeToZip = async (csvDataArray: CsvData[], res: Response) => {
  try {
    console.log('Starting CSV processing. Quantity:', csvDataArray.length);
    
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
      console.log('Temporary directory created:', tempDir);
    }
    const createdCsvPaths: string[] = [];

    for (const [index, csvData] of csvDataArray.entries()) {
      console.log(`Processing CSV ${index + 1}/${csvDataArray.length}`);
      
      if (!csvData.data || !Array.isArray(csvData.data) || csvData.data.length === 0) {
        console.error(`Invalid data for CSV ${index}:`, csvData);
        continue;
      }

      try {
        const csvPath = path.join(tempDir, csvData.filename || `data_${index}.csv`);
        console.log('Trying to create CSV at:', csvPath);
        console.log('First data:', JSON.stringify(csvData.data[0]));

        const headers = Object.keys(csvData.data[0]).map(key => ({
          id: key,
          title: key
        }));        
        console.log('Identified headers:', headers);

        const csvWriter = createObjectCsvWriter({
          path: csvPath,
          header: headers
        });

        console.log(`Writing ${csvData.data.length} records...`);
        await csvWriter.writeRecords(csvData.data);

        if (fs.existsSync(csvPath)) {
          const stats = fs.statSync(csvPath);
          console.log(`CSV created successfully. Size: ${stats.size} bytes`);
          createdCsvPaths.push(csvPath);
        } else {
          console.error('CSV not created:', csvPath);
        }

      } catch (csvError) {
        console.error(`Error creating CSV ${index}:`, csvError);
      }
    }

    if (createdCsvPaths.length === 0) {
      throw new Error('No CSV file was created successfully');
    }

    console.log('Starting ZIP Creation');
    const zipPath = path.join(tempDir, 'data.zip');
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => {
      throw err;
    });
    archive.pipe(output);

    for (const csvPath of createdCsvPaths) {
      const filename = path.basename(csvPath);
      console.log(`Adding ${filename} to ZIP`);
      archive.file(csvPath, { name: filename });
    }

    await new Promise<void>((resolve, reject) => {
      output.on('close', () => {
        console.log('ZIP created successfully');
        resolve();
      });
      archive.on('error', reject);
      archive.finalize();
    });

    console.log('Sending ZIP to the client');
    res.download(zipPath, 'data.zip', (err) => {
      if (err) {
        console.error('Error sending ZIP:', err);
      }

      console.log('Cleaning up temporary files');
      createdCsvPaths.forEach(csvPath => {
        try {
          fs.unlinkSync(csvPath);
          console.log(`File removed: ${csvPath}`);
        } catch (e) {
          console.error(`Error removing file ${csvPath}:`, e);
        }
      });
    
      try {
        fs.unlinkSync(zipPath);
        console.log('ZIP file removed');
      } catch (e) {
        console.error('Error removing ZIP file:', e);
      }
    });
    
    } catch (error) {
      console.error('Process error:', error);
      if (!res.headersSent) {
        res.status(500).send('Error processing files');
      }
    }
};

export const writeToCsv = async (data: any[], res: Response) => {
  const csvWriter = createObjectCsvWriter({
    path: 'data.csv',
    header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
  });

  await csvWriter.writeRecords(data);

  const csvContent = fs.readFileSync('data.csv');
  await saveFileToDatabase('data.csv', 'application/csv', csvContent);

  res.download('data.csv', 'data.csv', (err) => {
    if (err) {
      console.error(err);
    }
  });
};

export const writeToExcel = async (data: any[], res: Response) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  worksheet.columns = Object.keys(data[0]).map((key) => ({ header: key, key }));

  data.forEach((item) => {
    worksheet.addRow(item);
  });

  const excelBuffer = await workbook.xlsx.writeBuffer();
  const bufferNode = Buffer.from(excelBuffer);
  await saveFileToDatabase('data.xlsx', 'application/xls', bufferNode);

  res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
  await workbook.xlsx.write(res);
  res.end();
};
