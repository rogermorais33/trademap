import { Chart } from "react-google-charts";
import { Card, Grid2 } from "@mui/material"

export const data = [
  ["Country", "Popularity"],
  ["Germany", 200],
  ["United States", 300],
  ["Brazil", 400],
  ["Canada", 500],
  ["France", 600],
  ["RU", 700],
];

/*background: rgba(255, 255, 255, 0.28);
border-radius: 16px;
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
backdrop-filter: blur(6.9px);
-webkit-backdrop-filter: blur(6.9px);*/

function App() {

  const options = {
    backgroundColor: "none",
  };

  return (
    <Grid2 container paddingInline={"10%"} paddingBlock={"5%"} gap={"24px"}>
      <Grid2 size={{xs:12, lg:6 }}>
        <Card sx={{ borderRadius: "24px", padding: "24px", background: "rgba(0, 0, 0, 0.28)", boxShadow:"0 4px 30px rgba(0, 0, 0, 0.1)", backdropFilter: "blur(6.9px)", WebkitBackdropFilter: "blur(6.9px)"}}>
          <Chart
            options={options}
            chartEvents={[
              {
                eventName: "select",
                callback: ({ chartWrapper }) => {
                  const chart = chartWrapper.getChart();
                  const selection = chart.getSelection();
                  if (selection.length === 0) return;
                },
              },
            ]}
            chartType="GeoChart"
            width="100%"
            height="400px"
            data={data}
          />
        </Card>
      </Grid2>
    </Grid2>
  );
}

export default App;
