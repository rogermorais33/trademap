import { Response } from 'express';
import ExcelJS from 'exceljs';
import { createObjectCsvWriter } from 'csv-writer';
import db from '../config/db';
import { PoolClient } from 'pg';
import fs from 'fs';

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
