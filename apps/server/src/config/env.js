/**
 * @file env.js
 * @description Loads environment variables via dotenv and performs fail-fast validation
 * to ensure all required configuration keys are present before application startup.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

let envLoaded = false;
let loadedPath = '';

const pathsToTry = [
  path.join(process.cwd(), '.env'),
  path.join(__dirname, '../../../../.env'),
  path.join(__dirname, '../../../.env'),
  path.join(__dirname, '../../.env')
];

const searchedPaths = [];
for (const p of pathsToTry) {
  const resolved = path.resolve(p);
  if (!searchedPaths.includes(resolved)) {
    searchedPaths.push(resolved);
  }
  if (fs.existsSync(resolved)) {
    dotenv.config({ path: resolved });
    envLoaded = true;
    loadedPath = resolved;
    break;
  }
}

if (envLoaded) {
  console.log(`\x1b[32m[EnvConfig] Environment variables successfully loaded from: ${loadedPath}\x1b[0m`);
} else {
  console.error(`\x1b[33m[EnvConfig] Warning: .env file not found. Searched locations:\n- ${searchedPaths.join('\n- ')}\x1b[0m`);
}

/**
 * Validates required environment variables and returns the configuration object.
 * Throws an error if required environment variables are missing.
 * 
 * @returns {Object} Validated environment variables object
 */
function validateEnv() {
  const requiredVars = ['PORT', 'DATABASE_PATH'];
  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error(`\x1b[31m[CRITICAL ERROR] Missing required environment variables: ${missing.join(', ')}\nEnsure your .env file is correctly configured at the project root.\x1b[0m`);
    process.exit(1);
  }

  const hasApiKey = process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
  if (!hasApiKey && process.env.NODE_ENV !== 'test') {
    console.error('\x1b[31m[CRITICAL ERROR] At least one of GEMINI_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY must be provided.\x1b[0m');
    process.exit(1);
  }

  return {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
    GROQ_API_KEY: process.env.GROQ_API_KEY || '',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
    DATABASE_PATH: process.env.DATABASE_PATH || path.join(__dirname, '../../data/loom.sqlite'),
    
    // AI configuration settings (defaulting to the specified MVP models)
    ROUTER_PROVIDER: process.env.ROUTER_PROVIDER || 'groq',
    ROUTER_MODEL: process.env.ROUTER_MODEL || 'qwen-2.5-3b-instruct',
    
    PLANNER_PROVIDER: process.env.PLANNER_PROVIDER || 'groq',
    PLANNER_MODEL: process.env.PLANNER_MODEL || 'gemini-2.5-flash',

    BUILDER_PROVIDER: process.env.BUILDER_PROVIDER || 'gemini',
    BUILDER_MODEL: process.env.BUILDER_MODEL || 'gemini-2.5-flash',

    REVIEWER_PROVIDER: process.env.REVIEWER_PROVIDER || 'groq',
    REVIEWER_MODEL: process.env.REVIEWER_MODEL || 'llama-3.1-8b',
  };
}

module.exports = {
  validateEnv,
};
