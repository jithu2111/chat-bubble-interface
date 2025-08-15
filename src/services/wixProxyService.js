// Wix Backend Proxy Service
// This service calls your Wix backend instead of OpenAI directly

class WixProxyService {
  constructor() {
    this.baseUrl = 'https://www.composeearly.com/_functions';
    this.endpoint = '/chatbot';
  }

  async sendMessage(message, threadId = null) {
    try {
      console.log('Sending message to Wix backend...');
      
      const response = await fetch(`${this.baseUrl}${this.endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          message,
          threadId // Pass threadId for conversation continuity
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Successfully received response from Wix backend');
        return {
          success: true,
          response: data.response,
          threadId: data.threadId || threadId,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(data.error || 'Unknown error from backend');
      }
      
    } catch (error) {
      console.error('Wix Proxy Service error:', error);
      
      let errorMessage = "I'm experiencing technical difficulties. Please try again later.";
      
      if (error.message.includes('401')) {
        errorMessage = "Authentication error. Please check your Wix backend configuration.";
      } else if (error.message.includes('403')) {
        errorMessage = "Access denied. Please check your Wix backend permissions.";
      } else if (error.message.includes('404')) {
        errorMessage = "Backend endpoint not found. Please check your Wix function URL.";
      } else if (error.message.includes('500')) {
        errorMessage = "Server error occurred. Please try again later.";
      } else if (error.message.includes('timeout')) {
        errorMessage = "Request timeout. Please try again.";
      }

      return {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Method to update configuration if needed
  updateConfig(baseUrl, endpoint) {
    if (baseUrl) this.baseUrl = baseUrl;
    if (endpoint) this.endpoint = endpoint;
    console.log('Wix proxy service configuration updated');
  }
}

export default new WixProxyService();
