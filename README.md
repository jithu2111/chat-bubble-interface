# Chat Bubble Interface

A modern, responsive chat interface built with React.js designed for integration with Wix sites via iframe. Features WhatsApp-style chat bubbles, typing indicators, and seamless integration with your existing OpenAI backend.

## Features

- 🎨 **Modern Design**: Beautiful gradient backgrounds and smooth animations
- 💬 **WhatsApp-style Bubbles**: User messages (right, blue) and AI messages (left, gray)
- ⏱️ **Real-time Features**: Typing indicators and timestamp display
- 📱 **Mobile Responsive**: Optimized for all device sizes
- ⌨️ **Keyboard Support**: Enter key to send messages
- 🔄 **Auto-scroll**: Automatically scrolls to latest messages
- 🚀 **Easy Integration**: Simple iframe integration with Wix

## Architecture

```
Your Wix Site → iframe (hosted separately) → Custom Chat Interface → Your OpenAI Backend
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Backend URL
Update the API endpoint in `src/App.js`:
```javascript
const response = await fetch('YOUR_WIX_BACKEND_URL/getTeachingAdvice', {
  // ... configuration
});
```

### 3. Run Development Server
```bash
npm start
```

### 4. Build for Production
```bash
npm run build
```

## GitHub Pages Deployment

### 1. Update Homepage URL
Edit `package.json` and change the homepage URL to your GitHub username:
```json
"homepage": "https://yourusername.github.io/chat-bubble-interface"
```

### 2. Deploy to GitHub Pages
```bash
npm run deploy
```

### 3. Enable GitHub Pages
- Go to your repository settings
- Navigate to Pages section
- Select source as "gh-pages" branch

## Wix Integration

### 1. Add iframe to Wix
```html
<iframe 
  src="https://yourusername.github.io/chat-bubble-interface"
  width="400" 
  height="600"
  frameborder="0"
  scrolling="no"
  style="border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
</iframe>
```

### 2. Customize iframe Styling
```css
iframe {
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  border: none;
}
```

## API Integration

The chat interface expects your Wix backend to have a `/getTeachingAdvice` endpoint that:

- Accepts POST requests with JSON body: `{ "message": "user message" }`
- Returns JSON response: `{ "response": "AI response text" }`
- Handles CORS for cross-origin requests

## Customization

### Colors
Update the CSS variables in component files to match your brand colors.

### Styling
Modify the CSS files in `src/components/` to customize the appearance.

### Functionality
Extend the `App.js` component to add features like:
- Message history persistence
- File uploads
- Voice messages
- User authentication

## File Structure

```
src/
├── components/
│   ├── ChatBubble.js          # Individual message display
│   ├── ChatBubble.css         # Message styling
│   ├── MessageInput.js        # Input field and send button
│   ├── MessageInput.css       # Input styling
│   ├── TypingIndicator.js     # AI typing animation
│   └── TypingIndicator.css    # Typing animation styles
├── App.js                     # Main chat component
├── App.css                    # Main app styling
├── index.js                   # React entry point
└── index.css                  # Global styles
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own applications.

## Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using React.js**
