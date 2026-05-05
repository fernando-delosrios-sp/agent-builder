const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * init.js — Agent Builder skill bootstrap (Multi-platform)
 *
 * 1. Restores all upstream skills from skills-lock.json via `npx skills experimental_install`.
 * 2. Symlinks every local skill from /skills into .agents/skills/ so the local
 *    agent can discover them at runtime — idempotent and safe to re-run.
 */

const ROOT = __dirname;
const SKILLS_SRC = path.join(ROOT, 'skills');
const SKILLS_DEST = path.join(ROOT, '.agents', 'skills');

// ── Step 1: Restore upstream skills ─────────────────────────────────────────
console.log('🚀 Agent Builder — restoring upstream skills from manifest...');

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const result = spawnSync(npx, ['skills', 'experimental_install'], {
  stdio: 'inherit',
  shell: true,
});

if (result.status !== 0) {
  console.error('❌ Failed to restore upstream skills.');
  process.exit(1);
}

console.log('✅ Upstream skills restored.');

// ── Step 2: Symlink local skills → .agents/skills/ ──────────────────────────
console.log('\n🔗 Linking local skills into .agents/skills/...');

if (!fs.existsSync(SKILLS_SRC)) {
  console.log('   No local skills/ directory found — skipping.');
} else {
  fs.mkdirSync(SKILLS_DEST, { recursive: true });

  const localSkills = fs.readdirSync(SKILLS_SRC).filter((name) => {
    const skillMd = path.join(SKILLS_SRC, name, 'SKILL.md');
    return (
      fs.statSync(path.join(SKILLS_SRC, name)).isDirectory() &&
      fs.existsSync(skillMd)
    );
  });

  for (const skillName of localSkills) {
    const linkPath = path.join(SKILLS_DEST, skillName);
    // Relative target keeps the symlink portable across machines
    const target = path.relative(SKILLS_DEST, path.join(SKILLS_SRC, skillName));

    // lstat works on broken symlinks; existsSync does not
    let existingStat = null;
    try { existingStat = fs.lstatSync(linkPath); } catch (_) {}

    if (existingStat) {
      if (existingStat.isSymbolicLink() && fs.readlinkSync(linkPath) === target) {
        console.log(`   ⏭  ${skillName} — already linked, skipping.`);
        continue;
      }
      // Remove stale entry (wrong target or not a symlink)
      fs.rmSync(linkPath, { recursive: true, force: true });
    }

    fs.symlinkSync(target, linkPath, 'dir');
    console.log(`   ✅ ${skillName} → ${target}`);
  }

  if (localSkills.length === 0) {
    console.log('   No local skills with SKILL.md found in skills/ — skipping.');
  }
}

console.log('\n🎉 All done. You\'re ready to use agent-builder and skill-builder.');

