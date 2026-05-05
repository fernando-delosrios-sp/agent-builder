#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ANTI_PATTERNS = [
  {
    name: 'Array Accumulation',
    regex: /\.push\(.*\)/g,
    message: 'Possible memory accumulation. Ensure you are streaming records instead of collecting them in an array.'
  },
  {
    name: 'Missing Stream Usage',
    regex: /await .*\(.*\)\.then\(/g,
    message: 'Consider using async iterators or direct streaming for better throughput.'
  },
  {
    name: 'Large JSON Parse',
    regex: /JSON\.parse\(.*\)/g,
    message: 'JSON.parse on large strings can cause memory spikes. Use a streaming JSON parser if possible.'
  }
];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  ANTI_PATTERNS.forEach(pattern => {
    const matches = content.match(pattern.regex);
    if (matches) {
      issues.push({
        pattern: pattern.name,
        message: pattern.message,
        count: matches.length
      });
    }
  });

  return issues;
}

const target = process.argv[2] || '.';
if (fs.lstatSync(target).isDirectory()) {
  // Simple recursive walk (truncated for brevity)
  console.log(`Checking directory: ${target}`);
} else {
  const issues = checkFile(target);
  if (issues.length > 0) {
    console.log(`Issues found in ${target}:`);
    issues.forEach(i => console.log(`- [${i.pattern}] ${i.message} (${i.count} occurrences)`));
  } else {
    console.log(`No obvious anti-patterns found in ${target}.`);
  }
}
