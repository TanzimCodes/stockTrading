const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

// Helper function to format price by removing commas
// Function to format price to a string with commas and a dollar sign
function formatPrice(price) {
    if (price === undefined || price === null) {
        return 'N/A'; // Return 'N/A' if the price is undefined or null
    }
    // Ensure price is a valid number before applying formatting
    return '$' + price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

}

async function writeCSV(data) {
  const csvWriter = createCsvWriter({
    path: path.join(__dirname, 'breakout-report.csv'),
    header: [
      { id: 'buyDate', title: 'Buy Date' },
      { id: 'buyPrice', title: 'Buy Price' },
      { id: 'sellDate', title: 'Sell Date' },
      { id: 'sellPrice', title: 'Sell Price' },
      { id: 'returnPercentage', title: 'Return (%)' },
    ]
  });

  // Map the data and ensure proper format for price and return
  const mappedData = data.map(row => ({
    buyDate: row.buyDate,
    buyPrice: row.buyPrice !== undefined ? formatPrice(row.buyPrice) : 'N/A',  // Ensure valid data
    sellDate: row.sellDate,
    sellPrice: row.sellPrice !== undefined ? formatPrice(row.sellPrice) : 'N/A',
    returnPercentage: row.returnPercentage !== undefined ? row.returnPercentage.toFixed(2) : 'N/A',
  }));

  // Write to CSV
  await csvWriter.writeRecords(mappedData);
  console.log('CSV file successfully written!');
  return 'breakout-report.csv';  // Return the CSV file path
}

module.exports = { writeCSV };
