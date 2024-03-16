function toggleProgressIndicator(show) {
  const progressIndicator = document.getElementById('progressIndicator');
  if (show) {
    console.log('Displaying progress indicator.');
    progressIndicator.style.display = 'block';
    // Announce to screen readers that the query is being processed
    progressIndicator.setAttribute('aria-hidden', 'false');
  } else {
    console.log('Hiding progress indicator.');
    progressIndicator.style.display = 'none';
    // Inform screen readers that the progress indicator is hidden
    progressIndicator.setAttribute('aria-hidden', 'true');
  }
}

// Ensure the toggleProgressIndicator function is globally accessible
window.toggleProgressIndicator = toggleProgressIndicator;

document.addEventListener('DOMContentLoaded', () => {
  // Create the progress indicator element dynamically
  const progressIndicator = document.createElement('div');
  progressIndicator.setAttribute('id', 'progressIndicator');
  progressIndicator.setAttribute('role', 'alert'); // Indicate the progress status to assistive technologies
  progressIndicator.setAttribute('aria-live', 'assertive'); // Make updates to this region announced by screen readers
  // Initially hidden from screen readers to match the visual hidden state
  progressIndicator.setAttribute('aria-hidden', 'true');  
  progressIndicator.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p>Please wait, processing your query...</p>
  `;

  // Initially hidden visually
  progressIndicator.style.display = 'none';

  // Append to body
  console.log('Appending progress indicator to the document body.');
  document.body.appendChild(progressIndicator);
});