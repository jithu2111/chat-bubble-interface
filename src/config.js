// Configuration file for Chat Bubble Interface
export const config = {
  // API Configuration
  api: {
    baseUrl: 'https://www.composeearly.com/_functions',
    endpoint: '/getTeachingAdvice',
    timeout: 30000, // 30 seconds (increased for OpenAI calls)
  },
  
  // Chat Configuration
  chat: {
    maxMessageLength: 1000,
    typingDelay: 1000, // milliseconds
    autoScroll: true,
    showTimestamps: true,
  },
  
  // UI Configuration
  ui: {
    theme: 'default', // 'default', 'dark', 'custom'
    colors: {
      primary: '#2563eb', // Blue to match your site
      secondary: '#6c757d',
      background: '#f8f9fa',
      text: '#212529',
    },
    animations: {
      enabled: true,
      duration: 200,
    },
  },
  
  // Features
  features: {
    typingIndicator: true,
    messageHistory: false, // Set to true to persist messages
    fileUpload: false,
    voiceMessages: false,
  },
};

// Helper function to get full API URL
export const getApiUrl = () => {
  return `${config.api.baseUrl}${config.api.endpoint}`;
};

// Helper function to validate configuration
export const validateConfig = () => {
  if (config.api.baseUrl === 'YOUR_WIX_BACKEND_URL') {
    console.warn('Please update the API base URL in config.js');
    return false;
  }
  return true;
};