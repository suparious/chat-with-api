// File: /backend/utils/envValidator.js

// List of required environment variables
const requiredEnv = [
  'PORT',
  'DATABASE_URL',
  'SESSION_SECRET',
  'JWT_SECRET',
  'OPENAI_API_KEY',
  'BEA_API_KEY',
  'BLS_API_KEY',
  'CENSUS_API_KEY',
];

/**
 * Validates that all required environment variables are set.
 * Logs an error for each missing variable and throws if any are missing.
 */
function validateEnv() {
  const missingVars = requiredEnv.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    throw new Error('Missing required environment variables. Please check your .env file.');
  }

  console.log('All required environment variables are set.');
}

module.exports = validateEnv;