import { Response } from 'express';
import ExcelJS from 'exceljs';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import File from '../models/File';

interface Data {
  data: any[];
  filename: string;
}

export const saveFileToDatabase = async (name: string, type: string, content: Buffer) => {
  try {
    const newFile = await File.create({
      name,
      type,
      content,
    });
    console.log('File save successfully:', newFile);
    return newFile;
  } catch (err) {
    console.error('Error saving file to database', err);
    throw new Error('Error saving file to database');
  }
};

export const getFileFromDatabase = async (id: number) => {
  try {
    const file = await File.findOne({
      where: { id },
    });
    if (file) {
      console.log('Recovered file:', file);
      return file;
    } else {
      throw new Error('File not found.');
    }
  } catch (err) {
    console.error('Error retrieving file from database:', err);
    throw new Error('Error retrieving file from database.');
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

export const writeToZip = async (csvDataArray: Data[], res: Response) => {
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

        const headers = Object.keys(csvData.data[0]).map((key) => ({
          id: key,
          title: key,
        }));
        console.log('Identified headers:', headers);

        const csvWriter = createObjectCsvWriter({
          path: csvPath,
          header: headers,
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
      createdCsvPaths.forEach((csvPath) => {
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

export const writeToZipExcel = async (dataArray: Data[], res: Response) => {
  try {
    console.log('Starting Excel file processing. Quantity:', dataArray.length);

    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const createdFilePaths: string[] = [];

    for (const [index, data] of dataArray.entries()) {
      if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
        console.error(`Invalid data for file ${index}:`, data);
        continue;
      }

      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        // Add headers
        const headers = Object.keys(data.data[0]);
        worksheet.columns = headers.map((header) => ({
          header,
          key: header,
          width: 20,
        }));

        // Add data rows
        worksheet.addRows(data.data);

        // Determine file path and extension
        const filename = data.filename || `data_${index}.xlsx`;
        const filePath = path.join(tempDir, filename);

        // Save the workbook
        await workbook.xlsx.writeFile(filePath);

        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          console.log(`Excel file created successfully. Size: ${stats.size} bytes`);
          createdFilePaths.push(filePath);
        } else {
          console.error('Excel file not created:', filePath);
        }
      } catch (fileError) {
        console.error(`Error creating Excel file ${index}:`, fileError);
      }
    }

    if (createdFilePaths.length === 0) {
      throw new Error('No Excel file was created successfully');
    }

    // ZIP creation logic (similar to previous implementation)
    const zipPath = path.join(tempDir, 'data.zip');
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => {
      throw err;
    });
    archive.pipe(output);

    for (const filePath of createdFilePaths) {
      const filename = path.basename(filePath);
      archive.file(filePath, { name: filename });
    }

    await new Promise<void>((resolve, reject) => {
      output.on('close', () => {
        console.log('ZIP created successfully');
        resolve();
      });
      archive.on('error', reject);
      archive.finalize();
    });

    // Send ZIP and cleanup
    res.download(zipPath, 'data.zip', (err) => {
      if (err) {
        console.error('Error sending ZIP:', err);
      }

      // Cleanup temporary files
      createdFilePaths.forEach((filePath) => {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error(`Error removing file ${filePath}:`, e);
        }
      });

      try {
        fs.unlinkSync(zipPath);
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
