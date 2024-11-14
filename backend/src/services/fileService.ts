import { Response } from 'express';
import ExcelJS from 'exceljs';
import { createObjectCsvWriter } from 'csv-writer';

export const writeToCsv = async (data: any[], res: Response) => {
  const csvWriter = createObjectCsvWriter({
    path: 'data.csv',
    header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
  });

  await csvWriter.writeRecords(data);

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

  res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
  await workbook.xlsx.write(res);
  res.end();
};
