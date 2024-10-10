import express from "express";
import bodyParser from "body-parser";
import { createObjectCsvWriter } from "csv-writer";
import ExcelJS from "exceljs";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 5000;

// csv:   http://localhost:3000/convert
// xlsx:  http://localhost:3000/convert?format=xlsx

app.use(cors());
app.use(bodyParser.json());

app.post('/convert', async (req, res) => {
    const selectedValues = req.body;
    const reportCountriesValue =        selectedValues.reportCountriesValue?.value;
    const partnerCountriesValue =       selectedValues.partnerCountriesValue?.value;
    const partner2CountriesValue =      selectedValues.partner2CountriesValue?.value;
    const customCodeCountriesValue =    selectedValues.customCodeCountriesValue?.value;
    const modeOfTransportCodesValue =   selectedValues.modeOfTransportCodesValue?.value;

    const productsValue =               selectedValues.productsValue?.value;
    const serviceValue =                selectedValues.serviceValue?.value;     

    const typeCodeValue =               selectedValues.typeCodeValue?.value;
    const freqCodeValue =               selectedValues.freqCodeValue?.value;
    const clCodeValue =                 selectedValues.clCodeValue?.value;
    const period =                      selectedValues.dateValue?.value;

    const flowCode =                    selectedValues.flowCodeValue?.value;
    const aggregateBy =                 selectedValues.aggregateBy?.value;
    const breakdownMode =               selectedValues.breakdownMode?.value;
    const includeDesc =                 selectedValues.includeDesc?.value;
    
    const cmdCode = productsValue || serviceValue;
    const subscription_key = process.env.SUBSCRIPTION_KEY;

    // const comtradeUrl = `https://comtradeapi.un.org/data/v1/get/${typeCodeValue}/${freqCodeValue}/${clCodeValue}?subscription-key=${subscription_key}${reportCountriesValue}&${period}&${partnerCountriesValue}&${partner2CountriesValue}&${cmdCode}&${flowCode}&${customCodeCountriesValue}&${modeOfTransportCodesValue}&${aggregateBy}&${breakdownMode}&${includeDesc}`

    const baseUrl = `https://comtradeapi.un.org/data/v1/get/${typeCodeValue}/${freqCodeValue}/${clCodeValue}?subscription-key=${subscription_key}`;

    const params = [];

    if (reportCountriesValue) params.push(`reportCountries=${reportCountriesValue}`);
    if (period) params.push(`period=${period}`);
    if (partnerCountriesValue) params.push(`partnerCountries=${partnerCountriesValue}`);
    if (partner2CountriesValue) params.push(`partner2Countries=${partner2CountriesValue}`);
    if (cmdCode) params.push(`cmdCode=${cmdCode}`);
    if (flowCode) params.push(`flowCode=${flowCode}`);
    if (customCodeCountriesValue) params.push(`customCodeCountries=${customCodeCountriesValue}`);
    if (modeOfTransportCodesValue) params.push(`modeOfTransport=${modeOfTransportCodesValue}`);
    if (aggregateBy) params.push(`aggregateBy=${aggregateBy}`);
    if (breakdownMode) params.push(`breakdownMode=${breakdownMode}`);
    if (includeDesc) params.push(`includeDesc=${includeDesc}`);

    const paramString = params.length ? `&${params.join('&')}` : '';
    const comtradeUrl = `${baseUrl}${paramString}`;
    
    // const comtradeUrl = `https://comtradeapi.un.org/data/v1/get/C/A/HS?subscription-key=${subscription_key}&reporterCode=76&period=2023&partnerCode=251`

    let data;
    try {
      const response = await axios.get(comtradeUrl);
      data = await response.data.data;
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
    }

    const fileFormat = req.query.format || 'csv';
    if (fileFormat === 'xlsx') {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');

        worksheet.columns = Object.keys(data[0]).map(key => ({ header: key, key }));

        data.forEach(item => {
          worksheet.addRow(item);
        });

        res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    } else {
        const csvWriter = createObjectCsvWriter({
            path: 'data.csv',
            header: Object.keys(data[0]).map(key => ({ id: key, title: key })),
        });

        await csvWriter.writeRecords(data);

        res.download('data.csv', 'data.csv', (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
});

app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});