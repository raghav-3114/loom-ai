const { repairJson } = require('./apps/server/src/utils/json-repair');

// Test 1: Basic markdown fence wrapping
const test1 = '```json\n{"reasoning": "test", "summary": "hello", "actions": []}\n```';
try {
  const result = repairJson(test1);
  console.log('Test 1 (basic fence):', result.reasoning === 'test' ? 'PASS' : 'FAIL');
} catch(e) {
  console.log('Test 1 FAILED:', e.message);
}

// Test 2: Content with nested backticks (the real problem)
const test2 = '```json\n{"reasoning": "test", "summary": "hello", "actions": [{"action": "create", "path": "index.html", "content": "<pre>```code here```</pre>"}]}\n```';
try {
  const result = repairJson(test2);
  console.log('Test 2 (nested backticks):', result.actions[0].content.includes('```code') ? 'PASS' : 'FAIL');
} catch(e) {
  console.log('Test 2 FAILED:', e.message);
}

// Test 3: Raw JSON (no fences)
const test3 = '{"reasoning": "test", "summary": "ok", "actions": []}';
try {
  const result = repairJson(test3);
  console.log('Test 3 (raw JSON):', result.reasoning === 'test' ? 'PASS' : 'FAIL');
} catch(e) {
  console.log('Test 3 FAILED:', e.message);
}

console.log('All tests complete.');
