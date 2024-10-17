import { Button, Grid2, Typography } from "@mui/material"
import ChartCard from "../../components/chartCard"
import React from "react";
import { useEffect, useState } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from "axios"



export const data = [
  ["Country", "Exportação de Animais vivos"],
  ["Germany", 200],
  ["United States", 300],
  ["Brazil", 400],
  ["Canada", 500],
  ["France", 600],
  ["RU", 700],
];

export const data2 = [
  ["ID", "Life Expectancy", "Fertility Rate", "Region", "Population"],
  ["CAN", 80.66, 1.67, "North America", 33739900],
  ["DEU", 79.84, 1.36, "Europe", 81902307],
  ["DNK", 78.6, 1.84, "Europe", 5523095],
  ["EGY", 72.73, 2.78, "Middle East", 79716203],
  ["GBR", 80.05, 2, "Europe", 61801570],
  ["IRN", 72.49, 1.7, "Middle East", 73137148],
  ["IRQ", 68.09, 4.77, "Middle East", 31090763],
  ["ISR", 81.55, 2.96, "Middle East", 7485600],
  ["RUS", 68.6, 1.54, "Europe", 141850000],
  ["USA", 78.09, 2.05, "North America", 307007000],
];

/*background: rgba(255, 255, 255, 0.28);
border-radius: 16px;
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
backdrop-filter: blur(6.9px);
-webkit-backdrop-filter: blur(6.9px);*/

function App() {
  const [reportCountries, setReportCountries] = useState([]);
  const [partnerCountries, setPartnerCountries] = useState([]);
  const [customCodeCountries, setCustomCodeCountries] = useState([]);
  const [modeOfTransportCodes, setModeOfTransportCodes] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [period, setPeriod] = useState([]);

  const [reportCountriesValue, setReportCountriesValue] = useState(null);
  const [partnerCountriesValue, setPartnerCountriesValue] = useState(null);
  const [partner2CountriesValue, setPartner2CountriesValue] = useState(null);
  const [customCodeCountriesValue, setCustomCodeCountriesValue] = useState(null);
  const [modeOfTransportCodesValue, setModeOfTransportCodesValue] = useState(null);
  const [productsValue, setProductsValue] = useState(null);
  const [serviceValue, setServiceValue] = useState(null);
  const [typeCodeValue, setTypeCodeValue] = useState(null);
  const [freqCodeValue, setFreqCodeValue] = useState(null);
  const [clCodeValue, setClCodeValue] = useState(null);
  const [flowCodeValue, setFlowCodeValue] = useState(null);
  
  const [dateValue, setDateValue] = useState(null);
  
  const handleSubmit = (format) => {
    const selectedValues = {
      reportCountriesValue,
      partnerCountriesValue,
      partner2CountriesValue,
      customCodeCountriesValue,
      modeOfTransportCodesValue,
      productsValue,
      serviceValue,
      typeCodeValue,
      freqCodeValue,
      clCodeValue,
      dateValue,
      flowCodeValue,
    };
    console.log("testing", selectedValues);

    fetch(`http://localhost:5000/convert${format ? '?format=' + format : ''}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedValues)
    })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = format === 'xlsx' ? 'data.xlsx' : 'data.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error('Error:', error));
  }

  // root: https://comtradeapi.un.org/files/v1/app/reference/
  const typeCode = [
    {
      "text": "commodities",
      "code": "C",
    },
    {
      "text": "services",
      "code": "S",
    },
  ]

  const freqCode = [
    {
      "text": "Annual",
      "code": "A",
    },
    {
      "text": "Monthly",
      "code": "M",
    },
  ]

  const clCode = [
    {
      "text": "HS",
      "code": "HS",
    },
    {
      "text": "SITC",
      "code": "SITC",
    },
    {
      "text": "BEC",
      "code": "BEC",
    },
    {
      "text": "EB",
      "code": "EB",
    },
  ]


  const flowCode = [
    {
      "text": "Import",
      "code": "M",
    },
    {
      "text": "Export",
      "code": "X",
    },
  ]

  const API_URL = "http://localhost:5000";

  function periodToFetch() {
    const currentYear = new Date().getFullYear();
    const period = [];
  
    for (let year = 1962; year <= currentYear; year++) {
      if (freqCodeValue?.value === "M") {
        for (let month = 1; month <= 12; month++) {
          const formattedMonth = month.toString().padStart(2, '0');
          const yearMonth = `${year}/${formattedMonth}`;
          period.push({
            text: yearMonth,
            code: `${year}${formattedMonth}`,
          });
        }
      }
      else {
        period.push({
          text: year.toString(),
          code: year.toString(),
        });
      }
    }
    setPeriod(period);
  }

  async function fetchReporters() {
    try {
      const response = await axios.get(`${API_URL}/reporters`);
      setReportCountries(response.data.results);
    } catch (err) {
      console.error("Erro ao fazer a requisição", err);
    }
  }

  async function fetchPartners() {
    try {
      const response = await axios.get(`${API_URL}/partners`);
      setPartnerCountries(response.data.results);
    } catch (err) {
      console.error("Erro ao fazer a requisição", err);
    }
  }

  async function fetchCustomCode() {
    try {
      const response = await axios.get(`${API_URL}/custom_code`);
      console.log("response https://comtradeapi.un.org/files/v1/app/reference/CustomsCodes.json ", response)
      setCustomCodeCountries(response.data.results);
    } catch (err) {
      console.error("Erro ao fazer a requisição", err);
    }
  }
  
  async function fetchModeOfTransportCodes() {
    try {
      const response = await axios.get(`${API_URL}/motc`);
      setModeOfTransportCodes(response.data.results);
    } catch (err) {
      console.error("Erro ao fazer a requisição", err);
    }
  }
  
  async function fetchProducts() {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (err) {
      console.error("Erro ao fazer a requisição", err);
    }
  }

  async function fetchServices() {
    try {
      const response = await axios.get(`${API_URL}/services`);
      setServices(response.data.results);
    } catch (err) {
      console.error("Erro ao fazer a requisição", err);
    }
  }

  useEffect(() => {
    fetchReporters();
    fetchPartners();
    fetchCustomCode();
    fetchModeOfTransportCodes();
    fetchProducts();
    fetchServices();
  }, [])

  useEffect(() => {
    periodToFetch();
  }, [freqCodeValue])

  const resTypeCode = typeCode.map(country =>({
    label: country.text,
    value: country.code,
  }));

  const resFreqCode = freqCode.map(country =>({
    label: country.text,
    value: country.code,
  }));

  const resClCode = clCode.map(country =>({
    label: country.text,
    value: country.code,
  }));

  const resFlowCode = flowCode.map(country =>({
    label: country.text,
    value: country.code,
  }));

  const resPeriod = period.map(country =>({
    label: country.text,
    value: country.code,
  }));

  const resPartnerCountries = partnerCountries.map(country =>({
    label: country.text,
    value: country.PartnerCode,
  }));
  
  const resReportCountries = reportCountries.map(country =>({
    label: country.text,
    value: country.reporterCode,
  }));

  const resCustomCodeCountries = customCodeCountries.map(country =>({
    label: country.text,
    value: country.id,
  }));
  
  const resModeOfTransportCodes = modeOfTransportCodes.map(country =>({
    label: country.text,
    value: country.id,
  }));

  const resProducts = products.map(country =>({
    label: country.text,
    value: country.id,
  }));

  const resService = services.map(country =>({
    label: country.text,
    value: country.id,
  }));

  return (
    <Grid2 container direction={"column"} paddingInline={"10%"} paddingBlock={"5%"} gap={"24px"}>
      <Typography variant="h3" fontFamily={"gantari"} fontWeight={100} color="#ffffff">TradeMar</Typography>
      <Autocomplete
        disablePortal
        options={resTypeCode}
        value={typeCodeValue}
        onChange={(event, newValue) => setTypeCodeValue(newValue)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Type Code" />}
      />
      <Autocomplete
        disablePortal
        options={resFreqCode}
        value={freqCodeValue}
        onChange={(event, newValue) => setFreqCodeValue(newValue)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Frequency Code" />}
      />
      <Autocomplete
        disablePortal
        options={resClCode}
        value={clCodeValue}
        onChange={(event, newValue) => setClCodeValue(newValue)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Trade (IMTS) classifications: HS, SITC, BEC or EBOPS." />}
      />
      <Autocomplete
        disablePortal
        options={resFlowCode}
        value={flowCodeValue}
        onChange={(event, newValue) => setFlowCodeValue(newValue)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Trade flow or sub-flow (imports, exports)" />}
      />
      <Autocomplete
        disablePortal
        options={resReportCountries}
        value={reportCountriesValue}
        onChange={(event, newValue) => setReportCountriesValue(newValue)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Report Countries" />}
      />
      <Autocomplete
        disablePortal
        options={resPeriod}
        value={dateValue}
        onChange={(event, newValue) => setDateValue(newValue)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Period" />}
      />
      <Autocomplete
        disablePortal
        options={resPartnerCountries}
        value={partnerCountriesValue}
        onChange={(event, newValue) => setPartnerCountriesValue(newValue)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Partner Countries" />}
      />
      <Autocomplete
        disablePortal
        options={resPartnerCountries}
        value={partner2CountriesValue}
        onChange={(event, newValue) => setPartner2CountriesValue(newValue)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Partner Countries 2" />}
      />
      <Autocomplete
        disablePortal
        options={resCustomCodeCountries}
        value={customCodeCountriesValue}
        onChange={(event, newValue) => setCustomCodeCountriesValue(newValue)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Custom Code Countries" />}
      />
      <Autocomplete
        disablePortal
        options={resModeOfTransportCodes}
        value={modeOfTransportCodesValue}
        onChange={(event, newValue) => setModeOfTransportCodesValue(newValue)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Mode Of Transport Codes" />}
      />
      <Autocomplete
        disablePortal
        options={resProducts}
        value={productsValue}
        onChange={(event, newValue) => setProductsValue(newValue)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Products" />}
      />
      <Autocomplete
        disablePortal
        options={resService}
        value={serviceValue}
        onChange={(event, newValue) => setServiceValue(newValue)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Service" />}
      />
      <Button onClick={() => handleSubmit()} variant="contained">Download CSV</Button>
      <Button onClick={() => handleSubmit("xlsx")} variant="contained">Download XLSX</Button>


      <Grid2 container direction={"column"} spacing={4}>
        <Grid2 size={{ xs: 12, lg: 6 }}>
          {ChartCard(data, "GeoChart")}
        </Grid2>
        <Grid2 size={{ xs: 12, lg: 6 }}>
          {ChartCard(data2, "BubbleChart")}
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

export default App;
