#!/usr/bin/env node

// src/index.js
const { Command } = require('commander');
const path = require('path');
const fs = require('fs').promises;

const BrowserManager = require('./core/BrowserManager');
const PageNavigator = require('./core/PageNavigator');
const AssetDetector = require('./core/AssetDetector');
const AssetDownloader = require('./core/AssetDownloader');
const HTMLProcessor = require('./core/HTMLProcessor');
const { ErrorHandler, ReplicationError } = require('./core/ErrorHandler');
const logger = require('./utils/logger');

class WebsiteReplicator {
  constructor(options = {}) {
    this.options = {
      outputDir: options.outputDir || './replicated-sites',
      browserEngine: options.browserEngine || 'puppeteer',
      maxConcurrency: options.maxConcurrency || 5,
      timeout: options.timeout || 30000,
      includeAssets: options.includeAssets !== false,
      optimizeImages: options.optimizeImages || true,
      preserveOriginalLinks: options.preserveOriginalLinks || false,
      ...options
    };

    this.browserManager = new BrowserManager({
      engine: this.options.browserEngine,
      timeout: this.options.timeout,
      headless: this.options.headless !== false
    });

    this.pageNavigator = new PageNavigator(this.browserManager);
    this.assetDetector = new AssetDetector();
    this.assetDownloader = new AssetDownloader({
      maxConcurrency: this.options.maxConcurrency,
      timeout: this.options.timeout,
      optimizeImages: this.options.optimizeImages
    });

    this.htmlProcessor = new HTMLProcessor({
      preserveOriginalLinks: this.options.preserveOriginalLinks
    });

    this.errorHandler = new ErrorHandler();
  }

  async replicateWebsite(url, outputPath = null) {
    const correlationId = logger.createCorrelationId();
    const startTime = Date.now();

    try {
      logger.logRequest(correlationId, url, this.options);

      // Validate URL
      this.validateUrl(url);

      // Generate output path if not provided
      const finalOutputPath = outputPath || this.generateOutputPath(url);

      // Initialize browser
      await this.browserManager.initialize(correlationId);

      // Phase 1: Extract page content
      logger.logProgress(correlationId, 'phase_1_extraction_start');
      const pageData = await this.errorHandler.retryOperation(
        () => this.pageNavigator.navigateAndExtract(correlationId, url, {
          waitForNetworkIdle: true,
          waitForJS: true
        }),
        correlationId,
        { operationName: 'page_extraction', maxRetries: 2 }
      );

      // Phase 2: Detect assets
      logger.logProgress(correlationId, 'phase_2_asset_detection_start');
      const assets = await this.assetDetector.detectAssets(
        pageData.html,
        url,
        correlationId
      );

      // Phase 3: Download assets (if enabled)
      let assetMapping = {};
      if (this.options.includeAssets) {
        logger.logProgress(correlationId, 'phase_3_asset_download_start');
        const downloadResult = await this.assetDownloader.downloadAssets(
          assets,
          finalOutputPath,
          url,
          correlationId
        );
        assetMapping = downloadResult.mapping;
      }

      // Phase 4: Process HTML
      logger.logProgress(correlationId, 'phase_4_html_processing_start');
      const processedHTML = await this.htmlProcessor.processHTML(
        pageData.html,
        assetMapping,
        url,
        correlationId,
        this.options.features
      );

      // Phase 5: Save files
      logger.logProgress(correlationId, 'phase_5_file_saving_start');
      await this.saveFiles(processedHTML, pageData, finalOutputPath, correlationId);

      // Generate completion report
      const report = await this.generateReport(
        url,
        finalOutputPath,
        pageData,
        assets,
        correlationId,
        startTime
      );

      logger.logProgress(correlationId, 'replication_complete', {
        url,
        outputPath: finalOutputPath,
        duration: Date.now() - startTime,
        success: true
      });

      return report;
    } catch (error) {
      const errorInfo = await this.errorHandler.handleError(error, correlationId, {
        stage: 'main_replication',
        url
      });

      logger.logError(correlationId, error, {
        stage: 'replication_failed',
        url,
        duration: Date.now() - startTime
      });

      throw error;
    } finally {
      // Cleanup
      await this.browserManager.close();
    }
  }

  validateUrl(url) {
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('URL must use HTTP or HTTPS protocol');
      }
    } catch (error) {
      throw new ReplicationError(
        `Invalid URL: ${url}`,
        'INVALID_URL',
        { url },
        error
      );
    }
  }

  generateOutputPath(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace(/[^a-zA-Z0-9]/g, '_');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      return path.join(this.options.outputDir, `${hostname}_${timestamp}`);
    } catch (error) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      return path.join(this.options.outputDir, `unknown_site_${timestamp}`);
    }
  }

  async saveFiles(html, pageData, outputPath, correlationId) {
    try {
      // Ensure output directory exists
      await fs.mkdir(outputPath, { recursive: true });

      // Save main HTML file
      const htmlPath = path.join(outputPath, 'index.html');
      await fs.writeFile(htmlPath, html, 'utf8');

      // Copy experiment.js to output directory
      const experimentJsPath = path.join(__dirname, '../experiment.js');
      const outputExperimentJsPath = path.join(outputPath, 'experiment.js');
      await fs.copyFile(experimentJsPath, outputExperimentJsPath);

      // Copy gist-logo.png to output directory (fallback for when sites don't have favicon)
      const gistLogoPath = path.join(__dirname, '../gist-logo.png');
      const outputGistLogoPath = path.join(outputPath, 'gist-logo.png');
      try {
        await fs.copyFile(gistLogoPath, outputGistLogoPath);
        logger.logProgress(correlationId, 'gist_logo_copied', { gistLogoPath: outputGistLogoPath });
      } catch (logoError) {
        // Log warning but don't fail the entire process if logo copy fails
        logger.logError(correlationId, logoError, { 
          stage: 'gist_logo_copy_failed',
          message: 'Failed to copy gist-logo.png, widget will use fallback'
        });
      }

      // Save metadata
      const metadata = {
        originalUrl: pageData.url,
        title: pageData.title,
        metaData: pageData.metaData,
        extractedAt: pageData.extractedAt,
        replicationId: correlationId,
        replicatedBy: 'Gist.ai Website Replicator',
        version: '1.0.0'
      };

      const metadataPath = path.join(outputPath, 'metadata.json');
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');

      // Save screenshot
      if (pageData.screenshot) {
        const screenshotPath = path.join(outputPath, 'screenshot.png');
        await fs.writeFile(screenshotPath, pageData.screenshot, 'base64');
      }

      logger.logProgress(correlationId, 'files_saved', {
        htmlPath,
        metadataPath,
        hasScreenshot: !!pageData.screenshot
      });
    } catch (error) {
      throw new ReplicationError(
        'Failed to save files',
        'FILE_SAVE_ERROR',
        { outputPath },
        error
      );
    }
  }

  async generateReport(url, outputPath, pageData, assets, correlationId, startTime) {
    const duration = Date.now() - startTime;
    const errorStats = this.errorHandler.getErrorStatistics();

    const report = {
      replicationId: correlationId,
      url,
      outputPath,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date().toISOString(),
      duration: {
        ms: duration,
        seconds: Math.round(duration / 1000),
        minutes: Math.round(duration / 60000)
      },
      pageInfo: {
        title: pageData.title,
        htmlSize: pageData.html?.length || 0,
        hasScreenshot: !!pageData.screenshot
      },
      assets: {
        detected: Object.keys(assets).reduce((total, type) => {
          return total + (Array.isArray(assets[type]) ? assets[type].length : 0);
        }, 0),
        breakdown: Object.keys(assets).reduce((breakdown, type) => {
          breakdown[type] = Array.isArray(assets[type]) ? assets[type].length : 0;
          return breakdown;
        }, {})
      },
      download: this.assetDownloader.downloadStats,
      errors: errorStats,
      success: true
    };

    // Save report
    const reportPath = path.join(outputPath, 'replication-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');

    return report;
  }
}

// CLI Implementation
const program = new Command();

program
  .name('gist-replicator')
  .description('Advanced website replication tool for Gist.ai')
  .version('1.0.0');

program
  .command('replicate')
  .description('Replicate a website from URL')
  .argument('<url>', 'URL to replicate')
  .option('-o, --output <path>', 'Output directory path')
  .option('-e, --engine <engine>', 'Browser engine (puppeteer|playwright)', 'puppeteer')
  .option('--no-assets', 'Skip asset downloading')
  .option('--no-optimize', 'Skip image optimization')
  .option('--preserve-links', 'Preserve original links in HTML')
  .option('--max-concurrency <number>', 'Maximum concurrent downloads', '5')
  .option('--timeout <number>', 'Request timeout in milliseconds', '30000')
  .option('--headless <boolean>', 'Run browser in headless mode', true)
  .option('--features <features>', 'Comma-separated list of features to enable (ask,gist,remix,share)')
  .action(async (url, options) => {
    try {
      console.log(`🚀 Starting replication of: ${url}`);
      
      // Parse features if provided
      let features = null;
      if (options.features) {
        features = options.features.split(',').map(f => f.trim()).filter(f => f);
        console.log(`🎯 Selected features: ${features.join(', ')}`);
      }

      const replicator = new WebsiteReplicator({
        outputDir: options.output || './replicated-sites',
        browserEngine: options.engine,
        includeAssets: options.assets,
        optimizeImages: options.optimize,
        preserveOriginalLinks: options.preserveLinks,
        maxConcurrency: parseInt(options.maxConcurrency),
        timeout: parseInt(options.timeout),
        headless: options.headless,
        features: features
      });

      const report = await replicator.replicateWebsite(url, options.output);

      console.log('✅ Replication completed successfully!');
      console.log(`📁 Output: ${report.outputPath}`);
      console.log(`⏱️ Duration: ${report.duration.seconds} seconds`);
      console.log(`🎯 Assets: ${report.assets.detected} detected`);
      console.log(`📥 Downloads: ${report.download.completed}/${report.download.total} successful`);
      
    } catch (error) {
      console.error('❌ Replication failed:', error.message);
      if (error instanceof ReplicationError) {
        console.error(`Error Type: ${error.type}`);
        if (error.context) {
          console.error('Context:', JSON.stringify(error.context, null, 2));
        }
      }
      process.exit(1);
    }
  });

program
  .command('health')
  .description('Check system health and capabilities')
  .action(async () => {
    console.log('🏥 System Health Check');
    console.log('=====================');
    
    try {
      // Test browser initialization
      console.log('🔍 Testing browser engines...');
      
      const puppeteerTest = new BrowserManager({ engine: 'puppeteer' });
      await puppeteerTest.initialize('health-check');
      await puppeteerTest.close();
      console.log('✅ Puppeteer: OK');

      try {
        const playwrightTest = new BrowserManager({ engine: 'playwright' });
        await playwrightTest.initialize('health-check');
        await playwrightTest.close();
        console.log('✅ Playwright: OK');
      } catch (error) {
        console.log('⚠️ Playwright: Not available (optional)');
      }

      console.log('✅ All systems operational');
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
      process.exit(1);
    }
  });

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.logError('system', error, { stage: 'uncaught_exception' });
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.logError('system', new Error(reason), {
    stage: 'unhandled_rejection',
    promise: promise.toString()
  });
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Parse command line arguments
if (require.main === module) {
  program.parse();
}

module.exports = WebsiteReplicator;