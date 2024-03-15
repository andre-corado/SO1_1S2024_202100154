import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function PieChart ({ value }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const secondValue = 100 - value;
  
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const myChartRef = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(myChartRef, {
      type: "pie",
      data: {
        labels: ["Libre", "Utilizado"],
        datasets: [
          {
            data: [secondValue, value],
            backgroundColor: ["#36A2EB", "#FF6384"],
          }
        ]
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    }
  }, [value]); // Asegúrate de actualizar el gráfico cuando cambie el valor

  return (
    <div>
      <canvas ref={chartRef} style={{ width: "300px", height: "200px" }} /> 
    </div>
  );
}

export default PieChart;
