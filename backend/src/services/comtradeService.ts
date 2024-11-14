import axios from 'axios';
import { RequestBody } from '../types';
import dotenv from 'dotenv';

dotenv.config();

const COMTRADE_BASE_URL = 'https://comtradeapi.un.org/files/v1/app/reference';
const subscriptionKey = process.env.SUBSCRIPTION_KEY;

export async function fetchData(dataBody: RequestBody): Promise<any[]> {
  try {
    const paramString = generateParams(dataBody);
    const baseUrl = `https://comtradeapi.un.org/data/v1/get/${dataBody.typeCodeValue}/${dataBody.freqCodeValue}/${dataBody.clCodeValue}`;
    const comtradeUrl = `${baseUrl}?subscription-key=${subscriptionKey}${paramString ? `&${paramString}` : ''}`;
    console.log(`\nFINAL URL: ${comtradeUrl}\n`);

    const response = await axios.get(comtradeUrl);
    return response.data.data;
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

export async function fetchProducts(): Promise<any[]> {
  try {
    const productUrls = [
      `${COMTRADE_BASE_URL}/HS.json`,
      `${COMTRADE_BASE_URL}/B4.json`,
      `${COMTRADE_BASE_URL}/B5.json`,
      `${COMTRADE_BASE_URL}/SS.json`,
    ];
    const responses = await Promise.all(productUrls.map((url) => axios.get(url)));
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
