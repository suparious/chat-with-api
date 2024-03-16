/**
 * Handles API errors by logging and returning a standardized error object.
 * @param {Error} error - The error object.
 * @param {string} defaultMsg - Default error message if the error doesn't provide one.
 * @returns {Object} - An object containing status code and message.
 */
function handleApiError(error, defaultMsg = 'An unexpected error occurred') {
  let message = defaultMsg;
  let status = 500; // Default to internal server error

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(`Error data:`, error.response.data);
    console.error(`Error status:`, error.response.status);
    message = error.response.data.message || defaultMsg;
    status = error.response.status;
  } else if (error.request) {
    // The request was made but no response was received
    console.error(`Error request:`, error.request);
    message = 'No response received from external service';
    status = 503; // Service unavailable
  } else {
    // Something else happened in setting up the request that triggered an error
    console.error('Error', error.message);
    console.error('Error stack:', error.stack);
    message = error.message || defaultMsg;
  }

  return { status, message };
}

module.exports = { handleApiError };