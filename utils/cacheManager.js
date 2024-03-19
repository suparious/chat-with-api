const mongoose = require('mongoose');

// Define a schema for the cache
const cacheSchema = new mongoose.Schema({
  query: { type: String, required: true, unique: true },
  result: { type: mongoose.Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Set an index to automatically delete documents after a certain period (e.g., 1 day)
cacheSchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 });

const Cache = mongoose.model('Cache', cacheSchema);

/**
 * Checks if the cache contains data for a given query and if it is still valid.
 * @param {string} query - The query to check in the cache.
 * @returns {Promise<Object|null>} - The cached data or null if not found or expired.
 */
async function getCachedData(query) {
  try {
    const cachedData = await Cache.findOne({ query });
    console.log('Checking cache for query:', query);
    return cachedData ? cachedData.result : null;
  } catch (error) {
    console.error('Error fetching from cache:', error);
    console.error('Error details:', error.message, error.stack);
    throw error;
  }
}

/**
 * Saves the result of a query to the cache.
 * @param {string} query - The query string that was used to fetch the data.
 * @param {Object} result - The result of the query.
 * @returns {Promise<void>}
 */
async function saveToCache(query, result) {
  try {
    const newCacheEntry = new Cache({ query, result });
    await newCacheEntry.save();
    console.log('Data cached successfully for query:', query);
  } catch (error) {
    console.error('Error saving to cache:', error);
    console.error('Error details:', error.message, error.stack);
    throw error;
  }
}

module.exports = { getCachedData, saveToCache };