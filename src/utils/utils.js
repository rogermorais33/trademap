export const getApiUrl = (format, fromDb = false, isZipDownload = false) => {
  const baseUrl = process.env.REACT_APP_BASE_URL_API;
  const endpoint = isZipDownload ? '/downloadZip' : '/convert';
  const url = `${baseUrl}${endpoint}${format ? '?format=' + format : ''}`;
  if (fromDb) {
    return `${baseUrl}/getDataFromDb${format ? '?format=' + format : ''}`;
  }
  return url;
};

export const mapData = (data, labelKey, valueKey) =>
  data ? data.map((item) => ({ label: item[labelKey], value: item[valueKey] })) : [];

export const availablePeriod = (freqCode) => {
  const year = 1962;
  const period = [];

  for (let currentYear = new Date().getFullYear() - 1; currentYear >= year; currentYear--) {
    if (freqCode === 'M') {
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
};

export const filteredClCode = (typeCodeValue) =>
  [
    { label: 'HS', value: 'HS' },
    { label: 'SITC', value: 'SITC' },
    { label: 'BEC', value: 'BEC' },
    { label: 'EB', value: 'EB' },
  ].filter((item) => (typeCodeValue === 'C' && item.value !== 'EB') || (typeCodeValue === 'S' && item.value === 'EB'));
