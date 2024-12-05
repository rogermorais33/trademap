import { useState, useEffect } from 'react';
import axios from 'axios';
import { createLogger } from '../utils/logger';

const logger = createLogger({ context: 'useApi' });
const API_URL = process.env.REACT_APP_BASE_URL_API;
logger.info('URL loaded: ', API_URL);

const useApi = (endpoint, params = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        logger.info('PARAMS: ', params);
        const response = await axios.get(`${API_URL}/${endpoint}`, { params });
        setData(response.data.results || response.data);
      } catch (err) {
        logger.error('Error fetching data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint, params.productType]);

  return { data, loading };
};

export default useApi;
