import { Grid2, Typography } from "@mui/material"
import ChartCard from "../../components/chartCard"
import React from "react";
import { useEffect, useState } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from "axios"



export const data = [
  ["Country", "Exportação de Animais vivos"],
  ["Germany", 200],
  ["United States", 300],
  ["Brazil", 400],
  ["Canada", 500],
  ["France", 600],
  ["RU", 700],
];

export const data2 = [
  ["ID", "Life Expectancy", "Fertility Rate", "Region", "Population"],
  ["CAN", 80.66, 1.67, "North America", 33739900],
  ["DEU", 79.84, 1.36, "Europe", 81902307],
  ["DNK", 78.6, 1.84, "Europe", 5523095],
  ["EGY", 72.73, 2.78, "Middle East", 79716203],
  ["GBR", 80.05, 2, "Europe", 61801570],
  ["IRN", 72.49, 1.7, "Middle East", 73137148],
  ["IRQ", 68.09, 4.77, "Middle East", 31090763],
  ["ISR", 81.55, 2.96, "Middle East", 7485600],
  ["RUS", 68.6, 1.54, "Europe", 141850000],
  ["USA", 78.09, 2.05, "North America", 307007000],
];

/*background: rgba(255, 255, 255, 0.28);
border-radius: 16px;
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
backdrop-filter: blur(6.9px);
-webkit-backdrop-filter: blur(6.9px);*/

function App() {
  const [countries, setCountries] = useState([]);
  function fetchProducts() {
    axios.get('Reporters.json') // partnerAreas.json / Reporters.json
      .then(response => {
        setCountries((response.data.results))
      })
      .catch(error => {
        console.error('Erro ao fazer a requisição:', error);
      });
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  var resultCountries = countries.map(country =>({
    label: country.text,
    value: country.reporterCode,
  }));

  return (
    <Grid2 container direction={"column"} paddingInline={"10%"} paddingBlock={"5%"} gap={"24px"}>
      <Typography variant="h3" fontFamily={"gantari"} fontWeight={100} color="#ffffff">TradeMar</Typography>
      <Autocomplete
        disablePortal
        options={resultCountries}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="countries" />}
      />
      <Grid2 container direction={"column"} spacing={4}>
        <Grid2 size={{ xs: 12, lg: 6 }}>
          {ChartCard(data, "GeoChart")}
        </Grid2>
        <Grid2 size={{ xs: 12, lg: 6 }}>
          {ChartCard(data2, "BubbleChart")}
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

export default App;
