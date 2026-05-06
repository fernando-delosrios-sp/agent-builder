#!/usr/bin/env node
/**
 * fetch-mcp-servers.js
 *
 * Fetches MCP servers from mcpservers.org and builds data/mcp-servers.json.
 * Idempotent — safe to run multiple times.
 * Non-fatal — warns on network failure but exits cleanly.
 *
 * Run automatically via init.js on every `npm install`, or manually:
 *   node skills/find-mcp/scripts/fetch-mcp-servers.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const DATA_FILE = path.join(__dirname, '..', 'data', 'mcp-servers.json');

const MCPSERVERS_ORG = 'https://mcpservers.org';

function warn(msg) {
  console.warn(`\u26a0\ufe0f  find-mcp: ${msg}`);
}

function info(msg) {
  console.log(`\u2139\ufe0f  find-mcp: ${msg}`);
}

function fetchHtml(url) {
  try {
    return execSync(`curl -s -L --max-time 20 "${url}"`, { encoding: 'utf8', shell: true });
  } catch {
    return null;
  }
}

function extractServers(html) {
  const servers = [];

  const entryRegex = /id:(\d+),slug:"([^"]+)",name:"([^"]+)",description:"([^"]+)",content:null,url:"([^"]+)",category:"([^"]+)",tags:\$R\[\d+\]=\[([^\]]*)\],featured:(!0|!1)/g;

  let m;
  while ((m = entryRegex.exec(html)) !== null) {
    const tags = m[7] ? m[7].match(/"([^"]+)"/g)?.map(t => t.replace(/^"|"$/g, '')) : [];
    servers.push({
      id: m[2].split('/').pop() || m[2].replace(/\//g, '-'),
      slug: m[2],
      name: m[3],
      description: m[4],
      url: m[5],
      category: m[6],
      official: tags.includes('official'),
      installs: 'medium',
      harnesses: ['claude_code', 'cursor', 'gemini'],
      config: {
        command: 'npx',
        args: ['-y', detectPackage(m[2])]
      },
      source: 'auto'
    });
  }

  return servers;
}

function detectPackage(slug) {
  const map = {
    'anki-mcp/anki-mcp-desktop': '@modelcontextprotocol/server-anki',
    'browserbase/mcp-server-browserbase': '@browserbase/mcp-server-browserbase',
    'github-com-chromedevtools-chrome-devtools-mcp': '@chromedevtools/mcp',
    'cloudflare/mcp-server-cloudflare': '@cloudflare/mcp-server-cloudflare',
    'upstash/context7-mcp': '@upstash/context7-mcp',
    'devin/deepwiki': '@devin/deepwiki-mcp',
    'e2b-dev/mcp-server': '@e2b-dev/mcp-server',
    'exa-labs/exa-mcp-server': '@exa-labs/exa-mcp-server',
    'github-com-firecrawl-firecrawl-mcp-server': '@github-com-firecrawl-firecrawl-mcp-server',
    'github/github-mcp-server': '@modelcontextprotocol/server-github',
    'google/mcp': '@google/mcp',
    'github-com-minimax-ai-minimax-mcp': '@minimax-ai/minimax-mcp',
    'vercel/next-devtools-mcp': '@vercel/next-devtools-mcp',
    'pleaseprompto/notebooklm-mcp': '@pleaseprompto/notebooklm-mcp',
    'microsoft/playwright-mcp': '@modelcontextprotocol/server-playwright',
    'docs-proxyman-com-mcp-md': '@proxyman/mcp',
    'supabase-community/supabase-mcp': '@supabase-community/mcp',
    'cameroncooke/xcodebuildmcp': '@xcodebuildmcp/xcodebuildmcp',
    'ticketdesk-ai-mcp': '@ticketdesk-ai/mcp',
    'on-pageai-seo-mcp': '@on-pageai/seo-mcp',
    'compeller-mcp': '@compeller/mcp',
    'lightrun-platform/lightrun-mcp-server': '@lightrun-platform/mcp-server',
    'ploi-cloud-documentation-ai-intro': '@ploi-cloud/mcp',
    'mogacode-ma/infomaniak-mcp-agent': '@mogacode-ma/infomaniak-mcp-agent',
    'pretensor-ai/pretensor': '@pretensor-ai/mcp',
    'vamsi-kodimela/maagpi-images-mcp': '@maagpi/images-mcp',
  };
  if (map[slug]) return map[slug];
  const last = slug.split('/').pop();
  return `@modelcontextprotocol/server-${last.replace(/-mcp$/i, '')}`;
}

function loadExisting() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function merge(existing, fresh) {
  const autoIds = new Set(fresh.map(s => s.id));
  const manual = existing.filter(e => !e.source || e.source !== 'auto' || !autoIds.has(e.id));
  return [...fresh, ...manual];
}

function save(servers) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(servers, null, 2), 'utf8');
}

function main() {
  info('Fetching MCP server catalogue from mcpservers.org...');

  const existing = loadExisting();
  const manualCount = existing.filter(s => !s.source || s.source !== 'auto').length;
  info(`Found ${existing.length} existing entries (${manualCount} manual).`);

  const html = fetchHtml(MCPSERVERS_ORG);
  if (!html) {
    warn('Failed to fetch mcpservers.org — keeping existing catalogue.');
    return;
  }

  const servers = extractServers(html);
  if (servers.length === 0) {
    warn('No servers extracted from page — keeping existing catalogue.');
    return;
  }

  const seen = new Set();
  const deduped = servers.filter(s => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });

  const merged = merge(existing, deduped);
  save(merged);
  info(`Saved ${merged.length} servers (${deduped.length} new auto-fetched, ${manualCount} preserved manual).`);
}

main();