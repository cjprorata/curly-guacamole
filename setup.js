#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🚀 Gist Website Replicator Setup');
console.log('================================\n');

async function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function setup() {
    try {
        console.log('This setup will help you configure your environment variables.\n');
        
        // Check if .env already exists
        const envPath = path.join(__dirname, '.env');
        if (fs.existsSync(envPath)) {
            const overwrite = await askQuestion('⚠️  .env file already exists. Overwrite? (y/N): ');
            if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
                console.log('Setup cancelled. Your existing .env file was not modified.');
                rl.close();
                return;
            }
        }
        
        console.log('📝 Please provide the following information:\n');
        
        // Get OpenAI API Key
        const apiKey = await askQuestion('🔑 Enter your OpenAI API Key: ');
        if (!apiKey) {
            console.log('❌ OpenAI API Key is required. Setup cancelled.');
            rl.close();
            return;
        }
        
        // Validate API key format
        if (!apiKey.startsWith('sk-')) {
            console.log('⚠️  Warning: API key should start with "sk-". Please verify your key.');
        }
        
        // Optional configurations
        const model = await askQuestion('🤖 OpenAI Model (default: gpt-4o-mini): ') || 'gpt-4o-mini';
        const timeout = await askQuestion('⏱️  Request timeout in ms (default: 30000): ') || '30000';
        const port = await askQuestion('🌐 Server port (default: 3000): ') || '3000';
        
        // Create .env content
        const envContent = `# OpenAI Configuration
OPENAI_API_KEY=${apiKey}
OPENAI_API_BASE_URL=https://api.openai.com

# Server Configuration
PORT=${port}

# Widget Configuration
WIDGET_MODEL=${model}
WIDGET_TIMEOUT_MS=${timeout}
WIDGET_DEBOUNCE_MS=300
`;
        
        // Write .env file
        fs.writeFileSync(envPath, envContent);
        
        console.log('\n✅ Setup complete!');
        console.log('📁 Created .env file with your configuration.');
        console.log('\n🚀 Next steps:');
        console.log('1. Run: npm start');
        console.log('2. Open: http://localhost:' + port);
        console.log('\n🔒 Security note: Your .env file is automatically ignored by git.');
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    } finally {
        rl.close();
    }
}

setup(); 