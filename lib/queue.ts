import { scrapeWebsite } from './scraper';

interface QueueJob {
    id: string;
    type: 'scrape' | 'download';
    data: any;
    priority: number;
    createdAt: number;
    attempts: number;
    maxAttempts: number;
    delay?: number;
    lastError?: string;
}

class JobQueue {
    private jobs: QueueJob[] = [];
    private isProcessing = false;
    private processingInterval = 1000; // 1 second
    private maxConcurrent = 3; // Process 3 jobs at once
    private currentProcessing = 0;

    constructor() {
        // Start processing loop
        this.startProcessingLoop();
    }

    addJob(job: Omit<QueueJob, 'id' | 'createdAt' | 'attempts'>): string {
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newJob: QueueJob = {
            ...job,
            id: jobId,
            createdAt: Date.now(),
            attempts: 0
        };

        // Insert based on priority (higher priority first)
        const insertIndex = this.jobs.findIndex(j => j.priority < job.priority);
        if (insertIndex === -1) {
            this.jobs.push(newJob);
        } else {
            this.jobs.splice(insertIndex, 0, newJob);
        }

        console.log(`Job ${jobId} added to queue. Queue size: ${this.jobs.length}`);
        return jobId;
    }

    getJob(jobId: string): QueueJob | undefined {
        return this.jobs.find(job => job.id === jobId);
    }

    getQueueSize(): number {
        return this.jobs.length;
    }

    getProcessingCount(): number {
        return this.currentProcessing;
    }

    private async processNextJob(): Promise<void> {
        if (this.currentProcessing >= this.maxConcurrent) {
            return;
        }

        // Find next job that's ready to process (no delay or delay has passed)
        const now = Date.now();
        const jobIndex = this.jobs.findIndex(job => {
            if (job.delay && now - job.createdAt < job.delay) {
                return false;
            }
            return job.attempts < job.maxAttempts;
        });

        if (jobIndex === -1) {
            return;
        }

        const job = this.jobs[jobIndex];
        this.currentProcessing++;

        // Process job
        this.processJob(job)
            .then(() => {
                // Remove successful job
                this.jobs.splice(jobIndex, 1);
            })
            .catch((error) => {
                // Increment attempts
                job.attempts++;
                job.lastError = error instanceof Error ? error.message : String(error);

                // If max attempts reached, remove job
                if (job.attempts >= job.maxAttempts) {
                    console.error(`Job ${job.id} failed after ${job.maxAttempts} attempts:`, error);
                    this.jobs.splice(jobIndex, 1);
                } else {
                    // Exponential backoff for retry
                    job.delay = Math.min(
                        1000 * Math.pow(2, job.attempts), // Exponential backoff
                        30000 // Max 30 seconds
                    );
                    console.log(`Job ${job.id} failed, will retry in ${job.delay}ms`);
                }
            })
            .finally(() => {
                this.currentProcessing--;
            });
    }

    private async processJob(job: QueueJob): Promise<void> {
        console.log(`Processing job ${job.id} (${job.type})`);

        switch (job.type) {
            case 'scrape':
                await this.processScrapeJob(job);
                break;
            case 'download':
                await this.processDownloadJob(job);
                break;
            default:
                throw new Error(`Unknown job type: ${job.type}`);
        }
    }

    private async processScrapeJob(job: QueueJob): Promise<void> {
        const { id, url, skipDownloads, fastMode, mode } = job.data;
        
        try {
            await scrapeWebsite(id, url, skipDownloads, fastMode, mode);
            console.log(`Scrape job ${job.id} completed successfully`);
        } catch (error) {
            console.error(`Scrape job ${job.id} failed:`, error);
            throw error;
        }
    }

    private async processDownloadJob(job: QueueJob): Promise<void> {
        const { id, url } = job.data;
        
        // Implementation for download job
        // This would call downloadAssets function
        console.log(`Download job ${job.id} processing for ${url}`);
        
        // Simulate download processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log(`Download job ${job.id} completed`);
    }

    private startProcessingLoop(): void {
        setInterval(() => {
            if (this.jobs.length > 0 && this.currentProcessing < this.maxConcurrent) {
                this.processNextJob();
            }
        }, this.processingInterval);
    }

    // Clean old completed/failed jobs
    cleanup(olderThan: number = 24 * 60 * 60 * 1000): void {
        const cutoff = Date.now() - olderThan;
        const initialSize = this.jobs.length;
        
        this.jobs = this.jobs.filter(job => {
            // Keep jobs that are still pending
            if (job.attempts < job.maxAttempts) {
                return true;
            }
            
            // Remove old failed jobs
            return job.createdAt > cutoff;
        });
        
        const removed = initialSize - this.jobs.length;
        if (removed > 0) {
            console.log(`Cleaned up ${removed} old jobs from queue`);
        }
    }
}

// Singleton instance
export const jobQueue = new JobQueue();

// Helper functions for common job types
export const addScrapeJob = (
    id: string,
    url: string,
    skipDownloads: boolean = true,
    fastMode: boolean = true,
    mode: string = 'full',
    priority: number = 1
): string => {
    return jobQueue.addJob({
        type: 'scrape',
        data: { id, url, skipDownloads, fastMode, mode },
        priority,
        maxAttempts: 3
    });
};

export const addDownloadJob = (
    id: string,
    url: string,
    priority: number = 0
): string => {
    return jobQueue.addJob({
        type: 'download',
        data: { id, url },
        priority,
        maxAttempts: 2
    });
};

// Cleanup every hour
if (typeof window === 'undefined') {
    setInterval(() => {
        jobQueue.cleanup();
    }, 60 * 60 * 1000);
}