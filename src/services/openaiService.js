// Create this as src/services/openaiService.js
import { config } from '../config';

class OpenAIService {
  constructor() {
    this.apiKey = config.openai.apiKey;
    this.assistantId = config.openai.assistantId;
    this.baseUrl = config.openai.baseUrl;
  }

  updateConfig(apiKey, assistantId) {
    this.apiKey = apiKey;
    this.assistantId = assistantId;
    console.log('OpenAI service configuration updated');
  }

  async createThread() {
    try {
      const response = await fetch(`${this.baseUrl}/threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`Failed to create thread: ${response.status}`);
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error creating thread:', error);
      throw error;
    }
  }

  async addMessageToThread(threadId, message) {
    try {
      const response = await fetch(`${this.baseUrl}/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          role: 'user',
          content: message
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to add message: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding message to thread:', error);
      throw error;
    }
  }

  async createRun(threadId) {
    try {
      const response = await fetch(`${this.baseUrl}/threads/${threadId}/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          assistant_id: this.assistantId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create run: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating run:', error);
      throw error;
    }
  }

  async checkRunStatus(threadId, runId) {
    try {
      const response = await fetch(`${this.baseUrl}/threads/${threadId}/runs/${runId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to check run status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking run status:', error);
      throw error;
    }
  }

  async getMessages(threadId) {
    try {
      const response = await fetch(`${this.baseUrl}/threads/${threadId}/messages`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get messages: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  async waitForRunCompletion(threadId, runId, maxAttempts = 30) {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const runStatus = await this.checkRunStatus(threadId, runId);
      
      console.log(`Run status: ${runStatus.status} (attempt ${attempts + 1})`);
      
      if (runStatus.status === 'completed') {
        return runStatus;
      } else if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
        throw new Error(`Run failed with status: ${runStatus.status}`);
      }
      
      // Wait 1 second before next check
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
    
    throw new Error('Run timeout - assistant took too long to respond');
  }

  async sendMessage(message, threadId = null) {
    try {
      // Create thread if we don't have one
      let currentThreadId = threadId;
      if (!currentThreadId) {
        console.log('Creating new thread...');
        currentThreadId = await this.createThread();
        console.log('Created thread:', currentThreadId);
      }

      // Add user message to thread
      console.log('Adding message to thread...');
      await this.addMessageToThread(currentThreadId, message);

      // Create and wait for run completion
      console.log('Creating run...');
      const run = await this.createRun(currentThreadId);
      
      console.log('Waiting for completion...');
      await this.waitForRunCompletion(currentThreadId, run.id);

      // Get the assistant's response
      console.log('Retrieving messages...');
      const messages = await this.getMessages(currentThreadId);
      
      // Find the latest assistant message
      const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
      
      if (!assistantMessage || !assistantMessage.content || assistantMessage.content.length === 0) {
        throw new Error('No response from assistant');
      }

      const aiResponse = assistantMessage.content[0].text.value;
      
      console.log('Successfully received response from Assistant');
      
      return {
        success: true,
        response: aiResponse,
        threadId: currentThreadId,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('OpenAI Service error:', error);
      
      let errorMessage = "I'm experiencing technical difficulties. Please try again later.";
      if (error.message.includes('timeout')) {
        errorMessage = "The request is taking longer than expected. Please try again.";
      } else if (error.message.includes('thread')) {
        errorMessage = "Unable to maintain conversation context. Please try again.";
      } else if (error.message.includes('assistant')) {
        errorMessage = "The teaching assistant is temporarily unavailable.";
      } else if (error.message.includes('API key')) {
        errorMessage = "Configuration error. Please contact administrator.";
      }

      return {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export default new OpenAIService();
