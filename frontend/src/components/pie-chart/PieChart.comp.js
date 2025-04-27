import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export const PieChart = ({ stats }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Pending', 'Open', 'Closed'],
        datasets: [{
          data: [stats.pending, stats.open, stats.closed],
          backgroundColor: ['#FF9800', '#2196F3', '#4CAF50']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { 
            display: true, 
            text: `Total Tickets: ${stats.total}`,
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
  }, [stats]);

  return (
    <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}; 