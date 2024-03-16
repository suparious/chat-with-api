import React from 'react';

function ProgressIndicator({ show }) {
  if (!show) {
    return null;
  }

  return (
    <div id="progressIndicator" className="progress-indicator" style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      border: '1px solid #007bff',
      borderRadius: '5px',
      padding: '20px',
      zIndex: '1000',
    }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p>Please wait, processing your query...</p>
    </div>
  );
}

export default ProgressIndicator;