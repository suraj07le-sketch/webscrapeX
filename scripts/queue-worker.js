// Queue worker script for background processing
// Run this in a separate process for production deployment

const { jobQueue } = require('../lib/queue');

console.log('🚀 Starting queue worker...');

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

// Keep the process alive
setInterval(() => {
    const queueSize = jobQueue.getQueueSize();
    const processingCount = jobQueue.getProcessingCount();
    
    if (queueSize > 0 || processingCount > 0) {
        console.log(`📊 Queue status: ${queueSize} pending, ${processingCount} processing`);
    }
}, 30000); // Log every 30 seconds

// Cleanup old jobs every hour
setInterval(() => {
    jobQueue.cleanup();
}, 60 * 60 * 1000);

console.log('✅ Queue worker started successfully');
console.log('⏳ Waiting for jobs...');

// Keep the process alive indefinitely
process.stdin.resume();