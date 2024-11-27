import axios from 'axios';
import { RequestBody } from '../types';
import dotenv from 'dotenv';
import { writeToZip } from './fileService';
import { saveTradeData } from './tradeService';

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
  typeCodeValue: string;
  freqCodeValue: string;
  clCodeValue: string;
}

export async function fetchData(dataBody: RequestBody): Promise<any[]> {
  try {
    const paramString = generateParams(dataBody);
    const baseUrl = `${COMTRADE_REQUEST_URL}/${dataBody.typeCodeValue}/${dataBody.freqCodeValue}/${dataBody.clCodeValue}`;
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
    reportCountriesValue,
    partnerCountriesValue,
    partner2CountriesValue,
    customCodeCountriesValue,
    modeOfTransportCodesValue,
    productsValue,
    serviceValue,
    period,
    flowCodeValue,
    aggregateBy,
    breakdownMode,
    includeDesc,
  } = body;

  const extractValues = (array: { label: string; value: string }[] | undefined) => {
    return array?.map((item) => item.value).join(',') || '';
  };

  const cmdCode =
    Array.isArray(productsValue) && productsValue.length > 0
      ? productsValue
      : Array.isArray(serviceValue) && serviceValue.length > 0
        ? serviceValue
        : [];

  const params = {
    reporterCode: extractValues(reportCountriesValue),
    period: extractValues(period),
    partnerCode: extractValues(partnerCountriesValue),
    partner2Code: extractValues(partner2CountriesValue),
    cmdCode: extractValues(cmdCode),
    flowCode: extractValues(flowCodeValue),
    customCode: extractValues(customCodeCountriesValue),
    motCode: extractValues(modeOfTransportCodesValue),
    aggregateBy: extractValues(aggregateBy),
    breakdownMode: extractValues(breakdownMode),
    includeDesc: extractValues(includeDesc),
  };
  console.log('PARAMS: ', params);

  return Object.entries(params)
    .filter(([_, value]) => value !== '')
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
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

export async function generateURLs(dataBody: any, res: any) {
  const {
    reportCountriesValue,
    partnerCountriesValue,
    partner2CountriesValue,
    customCodeCountriesValue,
    modeOfTransportCodesValue,
    productsValue,
    serviceValue,
    period,
    flowCodeValue,
    aggregateBy,
    breakdownMode,
    includeDesc,
  } = dataBody;

  const cmdCode =
    Array.isArray(productsValue) && productsValue.length > 0
      ? productsValue
      : Array.isArray(serviceValue) && serviceValue.length > 0
        ? serviceValue
        : [];

  const params: ParamsType = {
    reporterCode: reportCountriesValue,
    partnerCode: partnerCountriesValue,
    partner2Code: partner2CountriesValue,
    period: period,
    cmdCode: cmdCode,
    flowCode: flowCodeValue,
    customCode: customCodeCountriesValue,
    motCode: modeOfTransportCodesValue,
    aggregateBy: aggregateBy,
    breakdownMode: breakdownMode,
    includeDesc: includeDesc,
  };
  console.log('MANY FILES - PARAMS: ', params);

  const cleanedParams = cleanParams(params);
  const allUrls = generateAllCombinations(cleanedParams);

  try {
    await makeRequestsWithDelay(allUrls, dataBody, 10000, res);
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
): Promise<void> => {
  console.log('Total Combinations:', allUrls.length);
  console.log(`Delay between requests: ${delayMs}ms`);

  let allResponses = [];
  for (let [index, url] of allUrls.entries()) {
    let response;
    try {
      console.log(`\nMaking requests ${index + 1} of ${allUrls.length}`);

      const baseUrl = `${COMTRADE_REQUEST_URL}/${dataBody.typeCodeValue}/${dataBody.freqCodeValue}/${dataBody.clCodeValue}`;
      const comtradeUrl = `${baseUrl}?${url}`;
      console.log(`URL: ${comtradeUrl}\n`);

      response = await axios.get(comtradeUrl);
      allResponses.push({
        data: response.data.data,
        filename: `comtrade_data_${index}.csv`,
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
    await writeToZip(allResponses, res);
  }
  console.log('\nAll requests have been completed!');
};
