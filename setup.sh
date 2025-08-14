#!/bin/bash

echo "🚀 Setting up Chat Bubble Interface..."
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Please check the error above."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "🔧 Creating .env file..."
    cat > .env << EOF
# Chat Bubble Interface Configuration
REACT_APP_API_URL=YOUR_WIX_BACKEND_URL
REACT_APP_TYPING_DELAY=1000
REACT_APP_MAX_MESSAGE_LENGTH=1000
EOF
    echo "✅ .env file created!"
    echo "   Please update REACT_APP_API_URL with your actual backend URL"
fi

echo ""
echo "🎉 Setup complete! Here's what to do next:"
echo ""
echo "1. 📝 Update your backend URL in src/config.js or .env file"
echo "2. 🚀 Start the development server: npm start"
echo "3. 🌐 Open http://localhost:3000 in your browser"
echo "4. 📱 Test the chat interface"
echo "5. 🚀 Deploy to GitHub Pages: npm run deploy"
echo ""
echo "📚 For detailed instructions, see README.md and DEPLOYMENT.md"
echo ""
echo "Happy coding! 🎨"
