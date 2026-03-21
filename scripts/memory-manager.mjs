#!/usr/bin/env node
/**
 * OmnicoreX Memory Manager
 *
 * Node.js utility for managing persistent memory across Claude Code sessions.
 * Handles JSONL read/write, memory search, entity management, and snapshots.
 *
 * Usage:
 *   node scripts/memory-manager.mjs store <category> <json_data>
 *   node scripts/memory-manager.mjs search <query> [category]
 *   node scripts/memory-manager.mjs snapshot
 *   node scripts/memory-manager.mjs prune [days]
 *   node scripts/memory-manager.mjs stats
 *   node scripts/memory-manager.mjs entity <type> <json_data>
 *   node scripts/memory-manager.mjs consolidate
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';
import { randomUUID } from 'crypto';

const MEMORY_DIR = join(process.cwd(), 'memory');
const LEARNINGS_DIR = join(MEMORY_DIR, 'learnings');
const ENTITIES_DIR = join(MEMORY_DIR, 'entities');
const CONTEXT_DIR = join(MEMORY_DIR, 'context');
const SESSIONS_DIR = join(MEMORY_DIR, 'sessions');
const SNAPSHOTS_DIR = join(MEMORY_DIR, 'snapshots');

// Ensure directories exist
for (const dir of [MEMORY_DIR, LEARNINGS_DIR, ENTITIES_DIR, CONTEXT_DIR, SESSIONS_DIR, SNAPSHOTS_DIR]) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function readJsonl(filePath) {
  if (!existsSync(filePath)) return [];
  const content = readFileSync(filePath, 'utf-8').trim();
  if (!content) return [];
  return content.split('\n').filter(Boolean).map(line => {
    try { return JSON.parse(line); }
    catch { return null; }
  }).filter(Boolean);
}

function appendJsonl(filePath, data) {
  const entry = {
    id: data.id || `mem_${randomUUID().slice(0, 8)}`,
    timestamp: new Date().toISOString(),
    ...data
  };
  appendFileSync(filePath, JSON.stringify(entry) + '\n');
  return entry;
}

function searchMemory(query, category) {
  const queryLower = query.toLowerCase();
  const results = [];

  const searchDir = category === 'entities' ? ENTITIES_DIR : LEARNINGS_DIR;
  const files = readdirSync(searchDir).filter(f => f.endsWith('.jsonl'));

  for (const file of files) {
    if (category && category !== 'entities' && file !== `${category}.jsonl`) continue;

    const entries = readJsonl(join(searchDir, file));
    for (const entry of entries) {
      const text = JSON.stringify(entry).toLowerCase();
      if (text.includes(queryLower)) {
        results.push({ ...entry, _source: file, _score: calculateRelevance(text, queryLower) });
      }
    }
  }

  return results.sort((a, b) => b._score - a._score);
}

function calculateRelevance(text, query) {
  const words = query.split(/\s+/);
  let score = 0;
  for (const word of words) {
    const matches = (text.match(new RegExp(word, 'gi')) || []).length;
    score += matches;
  }
  // Recency bonus
  return score;
}

function createSnapshot() {
  const snapshot = {
    timestamp: new Date().toISOString(),
    memory: {},
    entities: {},
    context: {}
  };

  // Collect all learnings
  const learningFiles = readdirSync(LEARNINGS_DIR).filter(f => f.endsWith('.jsonl'));
  for (const file of learningFiles) {
    const category = basename(file, '.jsonl');
    snapshot.memory[category] = readJsonl(join(LEARNINGS_DIR, file));
  }

  // Collect all entities
  const entityFiles = readdirSync(ENTITIES_DIR).filter(f => f.endsWith('.jsonl'));
  for (const file of entityFiles) {
    const type = basename(file, '.jsonl');
    snapshot.entities[type] = readJsonl(join(ENTITIES_DIR, file));
  }

  // Collect context
  const contextFiles = readdirSync(CONTEXT_DIR).filter(f => f.endsWith('.json'));
  for (const file of contextFiles) {
    const name = basename(file, '.json');
    try {
      snapshot.context[name] = JSON.parse(readFileSync(join(CONTEXT_DIR, file), 'utf-8'));
    } catch { /* skip invalid */ }
  }

  const dateSlug = new Date().toISOString().slice(0, 10);
  const snapshotPath = join(SNAPSHOTS_DIR, `${dateSlug}.json`);
  writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));

  console.log(`Snapshot created: ${snapshotPath}`);
  console.log(`  Learnings: ${Object.values(snapshot.memory).flat().length} entries`);
  console.log(`  Entities: ${Object.values(snapshot.entities).flat().length} entries`);
  return snapshot;
}

function pruneOldMemories(daysToKeep = 90) {
  const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
  let pruned = 0;

  const files = readdirSync(LEARNINGS_DIR).filter(f => f.endsWith('.jsonl'));
  for (const file of files) {
    const filePath = join(LEARNINGS_DIR, file);
    const entries = readJsonl(filePath);
    const kept = entries.filter(e => {
      const ts = new Date(e.timestamp).getTime();
      if (ts < cutoff && (e.confidence || 1) < 0.5) {
        pruned++;
        return false;
      }
      return true;
    });
    writeFileSync(filePath, kept.map(e => JSON.stringify(e)).join('\n') + '\n');
  }

  console.log(`Pruned ${pruned} low-confidence entries older than ${daysToKeep} days`);
}

function showStats() {
  console.log('=== OmnicoreX Memory Statistics ===\n');

  // Learnings
  console.log('Learnings:');
  const learningFiles = readdirSync(LEARNINGS_DIR).filter(f => f.endsWith('.jsonl'));
  let totalLearnings = 0;
  for (const file of learningFiles) {
    const entries = readJsonl(join(LEARNINGS_DIR, file));
    totalLearnings += entries.length;
    console.log(`  ${basename(file, '.jsonl')}: ${entries.length} entries`);
  }
  console.log(`  Total: ${totalLearnings}\n`);

  // Entities
  console.log('Entities:');
  const entityFiles = readdirSync(ENTITIES_DIR).filter(f => f.endsWith('.jsonl'));
  let totalEntities = 0;
  for (const file of entityFiles) {
    const entries = readJsonl(join(ENTITIES_DIR, file));
    totalEntities += entries.length;
    console.log(`  ${basename(file, '.jsonl')}: ${entries.length} entries`);
  }
  console.log(`  Total: ${totalEntities}\n`);

  // Sessions
  const sessionFiles = readdirSync(SESSIONS_DIR).filter(f => f.endsWith('.md'));
  console.log(`Session handoffs: ${sessionFiles.length}`);

  // Snapshots
  const snapshotFiles = readdirSync(SNAPSHOTS_DIR).filter(f => f.endsWith('.json'));
  console.log(`Snapshots: ${snapshotFiles.length}`);

  // Total disk usage
  let totalSize = 0;
  function dirSize(dir) {
    if (!existsSync(dir)) return;
    for (const file of readdirSync(dir)) {
      const fp = join(dir, file);
      const stat = statSync(fp);
      if (stat.isDirectory()) dirSize(fp);
      else totalSize += stat.size;
    }
  }
  dirSize(MEMORY_DIR);
  console.log(`\nTotal memory size: ${(totalSize / 1024).toFixed(1)} KB`);
}

function consolidateMemories() {
  console.log('Consolidating memories...');

  // Deduplicate learnings by similarity
  const files = readdirSync(LEARNINGS_DIR).filter(f => f.endsWith('.jsonl'));
  let deduped = 0;

  for (const file of files) {
    const filePath = join(LEARNINGS_DIR, file);
    const entries = readJsonl(filePath);
    const seen = new Set();
    const unique = [];

    for (const entry of entries) {
      const key = (entry.insight || entry.content || '').toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(entry);
      } else {
        deduped++;
      }
    }

    if (deduped > 0) {
      writeFileSync(filePath, unique.map(e => JSON.stringify(e)).join('\n') + '\n');
    }
  }

  console.log(`Deduplicated ${deduped} entries across all categories`);
}

// CLI handler
const [,, command, ...args] = process.argv;

switch (command) {
  case 'store': {
    const [category, ...jsonParts] = args;
    const jsonStr = jsonParts.join(' ');
    if (!category || !jsonStr) {
      console.error('Usage: memory-manager.mjs store <category> <json_data>');
      process.exit(1);
    }
    try {
      const data = JSON.parse(jsonStr);
      const entry = appendJsonl(join(LEARNINGS_DIR, `${category}.jsonl`), data);
      console.log(`Stored: ${JSON.stringify(entry)}`);
    } catch (e) {
      console.error('Invalid JSON:', e.message);
      process.exit(1);
    }
    break;
  }

  case 'search': {
    const [query, category] = args;
    if (!query) {
      console.error('Usage: memory-manager.mjs search <query> [category]');
      process.exit(1);
    }
    const results = searchMemory(query, category);
    console.log(`Found ${results.length} results:`);
    for (const r of results.slice(0, 10)) {
      console.log(`  [${r._source}] ${r.insight || r.content || r.name || JSON.stringify(r).slice(0, 100)}`);
    }
    break;
  }

  case 'entity': {
    const [type, ...jsonParts] = args;
    const jsonStr = jsonParts.join(' ');
    if (!type || !jsonStr) {
      console.error('Usage: memory-manager.mjs entity <type> <json_data>');
      process.exit(1);
    }
    try {
      const data = JSON.parse(jsonStr);
      const entry = appendJsonl(join(ENTITIES_DIR, `${type}.jsonl`), data);
      console.log(`Entity stored: ${JSON.stringify(entry)}`);
    } catch (e) {
      console.error('Invalid JSON:', e.message);
      process.exit(1);
    }
    break;
  }

  case 'snapshot':
    createSnapshot();
    break;

  case 'prune': {
    const days = parseInt(args[0]) || 90;
    pruneOldMemories(days);
    break;
  }

  case 'stats':
    showStats();
    break;

  case 'consolidate':
    consolidateMemories();
    break;

  default:
    console.log(`OmnicoreX Memory Manager

Commands:
  store <category> <json>   Store a learning (categories: clients, market, templates, objections, patterns, competitive)
  search <query> [category] Search across memory
  entity <type> <json>      Store an entity (types: people, companies, relationships)
  snapshot                   Create a full memory snapshot
  prune [days]              Remove old low-confidence memories (default: 90 days)
  stats                     Show memory statistics
  consolidate               Deduplicate and consolidate memories
`);
}
