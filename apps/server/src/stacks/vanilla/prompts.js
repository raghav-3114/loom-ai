/**
 * Prompt loader module for the "vanilla" stack.
 * Provides system and user prompt templates specifically formatted for HTML/CSS/JS projects.
 */

const fs = require('fs');
const path = require('path');

/**
 * Loads system prompt template for the Vanilla stack.
 * @returns {string} System prompt string for Vanilla stack.
 */
function getVanillaSystemPrompt() {
  const promptPath = path.join(__dirname, '../../prompts/builder-vanilla.system.txt');
  return fs.readFileSync(promptPath, 'utf8');
}

/**
 * Loads builder prompt for Vanilla project generation.
 * @param {string} userPrompt - User prompt describing requested UI.
 * @returns {string} Formatted prompt string for Builder agent.
 */
function getVanillaBuilderPrompt(userPrompt) {
  return `Generate a Vanilla HTML/CSS/JS interface based on this request: "${userPrompt}"`;
}

module.exports = {
  getVanillaSystemPrompt,
  getVanillaBuilderPrompt,
};
