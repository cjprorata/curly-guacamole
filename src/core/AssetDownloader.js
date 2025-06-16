// src/core/AssetDownloader.js
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const async = require('async');
const logger = require('../utils/logger');

class AssetDownloader {
  constructor(options = {}) {
    this.options = {
      maxConcurrency: options.maxConcurrency || 10,
      timeout: options.timeout || 30000,
      maxRetries: options.maxRetries || 3,
      downloadDelay: options.downloadDelay || 100,
      userAgent: options.userAgent || 'Mozilla/5.0 (compatible; Gist.ai-Replicator/1.0)',
      maxFileSize: options.maxFileSize || 50 * 1024 * 1024, // 50MB
      ...options
    };
    
    this.downloadStats = {
      total: 0,
      completed: 0,
      failed: 0,
      bytes: 0
    };
  }

  async downloadAssets(assets, outputDir, baseUrl, correlationId) {
    try {
      logger.logProgress(correlationId, 'asset_download_start', {
        totalAssets: this.countTotalAssets(assets),
        outputDir,
        concurrency: this.options.maxConcurrency
      });

      // Create output directory structure
      await this.createDirectoryStructure(outputDir);

      // Flatten all assets into download queue
      const downloadQueue = this.createDownloadQueue(assets, outputDir, baseUrl);
      this.downloadStats.total = downloadQueue.length;

      // Process downloads with controlled concurrency
      const results = await this.processDownloads(downloadQueue, correlationId);

      // Generate asset mapping for HTML rewriting
      const assetMapping = this.generateAssetMapping(results, baseUrl);

      logger.logProgress(correlationId, 'asset_download_complete', {
        ...this.downloadStats,
        successRate: ((this.downloadStats.completed / this.downloadStats.total) * 100).toFixed(2)
      });

      return {
        mapping: assetMapping,
        stats: this.downloadStats,
        results
      };
    } catch (error) {
      logger.logError(correlationId, error, {
        stage: 'asset_download',
        stats: this.downloadStats
      });
      throw error;
    }
  }

  createDownloadQueue(assets, outputDir, baseUrl) {
    const queue = [];

    // Process each asset type
    Object.entries(assets).forEach(([type, assetList]) => {
      if (Array.isArray(assetList)) {
        assetList.forEach(asset => {
          const assetUrl = asset.url || asset;
          if (assetUrl && typeof assetUrl === 'string' && !assetUrl.startsWith('data:')) {
            queue.push({
              url: assetUrl,
              type,
              originalAsset: asset,
              outputPath: this.generateOutputPath(assetUrl, type, outputDir),
              relativePath: this.generateRelativePath(assetUrl, type)
            });
          }
        });
      }
    });

    return queue;
  }

  async processDownloads(downloadQueue, correlationId) {
    return new Promise((resolve, reject) => {
      const results = [];

      // Create async queue with concurrency control
      const queue = async.queue(async (task) => {
        try {
          const result = await this.downloadAsset(task, correlationId);
          results.push(result);
          this.downloadStats.completed++;

          // Log progress every 10 downloads
          if (this.downloadStats.completed % 10 === 0) {
            logger.logProgress(correlationId, 'download_progress', {
              completed: this.downloadStats.completed,
              total: this.downloadStats.total,
              failed: this.downloadStats.failed,
              percentage: ((this.downloadStats.completed / this.downloadStats.total) * 100).toFixed(2)
            });
          }
        } catch (error) {
          this.downloadStats.failed++;
          logger.logError(correlationId, error, {
            stage: 'asset_download',
            url: task.url,
            type: task.type
          });
          
          results.push({
            ...task,
            success: false,
            error: error.message
          });
        }
      }, this.options.maxConcurrency);

      // Handle queue completion
      queue.drain(() => {
        resolve(results);
      });

      // Handle queue errors
      queue.error((error, task) => {
        logger.logError(correlationId, error, {
          stage: 'download_queue_error',
          task
        });
      });

      // Add all tasks to queue
      queue.push(downloadQueue);
    });
  }

  async downloadAsset(task, correlationId, attempt = 1) {
    try {
      // Add delay between requests to be respectful
      if (this.options.downloadDelay > 0) {
        await this.sleep(this.options.downloadDelay);
      }

      logger.logProgress(correlationId, 'asset_download_attempt', {
        url: task.url,
        type: task.type,
        attempt,
        outputPath: task.outputPath
      });

      // Configure request
      const requestConfig = {
        method: 'GET',
        url: task.url,
        timeout: this.options.timeout,
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': this.options.userAgent,
          'Accept': this.getAcceptHeader(task.type),
          'Accept-Encoding': 'gzip, deflate',
          'Cache-Control': 'no-cache'
        },
        maxContentLength: this.options.maxFileSize,
        maxBodyLength: this.options.maxFileSize
      };

      // Make request
      const response = await axios(requestConfig);

      // Validate response
      if (response.status >= 400) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Process and save file
      const processedData = await this.processAssetData(
        Buffer.from(response.data),
        task,
        response.headers['content-type'] || '',
        correlationId
      );

      // Ensure directory exists
      await fs.mkdir(path.dirname(task.outputPath), { recursive: true });

      // Write file
      await fs.writeFile(task.outputPath, processedData);

      // Update stats
      this.downloadStats.bytes += processedData.length;

      logger.logProgress(correlationId, 'asset_downloaded', {
        url: task.url,
        outputPath: task.outputPath,
        size: processedData.length,
        contentType: response.headers['content-type']
      });

      return {
        ...task,
        success: true,
        size: processedData.length,
        contentType: response.headers['content-type'],
        downloadedAt: new Date().toISOString()
      };
    } catch (error) {
      if (attempt < this.options.maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        logger.logProgress(correlationId, 'asset_download_retry', {
          url: task.url,
          attempt,
          maxRetries: this.options.maxRetries,
          delay,
          error: error.message
        });
        
        await this.sleep(delay);
        return this.downloadAsset(task, correlationId, attempt + 1);
      }
      
      throw new Error(`Download failed after ${this.options.maxRetries} attempts: ${error.message}`);
    }
  }

  async processAssetData(data, task, contentType, correlationId) {
    try {
      // For this demo, we'll just return the data as-is
      // In a full implementation, you could add image optimization, CSS processing, etc.
      return data;
    } catch (error) {
      logger.logError(correlationId, error, {
        stage: 'asset_processing',
        url: task.url,
        type: task.type
      });
      
      // Return original data if processing fails
      return data;
    }
  }

  generateOutputPath(assetUrl, type, outputDir) {
    try {
      const urlObj = new URL(assetUrl);
      const pathname = urlObj.pathname;
      
      // Create type-based subdirectory
      const typeDir = this.getTypeDirectory(type);
      
      // Generate safe filename
      let filename = path.basename(pathname) || 'index.html';
      
      // Add extension if missing
      if (!path.extname(filename)) {
        filename += this.getDefaultExtension(type);
      }
      
      // Sanitize filename
      filename = this.sanitizeFilename(filename);
      
      return path.join(outputDir, typeDir, filename);
    } catch (error) {
      // Fallback for invalid URLs
      const hash = this.generateHash(assetUrl);
      const typeDir = this.getTypeDirectory(type);
      const ext = this.getDefaultExtension(type);
      return path.join(outputDir, typeDir, `${hash}${ext}`);
    }
  }

  generateRelativePath(assetUrl, type) {
    try {
      const urlObj = new URL(assetUrl);
      const typeDir = this.getTypeDirectory(type);
      let filename = path.basename(urlObj.pathname) || 'index.html';
      
      if (!path.extname(filename)) {
        filename += this.getDefaultExtension(type);
      }
      
      filename = this.sanitizeFilename(filename);
      return `${typeDir}/${filename}`;
    } catch (error) {
      const hash = this.generateHash(assetUrl);
      const typeDir = this.getTypeDirectory(type);
      const ext = this.getDefaultExtension(type);
      return `${typeDir}/${hash}${ext}`;
    }
  }

  getTypeDirectory(type) {
    const dirMap = {
      images: 'assets/images',
      stylesheets: 'assets/css',
      scripts: 'assets/js',
      fonts: 'assets/fonts',
      videos: 'assets/videos',
      audio: 'assets/audio',
      'css-asset': 'assets/images' // CSS-referenced assets
    };
    return dirMap[type] || 'assets/misc';
  }

  getDefaultExtension(type) {
    const extMap = {
      images: '.jpg',
      stylesheets: '.css',
      scripts: '.js',
      fonts: '.woff2',
      videos: '.mp4',
      audio: '.mp3'
    };
    return extMap[type] || '.bin';
  }

  sanitizeFilename(filename) {
    return filename
      .replace(/[<>:"/\\|?*]/g, '_')
      .replace(/\s+/g, '_')
      .substring(0, 100); // Limit length
  }

  generateHash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  async createDirectoryStructure(outputDir) {
    const dirs = [
      'assets/images',
      'assets/css',
      'assets/js',
      'assets/fonts',
      'assets/videos',
      'assets/audio',
      'assets/misc'
    ];

    for (const dir of dirs) {
      await fs.mkdir(path.join(outputDir, dir), { recursive: true });
    }
  }

  countTotalAssets(assets) {
    return Object.values(assets).reduce((total, assetList) => {
      return total + (Array.isArray(assetList) ? assetList.length : 0);
    }, 0);
  }

  generateAssetMapping(results, baseUrl) {
    const mapping = {};
    results.forEach(result => {
      if (result.success) {
        mapping[result.url] = result.relativePath;
      }
    });
    return mapping;
  }

  getAcceptHeader(type) {
    const acceptMap = {
      images: 'image/webp,image/apng,image/*,*/*;q=0.8',
      stylesheets: 'text/css,*/*;q=0.1',
      scripts: 'application/javascript,*/*;q=0.1',
      fonts: 'font/woff2,font/woff,*/*;q=0.1'
    };
    return acceptMap[type] || '*/*';
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = AssetDownloader;