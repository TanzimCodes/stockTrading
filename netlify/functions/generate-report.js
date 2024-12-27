const fs = require('fs');
const path = require('path');
const { findBreakoutDays } = require('../../utils.js/processData');
const { writeCSV } = require('../../utils.js/csvGenerator');

exports.handler = async (event, context) => {
  // Ensure it's a POST request
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { ticker, startDate, endDate, volumeThreshold, priceThreshold, holdingPeriod } = JSON.parse(event.body);

  try {
    // Simulate breakout days and generate CSV data
    const breakoutData = await findBreakoutDays(ticker, startDate, endDate, volumeThreshold, priceThreshold, holdingPeriod);

    console.log('Breakout Days:', breakoutData);  // Verify the breakout days found

    if (breakoutData.length === 0) {
      console.log('No breakout days found!');
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No breakout days found.' }),
      };
    }

    // Write the data to a CSV file (temporary file in /tmp)
    const csvPath = await writeCSV(breakoutData);

    // Read the file content (needed for returning the file as response)
    const fileContent = fs.readFileSync(csvPath);

    // Return the CSV file as a download response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="report.csv"',
      },
      body: fileContent.toString('base64'),  // Convert binary to base64
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Error generating report:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate report' }),
    };
  }
};
