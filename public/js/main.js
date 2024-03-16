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
                const result = await response.json();

                console.log('Response received:', response);
                console.log('Result parsed:', result);

                // Clear previous results
                const previousResult = document.getElementById('resultContainer');
                if (previousResult) {
                    previousResult.remove();
                }

                const resultContainer = document.createElement('div');
                resultContainer.setAttribute('id', 'resultContainer');

                if (response.ok && result.status === "REQUEST_SUCCEEDED") {
                    if (result.data && result.data.length > 0) {
                        console.log('Rendering received data');
                        const dataContent = result.data.map(item => `<div>${item.name}: ${item.value}</div>`).join('');
                        resultContainer.innerHTML = dataContent;
                    } else {
                        console.log('No data available for the provided query.');
                        resultContainer.textContent = 'No data available for the provided query.';
                    }
                } else {
                    console.error('Error processing query:', result);
                    resultContainer.textContent = `An error occurred while processing your query: ${result.error && result.error.length > 0 ? result.error : 'Please check your query or try again later.'}`;
                }

                form.after(resultContainer);

                // Generate and append download buttons only if there is data
                if (result.data && result.data.length > 0) {
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
                // Handle any errors by displaying a user-friendly error message on the page
                console.error('An error occurred while fetching the data:', error);
                console.error(`Error details: ${error.message}`, error.stack);
                const errorContainer = document.createElement('div');
                errorContainer.style.color = 'red';
                errorContainer.textContent = `An error occurred while processing your query. Please check your query or try again later.`;
                form.after(errorContainer);
            } finally {
                // Hide the progress indicator
                toggleProgressIndicator(false);
            }
        });
    }
});