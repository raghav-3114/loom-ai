/**
 * Isolated test of Claude API — runs completely outside the pipeline.
 * Measures real latency and prints the raw response.
 */
const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });
const { callClaude } = require('./providers/claude');

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not found in .env');
    process.exit(1);
  }
  console.log(`API Key loaded: ${apiKey.substring(0, 12)}... (length: ${apiKey.length})`);

  const messages = [
    { role: 'system', content: 'You are a helpful coding assistant. Respond concisely.' },
    { role: 'user', content: 'Write a single HTML paragraph tag with the text "Hello from Claude". Nothing else.' },
  ];

  console.log('Calling Claude claude-sonnet-4-6...');
  const start = Date.now();

  try {
    const result = await callClaude({
      model: 'claude-sonnet-4-6',
      messages,
      apiKey,
    });
    const elapsed = Date.now() - start;
    console.log(`\n✅ SUCCESS in ${elapsed}ms`);
    console.log(`Provider: ${result.provider}, Model: ${result.model}`);
    console.log(`Response text:\n---\n${result.text}\n---`);
  } catch (err) {
    const elapsed = Date.now() - start;
    console.error(`\n❌ FAILED in ${elapsed}ms`);
    console.error(err.message);
    process.exit(1);
  }
}

main();
