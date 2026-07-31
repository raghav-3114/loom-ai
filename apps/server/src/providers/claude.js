/**
 * @file claude.js
 * @description Wrapper client around Anthropic Messages API.
 */

const axios = require('axios');

/**
 * Sends a completion request to Anthropic Claude Messages API.
 * 
 * @param {Object} options 
 * @param {string} options.model - Model identifier string (e.g. "claude-sonnet-4-6").
 * @param {Array<{role: string, content: string}>} options.messages - Message history array.
 * @param {string} options.apiKey - Anthropic API key.
 * @param {Object} [options.responseFormat] - Response format configurations.
 * @returns {Promise<Object>} API completion response payload.
 */
async function callClaude({ model, messages, apiKey, responseFormat }) {
  try {
    // Anthropic expects a separate `system` parameter, not a system message in the array.
    // Extract system messages and keep only user/assistant messages.
    let systemPrompt = '';
    const chatMessages = [];

    for (const m of messages) {
      if (m.role === 'system') {
        systemPrompt += (systemPrompt ? '\n\n' : '') + m.content;
      } else {
        chatMessages.push({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        });
      }
    }

    // Ensure messages alternate user/assistant — Anthropic requires first message to be 'user'.
    // If first message is assistant after filtering, prepend a minimal user message.
    if (chatMessages.length > 0 && chatMessages[0].role !== 'user') {
      chatMessages.unshift({ role: 'user', content: 'Continue.' });
    }

    const body = {
      model: model || 'claude-sonnet-4-6',
      max_tokens: 8192,
      messages: chatMessages,
    };

    if (systemPrompt) {
      body.system = systemPrompt;
    }

    // If JSON response format is requested, instruct via system prompt suffix
    if (responseFormat && responseFormat.type === 'json_object') {
      body.system = (body.system || '') + '\n\nIMPORTANT: You MUST respond with valid JSON only. No markdown, no explanation, just raw JSON.';
    }

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      body,
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'max-tokens-3-5-sonnet-2024-07-15',
          'Content-Type': 'application/json',
        },
        timeout: 120000, // 120s — refinement passes include full code + review context
      }
    );

    // Extract text from content blocks
    const contentBlocks = response.data?.content || [];
    let text = contentBlocks
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');

    // Claude often wraps JSON responses in markdown fences even when told not to.
    // Strip them here at the provider level so downstream parsers get clean JSON.
    const trimmed = text.trim();
    if (trimmed.startsWith('```')) {
      // Find the end of the opening fence line
      const firstNewline = trimmed.indexOf('\n');
      if (firstNewline !== -1) {
        // Find the last ``` closing fence
        const lastFence = trimmed.lastIndexOf('```');
        if (lastFence > firstNewline) {
          text = trimmed.substring(firstNewline + 1, lastFence).trim();
        }
      }
    }

    return { text, provider: 'claude', model };
  } catch (error) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    throw new Error(`Claude API Call Failed: ${errorMsg}`);
  }
}

module.exports = {
  callClaude,
};
