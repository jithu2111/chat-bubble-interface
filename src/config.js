// Configuration file for Chat Bubble Interface
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'YOUR_WIX_BACKEND_URL',
    endpoint: '/getTeachingAdvice',
    timeout: 10000, // 10 seconds
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
      primary: '#007bff',
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
    console.warn('⚠️  Please update the API base URL in config.js');
    return false;
  }
  return true;
};
