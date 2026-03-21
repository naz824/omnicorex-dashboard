#!/bin/bash
# OmnicoreX Memory Extraction — Extracts learnings from session activity
# Parses activity log and session log to generate structured learnings

set -e

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DATE_SLUG=$(date -u +"%Y-%m-%d_%H-%M")

echo "=== OmnicoreX Memory Extraction ==="

# Create session handoff document
SESSION_FILE="memory/sessions/${DATE_SLUG}.md"

cat > "$SESSION_FILE" << EOF
# Session Handoff — $DATE_SLUG

## Session Summary
- Started: $TIMESTAMP
- Agent: ${AGENT:-system}

## Files Changed This Session
$(git diff --name-only 2>/dev/null | sed 's/^/- /' || echo "- None detected")

## Untracked Files
$(git ls-files --others --exclude-standard 2>/dev/null | head -20 | sed 's/^/- /' || echo "- None")

## Activity Log (This Session)
$(tail -50 .claude/activity.log 2>/dev/null || echo "No activity log entries")

## Git Log (Last 5 Commits)
$(git log --oneline -5 2>/dev/null || echo "No commits")

## Pending Items for Next Session
$(cat memory/context/pending-actions.json 2>/dev/null | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    for a in data.get('actions', []):
        print(f\"- [{a['status']}] {a['description']}\")
except:
    print('- Unable to parse pending actions')
" 2>/dev/null || echo "- Check memory/context/pending-actions.json")

## Key Decisions Made
_To be filled by agent or extracted from conversation_

## Learnings
_To be filled by agent or extracted from session analysis_
EOF

echo "Session handoff created: $SESSION_FILE"

# Update MEMORY.md session counter
if [ -f "memory/MEMORY.md" ]; then
  CURRENT_COUNT=$(grep -oP 'Total sessions: \K[0-9]+' memory/MEMORY.md 2>/dev/null || echo "0")
  NEW_COUNT=$((CURRENT_COUNT + 1))
  sed -i "s/Total sessions: $CURRENT_COUNT/Total sessions: $NEW_COUNT/" memory/MEMORY.md 2>/dev/null || true

  # Update last updated timestamp
  sed -i "s/Last updated: .*/Last updated: $(date -u +%Y-%m-%d)/" memory/MEMORY.md 2>/dev/null || true

  echo "MEMORY.md updated (session $NEW_COUNT)"
fi

echo "=== Extraction complete ==="
