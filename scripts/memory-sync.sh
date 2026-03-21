#!/bin/bash
# OmnicoreX Memory Sync — Commits memory state to GitHub for persistence
# Called by on-stop hook and can be run manually

set -e

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DATE_SLUG=$(date -u +"%Y-%m-%d_%H-%M")

echo "=== OmnicoreX Memory Sync ==="
echo "Timestamp: $TIMESTAMP"

# Check if there are memory changes to commit
MEMORY_CHANGES=$(git diff --name-only memory/ .claude/memory/ CLAUDE.md 2>/dev/null | wc -l)

if [ "$MEMORY_CHANGES" -eq 0 ]; then
  UNTRACKED=$(git ls-files --others --exclude-standard memory/ .claude/memory/ 2>/dev/null | wc -l)
  if [ "$UNTRACKED" -eq 0 ]; then
    echo "No memory changes to sync."
    exit 0
  fi
fi

echo "Memory files changed: $MEMORY_CHANGES"

# Stage memory files
git add memory/ .claude/memory/ 2>/dev/null || true
git add CLAUDE.md 2>/dev/null || true
git add memory/MEMORY.md 2>/dev/null || true

# Check if anything is actually staged
STAGED=$(git diff --cached --name-only 2>/dev/null | wc -l)
if [ "$STAGED" -eq 0 ]; then
  echo "Nothing staged for commit."
  exit 0
fi

# Create memory sync commit
git commit -m "[MEMORY] sync: session memory update $DATE_SLUG

Auto-committed by OmnicoreX memory sync system.
Contains session learnings, context updates, and entity changes." 2>/dev/null || {
  echo "Commit failed (possibly nothing to commit)"
  exit 0
}

# Push to GitHub
if git remote get-url origin &>/dev/null; then
  echo "Pushing memory sync to GitHub..."
  git push origin main 2>/dev/null && echo "Memory synced to GitHub." || echo "Push failed (will sync next time)"
else
  echo "No remote configured. Memory saved locally."
fi

echo "=== Memory sync complete ==="
