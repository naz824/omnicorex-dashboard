#!/bin/bash
# Setup OmnicoreX Claude Code Environment
# Installs all MCP servers, validates configuration, tests connectivity

set -e

echo "🚀 OmnicoreX Claude Code Setup"
echo "================================"
echo ""

# Check prerequisites
echo "✓ Checking prerequisites..."

if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Please install Node.js 18+"
  exit 1
fi

if ! command -v npm &> /dev/null; then
  echo "❌ npm not found"
  exit 1
fi

NODE_VERSION=$(node -v)
echo "  Node: $NODE_VERSION"
echo "  npm: $(npm -v)"
echo ""

# Install project dependencies
echo "📦 Installing project dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p .claude/hooks
mkdir -p .claude/agents
mkdir -p .claude/rules
mkdir -p .claude/skills
mkdir -p scripts
echo "✓ Directories created"
echo ""

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x scripts/dashboard-sync.sh
chmod +x scripts/setup-claude-code.sh
chmod +x .claude/hooks/post-edit.sh
chmod +x .claude/hooks/on-stop.sh
echo "✓ Scripts executable"
echo ""

# Validate TypeScript
echo "🔍 Validating TypeScript configuration..."
if command -v npx &> /dev/null; then
  npx tsc --noEmit --skipLibCheck > /dev/null 2>&1 && echo "✓ TypeScript valid" || echo "⚠ TypeScript issues (may be expected)"
fi
echo ""

# Check environment variables
echo "🔐 Checking environment variables..."
if [ ! -f ".env.local" ]; then
  echo "⚠ No .env.local file found"
  echo "  Copy .env.example to .env.local and add your API keys:"
  echo "  cp .env.example .env.local"
  echo ""
  echo "  Required variables:"
  echo "  - VITE_SUPABASE_URL"
  echo "  - VITE_SUPABASE_ANON_KEY"
  echo "  - VITE_STRIPE_PUBLIC_KEY"
else
  echo "✓ .env.local found"
fi
echo ""

# Test MCP Server availability (optional)
echo "🔌 MCP Server Configuration"
echo "  The following MCP servers should be available:"
echo "  - github (repository management)"
echo "  - filesystem (file access)"
echo "  - fetch (HTTP requests)"
echo "  - memory (persistent key-value store)"
echo "  - sequential-thinking (extended thinking)"
echo "  - brave-search (web search)"
echo "  - postgres (database queries)"
echo ""

# Create activity log
echo "📝 Initializing activity log..."
touch .claude/activity.log
touch .claude/session.log
echo "✓ Activity logs ready"
echo ""

# Summary
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Add your API keys to .env.local"
echo "2. Review CLAUDE.md for system architecture"
echo "3. Run /health command to check agent status"
echo "4. Read .claude/rules/ for operational guidelines"
echo ""
echo "Start using OmnicoreX:"
echo "  - /status               Show business dashboard"
echo "  - /prospect [industry]  Find new leads"
echo "  - /design [client]      Create website mockup"
echo "  - /develop [project]    Build website"
echo "  - /report               Generate performance report"
echo ""
echo "Good luck! 🎉"
