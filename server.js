// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Progress tracking
const progressStore = new Map();

// Garbage Collection Configuration
const GC_CONFIG = {
    INACTIVE_TIMEOUT: 5 * 60 * 1000, // 5 minutes of inactivity before cleanup
    HEARTBEAT_INTERVAL: 30 * 1000,   // 30 seconds between heartbeats
    MAX_SITES: 50,                   // Maximum number of sites to keep
    MAX_DISK_SIZE_MB: 1000,          // Maximum disk usage in MB
    CLEANUP_INTERVAL: 2 * 60 * 1000  // Run cleanup every 2 minutes
};

// Session tracking for garbage collection
const activeSessions = new Map(); // siteId -> { lastActivity, sessionCount, createdAt }

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Serve media files from Downloads/media directory
app.use('/media', express.static(path.join(__dirname, '../Downloads/media')));

// Middleware to track site access
app.use('/replicated-sites/:siteId', (req, res, next) => {
    const siteId = req.params.siteId;
    const now = Date.now();
    
    console.log(`🔍 Site access detected: ${siteId} (${req.method} ${req.url})`);
    
    // Update or create session tracking
    const existing = activeSessions.get(siteId);
    if (existing) {
        existing.lastActivity = now;
        existing.sessionCount = Math.max(existing.sessionCount, 1);
        console.log(`📊 Updated existing session for: ${siteId} (${existing.sessionCount} active sessions)`);
    } else {
        activeSessions.set(siteId, {
            lastActivity: now,
            sessionCount: 1,
            createdAt: now
        });
        console.log(`📊 Created new session for: ${siteId} (1 active session)`);
    }
    
    next();
});

// Serve the landing page as default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing_page.html'));
});

// Serve the web interface at /demo
app.get('/demo', (req, res) => {
    res.sendFile(path.join(__dirname, 'web-interface.html'));
});

// Serve replicated sites
app.use('/replicated-sites', express.static(path.join(__dirname, 'replicated-sites')));

// API endpoint to serve environment variables to client-side code
app.get('/api/env', (req, res) => {
    // Only expose safe environment variables to the client
    const clientEnv = {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        OPENAI_API_BASE_URL: process.env.OPENAI_API_BASE_URL,
        WIDGET_MODEL: process.env.WIDGET_MODEL,
        WIDGET_TIMEOUT_MS: process.env.WIDGET_TIMEOUT_MS,
        WIDGET_DEBOUNCE_MS: process.env.WIDGET_DEBOUNCE_MS
    };
    
    res.json(clientEnv);
});

// API endpoint for heartbeat (keeps site alive)
app.post('/api/heartbeat/:siteId', (req, res) => {
    const siteId = req.params.siteId;
    const now = Date.now();
    
    console.log(`💓 Heartbeat request for site: ${siteId}`);
    
    const session = activeSessions.get(siteId);
    if (session) {
        session.lastActivity = now;
        console.log(`💓 Heartbeat recorded for existing site: ${siteId} (${session.sessionCount} sessions)`);
        res.json({ success: true, message: 'Heartbeat recorded' });
    } else {
        // Create new session if it doesn't exist
        activeSessions.set(siteId, {
            lastActivity: now,
            sessionCount: 1,
            createdAt: now
        });
        console.log(`💓 New session created via heartbeat for site: ${siteId}`);
        res.json({ success: true, message: 'New session created' });
    }
});

// API endpoint to notify when user leaves a site
app.post('/api/leave/:siteId', (req, res) => {
    const siteId = req.params.siteId;
    
    console.log(`👋 Leave request for site: ${siteId}`);
    
    const session = activeSessions.get(siteId);
    if (session) {
        session.sessionCount = Math.max(0, session.sessionCount - 1);
        console.log(`👋 User left site: ${siteId} (${session.sessionCount} remaining sessions)`);
        
        // If no active sessions, mark for immediate cleanup
        if (session.sessionCount === 0) {
            session.lastActivity = Date.now() - GC_CONFIG.INACTIVE_TIMEOUT;
            console.log(`🗑️  Site ${siteId} marked for immediate cleanup`);
        }
    } else {
        console.log(`⚠️  Leave request for unknown site: ${siteId}`);
    }
    
    res.json({ success: true });
});

// API endpoint to replicate a website
app.post('/api/replicate', async (req, res) => {
    const { url, features } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Generate a unique job ID
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Initialize progress tracking
        progressStore.set(jobId, {
            status: 'starting',
            progress: 0,
            step: 'Initializing...',
            startTime: Date.now()
        });

        console.log(`Starting replication of: ${url} (Job ID: ${jobId})`);
        if (features && features.length > 0) {
            console.log(`Selected features: ${features.join(', ')}`);
        }
        
        // Spawn the replication process with features
        const args = ['src/index.js', 'replicate', url];
        if (features && features.length > 0) {
            args.push('--features', features.join(','));
        }
        
        const replicationProcess = spawn('node', args, {
            cwd: __dirname,
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        // Update progress based on stdout
        replicationProcess.stdout.on('data', (data) => {
            const output = data.toString();
            stdout += output;
            console.log(`STDOUT: ${output}`);
            
            // Update progress based on output patterns
            updateProgressFromOutput(jobId, output);
        });

        replicationProcess.stderr.on('data', (data) => {
            stderr += data.toString();
            console.error(`STDERR: ${data}`);
        });

        replicationProcess.on('close', async (code) => {
            if (code === 0) {
                try {
                    // Update progress to completion
                    progressStore.set(jobId, {
                        ...progressStore.get(jobId),
                        status: 'completed',
                        progress: 100,
                        step: 'Complete!'
                    });

                    // Find the most recent replicated site
                    const replicatedSitesDir = path.join(__dirname, 'replicated-sites');
                    const files = await fs.readdir(replicatedSitesDir);
                    
                    // Filter for directories and sort by creation time
                    const directories = [];
                    for (const file of files) {
                        const filePath = path.join(replicatedSitesDir, file);
                        const stat = await fs.stat(filePath);
                        if (stat.isDirectory()) {
                            directories.push({
                                name: file,
                                ctime: stat.ctime
                            });
                        }
                    }
                    
                    directories.sort((a, b) => b.ctime - a.ctime);
                    const latestDir = directories[0]?.name;

                    if (latestDir) {
                        // Try to read the replication report
                        let report = null;
                        try {
                            const reportPath = path.join(replicatedSitesDir, latestDir, 'replication-report.json');
                            const reportData = await fs.readFile(reportPath, 'utf8');
                            report = JSON.parse(reportData);
                        } catch (reportError) {
                            console.warn('Could not read replication report:', reportError.message);
                        }

                        res.json({
                            success: true,
                            message: 'Website replicated successfully',
                            outputPath: `replicated-sites/${latestDir}`,
                            url: url,
                            features: features || [],
                            jobId: jobId,
                            duration: report?.duration || { seconds: 'unknown' },
                            report: report
                        });

                        // Clean up progress after 5 minutes
                        setTimeout(() => {
                            progressStore.delete(jobId);
                        }, 5 * 60 * 1000);
                    } else {
                        progressStore.set(jobId, {
                            ...progressStore.get(jobId),
                            status: 'error',
                            error: 'Could not find output directory'
                        });
                        res.status(500).json({
                            error: 'Replication completed but could not find output directory'
                        });
                    }
                } catch (error) {
                    console.error('Error processing replication result:', error);
                    progressStore.set(jobId, {
                        ...progressStore.get(jobId),
                        status: 'error',
                        error: 'Could not process result'
                    });
                    res.status(500).json({
                        error: 'Replication completed but could not process result'
                    });
                }
            } else {
                console.error(`Replication process exited with code ${code}`);
                progressStore.set(jobId, {
                    ...progressStore.get(jobId),
                    status: 'error',
                    error: `Process exited with code ${code}`
                });
                res.status(500).json({
                    error: `Replication failed with exit code ${code}`,
                    details: stderr || stdout
                });
            }
        });

        replicationProcess.on('error', (error) => {
            console.error('Failed to start replication process:', error);
            progressStore.set(jobId, {
                ...progressStore.get(jobId),
                status: 'error',
                error: 'Failed to start process'
            });
            res.status(500).json({
                error: 'Failed to start replication process',
                details: error.message
            });
        });

    } catch (error) {
        console.error('Replication error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Function to update progress based on output patterns
function updateProgressFromOutput(jobId, output) {
    const progress = progressStore.get(jobId);
    if (!progress) return;

    if (output.includes('phase_1_extraction_start')) {
        progressStore.set(jobId, { ...progress, progress: 20, step: 'Extracting content' });
    } else if (output.includes('phase_2_asset_detection_start')) {
        progressStore.set(jobId, { ...progress, progress: 30, step: 'Detecting assets' });
    } else if (output.includes('phase_3_asset_download_start')) {
        progressStore.set(jobId, { ...progress, progress: 40, step: 'Downloading assets' });
    } else if (output.includes('phase_4_html_processing_start')) {
        progressStore.set(jobId, { ...progress, progress: 60, step: 'Processing HTML' });
    } else if (output.includes('phase_5_file_saving_start')) {
        progressStore.set(jobId, { ...progress, progress: 80, step: 'Injecting widget' });
    } else if (output.includes('replication_complete')) {
        progressStore.set(jobId, { ...progress, progress: 95, step: 'Finalizing' });
    }
}

// API endpoint to get progress
app.get('/api/progress/:jobId', (req, res) => {
    const { jobId } = req.params;
    const progress = progressStore.get(jobId);
    
    if (!progress) {
        return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(progress);
});

// API endpoint to list replicated sites
app.get('/api/sites', async (req, res) => {
    try {
        const replicatedSitesDir = path.join(__dirname, 'replicated-sites');
        
        // Check if directory exists
        try {
            await fs.access(replicatedSitesDir);
        } catch {
            return res.json({ sites: [] });
        }

        const files = await fs.readdir(replicatedSitesDir);
        const sites = [];

        for (const file of files) {
            const filePath = path.join(replicatedSitesDir, file);
            const stat = await fs.stat(filePath);
            
            if (stat.isDirectory()) {
                // Try to read metadata
                let metadata = null;
                try {
                    const metadataPath = path.join(filePath, 'metadata.json');
                    const metadataData = await fs.readFile(metadataPath, 'utf8');
                    metadata = JSON.parse(metadataData);
                } catch (metadataError) {
                    // Ignore metadata errors
                }

                sites.push({
                    name: file,
                    path: `/replicated-sites/${file}/`,
                    created: stat.ctime,
                    originalUrl: metadata?.originalUrl || 'Unknown',
                    title: metadata?.title || file
                });
            }
        }

        // Sort by creation time (newest first)
        sites.sort((a, b) => new Date(b.created) - new Date(a.created));

        res.json({ sites });
    } catch (error) {
        console.error('Error listing sites:', error);
        res.status(500).json({
            error: 'Failed to list replicated sites',
            details: error.message
        });
    }
});

// Garbage Collection Functions
async function getDirectorySize(dirPath) {
    try {
        const files = await fs.readdir(dirPath, { withFileTypes: true });
        let totalSize = 0;
        
        for (const file of files) {
            const filePath = path.join(dirPath, file.name);
            if (file.isDirectory()) {
                totalSize += await getDirectorySize(filePath);
            } else {
                const stats = await fs.stat(filePath);
                totalSize += stats.size;
            }
        }
        
        return totalSize;
    } catch (error) {
        console.error(`Error calculating directory size for ${dirPath}:`, error);
        return 0;
    }
}

async function deleteSiteDirectory(siteId) {
    try {
        const sitePath = path.join(__dirname, 'replicated-sites', siteId);
        await fs.rm(sitePath, { recursive: true, force: true });
        console.log(`🗑️  Deleted site directory: ${siteId}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to delete site directory ${siteId}:`, error);
        return false;
    }
}

async function runGarbageCollection() {
    console.log('🧹 Running garbage collection...');
    
    try {
        const replicatedSitesDir = path.join(__dirname, 'replicated-sites');
        
        // Check if directory exists
        try {
            await fs.access(replicatedSitesDir);
        } catch {
            console.log('📁 No replicated-sites directory found, skipping GC');
            return;
        }

        const files = await fs.readdir(replicatedSitesDir);
        const now = Date.now();
        let deletedCount = 0;
        let totalSizeMB = 0;

        // Get all site directories with their stats
        const siteInfos = [];
        for (const file of files) {
            const filePath = path.join(replicatedSitesDir, file);
            const stat = await fs.stat(filePath);
            
            if (stat.isDirectory()) {
                const sizeBytes = await getDirectorySize(filePath);
                const sizeMB = sizeBytes / (1024 * 1024);
                totalSizeMB += sizeMB;
                
                siteInfos.push({
                    id: file,
                    path: filePath,
                    createdAt: stat.ctime.getTime(),
                    sizeBytes,
                    sizeMB
                });
            }
        }

        console.log(`📊 Found ${siteInfos.length} sites, total size: ${totalSizeMB.toFixed(2)} MB`);
        console.log(`🔍 Active sessions: ${Array.from(activeSessions.keys()).join(', ')}`);

        // 1. Clean up inactive sites
        for (const siteInfo of siteInfos) {
            const session = activeSessions.get(siteInfo.id);
            
            console.log(`🔍 Checking site: ${siteInfo.id}`);
            console.log(`   Session exists: ${!!session}`);
            if (session) {
                console.log(`   Session count: ${session.sessionCount}`);
                console.log(`   Last activity: ${new Date(session.lastActivity).toISOString()}`);
                console.log(`   Inactive time: ${Math.round((now - session.lastActivity) / 60000)}min`);
            }
            
            if (!session) {
                // No session tracking - delete if older than timeout
                const age = now - siteInfo.createdAt;
                console.log(`   Age: ${Math.round(age / 60000)}min (timeout: ${Math.round(GC_CONFIG.INACTIVE_TIMEOUT / 60000)}min)`);
                if (age > GC_CONFIG.INACTIVE_TIMEOUT) {
                    console.log(`🗑️  Deleting untracked site: ${siteInfo.id} (age: ${Math.round(age / 60000)}min)`);
                    if (await deleteSiteDirectory(siteInfo.id)) {
                        deletedCount++;
                        totalSizeMB -= siteInfo.sizeMB;
                    }
                } else {
                    console.log(`✅ Keeping untracked site: ${siteInfo.id} (too young)`);
                }
            } else {
                // Has session tracking - check if inactive
                const inactiveTime = now - session.lastActivity;
                if (inactiveTime > GC_CONFIG.INACTIVE_TIMEOUT && session.sessionCount === 0) {
                    console.log(`🗑️  Deleting inactive site: ${siteInfo.id} (inactive: ${Math.round(inactiveTime / 60000)}min)`);
                    if (await deleteSiteDirectory(siteInfo.id)) {
                        activeSessions.delete(siteInfo.id);
                        deletedCount++;
                        totalSizeMB -= siteInfo.sizeMB;
                    }
                } else {
                    console.log(`✅ Keeping active site: ${siteInfo.id} (${session.sessionCount} sessions, ${Math.round(inactiveTime / 60000)}min inactive)`);
                }
            }
        }

        // 2. Enforce maximum number of sites
        const remainingSites = siteInfos.filter(site => {
            try {
                return fs.access(site.path).then(() => true).catch(() => false);
            } catch {
                return false;
            }
        });

        if (remainingSites.length > GC_CONFIG.MAX_SITES) {
            // Sort by creation time (oldest first) and delete excess
            remainingSites.sort((a, b) => a.createdAt - b.createdAt);
            const sitesToDelete = remainingSites.slice(0, remainingSites.length - GC_CONFIG.MAX_SITES);
            
            for (const site of sitesToDelete) {
                console.log(`🗑️  Deleting excess site: ${site.id} (enforcing max sites limit)`);
                if (await deleteSiteDirectory(site.id)) {
                    activeSessions.delete(site.id);
                    deletedCount++;
                    totalSizeMB -= site.sizeMB;
                }
            }
        }

        // 3. Enforce disk size limit
        if (totalSizeMB > GC_CONFIG.MAX_DISK_SIZE_MB) {
            const excessMB = totalSizeMB - GC_CONFIG.MAX_DISK_SIZE_MB;
            console.log(`💾 Disk usage (${totalSizeMB.toFixed(2)} MB) exceeds limit (${GC_CONFIG.MAX_DISK_SIZE_MB} MB), cleaning up ${excessMB.toFixed(2)} MB`);
            
            // Sort by size (largest first) and delete until under limit
            const activeSites = remainingSites.filter(site => {
                const session = activeSessions.get(site.id);
                return !session || session.sessionCount === 0; // Only delete inactive sites
            });
            
            activeSites.sort((a, b) => b.sizeMB - a.sizeMB);
            
            let freedMB = 0;
            for (const site of activeSites) {
                if (freedMB >= excessMB) break;
                
                console.log(`🗑️  Deleting large site: ${site.id} (${site.sizeMB.toFixed(2)} MB)`);
                if (await deleteSiteDirectory(site.id)) {
                    activeSessions.delete(site.id);
                    deletedCount++;
                    freedMB += site.sizeMB;
                    totalSizeMB -= site.sizeMB;
                }
            }
        }

        // Clean up orphaned sessions
        const existingSiteIds = new Set(siteInfos.map(s => s.id));
        for (const [sessionId] of activeSessions) {
            if (!existingSiteIds.has(sessionId)) {
                console.log(`🧹 Cleaning up orphaned session: ${sessionId}`);
                activeSessions.delete(sessionId);
            }
        }

        if (deletedCount > 0) {
            console.log(`✅ Garbage collection complete: deleted ${deletedCount} sites, ${totalSizeMB.toFixed(2)} MB remaining`);
        } else {
            console.log(`✅ Garbage collection complete: no sites deleted, ${totalSizeMB.toFixed(2)} MB total`);
        }

    } catch (error) {
        console.error('❌ Error during garbage collection:', error);
    }
}

// API endpoint to get garbage collection status
app.get('/api/gc/status', async (req, res) => {
    try {
        const replicatedSitesDir = path.join(__dirname, 'replicated-sites');
        let totalSites = 0;
        let totalSizeMB = 0;
        let activeSites = 0;

        try {
            const files = await fs.readdir(replicatedSitesDir);
            for (const file of files) {
                const filePath = path.join(replicatedSitesDir, file);
                const stat = await fs.stat(filePath);
                if (stat.isDirectory()) {
                    totalSites++;
                    const sizeBytes = await getDirectorySize(filePath);
                    totalSizeMB += sizeBytes / (1024 * 1024);
                    
                    const session = activeSessions.get(file);
                    if (session && session.sessionCount > 0) {
                        activeSites++;
                    }
                }
            }
        } catch {
            // Directory doesn't exist
        }

        res.json({
            totalSites,
            activeSites,
            totalSizeMB: Math.round(totalSizeMB * 100) / 100,
            maxSites: GC_CONFIG.MAX_SITES,
            maxSizeMB: GC_CONFIG.MAX_DISK_SIZE_MB,
            inactiveTimeoutMinutes: GC_CONFIG.INACTIVE_TIMEOUT / 60000,
            activeSessions: Array.from(activeSessions.entries()).map(([id, session]) => ({
                siteId: id,
                sessionCount: session.sessionCount,
                lastActivity: new Date(session.lastActivity).toISOString(),
                inactiveMinutes: Math.round((Date.now() - session.lastActivity) / 60000)
            }))
        });
    } catch (error) {
        console.error('Error getting GC status:', error);
        res.status(500).json({ error: 'Failed to get garbage collection status' });
    }
});

// API endpoint to manually trigger garbage collection
app.post('/api/gc/run', async (req, res) => {
    console.log('🧹 Manual garbage collection triggered');
    await runGarbageCollection();
    res.json({ success: true, message: 'Garbage collection completed' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Website Replicator Server running at http://localhost:${PORT}`);
    console.log(`📁 Replicated sites will be served from /replicated-sites`);
    console.log(`🌐 Open http://localhost:${PORT} to use the web interface`);
    console.log(`🧹 Garbage collection: ${GC_CONFIG.INACTIVE_TIMEOUT / 60000}min timeout, max ${GC_CONFIG.MAX_SITES} sites, ${GC_CONFIG.MAX_DISK_SIZE_MB}MB limit`);
    
    // Start garbage collection timer
    setInterval(runGarbageCollection, GC_CONFIG.CLEANUP_INTERVAL);
    console.log(`⏰ Garbage collection will run every ${GC_CONFIG.CLEANUP_INTERVAL / 60000} minutes`);
    
    // Run initial garbage collection after 30 seconds
    setTimeout(runGarbageCollection, 30000);
});

module.exports = app; 