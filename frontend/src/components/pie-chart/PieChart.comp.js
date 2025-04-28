import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export const PieChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const chartData = {
      labels: ['Pending', 'Open', 'Closed'],
      datasets: [{
        data: [
          data?.pending || 0,
          data?.open || 0,
          data?.closed || 0
        ],
        backgroundColor: ['#FF9800', '#2196F3', '#4CAF50']
      }]
    };

    chartInstanceRef.current = new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { 
            display: true, 
            text: `Total Tickets: ${data?.total || 0}`,
            font: { size: 16 }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}; 