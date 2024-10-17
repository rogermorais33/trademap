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

const COMTRADE_BASE_URL = "https://comtradeapi.un.org/files/v1/app/reference";

app.post('/convert', async (req, res) => {
    const selectedValues = req.body;
    const reportCountriesValue =        selectedValues.reportCountriesValue?.value;
    const partnerCountriesValue =       selectedValues.partnerCountriesValue?.value;
    const partner2CountriesValue =      selectedValues.partner2CountriesValue?.value;
    const customCodeCountriesValue =    selectedValues.customCodeCountriesValue?.value;
    const modeOfTransportCodesValue =   selectedValues.modeOfTransportCodesValue?.value;

    const productsValue =               selectedValues.productsValue?.value;
    const serviceValue =                selectedValues.serviceValue?.value;     

    const typeCodeValue =               selectedValues.typeCodeValue;
    const freqCodeValue =               selectedValues.freqCodeValue;
    const clCodeValue =                 selectedValues.clCodeValue;
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

    if (reportCountriesValue) params.push(`reporterCode=${reportCountriesValue}`);
    if (period) params.push(`period=${period}`);
    if (partnerCountriesValue) params.push(`partnerCode=${partnerCountriesValue}`);
    if (partner2CountriesValue) params.push(`partner2Code=${partner2CountriesValue}`);
    if (cmdCode) params.push(`cmdCode=${cmdCode}`);
    if (flowCode) params.push(`flowCode=${flowCode}`);
    if (customCodeCountriesValue) params.push(`customCode=${customCodeCountriesValue}`);
    if (modeOfTransportCodesValue) params.push(`motCode=${modeOfTransportCodesValue}`);
    if (aggregateBy) params.push(`aggregateBy=${aggregateBy}`);
    if (breakdownMode) params.push(`breakdownMode=${breakdownMode}`);
    if (includeDesc) params.push(`includeDesc=${includeDesc}`);

    const paramString = params.length ? `&${params.join('&')}` : '';
    const comtradeUrl = `${baseUrl}${paramString}`;
    console.log("url", comtradeUrl)

    // const comtradeUrl = `https://comtradeapi.un.org/data/v1/get/C/A/HS?subscription-key=${subscription_key}&reporterCode=76&period=2023&partnerCode=251`

    let data;
    try {
      const response = await axios.get(comtradeUrl);
      data = await response.data.data;
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
    }

    try {
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
    } catch {
        console.log("Data:", data);
        console.error("Error writing file");
    }
});

app.get("/reporters", async (req, res) => {
    try {
        const response = await axios.get(`${COMTRADE_BASE_URL}/Reporters.json`);
        return res.send(response.data);
    } catch (error) {
        console.error("Erro ao fazer a requisição", error);
        return res.status(500).json({ error: "Erro ao buscar os dados"})
    }
})

app.get("/partners", async (req, res) => {
    try {
        const response = await axios.get(`${COMTRADE_BASE_URL}/partnerAreas.json`);
        return res.send(response.data);
    } catch (error) {
        console.error("Erro ao fazer a requisição", error);
        return res.status(500).json({ error: "Erro ao buscar os dados"})
    }
})

app.get("/custom_code", async (req, res) => {
    try {
        const response = await axios.get(`${COMTRADE_BASE_URL}/CustomsCodes.json`);
        return res.send(response.data);
    } catch (error) {
        console.error("Erro ao fazer a requisição", error);
        return res.status(500).json({ error: "Erro ao buscar os dados"})
    }
})

app.get("/motc", async (req, res) => {
    try {
        const response = await axios.get(`${COMTRADE_BASE_URL}/ModeOfTransportCodes.json`);
        return res.send(response.data);
    } catch (error) {
        console.error("Erro ao fazer a requisição", error);
        return res.status(500).json({ error: "Erro ao buscar os dados"})
    }
})

app.get("/products", async (req, res) => {
    const products_urls = [
      `${COMTRADE_BASE_URL}/HS.json`,
      `${COMTRADE_BASE_URL}/B4.json`,
      `${COMTRADE_BASE_URL}/B5.json`,
      `${COMTRADE_BASE_URL}/SS.json`,
    ]
    const fetchRequests = products_urls.map(url => axios.get(url));
    Promise.all(fetchRequests)
      .then(responses => {
        const combinedProducts = responses.reduce((acc, response) => {
            return acc.concat(response.data.results);
        }, []);
        return res.send(combinedProducts)
      })
      .catch(error => {
        console.error('Error fetching the JSON files:', error);
        return res.status(500).json({ error: "Erro ao buscar os dados" })
      });
  }
)

app.get("/services", async (req, res) => {
    try {
        const response = await axios.get(`${COMTRADE_BASE_URL}/EB.json`);
        return res.send(response.data);
    } catch (error) {
        console.error("Erro ao fazer a requisição", error);
        return res.status(500).json({ error: "Erro ao buscar os dados"})
    }
})



app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});