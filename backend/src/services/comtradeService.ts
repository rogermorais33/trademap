import axios from 'axios';
import { RequestBody } from '../types';
import dotenv from 'dotenv';
import { writeToZip, writeToZipExcel } from './fileService';
import { saveTradeData } from './tradeService';
import fileRepository from '../repositories/fileRepository';

dotenv.config();

const COMTRADE_BASE_URL = 'https://comtradeapi.un.org/files/v1/app/reference';
const COMTRADE_REQUEST_URL = 'https://comtradeapi.un.org/data/v1/get';
const subscriptionKey = process.env.SUBSCRIPTION_KEY;

interface CountryItem {
  label: string;
  value: string;
}

interface ParamsType {
  reporterCode: CountryItem[];
  partnerCode: CountryItem[];
  partner2Code: CountryItem[];
  period: CountryItem[];
  cmdCode: CountryItem[];
  flowCode: CountryItem[];
  customCode: CountryItem[];
  motCode: CountryItem[];
  aggregateBy: CountryItem[];
  breakdownMode: CountryItem[];
  includeDesc: CountryItem[];
  [key: string]: CountryItem[];
}

interface CurrentCombination {
  [key: string]: CountryItem;
}

interface DataBody {
  typeCode: string;
  freqCode: string;
  clCode: string;
}

interface ResponseData {
  data: any;
  filename: string;
}

export async function fetchData(dataBody: RequestBody): Promise<any[]> {
  try {
    const params = generateParams(dataBody);
    const paramString = Object.entries(params)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    const baseUrl = `${COMTRADE_REQUEST_URL}/${dataBody.typeCode}/${dataBody.freqCode}/${dataBody.clCode}`;
    const comtradeUrl = `${baseUrl}?subscription-key=${subscriptionKey}${paramString ? `&${paramString}` : ''}`;
    console.log(`\nFINAL URL: ${comtradeUrl}\n`);

    const response = await axios.get(comtradeUrl);
    const data = response.data.data;

    await saveTradeData(data);

    return data;
  } catch (error) {
    throw new Error(`Failed to fetch data`);
  }
}

export async function getFilteredData(dataBody: RequestBody) {
  const params = generateParams(dataBody);
  const dt = await getFiles(params);
  console.log('returning data from getFilteredData');
  return dt;
}

export async function getFiles(filters: any) {
  try {
    console.log('Pegando os dados do banco de dados');
    const files = await fileRepository.findWithFilters(filters);
    return files;
  } catch (error) {
    console.log('Errorr ao pegar os dados');
    throw new Error(`Service Error: ${error}`);
  }
}

export async function fetchReferenceData(fileName: string): Promise<any> {
  try {
    const response = await axios.get(`${COMTRADE_BASE_URL}/${fileName}.json`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch ${fileName}`);
  }
}

export async function fetchProducts(productType: 'HS' | 'SITC' | 'BEC'): Promise<any[]> {
  try {
    const allProducts = {
      HS: [`${COMTRADE_BASE_URL}/HS.json`],
      SITC: [`${COMTRADE_BASE_URL}/SS.json`],
      BEC: [`${COMTRADE_BASE_URL}/B4.json`, `${COMTRADE_BASE_URL}/B5.json`],
    };
    const selectedProductsUrls = allProducts[productType];
    const responses = await Promise.all(selectedProductsUrls.map((url) => axios.get(url)));
    return responses.flatMap((response) => response.data.results);
  } catch (error) {
    throw new Error('Failed to fetch product data');
  }
}

export const generateParams = (body: any) => {
  const {
    reportCountries,
    partnerCountries,
    partner2Countries,
    customCodeCountries,
    modeOfTransportCodes,
    products,
    service,
    period,
    flowCode,
    aggregateBy,
    breakdownMode,
    includeDesc,
  } = body;

  const extractValues = (array: { label: string; value: string }[] | undefined) => {
    return array?.map((item) => item.value).join(',') || '';
  };

  const cmdCode =
    Array.isArray(products) && products.length > 0
      ? products
      : Array.isArray(service) && service.length > 0
        ? service
        : [];

  const params = {
    reporterCode: extractValues(reportCountries),
    period: extractValues(period),
    partnerCode: extractValues(partnerCountries),
    partner2Code: extractValues(partner2Countries),
    cmdCode: extractValues(cmdCode),
    flowCode: extractValues(flowCode),
    customCode: extractValues(customCodeCountries),
    motCode: extractValues(modeOfTransportCodes),
    aggregateBy: extractValues(aggregateBy),
    breakdownMode: extractValues(breakdownMode),
    includeDesc: extractValues(includeDesc),
  };
  console.log('PARAMS: ', params);

  return params;
};

const cleanParams = (params: ParamsType): ParamsType => {
  const cleanedParams = { ...params };
  for (const key in cleanedParams) {
    if (cleanedParams[key] === undefined || cleanedParams[key] === null) {
      delete cleanedParams[key];
      continue;
    }
    if (Array.isArray(cleanedParams[key])) {
      cleanedParams[key] = cleanedParams[key].filter((item: any) => item !== undefined);

      if (cleanedParams[key].length === 0) {
        delete cleanedParams[key];
      }
    }
  }
  return cleanedParams;
};

export async function generateURLs(dataBody: any, res: any, fileFormat: string) {
  const {
    reportCountries,
    partnerCountries,
    partner2Countries,
    customCodeCountries,
    modeOfTransportCodes,
    products,
    service,
    period,
    flowCode,
    aggregateBy,
    breakdownMode,
    includeDesc,
  } = dataBody;

  const cmdCode =
    Array.isArray(products) && products.length > 0
      ? products
      : Array.isArray(service) && service.length > 0
        ? service
        : [];

  const params: ParamsType = {
    reporterCode: reportCountries,
    partnerCode: partnerCountries,
    partner2Code: partner2Countries,
    period: period,
    cmdCode: cmdCode,
    flowCode: flowCode,
    customCode: customCodeCountries,
    motCode: modeOfTransportCodes,
    aggregateBy: aggregateBy,
    breakdownMode: breakdownMode,
    includeDesc: includeDesc,
  };
  console.log('MANY FILES - PARAMS: ', params);

  const cleanedParams = cleanParams(params);
  const allUrls = generateAllCombinations(cleanedParams);

  try {
    await makeRequestsWithDelay(allUrls, dataBody, 10000, res, fileFormat);
  } catch (error) {
    console.error('Error processing requests:', error);
  }
}

function generateAllCombinations(params: ParamsType): string[] {
  const entries = Object.entries(params);

  function combine(index: number, current: CurrentCombination): string[] {
    if (index === entries.length) {
      const queryString = Object.entries(current)
        .map(([key, value]) => `${key}=${value.value}`)
        .join('&');
      return [`subscription-key=${subscriptionKey}&${queryString}`];
    }
    const [key, values] = entries[index];
    const results: string[] = [];

    for (const value of values) {
      const combinations = combine(index + 1, {
        ...current,
        [key]: value,
      });
      results.push(...combinations);
    }
    return results;
  }
  return combine(0, {});
}

const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const makeRequestsWithDelay = async (
  allUrls: string[],
  dataBody: DataBody,
  delayMs: number = 10000,
  res: any,
  fileFormat: string,
): Promise<void> => {
  console.log('Total Combinations:', allUrls.length);
  console.log(`Delay between requests: ${delayMs}ms`);

  const allResponses: ResponseData[] = [];
  for (let [index, url] of allUrls.entries()) {
    let response;
    try {
      console.log(`\nMaking requests ${index + 1} of ${allUrls.length}`);

      const baseUrl = `${COMTRADE_REQUEST_URL}/${dataBody.typeCode}/${dataBody.freqCode}/${dataBody.clCode}`;
      const comtradeUrl = `${baseUrl}?${url}`;
      console.log(`URL: ${comtradeUrl}\n`);

      response = await axios.get(comtradeUrl);
      allResponses.push({
        data: response.data.data,
        filename: fileFormat === 'xlsx' ? `comtrade_data_${index}.xlsx` : `comtrade_data_${index}.csv`,
      });

      if (index < allUrls.length - 1) {
        console.log(`Waiting ${delayMs / 1000} seconds before next request...`);
        await delay(delayMs);
      }
    } catch (error: any) {
      console.log('Last response received:', response?.data);
      console.error('Error in request:', error.message);

      if (error.response?.status === 429) {
        console.log('Rate limit reached. Increasing delay and trying again...');
        await delay(delayMs * 2);
        index--;
      }
    }
  }
  if (allResponses.length > 0) {
    console.log('Writing the zip');
    if (fileFormat === 'xlsx') {
      await writeToZipExcel(allResponses, res);
    } else {
      await writeToZip(allResponses, res);
    }
  }
  console.log('\nAll requests have been completed!');
};
