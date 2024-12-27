const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const { findBreakoutDays } = require('./utils.js/processData');
const { writeCSV } = require('./utils.js/csvGenerator');
const app = express();
const port = 3000;

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Route to generate report
app.post('/generate-report', async (req, res) => {
  const { ticker, startDate, endDate, volumeThreshold, priceThreshold, holdingPeriod } = req.body;

  try {
    // Simulate breakout days and generate CSV data
    const breakoutData = await findBreakoutDays(ticker, startDate, endDate, volumeThreshold, priceThreshold, holdingPeriod);

    console.log('Breakout Days:', breakoutData);  // Verify the breakout days found

    if (breakoutData.length === 0) {
      console.log('No breakout days found!');
      res.status(404).json({ message: 'No breakout days found.' });
      return;
    }

    // Write the data to a CSV file
    const csvPath = await writeCSV(breakoutData);

    // Send the CSV file as a download
    res.download(csvPath, 'report.csv', (err) => {
      if (err) {
        console.error('Error sending the file:', err);
        res.status(500).json({ error: 'Failed to generate report' });
      }
    });
  } catch (error) {
    console.log(error)
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
