#!/usr/bin/env node

// Simple test script for garbage collection functionality
const fs = require('fs').promises;
const path = require('path');

// Mock the garbage collection configuration
const GC_CONFIG = {
    INACTIVE_TIMEOUT: 5 * 60 * 1000, // 5 minutes
    MAX_SITES: 50,
    MAX_DISK_SIZE_MB: 1000,
};

// Mock active sessions
const activeSessions = new Map();

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
        console.error(`Error calculating directory size for ${dirPath}:`, error.message);
        return 0;
    }
}

async function testGarbageCollection() {
    console.log('🧹 Testing Garbage Collection Logic...\n');
    
    try {
        const replicatedSitesDir = path.join(__dirname, 'replicated-sites');
        
        // Check if directory exists
        try {
            await fs.access(replicatedSitesDir);
        } catch {
            console.log('📁 No replicated-sites directory found');
            return;
        }

        const files = await fs.readdir(replicatedSitesDir);
        const now = Date.now();
        let totalSizeMB = 0;

        console.log(`📊 Found ${files.length} items in replicated-sites/`);

        // Get all site directories with their stats
        const siteInfos = [];
        for (const file of files) {
            const filePath = path.join(replicatedSitesDir, file);
            const stat = await fs.stat(filePath);
            
            if (stat.isDirectory()) {
                const sizeBytes = await getDirectorySize(filePath);
                const sizeMB = sizeBytes / (1024 * 1024);
                totalSizeMB += sizeMB;
                
                const ageMinutes = Math.round((now - stat.ctime.getTime()) / 60000);
                
                siteInfos.push({
                    id: file,
                    path: filePath,
                    createdAt: stat.ctime.getTime(),
                    sizeBytes,
                    sizeMB,
                    ageMinutes
                });
                
                console.log(`  📁 ${file}`);
                console.log(`     Size: ${sizeMB.toFixed(2)} MB`);
                console.log(`     Age: ${ageMinutes} minutes`);
                console.log(`     Created: ${stat.ctime.toISOString()}`);
                
                // Check if it would be cleaned up
                const session = activeSessions.get(file);
                if (!session) {
                    const age = now - stat.ctime.getTime();
                    if (age > GC_CONFIG.INACTIVE_TIMEOUT) {
                        console.log(`     🗑️  Would be DELETED (no session, age > timeout)`);
                    } else {
                        console.log(`     ✅ Would be KEPT (no session, but age < timeout)`);
                    }
                } else {
                    const inactiveTime = now - session.lastActivity;
                    if (inactiveTime > GC_CONFIG.INACTIVE_TIMEOUT && session.sessionCount === 0) {
                        console.log(`     🗑️  Would be DELETED (inactive session)`);
                    } else {
                        console.log(`     ✅ Would be KEPT (active session)`);
                    }
                }
                console.log('');
            }
        }

        console.log(`📊 Summary:`);
        console.log(`   Total sites: ${siteInfos.length}`);
        console.log(`   Total size: ${totalSizeMB.toFixed(2)} MB`);
        console.log(`   Max allowed: ${GC_CONFIG.MAX_DISK_SIZE_MB} MB`);
        console.log(`   Usage: ${((totalSizeMB / GC_CONFIG.MAX_DISK_SIZE_MB) * 100).toFixed(1)}%`);
        
        if (totalSizeMB > GC_CONFIG.MAX_DISK_SIZE_MB) {
            console.log(`   ⚠️  OVER LIMIT by ${(totalSizeMB - GC_CONFIG.MAX_DISK_SIZE_MB).toFixed(2)} MB`);
        } else {
            console.log(`   ✅ Within disk limit`);
        }
        
        if (siteInfos.length > GC_CONFIG.MAX_SITES) {
            console.log(`   ⚠️  TOO MANY SITES (${siteInfos.length} > ${GC_CONFIG.MAX_SITES})`);
        } else {
            console.log(`   ✅ Within site count limit`);
        }

    } catch (error) {
        console.error('❌ Error during garbage collection test:', error);
    }
}

// Add some mock sessions for testing
activeSessions.set('www_theatlantic_com_2025-06-13T19-48-20-956Z', {
    lastActivity: Date.now() - (2 * 60 * 1000), // 2 minutes ago
    sessionCount: 1,
    createdAt: Date.now() - (10 * 60 * 1000) // 10 minutes ago
});

activeSessions.set('digiday_com_2025-06-13T19-32-23-371Z', {
    lastActivity: Date.now() - (10 * 60 * 1000), // 10 minutes ago
    sessionCount: 0, // No active sessions
    createdAt: Date.now() - (15 * 60 * 1000) // 15 minutes ago
});

console.log('🗑️ Garbage Collection Test\n');
console.log('Configuration:');
console.log(`  Inactive timeout: ${GC_CONFIG.INACTIVE_TIMEOUT / 60000} minutes`);
console.log(`  Max sites: ${GC_CONFIG.MAX_SITES}`);
console.log(`  Max disk size: ${GC_CONFIG.MAX_DISK_SIZE_MB} MB`);
console.log('');

testGarbageCollection().then(() => {
    console.log('✅ Test completed');
}).catch(error => {
    console.error('❌ Test failed:', error);
}); 