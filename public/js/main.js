document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('economy-query-form');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the default form submission behavior

            // Display the progress indicator
            toggleProgressIndicator(true);

            // Get the query from the input field
            const queryInput = document.getElementById('queryInput');
            const query = queryInput.value;

            // Prepare the POST request
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query }),
            };

            try {
                // Send the query to /api/query endpoint
                console.log(`Sending query: ${query}`);
                const response = await fetch('/api/query', requestOptions);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();

                // Hide the progress indicator
                toggleProgressIndicator(false);

                // Clear previous results
                const previousResult = document.getElementById('resultContainer');
                if (previousResult) {
                    previousResult.remove();
                }

                const resultContainer = document.createElement('div');
                resultContainer.setAttribute('id', 'resultContainer');

                // Check if there's a direct message or status in the response
                if (result.message) {
                    console.log('Displaying message from response');
                    resultContainer.textContent = result.message;
                } else if (result.status && result.status === "REQUEST_FAILED") {
                    console.log('Displaying error message from response');
                    resultContainer.textContent = result.Error || 'An unknown error occurred.';
                    if (result.details.includes('lack of real-time data capabilities')) {
                        resultContainer.textContent = 'The query cannot be processed due to limitations in accessing real-time data. Please refine your query.';
                    }
                } else {
                    // Handle data display
                    console.log('Rendering received data or chart');
                    if (result.chart) {
                        resultContainer.innerHTML = `<img src="${result.chart}" alt="Chart">`;
                    } else if (result.data) {
                        const dataContent = JSON.stringify(result.data, null, 2);
                        resultContainer.innerHTML = `<pre>${dataContent}</pre>`;
                    } else {
                        resultContainer.textContent = 'No data available for the provided query.';
                    }
                }

                form.after(resultContainer);

                // Generate and append download buttons only if there is data
                if (result.data) {
                    const downloadButtons = `
                        <button onclick="downloadData('csv')">Download CSV</button>
                        <button onclick="downloadData('json')">Download JSON</button>
                        <button onclick="downloadData('txt')">Download Plaintext</button>
                    `;
                    resultContainer.innerHTML += downloadButtons;
                }

                // Function to handle data download in selected format
                window.downloadData = async (format) => {
                    try {
                        const downloadResponse = await fetch('/api/download-result', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ format: format, data: result.data }),
                        });

                        if (!downloadResponse.ok) {
                            throw new Error(`HTTP error! status: ${downloadResponse.status}`);
                        }

                        const blob = await downloadResponse.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `query_result.${format}`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    } catch (error) {
                        console.error('An error occurred while downloading the data:', error);
                        console.error(`Error details: ${error.message}`, error.stack);
                        alert('Failed to download the file. Please try again.');
                    }
                };
            } catch (error) {
                // Hide the progress indicator in case of an error
                toggleProgressIndicator(false);

                // Handle any errors by displaying a user-friendly error message on the page
                console.error('An error occurred while fetching the data:', error);
                console.error(`Error details: ${error.message}`, error.stack);
                const errorContainer = document.createElement('div');
                errorContainer.style.color = 'red';
                errorContainer.textContent = 'An error occurred while processing your query. Please try again.';
                form.after(errorContainer);
            }
        });
    }
});