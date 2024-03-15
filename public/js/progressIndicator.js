function toggleProgressIndicator(show) {
  const progressIndicator = document.getElementById('progressIndicator');
  if (show) {
    console.log('Displaying progress indicator.');
    progressIndicator.style.display = 'block';
  } else {
    console.log('Hiding progress indicator.');
    progressIndicator.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Create the progress indicator element dynamically
  const progressIndicator = document.createElement('div');
  progressIndicator.setAttribute('id', 'progressIndicator');
  progressIndicator.setAttribute('role', 'alert');
  progressIndicator.setAttribute('aria-live', 'assertive');
  progressIndicator.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p>Please wait, processing your query...</p>
  `;

  // Initially hidden
  progressIndicator.style.display = 'none';

  // Append to body
  console.log('Appending progress indicator to the document body.');
  document.body.appendChild(progressIndicator);
});