/**
 * Prompt loader module for the "react-tailwind" stack.
 * Provides system and user prompt templates specifically formatted for React/Tailwind projects.
 */

const fs = require('fs');
const path = require('path');

/**
 * Loads system prompt template for the React + Tailwind stack.
 * @returns {string} System prompt string.
 */
function getReactTailwindSystemPrompt() {
  const promptPath = path.join(__dirname, '../../prompts/builder-react-tailwind.system.txt');
  return fs.readFileSync(promptPath, 'utf8');
}

/**
 * Loads builder prompt for React + Tailwind project generation.
 * @param {string} userPrompt - User prompt describing requested UI.
 * @returns {string} Formatted prompt string for Builder agent.
 */
function getReactTailwindBuilderPrompt(userPrompt) {
  return `Generate a React + Tailwind component based on this request: "${userPrompt}"`;
}

module.exports = {
  getReactTailwindSystemPrompt,
  getReactTailwindBuilderPrompt,
};
