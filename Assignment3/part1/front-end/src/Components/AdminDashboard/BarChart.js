import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { Chart } from "react-chartjs-2";
ChartJS.register(...registerables);

export const BarChart = ({ chartDataSet }) => {
  return (
    <div className="chart-container">
      <Bar
        data={chartDataSet}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Pokedex report",
            },
            legend: {
              display: false,
            },
          },
        }}
      />
    </div>
  );
};
