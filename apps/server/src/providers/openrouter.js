/**
 * @file openrouter.js
 * @description Wrapper client around OpenRouter API.
 */

const axios = require('axios');

/**
 * Sends a completion request to OpenRouter API.
 * 
 * @param {Object} options 
 * @param {string} options.model - Model identifier string.
 * @param {Array<{role: string, content: string}>} options.messages - Message history.
 * @param {string} options.apiKey - API key.
 * @param {Object} [options.responseFormat] - Response format configurations.
 * @returns {Promise<Object>} API completion response payload.
 */
async function callOpenRouter({ model, messages, apiKey, responseFormat }) {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model || 'meta-llama/llama-3.1-8b-instruct',
        messages,
        response_format: responseFormat ? { type: responseFormat.type } : undefined,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://loom.ai',
          'X-Title': 'Loom AI Builder',
        },
        timeout: 30000,  // 30 seconds to allow full code generation
      }
    );

    const text = response.data?.choices?.[0]?.message?.content || '';
    return { text, provider: 'openrouter', model };
  } catch (error) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    throw new Error(`OpenRouter API Call Failed: ${errorMsg}`);
  }
}

module.exports = {
  callOpenRouter,
};
