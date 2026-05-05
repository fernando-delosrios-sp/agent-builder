const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * init.js — Agent Builder skill bootstrap (Multi-platform)
 * 
 * This script ensures all required upstream skills are installed.
 * It is cross-platform and can be run via `node init.js`.
 */

/**
 * init.js — Agent Builder skill bootstrap (Multi-platform)
 * 
 * This script ensures all required upstream skills are installed
 * by restoring them from the skills-lock.json manifest.
 */

console.log("🚀 Agent Builder — restoring upstream skills from manifest...");

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const result = spawnSync(npx, ['skills', 'experimental_install'], {
  stdio: 'inherit',
  shell: true
});

if (result.status !== 0) {
  console.error("❌ Failed to restore skills.");
  process.exit(1);
}

console.log("✅ All skills restored. You're ready to use agent-builder and skill-builder.");
