/**
 * Builder Agent node for code generation and modifications.
 * Dispatches to stack-specific prompt templates and returns structured JSON instructions.
 */

const { getVanillaSystemPrompt, getVanillaBuilderPrompt } = require('../stacks/vanilla/prompts');
const { getReactTailwindSystemPrompt, getReactTailwindBuilderPrompt } = require('../stacks/react-tailwind/prompts');
const { executeModelCall } = require('../providers/provider-manager');
const { repairJson } = require('../utils/json-repair');

/**
 * Generates or modifies project files using structured actions.
 * @param {Object} state - Graph state containing files, prompt, stack, and reviewer feedback.
 * @returns {Promise<Object>} Updated graph state.
 */
async function builderNode(state) {
  try {
    const isVanilla = state.stack === 'vanilla';
    const systemPrompt = isVanilla ? getVanillaSystemPrompt() : getReactTailwindSystemPrompt();
    const builderPrompt = isVanilla ? getVanillaBuilderPrompt(state.prompt) : getReactTailwindBuilderPrompt(state.prompt);

    // Build files context
    const filesContext = Object.entries(state.files || {})
      .map(([path, content]) => `File: "${path}"\n\`\`\`\n${content}\n\`\`\``)
      .join('\n\n');

    let userMessage = `${builderPrompt}\n\nCurrent Project Files Context:\n${filesContext || 'No files created yet.'}`;
    
    // Append reviewer feedback if builder is running on a retry loop
    if (state.issues && state.issues.length > 0) {
      const issuesText = state.issues.map((i, idx) => `${idx + 1}. File "${i.file}": ${i.issue} (Suggestion: ${i.suggestion})`).join('\n');
      userMessage += `\n\n[REVIEW FEEDBACK]: The previous build was rejected due to the following issues. Correct them immediately:\n${issuesText}`;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    const result = await executeModelCall({
      agentRole: 'builder',
      messages,
      responseFormat: { type: 'json_object' }
    });

    let buildResult = { reasoning: '', summary: '', actions: [] };
    try {
      buildResult = repairJson(result.text);
    } catch (e) {
      console.error('[BuilderAgent] Failed to parse generated JSON. Raw text:', result.text);
      throw new Error(`Builder returned malformed JSON: ${e.message}`);
    }

    // Apply file actions to the state files map
    const updatedFiles = { ...(state.files || {}) };
    
    if (buildResult.actions && Array.isArray(buildResult.actions)) {
      for (const change of buildResult.actions) {
        const { action, path, content } = change;
        if (action === 'delete') {
          delete updatedFiles[path];
        } else if (action === 'create' || action === 'update') {
          updatedFiles[path] = content;
        }
      }
    }

    return {
      ...state,
      files: updatedFiles,
      reasoning: buildResult.reasoning,
      summary: buildResult.summary,
      actions: buildResult.actions,
      // Clear issues once builder makes a new pass
      issues: null,
    };
  } catch (error) {
    console.error('[BuilderAgent] Error:', error);
    return {
      ...state,
      errors: [...(state.errors || []), `Builder failed: ${error.message}`],
    };
  }
}

module.exports = {
  builderNode,
};
