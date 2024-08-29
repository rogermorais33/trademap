import { Chart } from "react-google-charts";
import { Card } from "@mui/material"

function ChartCard(data, type) {
  const options = {
    backgroundColor: "none",
  };
  return (
        <Card sx={{borderRadius: "24px", padding: "24px", background: "rgba(0, 0, 0, 0.28)", boxShadow:"0 4px 30px rgba(0, 0, 0, 0.1)", backdropFilter: "blur(6.9px)", WebkitBackdropFilter: "blur(6.9px)"}}>
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
            chartType={type}
            data={data}
          />
        </Card>
  );
}

export default ChartCard;
