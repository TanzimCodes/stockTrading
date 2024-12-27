const { createObjectCsvWriter } = require('csv-writer'); // Import csv-writer
const { Parser } = require('json2csv');  // Import json2csv library for converting data to CSV

// Helper function to format price by adding commas and dollar sign
function formatPrice(price) {
    if (price === undefined || price === null) {
        return 'N/A'; // Return 'N/A' if the price is undefined or null
    }
    return '$' + price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');  // Format the price with a dollar sign and commas
}

// Function to generate CSV data (in-memory) and return it as a string
async function writeCSV(data) {
    // Map the data to ensure proper format for price and return
    const mappedData = data.map(row => ({
        buyDate: row.buyDate,
        buyPrice: row.buyPrice !== undefined ? formatPrice(row.buyPrice) : 'N/A',
        sellDate: row.sellDate,
        sellPrice: row.sellPrice !== undefined ? formatPrice(row.sellPrice) : 'N/A',
        returnPercentage: row.returnPercentage !== undefined ? row.returnPercentage.toFixed(2) : 'N/A',
    }));

    // Use json2csv to convert the mapped data into CSV format in memory
    const parser = new Parser();
    const csv = parser.parse(mappedData);

    // Return the CSV data as a string (it will be sent as a response)
    console.log('CSV file generated successfully in memory!');
    return csv;
}

module.exports = { writeCSV };
