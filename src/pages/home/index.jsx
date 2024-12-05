import { Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import ToggleButtonInput from '../../components/ToggleButtonInput';
import DownloadButton from '../../components/DownloadButton';
import useApi from '../../hooks/useApi';
import AutocompleteInput from '../../components/AutocompleteInput';
import { getApiUrl, mapData, availablePeriod, filteredClCode } from '../../utils/utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger({ context: 'HomePage' });

function App() {
  const [filters, setFilters] = useState({
    reportCountries: [],
    partnerCountries: [],
    partner2Countries: [],
    customCodeCountries: [],
    modeOfTransportCodes: [],
    products: [],
    service: [],
    typeCode: 'C',
    freqCode: 'A',
    clCode: 'HS',
    flowCode: [],
    period: [],
  });

  const { data: reportCountries } = useApi('reporters');
  const { data: partnerCountries } = useApi('partners');
  const { data: customCodeCountries } = useApi('custom_code');
  const { data: modeOfTransportCodes } = useApi('motc');
  const { data: products, loading } = useApi('products', { productType: filters.clCode });
  const { data: services } = useApi('services');

  const resPeriod = availablePeriod(filters.freqCode).map((period) => ({ label: period.text, value: period.code }));
  const resReportCountries = mapData(reportCountries, 'text', 'reporterCode');
  const resPartnerCountries = mapData(partnerCountries, 'text', 'PartnerCode');
  const resCustomCodeCountries = mapData(customCodeCountries, 'text', 'id');
  const resModeOfTransportCodes = mapData(modeOfTransportCodes, 'text', 'id');
  const resProducts = mapData(products, 'text', 'id');
  const resService = mapData(services, 'text', 'id');

  useEffect(() => {
    if (filters.typeCode === 'S') {
      setFilters((prevFilters) => ({ ...prevFilters, products: [] }));
    }
  }, [filters.typeCode]);

  useEffect(() => {
    availablePeriod(filters.freqCode);
    setFilters((prevFilters) => ({ ...prevFilters, period: null }));
  }, [filters.freqCode]);

  const handleChange = (field, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
  };

  const handleSubmit = (format, fromDb = false) => {
    const apiUrl = getApiUrl(format, fromDb);
    logger.time('Request Time');

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
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
        logger.timeEnd('Request Time');
      })
      .catch((error) => logger.error('Error:', error));
  };

  const manyFiles = (format, fromDb = false) => {
    const apiUrl = getApiUrl(format, fromDb, true);
    logger.time('Request Time');

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
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
        logger.timeEnd('Request Time');
      })
      .catch((error) => logger.error('Error:', error));
  };

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
              value={filters.typeCode}
              onChange={(newValue) => {
                handleChange('typeCode', newValue);
                handleChange('clCode', newValue === 'S' ? 'EB' : 'HS');
              }}
              options={[
                { label: 'Commodities', value: 'C' },
                { label: 'Services', value: 'S' },
              ]}
            />
          </Grid>
          <Grid>
            <ToggleButtonInput
              value={filters.freqCode}
              onChange={(newValue) => handleChange('freqCode', newValue)}
              options={[
                { label: 'Annual', value: 'A' },
                { label: 'Monthly', value: 'M' },
              ]}
            />
          </Grid>
          <Grid>
            <ToggleButtonInput
              value={filters.clCode}
              onChange={(newValue) => handleChange('clCode', newValue)}
              options={filteredClCode(filters.typeCode)}
            />
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
              label={filters.typeCode === 'C' ? 'Products' : 'Service'}
              value={filters.typeCode === 'C' ? filters.products : filters.service}
              onChange={(value) => handleChange(filters.typeCode === 'C' ? 'products' : 'service', value)}
              options={
                filters.typeCode === 'C'
                  ? loading
                    ? [{ label: 'Loading...', value: 'loading' }]
                    : resProducts
                  : loading
                    ? [{ label: 'Loading...', value: 'loading' }]
                    : resService
              }
            />
          </Grid>
          <Grid size={6}>
            <AutocompleteInput
              label="Period"
              value={filters.period}
              onChange={(value) => handleChange('period', value)}
              options={resPeriod}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={3}>
            <AutocompleteInput
              label="Trade flow"
              value={filters.flowCode}
              onChange={(value) => handleChange('flowCode', value)}
              options={[
                { label: 'Import', value: 'M' },
                { label: 'Export', value: 'X' },
              ]}
            />
          </Grid>
          <Grid size={3}>
            <AutocompleteInput
              label="Report Countries"
              value={filters.reportCountries}
              onChange={(value) => handleChange('reportCountries', value)}
              options={resReportCountries}
            />
          </Grid>
          <Grid size={3}>
            <AutocompleteInput
              label="Partner Countries"
              value={filters.partnerCountries}
              onChange={(value) => handleChange('partnerCountries', value)}
              options={resPartnerCountries}
            />
          </Grid>
          <Grid size={3}>
            <AutocompleteInput
              label="Partner Countries 2"
              value={filters.partnerCountries}
              onChange={(value) => handleChange('partner2Countries', value)}
              options={resPartnerCountries}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={3}>
            <AutocompleteInput
              label="Custom Code Countries"
              value={filters.customCodeCountries}
              onChange={(value) => handleChange('customCodeCountries', value)}
              options={resCustomCodeCountries}
            />
          </Grid>
          <Grid size={3}>
            <AutocompleteInput
              label="Mode Of Transport Codes"
              value={filters.modeOfTransportCodes}
              onChange={(value) => handleChange('modeOfTransportCodes', value)}
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
        <Button onClick={() => manyFiles('csv')} variant="contained">
          Download Many Files (csv)
        </Button>
        <Button onClick={() => manyFiles('xlsx')} variant="contained">
          Download Many Files (xlsx)
        </Button>
      </Grid>

      <Typography color="#ffffff" variant="h5" fontFamily={'gantari'} fontWeight={100}>
        Download data from Database:
      </Typography>
      <Grid container spacing={2}>
        <DownloadButton onClick={handleSubmit} format="csv" fromDb={true} />
        <DownloadButton onClick={handleSubmit} format="xlsx" fromDb={true} />
      </Grid>
    </Grid>
  );
}

export default App;
