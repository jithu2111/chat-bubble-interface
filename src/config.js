// Configuration file for Chat Bubble Interface
export const config = {
  // Wix Backend Configuration
  backend: {
    baseUrl: 'https://www.composeearly.com/_functions',
    endpoint: '/chatbot',
    timeout: 30000, // 30 seconds
  },
  
  // Chat Configuration
  chat: {
    maxMessageLength: 1000,
    typingDelay: 1000,
    autoScroll: true,
    showTimestamps: true,
    welcomeMessage: "How can I help you create structured composing lessons? Can you tell me the grade level for this?",
  },
  
  // UI Configuration
  ui: {
    theme: 'default',
    colors: {
      primary: '#2563eb',
      secondary: '#6c757d',
      background: '#f8f9fa',
      text: '#212529',
      userBubble: '#6366f1',
      aiBubble: '#f3f4f6',
    },
    animations: {
      enabled: true,
      duration: 200,
    },
  },
  
  // Features
  features: {
    typingIndicator: true,
    messageHistory: false,
    fileUpload: false,
    voiceMessages: false,
  },
};

// Validate configuration
export const validateConfig = () => {
  if (!config.backend.baseUrl) {
    console.error('⚠️  Backend base URL not configured.');
    return false;
  }
  if (!config.backend.endpoint) {
    console.error('⚠️  Backend endpoint not configured.');
    return false;
  }
  return true;
};

// Helper function to get full backend URL
export const getBackendUrl = () => {
  return `${config.backend.baseUrl}${config.backend.endpoint}`;
};