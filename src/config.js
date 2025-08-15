// Configuration file for Chat Bubble Interface
export const config = {
  // OpenAI Configuration
  openai: {
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    assistantId: process.env.REACT_APP_ASSISTANT_ID || 'asst_7pZxP4e5FEBHfeBVrhpkCBVJ',
    baseUrl: 'https://api.openai.com/v1',
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
      userBubble: '#2563eb',
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
  if (!config.openai.apiKey) {
    console.error('⚠️  OpenAI API key not found. Please add REACT_APP_OPENAI_API_KEY to your environment variables.');
    return false;
  }
  if (!config.openai.assistantId) {
    console.error('⚠️  OpenAI Assistant ID not found.');
    return false;
  }
  return true;
};

// Helper function to get full API URL
export const getApiUrl = () => {
  return `${config.openai.baseUrl}`;
};