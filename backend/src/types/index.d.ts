export interface QueryParams {
  format: string;
}

export interface RequestBody {
  typeCodeValue: string;
  freqCodeValue: string;
  clCodeValue: string;
  reportCountriesValue?: { value: string };
  partnerCountriesValue?: { value: string };
  partner2CountriesValue?: { value: string };
  customCodeCountriesValue?: { value: string };
  modeOfTransportCodesValue?: { value: string };
  productsValue?: { value: string };
  serviceValue?: { value: string };
  period?: { value: string };
  flowCodeValue?: { value: string };
  aggregateBy?: { value: string };
  breakdownMode?: { value: string };
  includeDesc?: { value: string };
}
