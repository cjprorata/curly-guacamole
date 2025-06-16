// src/core/AssetDetector.js
const cheerio = require('cheerio');
const url = require('url');
const path = require('path');
const logger = require('../utils/logger');

class AssetDetector {
  constructor() {
    this.assetTypes = {
      images: ['img[src]', 'img[data-src]', 'source[srcset]', '[style*="background-image"]'],
      stylesheets: ['link[rel="stylesheet"]', 'style'],
      scripts: ['script[src]', 'script:not([src])'],
      fonts: ['link[rel="font"]', '@font-face'],
      videos: ['video[src]', 'source[src]'],
      audio: ['audio[src]'],
      iframes: ['iframe[src]'],
      links: ['a[href]'],
      forms: ['form[action]']
    };
  }

  async detectAssets(html, baseUrl, correlationId) {
    try {
      logger.logProgress(correlationId, 'asset_detection_start', { baseUrl });
      
      const $ = cheerio.load(html);
      const assets = {
        images: [],
        stylesheets: [],
        scripts: [],
        fonts: [],
        videos: [],
        audio: [],
        iframes: [],
        links: [],
        forms: [],
        inlineStyles: [],
        inlineScripts: []
      };

      // Detect images
      assets.images = this.detectImages($, baseUrl);
      
      // Detect stylesheets and extract CSS URLs
      const { stylesheets, inlineStyles } = this.detectStylesheets($, baseUrl);
      assets.stylesheets = stylesheets;
      assets.inlineStyles = inlineStyles;
      
      // Extract fonts from CSS
      assets.fonts = await this.detectFonts(assets.stylesheets, assets.inlineStyles, baseUrl, correlationId);
      
      // Detect scripts
      const { scripts, inlineScripts } = this.detectScripts($, baseUrl);
      assets.scripts = scripts;
      assets.inlineScripts = inlineScripts;
      
      // Detect other media
      assets.videos = this.detectMedia($, baseUrl, 'video');
      assets.audio = this.detectMedia($, baseUrl, 'audio');
      assets.iframes = this.detectIframes($, baseUrl);
      
      // Detect navigation links
      assets.links = this.detectLinks($, baseUrl);
      assets.forms = this.detectForms($, baseUrl);
      
      // Remove duplicates and invalid URLs
      Object.keys(assets).forEach(type => {
        if (Array.isArray(assets[type])) {
          assets[type] = this.deduplicateAndValidate(assets[type], baseUrl);
        }
      });
      
      logger.logProgress(correlationId, 'asset_detection_complete', {
        baseUrl,
        assetCounts: Object.keys(assets).reduce((counts, type) => {
          counts[type] = Array.isArray(assets[type]) ? assets[type].length : (assets[type] || '').length;
          return counts;
        }, {})
      });
      
      return assets;
    } catch (error) {
      logger.logError(correlationId, error, {
        stage: 'asset_detection',
        baseUrl
      });
      throw error;
    }
  }

  detectImages($, baseUrl) {
    const images = [];
    
    // Standard img tags
    $('img[src]').each((i, el) => {
      const src = $(el).attr('src');
      if (src) {
        images.push({
          url: this.resolveUrl(src, baseUrl),
          alt: $(el).attr('alt') || '',
          type: 'img',
          selector: 'img[src]'
        });
      }
    });
    
    // Lazy-loaded images
    $('img[data-src]').each((i, el) => {
      const src = $(el).attr('data-src');
      if (src) {
        images.push({
          url: this.resolveUrl(src, baseUrl),
          alt: $(el).attr('alt') || '',
          type: 'img-lazy',
          selector: 'img[data-src]'
        });
      }
    });
    
    // Background images in style attributes
    $('[style*="background-image"]').each((i, el) => {
      const style = $(el).attr('style');
      const matches = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/g);
      if (matches) {
        matches.forEach(match => {
          const urlMatch = match.match(/url\(['"]?([^'"]+)['"]?\)/);
          if (urlMatch && urlMatch[1]) {
            images.push({
              url: this.resolveUrl(urlMatch[1], baseUrl),
              type: 'background',
              selector: '[style*="background-image"]'
            });
          }
        });
      }
    });
    
    // Srcset for responsive images
    $('img[srcset], source[srcset]').each((i, el) => {
      const srcset = $(el).attr('srcset');
      if (srcset) {
        const urls = this.parseSrcset(srcset, baseUrl);
        urls.forEach(urlObj => {
          images.push({
            url: urlObj.url,
            type: 'srcset',
            descriptor: urlObj.descriptor,
            selector: 'img[srcset], source[srcset]'
          });
        });
      }
    });
    
    return images;
  }

  detectStylesheets($, baseUrl) {
    const stylesheets = [];
    const inlineStyles = [];
    
    // External stylesheets
    $('link[rel="stylesheet"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href) {
        stylesheets.push({
          url: this.resolveUrl(href, baseUrl),
          media: $(el).attr('media') || 'all',
          type: 'external',
          selector: 'link[rel="stylesheet"]'
        });
      }
    });
    
    // Inline styles
    $('style').each((i, el) => {
      const content = $(el).html();
      if (content) {
        inlineStyles.push({
          content: content,
          type: 'inline',
          media: $(el).attr('media') || 'all'
        });
      }
    });
    
    return { stylesheets, inlineStyles };
  }

  async detectFonts(stylesheets, inlineStyles, baseUrl, correlationId) {
    const fonts = [];
    
    try {
      // Extract from external stylesheets
      for (const stylesheet of stylesheets) {
        try {
          // For now, just add the stylesheet URL as a potential font source
          // In a full implementation, you'd fetch and parse the CSS
          if (stylesheet.url.includes('font') || stylesheet.url.includes('typeface')) {
            fonts.push({
              url: stylesheet.url,
              type: 'font-stylesheet',
              format: 'css'
            });
          }
        } catch (error) {
          logger.logProgress(correlationId, 'font_extraction_failed', {
            stylesheetUrl: stylesheet.url,
            error: error.message
          });
        }
      }
      
      // Extract from inline styles
      inlineStyles.forEach(style => {
        const fontUrls = this.extractFontUrls(style.content, baseUrl);
        fonts.push(...fontUrls);
      });
    } catch (error) {
      logger.logError(correlationId, error, {
        stage: 'font_detection'
      });
    }
    
    return fonts;
  }

  extractFontUrls(css, baseUrl) {
    const fonts = [];
    const fontFaceRegex = /@font-face\s*{[^}]*}/g;
    const urlRegex = /url\(['"]?([^'"]+)['"]?\)/g;
    
    const fontFaces = css.match(fontFaceRegex) || [];
    
    fontFaces.forEach(fontFace => {
      let match;
      while ((match = urlRegex.exec(fontFace)) !== null) {
        fonts.push({
          url: this.resolveUrl(match[1], baseUrl),
          type: 'font',
          format: this.detectFontFormat(match[1])
        });
      }
    });
    
    return fonts;
  }

  detectScripts($, baseUrl) {
    const scripts = [];
    const inlineScripts = [];
    
    // External scripts
    $('script[src]').each((i, el) => {
      const src = $(el).attr('src');
      if (src) {
        scripts.push({
          url: this.resolveUrl(src, baseUrl),
          type: 'external',
          async: $(el).attr('async') !== undefined,
          defer: $(el).attr('defer') !== undefined,
          selector: 'script[src]'
        });
      }
    });
    
    // Inline scripts
    $('script:not([src])').each((i, el) => {
      const content = $(el).html();
      if (content && content.trim()) {
        inlineScripts.push({
          content: content,
          type: 'inline'
        });
      }
    });
    
    return { scripts, inlineScripts };
  }

  detectMedia($, baseUrl, mediaType) {
    const media = [];
    const selector = `${mediaType}[src], ${mediaType} source[src]`;
    
    $(selector).each((i, el) => {
      const src = $(el).attr('src');
      if (src) {
        media.push({
          url: this.resolveUrl(src, baseUrl),
          type: mediaType,
          mimeType: $(el).attr('type') || '',
          selector: selector
        });
      }
    });
    
    return media;
  }

  detectIframes($, baseUrl) {
    const iframes = [];
    
    $('iframe[src]').each((i, el) => {
      const src = $(el).attr('src');
      if (src) {
        iframes.push({
          url: this.resolveUrl(src, baseUrl),
          type: 'iframe',
          width: $(el).attr('width'),
          height: $(el).attr('height'),
          selector: 'iframe[src]'
        });
      }
    });
    
    return iframes;
  }

  detectLinks($, baseUrl) {
    const links = [];
    
    $('a[href]').each((i, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        links.push({
          url: this.resolveUrl(href, baseUrl),
          text: $(el).text().trim(),
          type: 'link',
          target: $(el).attr('target'),
          selector: 'a[href]'
        });
      }
    });
    
    return links;
  }

  detectForms($, baseUrl) {
    const forms = [];
    
    $('form[action]').each((i, el) => {
      const action = $(el).attr('action');
      if (action) {
        forms.push({
          url: this.resolveUrl(action, baseUrl),
          method: $(el).attr('method') || 'GET',
          type: 'form',
          selector: 'form[action]'
        });
      }
    });
    
    return forms;
  }

  parseSrcset(srcset, baseUrl) {
    return srcset.split(',').map(src => {
      const parts = src.trim().split(/\s+/);
      return {
        url: this.resolveUrl(parts[0], baseUrl),
        descriptor: parts[1] || '1x'
      };
    });
  }

  resolveUrl(relativeUrl, baseUrl) {
    try {
      return url.resolve(baseUrl, relativeUrl);
    } catch (error) {
      return relativeUrl;
    }
  }

  detectFontFormat(fontUrl) {
    const ext = path.extname(fontUrl).toLowerCase();
    const formatMap = {
      '.woff2': 'woff2',
      '.woff': 'woff',
      '.ttf': 'truetype',
      '.otf': 'opentype',
      '.eot': 'embedded-opentype',
      '.svg': 'svg'
    };
    return formatMap[ext] || 'unknown';
  }

  deduplicateAndValidate(assets, baseUrl) {
    const seen = new Set();
    return assets.filter(asset => {
      const assetUrl = asset.url || asset;
      
      // Skip invalid URLs
      if (!assetUrl || typeof assetUrl !== 'string') {
        return false;
      }
      
      // Skip data URLs (too large to store efficiently)
      if (assetUrl.startsWith('data:')) {
        return false;
      }
      
      // Skip duplicates
      if (seen.has(assetUrl)) {
        return false;
      }
      
      seen.add(assetUrl);
      return true;
    });
  }
}

module.exports = AssetDetector;