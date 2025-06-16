# Gist Website Replicator with AI Widget

A comprehensive website replication system that clones any website and injects an intelligent AI widget, providing users with instant answers, content summaries, and interactive features. Built for publishers and content creators who want to enhance reader engagement while maintaining content ownership.

## 🚀 Key Features

### 🤖 AI-Powered Widget
- **Ask Anything**: Interactive AI chat about page content
- **The Gist**: Instant article summaries and key insights
- **Remix**: Content transformation and customization (coming soon)
- **Share**: Enhanced sharing with AI-generated insights
- **Smart Positioning**: Responsive design with desktop/mobile optimization
- **Instant Response**: Removed hover delays for immediate interaction

### 🌐 Website Replication
- **Perfect Fidelity**: Complete website cloning with all assets
- **Multi-browser Support**: Puppeteer and Playwright engines
- **Parallel Processing**: Configurable concurrency for optimal performance
- **Intelligent Asset Detection**: Discovers and downloads all web resources
- **Error Resilience**: Comprehensive retry mechanisms and circuit breakers
- **Logo Fallback System**: Automatic gist logo injection for sites without favicons

### 🎨 Modern Web Interface
- **Landing Page**: Beautiful, animated introduction with publisher trust indicators
- **Demo Interface**: Streamlined URL input and feature selection
- **Dark Mode Support**: Synchronized theme across all pages with automatic logo switching
- **Real-time Progress**: Live progress tracking during website cloning
- **Responsive Design**: Mobile-first approach with smooth animations

### 🛠️ Advanced Configuration
- **Features Selection**: Granular control over AI tools (Ask always enabled)
- **Dynamic Styling**: Widget adapts to website's visual design
- **Garbage Collection**: Automatic cleanup of inactive cloned sites
- **Session Management**: Smart session tracking and resource management

## 📋 Prerequisites

- Node.js 16+
- npm or yarn
- Chrome/Chromium browser
- OpenAI API key (for AI features)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/gist-website-replicator.git
cd gist-website-replicator
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
npm run setup
```
This will guide you through creating a `.env` file with your OpenAI API key.

Alternatively, create a `.env` file manually:
```bash
# .env
OPENAI_API_KEY=your-openai-api-key-here
WIDGET_MODEL=gpt-4o-mini
PORT=3000
```

4. Start the server:
```bash
npm start
```

5. Open your browser to `http://localhost:3000`

## 💻 Usage

### Web Interface

1. **Landing Page** (`http://localhost:3000`):
   - Enter any website URL
   - Watch the animated demo
   - Toggle between light/dark modes

2. **Demo Interface** (`http://localhost:3000/demo`):
   - Select additional features (Ask Anything always included)
   - Monitor real-time cloning progress
   - Access cloned sites with AI widget

### Command Line Interface

```bash
# Basic replication with AI widget
npm start replicate https://example.com

# Custom features selection
npm start replicate https://example.com --features ask,gist,remix

# Custom output directory
npm start replicate https://example.com -o ./my-output

# Skip AI widget injection
npm start replicate https://example.com --no-widget
```

### API Endpoints

```bash
# Clone website via API
POST /api/replicate
{
  "url": "https://example.com",
  "features": ["ask", "gist", "share"]
}

# Check cloning progress
GET /api/progress/:jobId

# Garbage collection status
GET /api/gc/status

# Trigger cleanup
POST /api/gc/run
```

## 🎯 AI Widget Features

### Ask Anything 💬
- **Always Available**: Core feature that's always enabled
- **Context-Aware**: Understands the specific page content
- **Follow-up Questions**: Intelligent conversation flow
- **Suggested Questions**: AI-generated relevant questions

### The Gist 📄
- **Smart Summaries**: 3 bullet points or fewer
- **Key Insights**: Extracts most important information
- **Quick Reading**: Perfect for busy readers
- **Attribution**: Always links back to original content

### Remix ✨ (Coming Soon)
- **Content Transformation**: Multiple tone and style options
- **Format Conversion**: Video, audio, PDF, and more
- **Creative Options**: UGC, newscast, narrative styles
- **Visual Preview**: Shows remix-coming-soon.png

### Share 🔗
- **Enhanced Sharing**: Multiple platform support
- **Context Preservation**: Includes AI-generated insights
- **Social Integration**: iMessage, Instagram, X, Facebook
- **Copy Link**: Quick URL sharing with context

## 🌙 Dark Mode Support

- **Synchronized Themes**: Consistent experience across all pages
- **Smart Logo Switching**: 
  - Light mode: `Gist_Mark_000000.png`
  - Dark mode: `Gist G white no background.png`
- **Automatic Detection**: Remembers user preference
- **Smooth Transitions**: Animated theme changes

## 📁 Output Structure

```
replicated-sites/
└── example_com_2024-01-15T10-30-00-000Z/
    ├── index.html              # Main HTML with AI widget
    ├── experiment.js           # AI widget code
    ├── gist-logo.png          # Fallback logo
    ├── metadata.json          # Replication metadata
    ├── screenshot.png         # Full page screenshot
    └── assets/
        ├── images/            # Downloaded images
        ├── css/              # Stylesheets
        ├── js/               # JavaScript files
        └── misc/             # Other assets
```

## 🔧 Configuration Options

### Widget Configuration
```javascript
const WIDGET_CONFIG = {
    API_KEY: 'your-openai-api-key',
    MODEL: 'gpt-4o-mini',
    API_BASE_URL: 'https://api.openai.com',
    TIMEOUT_MS: 30000,
    MAX_TOKENS: 1000
};
```

### Features Configuration
```javascript
// Configure available tools
GistWidget.configureTools({
    ask: true,      // Always enabled
    gist: true,     // Can be disabled
    remix: false,   // Coming soon
    share: true     // Can be disabled
});
```

### Server Configuration
| Option | Default | Description |
|--------|---------|-------------|
| `port` | `3000` | Server port |
| `outputDir` | `./replicated-sites` | Output directory |
| `maxConcurrency` | `5` | Concurrent downloads |
| `gcTimeoutMinutes` | `5` | Garbage collection timeout |
| `maxSizeMB` | `1000` | Maximum storage size |

## 🗑️ Garbage Collection

Automatic cleanup system that:
- **Monitors Storage**: Tracks disk usage and active sessions
- **Session Tracking**: Identifies inactive cloned sites
- **Automatic Cleanup**: Removes sites after 5 minutes of inactivity
- **Manual Control**: Web interface for immediate cleanup
- **Status Monitoring**: Real-time garbage collection dashboard

## 🎨 UI/UX Improvements

### Recent Enhancements
- ✅ **Instant Widget Response**: Removed hover delays for immediate interaction
- ✅ **Dark Mode Sync**: Consistent theming across landing and demo pages
- ✅ **Simplified Features**: Ask Anything always enabled, cleaner selection
- ✅ **Clean Design**: Removed emoji icons for professional appearance
- ✅ **Fixed Interactions**: Resolved checkbox double-toggling issues
- ✅ **Coming Soon Display**: Proper remix feature preview
- ✅ **Smooth Transitions**: Enhanced animations and visual feedback

### Visual Features
- **Trust Indicators**: Publisher logos and statistics
- **Progress Tracking**: Real-time cloning progress with steps
- **Responsive Layout**: Mobile-first design with desktop optimization
- **Error Handling**: User-friendly error messages and recovery
- **Loading States**: Smooth loading animations and feedback

## 🧪 Testing

```bash
# Run all tests
npm test

# Test specific features
npm run test:widget
npm run test:gc
npm run test:replication

# Health check
npm run health

# Test garbage collection
node test-gc.js
```

## 🚨 Error Handling

- **Graceful Degradation**: Widget continues working despite individual failures
- **Retry Mechanisms**: Exponential backoff for API calls
- **Fallback Content**: Default responses when AI is unavailable
- **User Feedback**: Clear error messages and recovery suggestions
- **Logging**: Comprehensive error tracking and debugging

## 🔒 Security and Privacy

- **Privacy-First**: No user tracking or data harvesting
- **Content Attribution**: Always credits original sources
- **API Security**: Secure OpenAI API key handling
- **Rate Limiting**: Respects server resources and API limits
- **Content Filtering**: Appropriate content handling

## 📈 Performance Optimization

- **Lazy Loading**: Widget loads asynchronously
- **Caching**: Intelligent response caching
- **Compression**: Optimized asset delivery
- **Memory Management**: Efficient resource handling
- **Background Processing**: Non-blocking operations

## 🎯 Use Cases

Perfect for:
- **Publishers**: Enhance reader engagement and revenue
- **Content Creators**: Add AI features to existing content
- **Demos**: Showcase AI capabilities on any website
- **Testing**: Prototype AI-enhanced user experiences
- **Education**: Interactive learning with AI assistance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting guide
- Review the API documentation

---

**Built with ❤️ by the ProRata AI team**

*Transform your content into magic with AI-powered interactions*
