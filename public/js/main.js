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

                // Display results based on the received data
                if (result.Results && result.Results.series.length > 0) {
                    console.log('Rendering received data');
                    const dataContent = result.Results.series.map(series => `<div>${series.name}: ${series.data}</div>`).join('');
                    resultContainer.innerHTML = dataContent;
                } else if (result.status === "REQUEST_SUCCEEDED" && !result.Results.series.length) {
                    console.log('No data available for the provided query.');
                    resultContainer.textContent = 'No data available for the provided query.';
                } else {
                    console.log('Unexpected response structure from API.');
                    resultContainer.textContent = 'An unexpected error occurred. Please try again later.';
                }

                form.after(resultContainer);

                // Generate and append download buttons only if there is data
                if (result.Results && result.Results.series.length) {
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
                            body: JSON.stringify({ format: format, data: result.Results.series }),
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