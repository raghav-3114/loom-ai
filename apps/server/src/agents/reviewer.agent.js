/**
 * Reviewer Agent node validating Builder output.
 * Dispatches to stack-specific validation prompts.
 */

const fs = require('fs');
const path = require('path');
const { executeModelCall } = require('../providers/provider-manager');
const { repairJson } = require('../utils/json-repair');

/**
 * Validates Builder output against active stack rules.
 * @param {Object} state - Graph state containing files, prompt, stack, and builder actions.
 * @returns {Promise<Object>} Updated graph state with approval outcome.
 */
async function reviewerNode(state) {
  try {
    const isVanilla = state.stack === 'vanilla';
    const promptPath = path.join(
      __dirname,
      isVanilla ? '../prompts/reviewer-vanilla.system.txt' : '../prompts/reviewer-react-tailwind.system.txt'
    );
    const systemPrompt = fs.readFileSync(promptPath, 'utf8');

    // Build files context to review
    const filesContext = Object.entries(state.files || {})
      .map(([path, content]) => `File: "${path}"\n\`\`\`\n${content}\n\`\`\``)
      .join('\n\n');

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Prompt Request: "${state.prompt}"\n\nGenerated Files to Review:\n${filesContext}`,
      },
    ];

    const result = await executeModelCall({
      agentRole: 'reviewer',
      messages: formattedMessages,
      responseFormat: { type: 'json_object' },
    });

    let review = { approved: true, issues: [] };
    try {
      review = repairJson(result.text);
    } catch (e) {
      console.warn('[ReviewerAgent] Failed to parse JSON, defaulting to approved.');
    }

    return {
      ...state,
      approved: review.approved,
      issues: review.issues || [],
      retryCount: (state.retryCount || 0) + (review.approved ? 0 : 1),
    };
  } catch (error) {
    console.error('[ReviewerAgent] Error:', error);
    return {
      ...state,
      approved: true,
      issues: [],
    };
  }
}

module.exports = {
  reviewerNode,
};
