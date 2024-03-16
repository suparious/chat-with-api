const { isMainThread, Worker } = require('worker_threads');
const { GPU } = require('gpu.js');

/**
 * Runs a task in a separate CPU thread using worker_threads module.
 * @param {string} workerPath - Path to the worker script file.
 * @param {Object} data - Data to be processed by the worker.
 * @returns {Promise<any>} - Promise that resolves with the result from the worker.
 */
function runOnCpu(workerPath, data) {
  return new Promise((resolve, reject) => {
    if (isMainThread) {
      console.log(`Running task on CPU with data: ${JSON.stringify(data)}`);
      const worker = new Worker(workerPath, { workerData: data });
      worker.on('message', (result) => {
        console.log(`Task completed by worker: ${workerPath}`);
        resolve(result);
      });
      worker.on('error', (error) => {
        console.error(`Error from worker: ${workerPath}`, error);
        reject(error);
      });
      worker.on('exit', (code) => {
        if (code !== 0) {
          console.error(`Worker stopped with exit code ${code}`);
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    } else {
      reject(new Error('runOnCpu must be called from the main thread.'));
    }
  });
}

/**
 * Runs a task using GPU acceleration.
 * @param {Function} gpuKernelFunction - Function that defines the GPU.js kernel.
 * @param {Array<any>} args - Arguments to pass to the gpuKernelFunction.
 * @returns {any} - The result from the GPU.js kernel execution.
 */
function runOnGpu(gpuKernelFunction, args) {
  try {
    console.log(`Running task on GPU with arguments: ${args}`);
    const gpu = new GPU();
    const kernel = gpu.createKernel(gpuKernelFunction).setOutput([args.length]);
    const result = kernel(...args);
    console.log(`Task completed on GPU.`);
    return result;
  } catch (error) {
    console.error(`Error executing task on GPU:`, error);
    throw error;
  }
}

module.exports = { runOnCpu, runOnGpu };