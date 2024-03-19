const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const path = require('path');

/**
 * Generates a file based on the provided data and format.
 * @param {Object|Array} data - The data to be written to the file.
 * @param {string} format - The format of the file ('csv', 'json', 'txt').
 * @returns {Promise<string>} - The path to the generated file.
 */
async function generateFile(data, format) {
    // Define the base directory for saving files
    const baseDir = path.join(__dirname, '../downloads');
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir);
    }
    const fileName = `data_${Date.now()}.${format}`;
    const filePath = path.join(baseDir, fileName);

    try {
        switch (format) {
            case 'csv':
                await generateCSV(data, filePath);
                break;
            case 'json':
                await generateJSON(data, filePath);
                break;
            case 'txt':
                await generateTXT(data, filePath);
                break;
            default:
                throw new Error(`Unsupported file format: ${format}`);
        }
        console.log(`File generated successfully at: ${filePath}`);
    } catch (error) {
        console.error(`Error generating file: ${error.message}`);
        console.error('Error details:', error.stack);
        throw error;
    }

    return filePath;
}

/**
 * Generates a CSV file.
 * @param {Array|Object} data - The data to be written.
 * @param {string} filePath - The path where the file will be saved.
 */
function generateCSV(data, filePath) {
    if (!Array.isArray(data)) {
        if (typeof data === 'object') {
            data = [data]; // Wrap the object in an array to meet CSV writer requirements
        } else {
            throw new Error('Data for CSV must be an array of objects or an object.');
        }
    }
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: Object.keys(data[0]).map(key => ({ id: key, title: key })),
    });
    return csvWriter.writeRecords(data).then(() => {
        console.log(`CSV file successfully generated at: ${filePath}`);
    }).catch((error) => {
        console.error(`Error generating CSV file: ${error.message}`);
        console.error('Error details:', error.stack);
        throw error;
    });
}

/**
 * Generates a JSON file.
 * @param {Object} data - The data to be written.
 * @param {string} filePath - The path where the file will be saved.
 */
function generateJSON(data, filePath) {
    return fs.promises.writeFile(filePath, JSON.stringify(data, null, 2))
        .then(() => {
            console.log(`JSON file successfully generated at: ${filePath}`);
        }).catch((error) => {
            console.error(`Error generating JSON file: ${error.message}`);
            console.error('Error details:', error.stack);
            throw error;
        });
}

/**
 * Generates a plaintext file.
 * @param {Object|Array} data - The data to be written.
 * @param {string} filePath - The path where the file will be saved.
 */
function generateTXT(data, filePath) {
    let textContent = '';
    if (Array.isArray(data)) {
        textContent = data.map(item => {
            return Object.entries(item).map(([key, value]) => {
                return formatPlainText(key, value);
            }).join('\n');
        }).join('\n\n');
    } else if (typeof data === 'object') {
        textContent = Object.entries(data).map(([key, value]) => {
            return formatPlainText(key, value);
        }).join('\n');
    } else {
        textContent = data.toString();
    }

    return fs.promises.writeFile(filePath, textContent)
        .then(() => {
            console.log(`Text file successfully generated at: ${filePath}`);
        }).catch((error) => {
            console.error(`Error generating text file: ${error.message}`);
            console.error('Error details:', error.stack);
            throw error;
        });
}

/**
 * Formats a key-value pair into a string for plaintext representation.
 * @param {string} key - The key of the data.
 * @param {any} value - The value of the data.
 * @returns {string} - Formatted string for plaintext.
 */
function formatPlainText(key, value) {
    if (typeof value === 'object' && value !== null) {
        return `${key}: ${JSON.stringify(value, null, 2)}`;
    }
    return `${key}: ${value}`;
}

/**
 * Saves query result data into a downloadable file in the specified format.
 * @param {Object|Array} data - The query result data to save.
 * @param {string} format - The format of the file ('csv', 'json', 'txt').
 * @returns {Promise<string>} - The path to the generated file.
 */
async function saveQueryResult(data, format) {
  return generateFile(data, format);
}

module.exports = { generateFile, saveQueryResult };