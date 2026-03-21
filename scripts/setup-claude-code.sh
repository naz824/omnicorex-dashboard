#!/bin/bash
# Setup OmnicoreX Claude Code Environment
# Installs all MCP servers, validates configuration, sets up memory system

set -e

echo "========================================"
echo "  OmnicoreX Claude Code Setup"
echo "  Autonomous Business Agent System"
echo "========================================"
echo ""

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

# Check prerequisites
echo "[1/8] Checking prerequisites..."

if ! command -v node &> /dev/null; then
  echo "  ERROR: Node.js not found. Install Node.js 18+"
  exit 1
fi

if ! command -v git &> /dev/null; then
  echo "  ERROR: git not found."
  exit 1
fi

NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
echo "  Node: $NODE_VERSION"
echo "  npm: $NPM_VERSION"
echo "  git: $(git --version | awk '{print $3}')"
echo ""

# Install project dependencies
echo "[2/8] Installing project dependencies..."
npm install 2>/dev/null
echo "  Done."
echo ""

# Create directory structure
echo "[3/8] Creating directory structure..."
mkdir -p .claude/hooks
mkdir -p .claude/agents
mkdir -p .claude/rules
mkdir -p .claude/skills
mkdir -p .claude/memory
mkdir -p memory/{sessions,learnings,context,entities,snapshots}
mkdir -p scripts
echo "  Done."
echo ""

# Make scripts executable
echo "[4/8] Making scripts executable..."
chmod +x scripts/*.sh scripts/*.mjs 2>/dev/null || true
chmod +x .claude/hooks/*.sh 2>/dev/null || true
echo "  Done."
echo ""

# Install MCP memory servers
echo "[5/8] Pre-installing MCP servers (for faster startup)..."
echo "  Installing @modelcontextprotocol/server-memory..."
npx -y @modelcontextprotocol/server-memory --help 2>/dev/null || true
echo "  Installing @modelcontextprotocol/server-github..."
npx -y @modelcontextprotocol/server-github --help 2>/dev/null || true
echo "  Installing @modelcontextprotocol/server-filesystem..."
npx -y @modelcontextprotocol/server-filesystem --help 2>/dev/null || true
echo "  Installing @modelcontextprotocol/server-fetch..."
npx -y @modelcontextprotocol/server-fetch --help 2>/dev/null || true
echo "  Installing mcp-memory-service..."
npx -y mcp-memory-service --help 2>/dev/null || true
echo "  Done."
echo ""

# Initialize memory system
echo "[6/8] Initializing memory system..."
if [ ! -f "memory/MEMORY.md" ]; then
  echo "  Creating initial MEMORY.md..."
  cat > memory/MEMORY.md << 'MEMEOF'
# OmnicoreX Working Memory

> This file is automatically loaded at the start of every Claude Code session.
> Last updated: $(date -u +%Y-%m-%d)

## Current State
- Business: Pre-revenue, building infrastructure
- Dashboard: https://omnicorex-dashboard.vercel.app
- GitHub: https://github.com/naz824/omnicorex-dashboard

## Pending Actions
- Check memory/context/pending-actions.json

## Session Counter
Total sessions: 0
MEMEOF
fi

# Initialize JSONL files if they don't exist
for f in clients market templates objections patterns competitive; do
  touch "memory/learnings/$f.jsonl"
done
for f in people companies relationships; do
  touch "memory/entities/$f.jsonl"
done
for f in active-projects pipeline pending-actions; do
  if [ ! -f "memory/context/$f.json" ]; then
    echo '{}' > "memory/context/$f.json"
  fi
done

touch .claude/activity.log
touch .claude/session.log
echo "  Done."
echo ""

# Validate TypeScript
echo "[7/8] Validating TypeScript configuration..."
if command -v npx &> /dev/null; then
  npx tsc --noEmit --skipLibCheck > /dev/null 2>&1 && echo "  TypeScript: Valid" || echo "  TypeScript: Warnings (may be expected during setup)"
fi
echo ""

# Check environment variables
echo "[8/8] Checking environment variables..."
MISSING_VARS=0

if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
  echo "  WARNING: GITHUB_PERSONAL_ACCESS_TOKEN not set"
  echo "    Set with: export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_..."
  MISSING_VARS=$((MISSING_VARS + 1))
else
  echo "  GITHUB_PERSONAL_ACCESS_TOKEN: Set"
fi

if [ -z "$BRAVE_SEARCH_API_KEY" ]; then
  echo "  INFO: BRAVE_SEARCH_API_KEY not set (brave-search MCP will be unavailable)"
else
  echo "  BRAVE_SEARCH_API_KEY: Set"
fi

if [ -z "$DATABASE_URL" ]; then
  echo "  INFO: DATABASE_URL not set (postgres MCP will be unavailable, using mock data)"
else
  echo "  DATABASE_URL: Set"
fi
echo ""

# Summary
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "Memory System:"
echo "  Working memory:  memory/MEMORY.md"
echo "  Learnings:       memory/learnings/ ($(find memory/learnings -name '*.jsonl' | wc -l) files)"
echo "  Entities:        memory/entities/ ($(find memory/entities -name '*.jsonl' | wc -l) files)"
echo "  Sessions:        memory/sessions/ ($(find memory/sessions -name '*.md' 2>/dev/null | wc -l) handoffs)"
echo ""
echo "MCP Servers (8 configured):"
echo "  github            GitHub repo management"
echo "  filesystem        Local file access"
echo "  fetch             HTTP/HTTPS requests"
echo "  memory            Official MCP knowledge graph"
echo "  memory-service    Semantic search (doobidoo/mcp-memory-service)"
echo "  sequential-thinking  Extended thinking"
echo "  brave-search      Web search"
echo "  postgres          Database access"
echo ""
echo "Agents (8 configured):"
echo "  Apex (Orchestrator) | Nova (Sales) | Meridian (Marketing)"
echo "  Prism (Design) | Vertex (Frontend) | Nexus (Backend)"
echo "  Sentinel (QA) | Compass (Operations)"
echo ""
echo "Commands:"
echo "  /status              Business dashboard"
echo "  /prospect [industry] Find new leads"
echo "  /memory [query]      Query memory"
echo "  /memory-stats        Memory statistics"
echo "  /health              System health check"
echo ""
echo "Memory Stats:"
node scripts/memory-manager.mjs stats 2>/dev/null || echo "  Run 'node scripts/memory-manager.mjs stats' for details"
echo ""
if [ "$MISSING_VARS" -gt 0 ]; then
  echo "NOTE: $MISSING_VARS environment variable(s) not set."
  echo "  Set them in your shell profile or .env.local file."
fi
echo ""
echo "Ready to go!"
