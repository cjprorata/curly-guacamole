// src/core/PageNavigator.js
const logger = require('../utils/logger');

class PageNavigator {
  constructor(browserManager) {
    this.browserManager = browserManager;
  }

  async navigateAndExtract(correlationId, url, options = {}) {
    const { page, pageId } = await this.browserManager.createPage(correlationId, url);
    
    try {
      logger.logProgress(correlationId, 'navigation_start', { url });
      
      // Navigate with retry mechanism
      const response = await this.navigateWithRetry(page, url, correlationId, options);
      
      // Wait for content to load
      await this.waitForContent(page, correlationId, options);
      
      // Extract page data
      const pageData = await this.extractPageData(page, correlationId, url);
      
      logger.logProgress(correlationId, 'navigation_complete', {
        url,
        statusCode: response?.status(),
        contentLength: pageData.html?.length || 0
      });
      
      return pageData;
    } catch (error) {
      logger.logError(correlationId, error, {
        stage: 'navigation_and_extraction',
        url
      });
      throw error;
    } finally {
      await this.browserManager.closePage(pageId);
    }
  }

  async navigateWithRetry(page, url, correlationId, options, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        logger.logProgress(correlationId, 'navigation_attempt', {
          url,
          attempt,
          maxRetries
        });
        
        const response = await page.goto(url, {
          waitUntil: options.waitUntil || 'domcontentloaded',
          timeout: options.timeout || 30000
        });
        
        // Check for successful response
        if (response && response.status() >= 400) {
          throw new Error(`HTTP ${response.status()}: ${response.statusText()}`);
        }
        
        return response;
      } catch (error) {
        lastError = error;
        logger.logError(correlationId, error, {
          stage: 'navigation_attempt',
          url,
          attempt,
          maxRetries
        });
        
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          logger.logProgress(correlationId, 'navigation_retry_delay', {
            delay,
            nextAttempt: attempt + 1
          });
          await this.sleep(delay);
        }
      }
    }
    
    throw new Error(`Navigation failed after ${maxRetries} attempts: ${lastError.message}`);
  }

  async waitForContent(page, correlationId, options = {}) {
    try {
      // Wait for network to be idle (no requests for 500ms)
      if (options.waitForNetworkIdle) {
        await page.waitForLoadState('networkidle', { timeout: 10000 });
      }
      
      // Wait for specific selectors
      if (options.waitForSelectors && Array.isArray(options.waitForSelectors)) {
        for (const selector of options.waitForSelectors) {
          try {
            await page.waitForSelector(selector, { timeout: 5000 });
            logger.logProgress(correlationId, 'selector_found', { selector });
          } catch (error) {
            logger.logProgress(correlationId, 'selector_not_found', {
              selector,
              error: error.message
            });
          }
        }
      }
      
      // Wait for JavaScript execution to complete
      if (options.waitForJS) {
        await this.waitForJavaScriptComplete(page, correlationId);
      }
      
      // Custom wait function
      if (options.customWait && typeof options.customWait === 'function') {
        await options.customWait(page);
      }
    } catch (error) {
      logger.logError(correlationId, error, {
        stage: 'content_waiting'
      });
      // Don't throw here - continue with extraction even if waiting fails
    }
  }

  async waitForJavaScriptComplete(page, correlationId) {
    try {
      // Wait for document.readyState to be complete
      await page.waitForFunction(
        () => document.readyState === 'complete',
        { timeout: 10000 }
      );
      
      // Wait for any pending setTimeout/setInterval to complete
      await page.waitForFunction(
        () => {
          return new Promise(resolve => {
            if (window.requestIdleCallback) {
              window.requestIdleCallback(resolve);
            } else {
              setTimeout(resolve, 100);
            }
          });
        },
        { timeout: 5000 }
      );
      
      logger.logProgress(correlationId, 'javascript_complete');
    } catch (error) {
      logger.logProgress(correlationId, 'javascript_wait_timeout', {
        error: error.message
      });
    }
  }

  async extractPageData(page, correlationId, url) {
    try {
      // Get page HTML
      const html = await page.content();
      
      // Get page title
      const title = await page.title();
      
      // Get meta information
      const metaData = await page.evaluate(() => {
        const metas = {};
        document.querySelectorAll('meta').forEach(meta => {
          const name = meta.getAttribute('name') || meta.getAttribute('property');
          const content = meta.getAttribute('content');
          if (name && content) {
            metas[name] = content;
          }
        });
        return metas;
      });
      
      // Get all links and assets
      const resources = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href]'))
          .map(a => a.href);
        
        const images = Array.from(document.querySelectorAll('img[src]'))
          .map(img => img.src);
        
        const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
          .map(link => link.href);
        
        const scripts = Array.from(document.querySelectorAll('script[src]'))
          .map(script => script.src);
        
        return { links, images, stylesheets, scripts };
      });
      
      // Take screenshot for reference
      const screenshot = await page.screenshot({
        fullPage: true,
        type: 'png'
      });
      
      logger.logProgress(correlationId, 'page_data_extracted', {
        url,
        htmlLength: html.length,
        title,
        resourceCounts: {
          links: resources.links.length,
          images: resources.images.length,
          stylesheets: resources.stylesheets.length,
          scripts: resources.scripts.length
        }
      });
      
      return {
        url,
        html,
        title,
        metaData,
        resources,
        screenshot: screenshot.toString('base64'),
        extractedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.logError(correlationId, error, {
        stage: 'page_data_extraction',
        url
      });
      throw error;
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = PageNavigator;