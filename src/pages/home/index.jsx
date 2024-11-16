import { Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCallback, useEffect, useState } from 'react';
import ToggleButtonInput from '../../components/ToggleButtonInput';
import DownloadButton from '../../components/DownloadButton';
import useApi from '../../hooks/useApi';
import AutocompleteInput from '../../components/AutocompleteInput';

function App() {
  const [reportCountriesValue, setReportCountriesValue] = useState([]);
  const [partnerCountriesValue, setPartnerCountriesValue] = useState([]);
  const [partner2CountriesValue, setPartner2CountriesValue] = useState([]);
  const [customCodeCountriesValue, setCustomCodeCountriesValue] = useState([]);
  const [modeOfTransportCodesValue, setModeOfTransportCodesValue] = useState([]);
  const [productsValue, setProductsValue] = useState([]);
  const [serviceValue, setServiceValue] = useState([]);
  const [typeCodeValue, setTypeCodeValue] = useState('C');
  const [freqCodeValue, setFreqCodeValue] = useState('A');
  const [clCodeValue, setClCodeValue] = useState('HS');
  const [flowCodeValue, setFlowCodeValue] = useState([]);
  const [period, setPeriod] = useState([]);

  const { data: reportCountries } = useApi('reporters');
  const { data: partnerCountries } = useApi('partners');
  const { data: customCodeCountries } = useApi('custom_code');
  const { data: modeOfTransportCodes } = useApi('motc');
  const { data: products } = useApi('products');
  const { data: services } = useApi('services');

  const availablePeriod = useCallback(() => {
    const year = 1962;
    const period = [];

    for (let currentYear = new Date().getFullYear() - 1; currentYear >= year; currentYear--) {
      if (freqCodeValue === 'M') {
        for (let month = 12; month > 0; month--) {
          const formattedMonth = month.toString().padStart(2, '0');
          const yearMonth = `${currentYear}/${formattedMonth}`;
          period.push({
            text: yearMonth,
            code: `${currentYear}${formattedMonth}`,
          });
        }
      } else {
        period.push({
          text: currentYear.toString(),
          code: currentYear.toString(),
        });
      }
    }
    return period;
  }, [freqCodeValue]);

  const mapData = (data, labelKey, valueKey) =>
    data ? data.map((item) => ({ label: item[labelKey], value: item[valueKey] })) : [];

  const filteredClCode = [
    { label: 'HS', value: 'HS' },
    { label: 'SITC', value: 'SITC' },
    { label: 'BEC', value: 'BEC' },
    { label: 'EB', value: 'EB' },
  ].filter((item) => (typeCodeValue === 'C' && item.value !== 'EB') || (typeCodeValue === 'S' && item.value === 'EB'));

  const resPeriod = availablePeriod().map((period) => ({ label: period.text, value: period.code }));
  const resReportCountries = mapData(reportCountries, 'text', 'reporterCode');
  const resPartnerCountries = mapData(partnerCountries, 'text', 'PartnerCode');
  const resCustomCodeCountries = mapData(customCodeCountries, 'text', 'id');
  const resModeOfTransportCodes = mapData(modeOfTransportCodes, 'text', 'id');
  const resProducts = mapData(products, 'text', 'id');
  const resService = mapData(services, 'text', 'id');

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
      period,
      flowCodeValue,
    };
    console.log('testing', selectedValues);

    fetch(`http://localhost:5000/convert${format ? '?format=' + format : ''}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedValues),
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = format === 'xlsx' ? 'data.xlsx' : 'data.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error('Error:', error));
  }

  function manyFiles(format) {
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
      period,
      flowCodeValue,
    };
    console.log('testing', selectedValues);

    fetch(`http://localhost:5000/downloadZip${format ? '?format=' + format : ''}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedValues),
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'data.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error('Error:', error));
  }

  useEffect(() => {
    availablePeriod();
    setPeriod(null);
  }, [freqCodeValue, availablePeriod]);

  return (
    <Grid container direction={'column'} paddingInline={'20%'} paddingBlock={'5%'} gap={'48px'}>
      <Typography color="#ffffff" variant="h3" fontFamily={'gantari'} fontWeight={100}>
        TradeMar
      </Typography>
      <Grid container direction={'column'} gap={'24px'}>
        <Typography color="#ffffff" variant="h5" fontFamily={'gantari'} fontWeight={100}>
          What are you looking for?
        </Typography>
        <Grid container direction={'row'} spacing={2} height={'56px'}>
          <Grid>
            <ToggleButtonInput
              value={typeCodeValue}
              onChange={setTypeCodeValue}
              options={[
                { label: 'Commodities', value: 'C' },
                { label: 'Services', value: 'S' },
              ]}
            />
          </Grid>
          <Grid>
            <ToggleButtonInput
              value={freqCodeValue}
              onChange={setFreqCodeValue}
              options={[
                { label: 'Annual', value: 'A' },
                { label: 'Monthly', value: 'M' },
              ]}
            />
          </Grid>
          <Grid>
            <ToggleButtonInput value={clCodeValue} onChange={setClCodeValue} options={filteredClCode} />
          </Grid>
        </Grid>
      </Grid>

      <Grid container direction={'column'} gap={'24px'}>
        <Typography color="#ffffff" variant="h5" fontFamily={'gantari'} fontWeight={100}>
          Refine your serach:
        </Typography>

        <Grid container spacing={2}>
          <Grid size={6}>
            <AutocompleteInput
              label={typeCodeValue === 'C' ? 'Products' : 'Service'}
              value={typeCodeValue === 'C' ? productsValue : serviceValue}
              onChange={typeCodeValue === 'C' ? setProductsValue : setServiceValue}
              options={typeCodeValue === 'C' ? resProducts : resService}
            />
          </Grid>
          <Grid size={6}>
            <AutocompleteInput label="Period" value={period} onChange={setPeriod} options={resPeriod} />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={3}>
            <AutocompleteInput
              label="Trade flow"
              value={flowCodeValue}
              onChange={setFlowCodeValue}
              options={[
                { label: 'Import', value: 'M' },
                { label: 'Export', value: 'X' },
              ]}
            />
          </Grid>
          <Grid size={3}>
            <AutocompleteInput
              label="Report Countries"
              value={reportCountriesValue}
              onChange={setReportCountriesValue}
              options={resReportCountries}
            />
          </Grid>
          <Grid size={3}>
            <AutocompleteInput
              label="Partner Countries"
              value={partnerCountriesValue}
              onChange={setPartnerCountriesValue}
              options={resPartnerCountries}
            />
          </Grid>
          <Grid size={3}>
            <AutocompleteInput
              label="Partner Countries 2"
              value={partner2CountriesValue}
              onChange={setPartner2CountriesValue}
              options={resPartnerCountries}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={3}>
            <AutocompleteInput
              label="Custom Code Countries"
              value={customCodeCountriesValue}
              onChange={setCustomCodeCountriesValue}
              options={resCustomCodeCountries}
            />
          </Grid>
          <Grid size={3}>
            <AutocompleteInput
              label="Mode Of Transport Codes"
              value={modeOfTransportCodesValue}
              onChange={setModeOfTransportCodesValue}
              options={resModeOfTransportCodes}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <DownloadButton onClick={handleSubmit} format="csv" />
        <DownloadButton onClick={handleSubmit} format="xlsx" />
      </Grid>
      <Grid container spacing={2}>
        <Button onClick={() => manyFiles("csv")} variant='contained'>
          Download Many Files (CSV)
        </Button>
      </Grid>
    </Grid>
  );
}

export default App;
