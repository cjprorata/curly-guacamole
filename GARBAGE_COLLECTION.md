# 🗑️ Garbage Collection System

The Website Replicator includes an intelligent garbage collection system that automatically manages disk space by cleaning up inactive replicated sites.

## 🎯 Overview

The garbage collection system prevents the `replicated-sites` directory from growing indefinitely by:

1. **Session Tracking**: Monitors when users visit replicated sites
2. **Heartbeat System**: Tracks active users with periodic heartbeats
3. **Automatic Cleanup**: Removes sites after periods of inactivity
4. **Resource Management**: Enforces disk space and site count limits

## ⚙️ Configuration

The garbage collection system is configured in `server.js`:

```javascript
const GC_CONFIG = {
    INACTIVE_TIMEOUT: 5 * 60 * 1000, // 5 minutes of inactivity before cleanup
    HEARTBEAT_INTERVAL: 30 * 1000,   // 30 seconds between heartbeats
    MAX_SITES: 50,                   // Maximum number of sites to keep
    MAX_DISK_SIZE_MB: 1000,          // Maximum disk usage in MB
    CLEANUP_INTERVAL: 2 * 60 * 1000  // Run cleanup every 2 minutes
};
```

### Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `INACTIVE_TIMEOUT` | 5 minutes | Time before inactive sites are deleted |
| `HEARTBEAT_INTERVAL` | 30 seconds | How often clients send heartbeats |
| `MAX_SITES` | 50 | Maximum number of sites to keep |
| `MAX_DISK_SIZE_MB` | 1000 MB | Maximum total disk usage |
| `CLEANUP_INTERVAL` | 2 minutes | How often cleanup runs automatically |

## 🔄 How It Works

### 1. Session Tracking

When a user visits a replicated site:
- The server creates a session entry with timestamp
- Session count is incremented for multiple concurrent users
- Last activity time is updated on each request

### 2. Client-Side Heartbeats

Each replicated site includes JavaScript that:
- Sends heartbeats every 30 seconds to keep the site alive
- Pauses heartbeats when the page is hidden/inactive
- Notifies the server when the user leaves (using `beforeunload` events)

### 3. Cleanup Process

The garbage collector runs every 2 minutes and:

1. **Removes Inactive Sites**: Deletes sites with no activity for 5+ minutes
2. **Enforces Site Limit**: Keeps only the 50 most recent sites
3. **Manages Disk Space**: Removes largest sites if over 1GB total
4. **Cleans Orphaned Sessions**: Removes session data for deleted sites

### 4. Cleanup Priority

Sites are cleaned up in this order:
1. Sites with no session tracking (oldest first)
2. Sites with inactive sessions (longest inactive first)
3. Excess sites beyond the maximum count (oldest first)
4. Largest sites when over disk limit (largest first)

## 📊 Monitoring

### Web Interface

The main web interface includes a garbage collection panel (click the 🗑️ GC button) that shows:
- Total number of sites
- Number of active sites
- Current disk usage
- Active sessions with timestamps
- Manual cleanup button

### API Endpoints

#### Get Status
```http
GET /api/gc/status
```

Returns:
```json
{
  "totalSites": 15,
  "activeSites": 3,
  "totalSizeMB": 245.67,
  "maxSites": 50,
  "maxSizeMB": 1000,
  "inactiveTimeoutMinutes": 5,
  "activeSessions": [
    {
      "siteId": "www_example_com_2025-06-13T19-48-20-956Z",
      "sessionCount": 2,
      "lastActivity": "2025-06-13T19:50:15.123Z",
      "inactiveMinutes": 1
    }
  ]
}
```

#### Manual Cleanup
```http
POST /api/gc/run
```

Triggers immediate garbage collection and returns:
```json
{
  "success": true,
  "message": "Garbage collection completed"
}
```

#### Session Management
```http
POST /api/heartbeat/:siteId
POST /api/leave/:siteId
```

Used by client-side JavaScript to manage sessions.

## 🧪 Testing

Use the included test script to analyze your current sites:

```bash
node test-gc.js
```

This will show:
- All replicated sites with sizes and ages
- Which sites would be cleaned up
- Current disk usage vs limits
- Session status for each site

## 🔧 Client-Side Integration

The garbage collection tracking is automatically injected into every replicated site via `HTMLProcessor.js`. The client-side code:

1. **Extracts Site ID**: From the URL path (e.g., `www_example_com_2025-06-13T19-48-20-956Z`)
2. **Sends Heartbeats**: Every 30 seconds while the page is active
3. **Handles Visibility**: Pauses heartbeats when page is hidden
4. **Cleanup Notification**: Uses `navigator.sendBeacon()` for reliable leave notifications

## 📝 Logs

The garbage collection system provides detailed logging:

```
🧹 Running garbage collection...
📊 Found 17 sites, total size: 423.45 MB
🗑️  Deleting inactive site: old_site_123 (inactive: 8min)
🗑️  Deleting excess site: another_site_456 (enforcing max sites limit)
✅ Garbage collection complete: deleted 3 sites, 387.21 MB remaining
```

## 🚨 Important Notes

1. **Active Protection**: Sites with active users are never deleted
2. **Graceful Degradation**: If heartbeats fail, sites are kept for the full timeout period
3. **Browser Compatibility**: Uses `sendBeacon()` with fallback for older browsers
4. **Memory Efficiency**: Session data is stored in memory and cleaned up automatically
5. **Startup Cleanup**: Initial garbage collection runs 30 seconds after server start

## 🔒 Security Considerations

- Site IDs are extracted from URL paths, not user input
- All API endpoints validate site ID format
- No sensitive data is stored in session tracking
- Cleanup operations are logged for audit purposes

## 🎛️ Customization

To modify the garbage collection behavior:

1. **Change Timeouts**: Adjust `INACTIVE_TIMEOUT` in `server.js`
2. **Modify Limits**: Update `MAX_SITES` and `MAX_DISK_SIZE_MB`
3. **Custom Logic**: Extend the `runGarbageCollection()` function
4. **Client Behavior**: Modify the injected JavaScript in `HTMLProcessor.js`

## 🐛 Troubleshooting

### Sites Not Being Cleaned Up
- Check if heartbeats are being sent (browser dev tools → Network tab)
- Verify site ID extraction is working correctly
- Check server logs for garbage collection runs

### High Disk Usage
- Lower `MAX_DISK_SIZE_MB` limit
- Reduce `INACTIVE_TIMEOUT` for faster cleanup
- Run manual cleanup via API or web interface

### Session Tracking Issues
- Ensure JavaScript is enabled in replicated sites
- Check for console errors in browser dev tools
- Verify `beforeunload` events are firing

## 📈 Performance Impact

The garbage collection system is designed to be lightweight:
- Session tracking uses minimal memory (< 1KB per site)
- Cleanup runs are throttled to every 2 minutes
- Directory size calculation is cached during cleanup runs
- Client-side heartbeats are small HTTP requests (< 100 bytes)

---

The garbage collection system ensures your Website Replicator remains efficient and doesn't consume excessive disk space while providing a smooth user experience. 