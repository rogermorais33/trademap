export interface QueryParams {
  format: string;
}

export interface RequestBody {
  typeCode: string;
  freqCode: string;
  clCode: string;
  reportCountries?: { value: string };
  partnerCountries?: { value: string };
  partner2Countries?: { value: string };
  customCodeCountries?: { value: string };
  modeOfTransportCodes?: { value: string };
  products?: { value: string };
  service?: { value: string };
  period?: { value: string };
  flowCode?: { value: string };
  aggregateBy?: { value: string };
  breakdownMode?: { value: string };
  includeDesc?: { value: string };
}
