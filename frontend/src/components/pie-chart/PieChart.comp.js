import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export const PieChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    // Ensure we have valid data and canvas reference
    if (!chartRef.current || !data) return;

    // Clean up previous chart instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Calculate total from the actual data points
    const total = (data.pending || 0) + (data.open || 0) + (data.closed || 0);

    // Only create chart if we have data
    if (total > 0) {
      const chartData = {
        labels: ['Pending', 'Open', 'Closed'],
        datasets: [{
          data: [
            data.pending || 0,
            data.open || 0,
            data.closed || 0
          ],
          backgroundColor: ['#FF9800', '#2196F3', '#4CAF50'],
          borderWidth: 1,
          borderColor: '#fff'
        }]
      };

      try {
        chartInstanceRef.current = new Chart(ctx, {
          type: 'pie',
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { 
                position: 'bottom',
                labels: {
                  padding: 20,
                  font: {
                    size: 12
                  }
                }
              },
              title: { 
                display: true, 
                text: `Total Tickets: ${total}`,
                font: { size: 16 }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      } catch (error) {
        console.error('Error creating chart:', error);
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data]);

  return (
    <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}; 