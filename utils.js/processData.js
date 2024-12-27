const { getStockData } = require('../data');

// Calculate the 20-day moving average of volume
function calculateMovingAverage(data, period) {
    let movingAvg = [];
    for (let i = period - 1; i < data.length; i++) {
        const slice = data.slice(i - period + 1, i + 1);
        const avg = slice.reduce((acc, curr) => acc + curr.volume, 0) / period;
        movingAvg.push({
            date: data[i].date,
            volumeAvg: avg,
            priceChange: (data[i].close - data[i - 1].close) / data[i - 1].close * 100, // % change from previous day
            volume: data[i].volume,
        });
    }
    return movingAvg;
}

// Find breakout days
// Function to simulate fetching breakout days with the holding period logic included
async function findBreakoutDays(symbol, startDate, endDate, volumeThreshold, priceThreshold, holdingPeriod) {
    const data = await getStockData(symbol, startDate, endDate);
    // console.log('Stock data fetched:', data);

    const movingAvg = calculateMovingAverage(data, 20);
    // console.log('Moving averages:', movingAvg);

    const breakoutDays = [];

    movingAvg.forEach((entry, i) => {
        // Log the values to debug
        // console.log(`Checking ${entry.date}: Volume = ${entry.volume}, VolumeAvg = ${entry.volumeAvg}, Price Change = ${entry.priceChange}%`);

        const meetsVolumeCondition = entry.volume > entry.volumeAvg * (volumeThreshold / 100);
        const meetsPriceCondition = entry.priceChange >= priceThreshold;

        // Debug log to check conditions
        // console.log(`Volume Threshold Check: ${entry.volume} > ${entry.volumeAvg * (volumeThreshold / 100)}? ${meetsVolumeCondition}`);
        // console.log(`Price Threshold Check: ${entry.priceChange} >= ${priceThreshold}? ${meetsPriceCondition}`);

        // Relaxed breakout condition:
        if (meetsVolumeCondition || meetsPriceCondition) {
            // console.log(`Breakout condition met on ${entry.date}: Volume = ${entry.volume}, Price Change = ${entry.priceChange}%`);

            const buyDate = entry.date;

            // Ensure there are enough days of data after the breakout for the buy and sell
            const buyIndex = i + 19; // 20th day (19th index) after breakout day
            const sellIndex = i + 19 + holdingPeriod; // 10 days after the 20th day for holding period

            // If we don't have enough data for both buy and sell, skip
            if (!data[buyIndex] || !data[sellIndex]) {
                console.log(`Not enough data to process breakout for ${buyDate}. Skipping.`);
                return; // Skip this iteration if there's not enough data
            }

            const buyPrice = data[buyIndex].close;
            const sellPrice = data[sellIndex].close;

            const returnPercentage = ((sellPrice - buyPrice) / buyPrice) * 100;
            // console.log(`Buy Price: ${buyPrice}, Sell Price: ${sellPrice}, Return: ${returnPercentage}%`);

            breakoutDays.push({
                buyDate,
                buyPrice,
                sellDate: data[sellIndex].date,
                sellPrice,
                returnPercentage,
            });
        }
    });

    console.log('Breakout days identified:', breakoutDays);
    return breakoutDays;
}

module.exports = {
    findBreakoutDays,
};