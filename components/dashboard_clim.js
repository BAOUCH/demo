import React, { useState, useEffect } from 'react';
import { Box } from 'theme-ui';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedData, setSelectedData] = useState('tavg'); // Default to 'tavg'

  const toggleDashboard = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    fetch('/data/maroc_climate.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  // Handle data change based on selectedData
  const chartData = data && data[selectedData]
    ? Object.keys(data[selectedData]).map((month) => ({
        month,
        value: data[selectedData][month], // Use the selected data type (e.g., 'tavg', 'prec', etc.)
      }))
    : [];

  // Define line colors based on selected data
  const lineColors = {
    tavg: 'red',
    prec: 'blue',
    windsp: 'green',
    srad: 'url(#gradient)', // Gradient for solar radiation
  };

  // Define Y-axis label based on the selected data
  const yAxisLabel = {
    tavg: 'Temperature (°C)',
    prec: 'Precipitation (mm)',
    windsp: 'Wind Speed (m/s)',
    srad: 'Solar Radiation (W/m²)',
  };

  return (
    <>
      <Box
        as="button"
        onClick={toggleDashboard}
        sx={{
          position: 'fixed',
          top: '1rem',
          right: isOpen ? '50%' : '10px',
          transition: 'right 0.3s ease-in-out',
          zIndex: 1001,
          bg: '1-background',
          color: 'background',
          borderRadius: '5px',
          p: 3,
          cursor: 'pointer',
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
          fontSize: [2, 2, 2, 3],
        }}
      >
        <span sx={{ textTransform: 'uppercase' }}>
          {isOpen ? 'Close Dashboard' : 'Open Dashboard'}
        </span>
      </Box>

      <Box
        sx={{
          bg: 'background',
          color: '1-background',
          p: 4,
          width: '50%',
          height: '100%',
          position: 'fixed',
          top: 0,
          right: 0,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '-2px 0px 5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 sx={{ textTransform: 'uppercase', fontSize: 3 }}>charte for climate variables analysed </h2>
        <p></p>

        {loading ? (
          <Box sx={{ fontSize: 3, color: 'primary' }}>Loading data...</Box>
        ) : (
          <>
            {/* Selector for data type */}
            <Box sx={{ mb: 4 }}>
              <label htmlFor="dataSelector" sx={{ fontSize: 3, fontWeight: 'bold' }}>
                Select climate data type:
              </label>
              <select
                id="dataSelector"
                onChange={(e) => setSelectedData(e.target.value)}
                value={selectedData}
                sx={{
                  fontSize: 2,
                  p: 2,
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  cursor: 'pointer',
                  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
                  transition: 'background-color 0.3s ease-in-out',
                  bg: 'background', // Set background to match toggle button
                  color: 'background', // Set text color
                  '&:hover': {
                    bg: 'highlight', // Change background on hover for interaction
                  },
                }}
              >
                <option value="tavg">Temperature (tavg)</option>
                <option value="prec">Precipitation (prec)</option>
                <option value="windsp">Wind Speed (windsp)</option>
                <option value="srad">Solar Radiation (srad)</option>
              </select>
            </Box>

            {/* Gradient for solar radiation */}
            {selectedData === 'srad' && (
              <svg width="1" height="1">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'yellow', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'orange', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
            )}

            {/* Area Chart */}
            {data && data[selectedData] && (
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={chartData} sx={{ bg: 'background' }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    stroke="text" 
                    fontSize={10} // Increase font size for X-axis labels
                    tick={{ fontSize: 10 , color : lineColors.selectedData}} // Adjust tick label size
                    label={{ value: 'Month', fontSize: 14, position: 'insideBottom', offset: 0  ,color :lineColors[selectedData]  }}
                  />
                  <YAxis
                    stroke="text"
                    fontSize={10} // Increase font size for Y-axis labels
                    tick={{ fontSize: 10 , color : 'r'}} // Adjust tick label size
                    label={{
                      value: yAxisLabel[selectedData],
                      fontSize: 14,
                      angle: -90,
                      position: 'insideLeft',
                      dx: 10,
                      color : 'red'
                    }}
                  />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 2 }} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={lineColors[selectedData]}
                    fill={lineColors[selectedData]}
                    fillOpacity={0.3} // Optional: Adds fill to the area
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default Dashboard;
