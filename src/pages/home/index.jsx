import { Button, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material"
import Grid from '@mui/material/Grid2';
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
  const [typeCodeValue, setTypeCodeValue] = useState("C");
  const [freqCodeValue, setFreqCodeValue] = useState("A");
  const [clCodeValue, setClCodeValue] = useState("HS");
  const [flowCodeValue, setFlowCodeValue] = useState(null);

  const [dateValue, setDateValue] = useState(null);

  function handleSubmit(format) {
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

    for (let year = 1962; year <= currentYear - 1; year++) {
      if (freqCodeValue === "M") {
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
  }, [periodToFetch])

  const resTypeCode = typeCode.map(country => ({
    label: country.text,
    value: country.code,
  }));

  const resFreqCode = freqCode.map(country => ({
    label: country.text,
    value: country.code,
  }));

  const resClCode = clCode.map(country => ({
    label: country.text,
    value: country.code,
  }));

  const resFlowCode = flowCode.map(country => ({
    label: country.text,
    value: country.code,
  }));

  const resPeriod = period.map(country => ({
    label: country.text,
    value: country.code,
  }));

  const resPartnerCountries = partnerCountries.map(country => ({
    label: country.text,
    value: country.PartnerCode,
  }));

  const resReportCountries = reportCountries.map(country => ({
    label: country.text,
    value: country.reporterCode,
  }));

  const resCustomCodeCountries = customCodeCountries.map(country => ({
    label: country.text,
    value: country.id,
  }));

  const resModeOfTransportCodes = modeOfTransportCodes.map(country => ({
    label: country.text,
    value: country.id,
  }));

  const resProducts = products.map(country => ({
    label: country.text,
    value: country.id,
  }));

  const resService = services.map(country => ({
    label: country.text,
    value: country.id,
  }));


  return (
    <Grid container direction={"column"} paddingInline={"20%"} paddingBlock={"5%"} gap={"48px"}>
      <Typography color="#ffffff" variant="h3" fontFamily={"gantari"} fontWeight={100}>TradeMar</Typography>
      <Grid container direction={"column"} gap={"24px"}>
        <Typography color="#ffffff" variant="h5" fontFamily={"gantari"} fontWeight={100}>What are you looking for?</Typography>
        <Grid container direction={"row"} spacing={2} height={"56px"}>
          <Grid>
            <ToggleButtonGroup
              color="primary"
              value={typeCodeValue}
              exclusive
              onChange={(event, newValue) => { if (newValue != null) { setTypeCodeValue(newValue) } }}
              aria-label="Platform"
              sx={{ height: "56px" }}
            >
              {resTypeCode.map((dict) => (
                <ToggleButton value={dict.value}>{dict.label}</ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
          <Grid>
            <ToggleButtonGroup
              color="primary"
              value={freqCodeValue}
              exclusive
              onChange={(event, newValue) => { if (newValue != null) { setFreqCodeValue(newValue) } }}
              aria-label="Platform"
              sx={{ height: "56px" }}
            >
              {resFreqCode.map((dict) => (
                <ToggleButton value={dict.value}>{dict.label}</ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
          <Grid>
            <ToggleButtonGroup
              color="primary"
              value={clCodeValue}
              exclusive
              onChange={(event, newValue) => { if (newValue != null) { setClCodeValue(newValue) } }}
              aria-label="Platform"
              sx={{ height: "56px" }}
            >
              {resClCode.map((dict) => (
                <ToggleButton value={dict.value}>{dict.label}</ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Grid>

      <Grid container direction={"column"} gap={"24px"}>
        <Typography color="#ffffff" variant="h5" fontFamily={"gantari"} fontWeight={100}>Refine your serach:</Typography>

        <Grid container spacing={2}>
          <Grid size={6}>
            {typeCodeValue === "C"
              ?
              <Autocomplete
                disablePortal
                options={resProducts}
                value={productsValue}
                onChange={(event, newValue) => setProductsValue(newValue)}
                size="5"
                renderInput={(params) => <TextField {...params} label="Products" />}
              />
              :
              <Autocomplete
                disablePortal
                options={resService}
                value={serviceValue}
                onChange={(event, newValue) => setServiceValue(newValue)}
                size="5"
                renderInput={(params) => <TextField {...params} label="Service" />}
              />
            }
          </Grid>
          <Grid size={6}>
            <Autocomplete
              disablePortal
              options={resPeriod.reverse()}
              value={dateValue}
              onChange={(event, newValue) => setDateValue(newValue)}
              renderInput={(params) => <TextField {...params} label="Period" />}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={3}>
            <Autocomplete
              disablePortal
              options={resFlowCode}
              value={flowCodeValue}
              onChange={(event, newValue) => setFlowCodeValue(newValue)}
              renderInput={(params) => <TextField {...params} label="Trade flow or sub-flow (imports, exports)" />}
            />
          </Grid>

          <Grid size={3}>
            <Autocomplete
              disablePortal
              options={resReportCountries}
              value={reportCountriesValue}
              onChange={(event, newValue) => setReportCountriesValue(newValue)}
              renderInput={(params) => <TextField {...params} label="Report Countries" />}
            />
          </Grid>

          <Grid size={3}>
            <Autocomplete
              disablePortal
              options={resPartnerCountries}
              value={partnerCountriesValue}
              onChange={(event, newValue) => setPartnerCountriesValue(newValue)}
              renderInput={(params) => <TextField {...params} label="Partner Countries" />}
            />
          </Grid>

          <Grid size={3}>

            <Autocomplete
              disablePortal
              options={resPartnerCountries}
              value={partner2CountriesValue}
              onChange={(event, newValue) => setPartner2CountriesValue(newValue)}
              renderInput={(params) => <TextField {...params} label="Partner Countries 2" />}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={3}>
            <Autocomplete
              disablePortal
              options={resCustomCodeCountries}
              value={customCodeCountriesValue}
              onChange={(event, newValue) => setCustomCodeCountriesValue(newValue)}
              renderInput={(params) => <TextField {...params} label="Custom Code Countries" />}
            />
          </Grid>

          <Grid size={3}>
            <Autocomplete
              disablePortal
              options={resModeOfTransportCodes}
              value={modeOfTransportCodesValue}
              onChange={(event, newValue) => setModeOfTransportCodesValue(newValue)}
              renderInput={(params) => <TextField {...params} label="Mode Of Transport Codes" />}
            />
          </Grid>
        </Grid>
      </Grid>
      
      <Grid container spacing={2}>
      <Button onClick={() => {handleSubmit()}} variant="contained">Download CSV</Button>
      <Button onClick={() => handleSubmit("xlsx")} variant="contained">Download XLSX</Button>
      </Grid>
    </Grid>
  );
}

export default App;
