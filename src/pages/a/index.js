import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ComtradeAPI() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = '7a7c60bd34324eaa92e9199df74523d5'; // Substitua pela sua chave

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://comtradeapi.un.org/data/v1/getDa/C/A/HS?251&2022', {
          headers: {
            'Ocp-Apim-Subscription-Key': apiKey,
          },
        });
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiKey]);

  return (
    <div>
      {loading && <p>Carregando dados...</p>}
      {error && <p>Erro ao carregar dados: {error.message}</p>}
      {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}

export default ComtradeAPI;