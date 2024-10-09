import { Button, Grid2, Typography } from "@mui/material"
import ChartCard from "../../components/chartCard"
import React from "react";
import { useEffect, useState } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import BasicDateField from "../../components/DatePicker";
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
  const [becProducts, setBecProducts] = useState([]);
  const [hsProducts, setHsProducts] = useState([]);
  const [sitcProducts, setSitcProducts] = useState([]);
  const [ebopsService, setEbopsService] = useState([]);


  const [reportCountriesValue, setReportCountriesValue] = useState(null);
  const [partnerCountriesValue, setPartnerCountriesValue] = useState(null);
  const [partner2CountriesValue, setPartner2CountriesValue] = useState(null);
  const [customCodeCountriesValue, setCustomCodeCountriesValue] = useState(null);
  const [modeOfTransportCodesValue, setModeOfTransportCodesValue] = useState(null);
  const [becProductsValue, setBecProductsValue] = useState(null);
  const [hsProductsValue, setHsProductsValue] = useState(null);
  const [sitcProductsValue, setSitcProductsValue] = useState(null);
  const [ebopsServiceValue, setEbopsServiceValue] = useState(null);
  const [typeCodeValue, setTypeCodeValue] = useState(null);
  const [freqCodeValue, setFreqCodeValue] = useState(null);
  const [clCodeValue, setClCodeValue] = useState(null);

  const handleSubmit = (format) => {
    const selectedValues = {
      reportCountriesValue,
      partnerCountriesValue,
      partner2CountriesValue,
      customCodeCountriesValue,
      modeOfTransportCodesValue,
      becProductsValue,
      hsProductsValue,
      sitcProductsValue,
      ebopsServiceValue,
      typeCodeValue,
      freqCodeValue,
      clCodeValue,
    };

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
      "text": "service",
      "code": "S",
    },
  ]

  const freqCode = [
    {
      "text": "Annual",
      "code": "A",
    },
    {
      "text": "Quarterly",
      "code": "Q",
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
      "text": "EBOPS",
      "code": "EBOPS",
    },
  ]

  function fetchReporters() {
    axios.get('Reporters.json')
      .then(response => {
        setReportCountries((response.data.results))
      })
      .catch(error => {
        console.error('Erro ao fazer a requisição:', error);
      });
  }

  function fetchPartners() {
    axios.get('partnerAreas.json') 
      .then(response => {
        setPartnerCountries((response.data.results))
      })
      .catch(error => {
        console.error('Erro ao fazer a requisição:', error);
      });
  }

  function fetchCustomCode() {
    axios.get('CustomsCodes.json') 
      .then(response => {
        setCustomCodeCountries((response.data.results))
      })
      .catch(error => {
        console.error('Erro ao fazer a requisição:', error);
      });
  }

  function fetchModeOfTransportCodes() {
    axios.get('ModeOfTransportCodes.json') 
      .then(response => {
        setModeOfTransportCodes((response.data.results))
      })
      .catch(error => {
        console.error('Erro ao fazer a requisição:', error);
      });
  }

  function fetchBecProducts() {
    axios.get('B4.json')
      .then(responseB4 => {
        const productsB4 = responseB4.data.results;
        axios.get('B5.json')
          .then(responseB5 => {
            const productsB5 = responseB5.data.results;
            const combinedBecProducts = [...productsB4, ...productsB5];

            setBecProducts(combinedBecProducts);
          })
          .catch(error => {
            console.error('Error fetching B5.json:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching B4.json:', error);
      });
    }

  function fetchHsProducts() {
    const hs_urls = [
      // "H0.json",
      // "H1.json",
      // "H2.json",
      // "H3.json",
      // "H4.json",
      // "H5.json",
      // "H6.json",
      "HS.json",
    ]
    axios.all(hs_urls.map(url => axios.get(url)))
      .then(axios.spread((...responses) => {
        const combinedHsProducts = responses.reduce((acc, response) => {
          return [...acc, ...response.data.results];
        }, []);

        setHsProducts(combinedHsProducts);
      }))
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  function fetchSitcProducts() {
    const sitc_urls = [
      // "S1.json",
      // "S2.json",
      // "S3.json",
      // "S4.json",
      "SS.json"
    ]
    axios.all(sitc_urls.map(url => axios.get(url)))
      .then(axios.spread((...responses) => {
        const combinedSitcProducts = responses.reduce((acc, response) => {
          return [...acc, ...response.data.results];
        }, []);

        setSitcProducts(combinedSitcProducts);
      }))
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  function fetchEbopsServices() {
    const ebops_url = [
      // "EB02.json",
      // "EB10.json",
      // "EB10S.json",
      "EB.json",
    ]
    const fetchRequests = ebops_url.map(url => axios.get(url));
    Promise.all(fetchRequests)
      .then(responses => {
        const combinedProducts = responses.reduce((acc, response) => {
          return acc.concat(response.data.results);
        }, []);

        setEbopsService(combinedProducts);
      })
      .catch(error => {
        console.error('Error fetching the JSON files:', error);
      });
  }

  useEffect(() => {
    fetchReporters();
    fetchPartners();
    fetchCustomCode();
    fetchModeOfTransportCodes();
    fetchBecProducts();
    fetchHsProducts();
    fetchSitcProducts();
    fetchEbopsServices();
  }, [])

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

  const resBecProducts = becProducts.map(country =>({
    label: country.text,
    value: country.id,
  }));

  const resHsProducts = hsProducts.map(country =>({
    label: country.text,
    value: country.id,
  }));

  const resSitcProducts = sitcProducts.map(country =>({
    label: country.text,
    value: country.id,
  }));

  const resEbopsService = ebopsService.map(country =>({
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
        renderInput={(params) => <TextField {...params} label="Report Countries" />}
      />
      <Autocomplete
        disablePortal
        options={resFreqCode}
        value={freqCodeValue}
        onChange={(event, newValue) => setFreqCodeValue(newValue)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Report Countries" />}
      />
      <Autocomplete
        disablePortal
        options={resClCode}
        value={clCodeValue}
        onChange={(event, newValue) => setClCodeValue(newValue)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Report Countries" />}
      />
      <Autocomplete
        disablePortal
        options={resReportCountries}
        value={reportCountriesValue}
        onChange={(event, newValue) => setReportCountriesValue(newValue)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Report Countries" />}
      />
      <BasicDateField />
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
        options={resBecProducts}
        value={becProductsValue}
        onChange={(event, newValue) => setBecProductsValue(newValue)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="BEC Products" />}
      />
      <Autocomplete
        disablePortal
        options={resHsProducts}
        value={hsProductsValue}
        onChange={(event, newValue) => setHsProductsValue(newValue)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="HS Products" />}
      />
      <Autocomplete
        disablePortal
        options={resSitcProducts}
        value={sitcProductsValue}
        onChange={(event, newValue) => setSitcProductsValue(newValue)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="SITC Products" />}
      />
      <Autocomplete
        disablePortal
        options={resEbopsService}
        value={ebopsServiceValue}
        onChange={(event, newValue) => setEbopsServiceValue(newValue)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="EBOPS Service" />}
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
