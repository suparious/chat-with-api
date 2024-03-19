const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');
const path = require('path');

const width = 800; // Chart width
const height = 600; // Chart height

// Function to generate a chart
async function generateChart(data, chartType, options = {}) {
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
    const configuration = {
        type: chartType,
        data: data,
        options: options,
    };

    try {
        console.log(`Generating ${chartType} chart with provided data.`);
        // Render chart to buffer
        const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);

        // Define the path for saving the chart image
        const outputPath = path.join(__dirname, '../downloads');
        if (!fs.existsSync(outputPath)) {
            console.log('Creating downloads directory for charts.');
            fs.mkdirSync(outputPath);
        }
        const fileName = `chart_${Date.now()}.png`;
        const filePath = path.join(outputPath, fileName);

        // Save the chart image to file
        fs.writeFileSync(filePath, buffer);
        console.log(`Chart generated successfully at: ${filePath}`);

        return filePath;
    } catch (error) {
        console.error('Error generating chart:', error.message);
        console.error('Error stack:', error.stack);
        throw error;
    }
}

module.exports = { generateChart };