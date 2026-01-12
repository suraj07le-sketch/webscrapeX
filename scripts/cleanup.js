const fs = require('fs');
const path = require('path');

const SCRAPE_DIR = path.join(__dirname, '../tmp/scrapes');
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

async function cleanup() {
    if (!fs.existsSync(SCRAPE_DIR)) {
        console.log('No scrape directory found.');
        return;
    }

    const files = await fs.promises.readdir(SCRAPE_DIR);
    let count = 0;

    for (const file of files) {
        const filePath = path.join(SCRAPE_DIR, file);
        try {
            const stats = await fs.promises.stat(filePath);
            const age = Date.now() - stats.mtimeMs;

            if (age > MAX_AGE_MS) {
                await fs.promises.rm(filePath, { recursive: true, force: true });
                console.log(`Deleted old scrape: ${file}`);
                count++;
            }
        } catch (e) {
            console.error(`Failed to delete ${file}:`, e.message);
        }
    }

    console.log(`Cleanup complete. Removed ${count} old scrapes.`);
}

cleanup();
