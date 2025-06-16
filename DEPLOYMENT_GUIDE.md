# Secure API Key Deployment Guide

This guide shows you how to deploy your widget with secure API key storage using Vercel (recommended) or other platforms.

## 🚀 Option 1: Vercel (Recommended - Easiest)

### Step 1: Prepare Your Project
1. Make sure you have all the files in your project directory:
   - `experiment.js` (your main widget file)
   - `science_article.html` (your test page)
   - `api/chat.js` (secure chat API endpoint)
   - `api/image.js` (secure image API endpoint)
   - `vercel.json` (configuration file)

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository (or upload files directly)
4. Vercel will automatically detect it as a static site with API routes

### Step 3: Add Environment Variables
1. In your Vercel dashboard, go to your project
2. Click "Settings" → "Environment Variables"
3. Add a new variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your actual OpenAI API key (starts with `sk-`)
   - **Environment**: All (Production, Preview, Development)
4. Click "Save"

### Step 4: Update Your Widget URLs
1. After deployment, Vercel will give you a URL like `https://your-app.vercel.app`
2. Update your `experiment.js` file:
   ```javascript
   const WIDGET_CONFIG = {
       CHAT_API_URL: 'https://your-app.vercel.app/api/chat',
       IMAGE_API_URL: 'https://your-app.vercel.app/api/image',
       MODEL: 'gpt-3.5-turbo',
       TIMEOUT_MS: 20000
   };
   ```
3. Redeploy (Vercel auto-deploys on file changes)

### Step 5: Test
- Visit your deployed URL
- Test the widget functionality
- Your API key is now secure on the server!

---

## 🔧 Option 2: Netlify Functions

### Step 1: Create Netlify Functions
Create a `netlify/functions/` directory and add:

**netlify/functions/chat.js:**
```javascript
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { messages, model = 'gpt-3.5-turbo', max_tokens = 1000 } = JSON.parse(event.body);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, messages, max_tokens, temperature: 0.7 }),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

### Step 2: Deploy and Configure
1. Deploy to Netlify
2. Add `OPENAI_API_KEY` in Site Settings → Environment Variables
3. Update your widget URLs to use `/.netlify/functions/chat`

---

## 🏗️ Option 3: Railway/Render (Full Backend)

### Step 1: Create Express Server
Create `server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve your static files

app.post('/api/chat', async (req, res) => {
  const { messages, model = 'gpt-3.5-turbo', max_tokens = 1000 } = req.body;
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, messages, max_tokens, temperature: 0.7 }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Step 2: Deploy
1. Deploy to Railway or Render
2. Set `OPENAI_API_KEY` environment variable
3. Update your widget URLs to use your deployed server

---

## 🔒 Security Benefits

✅ **API Key Hidden**: Your OpenAI API key is stored securely on the server
✅ **No Client Exposure**: API key never appears in browser/source code  
✅ **Rate Limiting**: You can add rate limiting to your API endpoints
✅ **Usage Control**: Monitor and control API usage from your server
✅ **CORS Protection**: Control which domains can access your API

---

## 🚨 Important Notes

1. **Remove Old API Key**: Make sure to remove the hardcoded API key from your `experiment.js` file
2. **Environment Variables**: Never commit `.env` files or API keys to version control
3. **HTTPS Only**: Always use HTTPS in production
4. **Rate Limiting**: Consider adding rate limiting to prevent abuse
5. **Monitoring**: Monitor your API usage and costs

---

## 🛠️ Troubleshooting

**CORS Errors**: Make sure your API endpoints include proper CORS headers
**API Key Not Found**: Verify environment variable name matches exactly
**Timeout Issues**: Image generation takes longer - increase timeout for image endpoints
**Deployment Issues**: Check build logs for specific error messages

---

## 💰 Cost Considerations

- **Vercel**: Free tier includes 100GB bandwidth, 1000 serverless function invocations
- **Netlify**: Free tier includes 125k function invocations per month  
- **Railway**: $5/month for hobby plan
- **OpenAI**: Pay per API usage (GPT-3.5-turbo ~$0.002/1k tokens)

Choose the platform that best fits your expected usage and budget! 