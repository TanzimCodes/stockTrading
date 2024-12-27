const { writeCSV } = require('../../utils.js/csvGenerator');
const { findBreakoutDays } = require('../../utils.js/processData');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    // Parse incoming data
    const data = JSON.parse(event.body);
    const breakoutData = await findBreakoutDays(data.ticker, data.startDate, data.endDate, data.volumeThreshold, data.priceThreshold, data.holdingPeriod);

    // Check if breakoutData is empty
    if (breakoutData.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No breakout days found for the given criteria.' })
      };
    }

    // Generate CSV data in-memory
    const csv = await writeCSV(breakoutData);

    // Return the CSV data as a downloadable response
    return {
      statusCode: 200,
      body: csv,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="breakout-report.csv"',
      },
    };
  } catch (error) {
    console.error('Error generating report:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate report' })
    };
  }
};
