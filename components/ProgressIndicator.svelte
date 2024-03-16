<script>
  export let show = false;
</script>

{#if show}
<div id="progressIndicator" class="progress-indicator">
  <div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
  <p>Please wait, processing your query...</p>
</div>
{/if}

<style>
  .progress-indicator {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid #007bff;
    border-radius: 5px;
    padding: 20px;
    z-index: 1000;
  }

  @media screen and (max-width: 768px) {
    .progress-indicator {
      width: 90%;
      padding: 15px;
    }
  }

  @media screen and (min-width: 769px) {
    .progress-indicator {
      width: 50%;
    }
  }
</style>