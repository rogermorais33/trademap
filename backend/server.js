import express from "express";
import bodyParser from "body-parser";
import { createObjectCsvWriter } from "csv-writer";
import ExcelJS from "exceljs";
import cors from "cors";
import axios from "axios";

const app = express();
const port = 5000;

// csv:   http://localhost:3000/convert
// xlsx:  http://localhost:3000/convert?format=xlsx

app.use(cors());
app.use(bodyParser.json());

app.post('/convert', async (req, res) => {
    const selectedValues = req.body;
    const reportCountriesValue =      selectedValues.reportCountriesValue;
    const partnerCountriesValue =     selectedValues.partnerCountriesValue;
    const partner2CountriesValue =    selectedValues.partner2CountriesValue;
    const customCodeCountriesValue =  selectedValues.customCodeCountriesValue;
    const modeOfTransportCodesValue = selectedValues.modeOfTransportCodesValue;

    const becProductsValue =          selectedValues.becProductsValue;
    const hsProductsValue =           selectedValues.hsProductsValue;
    const sitcProductsValue =         selectedValues.sitcProductsValue;
    const ebopsServiceValue =         selectedValues.ebopsServiceValue;

    const typeCodeValue =             selectedValues.typeCodeValue;
    const freqCodeValue =             selectedValues.freqCodeValue;
    const clCodeValue =               selectedValues.clCodeValue;
    
    const aggregateBy = null;

    const subscription_key = process.env.SUBSCRIPTION_KEY;

    // const comtradeUrl = `https://comtradeapi.un.org/data/v1/get/${typeCodeValue}/${freqCodeValue}/${clCodeValue}?subscription-key=${subscription_key}${reportCountriesValue}&${period}&${partnerCountriesValue}&${partner2CountriesValue}&${cmdCode}&${flowCode}&${customCodeCountriesValue}&${modeOfTransportCodesValue}&${aggregateBy}&${breakdownMode}&${includeDesc}`

    const comtradeUrl = `https://comtradeapi.un.org/data/v1/get/C/A/HS?subscription-key=${subscription_key}&reporterCode=76&period=2023&partnerCode=251`

    let data;
    try {
      const response = await axios.get(comtradeUrl);
      data = await response.data.data;
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
    }

    const fileFormat = req.query.format || 'csv';

    console.log("uzuuuU", data)
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