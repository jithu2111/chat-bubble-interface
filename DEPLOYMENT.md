# Deployment Guide

This guide will walk you through deploying your chat interface to GitHub Pages and integrating it with your Wix site.

## Step 1: GitHub Repository Setup

### 1. Create a new repository on GitHub
- Go to [github.com](https://github.com) and click "New repository"
- Name it `chat-bubble-interface` (or your preferred name)
- Make it public (required for GitHub Pages)
- Don't initialize with README (we already have one)

### 2. Push your code to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Chat bubble interface"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/chat-bubble-interface.git
git push -u origin main
```

## Step 2: Configure GitHub Pages

### 1. Update package.json
Edit the `homepage` field in `package.json`:
```json
"homepage": "https://YOUR_USERNAME.github.io/chat-bubble-interface"
```

### 2. Install gh-pages package
```bash
npm install --save-dev gh-pages
```

### 3. Deploy to GitHub Pages
```bash
npm run deploy
```

### 4. Enable GitHub Pages
- Go to your repository on GitHub
- Click "Settings" tab
- Scroll down to "Pages" section
- Under "Source", select "Deploy from a branch"
- Choose "gh-pages" branch and "/ (root)" folder
- Click "Save"

Your chat interface will be available at: `https://YOUR_USERNAME.github.io/chat-bubble-interface`

## Step 3: Wix Integration

### 1. Add iframe to your Wix site
- In your Wix editor, add an "HTML" element
- Paste this code:

```html
<iframe 
  src="https://YOUR_USERNAME.github.io/chat-bubble-interface"
  width="400" 
  height="600"
  frameborder="0"
  scrolling="no"
  style="border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: none;">
</iframe>
```

### 2. Customize iframe appearance
You can adjust the styling by modifying the inline styles:
- `width` and `height`: Adjust size as needed
- `border-radius`: Change corner roundness
- `box-shadow`: Modify shadow appearance
- `border`: Remove or customize border

### 3. Position the iframe
- Drag the HTML element to your desired location
- Resize as needed
- Ensure it doesn't overlap with other content

## Step 4: Backend Configuration

### 1. Update API endpoint
In `src/App.js`, replace the placeholder URL:
```javascript
const response = await fetch('https://your-wix-site.com/api/getTeachingAdvice', {
  // ... rest of the code
});
```

### 2. Ensure CORS is enabled
Your Wix backend must allow requests from your GitHub Pages domain:
```
Access-Control-Allow-Origin: https://YOUR_USERNAME.github.io
```

## Step 5: Testing

### 1. Test locally
```bash
npm start
```
Open http://localhost:3000 to test the interface

### 2. Test deployed version
Visit your GitHub Pages URL to ensure everything works

### 3. Test Wix integration
- Publish your Wix site
- Test the chat functionality
- Verify messages are sent to your backend

## Troubleshooting

### Common Issues

#### 1. iframe not loading
- Check the URL in the src attribute
- Ensure GitHub Pages is enabled
- Verify the repository is public

#### 2. CORS errors
- Check browser console for CORS messages
- Ensure your backend allows requests from GitHub Pages domain
- Verify the API endpoint is correct

#### 3. Chat not working
- Check browser console for JavaScript errors
- Verify the backend URL is correct
- Test the API endpoint directly

#### 4. Mobile responsiveness issues
- Test on different devices
- Check CSS media queries
- Verify viewport meta tag

### Debug Mode

Enable debug logging by adding this to your browser console:
```javascript
localStorage.setItem('debug', 'true')
```

## Maintenance

### Updating the chat interface
1. Make your changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Run `npm run deploy`
5. Changes will be live in a few minutes

### Monitoring
- Check GitHub Pages status in repository settings
- Monitor your backend logs for API calls
- Use browser developer tools to debug issues

## Security Considerations

- Never expose API keys in client-side code
- Use HTTPS for all communications
- Implement rate limiting on your backend
- Validate and sanitize all user inputs
- Consider implementing user authentication if needed

## Performance Optimization

- The chat interface is optimized for mobile devices
- Images and assets are optimized for web
- CSS animations use hardware acceleration
- Minimal JavaScript for fast loading

---

**Need help?** Open an issue on GitHub or check the troubleshooting section above.
