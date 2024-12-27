const axios = require('axios');

const API_KEY = 'A37X8A4RA007X59V';  // Replace with your API Key
const BASE_URL = 'https://www.alphavantage.co/query';

// Fetch historical data (Time Series data)
async function getStockData(symbol, startDate, endDate) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        apikey: API_KEY,
        outputsize: 'full',  // This gives us up to 20 years of data
      },
    });

    const data = response.data['Time Series (Daily)'];
    const filteredData = Object.entries(data)
      .map(([date, values]) => ({
        date,
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume']),
      }))
      .filter((entry) => entry.date >= startDate && entry.date <= endDate);

    return filteredData;
  } catch (error) {
    console.error('Error fetching stock data:', error);
  }
}

module.exports = {
  getStockData,
};
