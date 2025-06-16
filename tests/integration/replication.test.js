// tests/integration/replication.test.js
const WebsiteReplicator = require('../../src/index');
const fs = require('fs').promises;
const path = require('path');

describe('Website Replication Integration Tests', () => {
  let replicator;
  let testOutputDir;

  beforeEach(() => {
    testOutputDir = path.join(__dirname, '../../test-output');
    replicator = new WebsiteReplicator({
      outputDir: testOutputDir,
      timeout: 10000,
      maxConcurrency: 2
    });
  });

  afterEach(async () => {
    // Cleanup test files
    try {
      await fs.rmdir(testOutputDir, { recursive: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('Basic Replication', () => {
    test('should replicate a simple static website', async () => {
      const testUrl = 'https://example.com';
      const result = await replicator.replicateWebsite(testUrl);

      expect(result.success).toBe(true);
      expect(result.url).toBe(testUrl);

      // Check output files exist
      const htmlPath = path.join(result.outputPath, 'index.html');
      const metadataPath = path.join(result.outputPath, 'metadata.json');
      
      expect(await fileExists(htmlPath)).toBe(true);
      expect(await fileExists(metadataPath)).toBe(true);

      // Validate HTML content
      const htmlContent = await fs.readFile(htmlPath, 'utf8');
      expect(htmlContent).toContain('Example Domain');
      expect(htmlContent).toContain('gist-replicator-source');
    }, 30000);

    test('should handle invalid URLs gracefully', async () => {
      const testUrl = 'invalid-url';
      
      await expect(replicator.replicateWebsite(testUrl))
        .rejects.toThrow(/Invalid URL/);
    });

    test('should generate proper output structure', async () => {
      const testUrl = 'https://example.com';
      const result = await replicator.replicateWebsite(testUrl);

      // Check directory structure
      const assetsDir = path.join(result.outputPath, 'assets');
      expect(await directoryExists(assetsDir)).toBe(true);

      // Check metadata
      const metadataPath = path.join(result.outputPath, 'metadata.json');
      const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
      
      expect(metadata.originalUrl).toBe(testUrl);
      expect(metadata.replicatedBy).toBe('Gist.ai Website Replicator');
      expect(metadata.version).toBe('1.0.0');
    }, 30000);
  });
});

// Test utilities
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function directoryExists(dirPath) {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}