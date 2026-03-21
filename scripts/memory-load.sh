#!/bin/bash
# OmnicoreX Memory Load — Loads context for a new session
# Run at the start of every Claude Code session

set -e

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

echo "=== OmnicoreX Memory Load ==="
echo "Loading persistent memory into session context..."
echo ""

# Layer 1: Working Memory (MEMORY.md)
if [ -f "memory/MEMORY.md" ]; then
  echo "--- WORKING MEMORY (memory/MEMORY.md) ---"
  cat memory/MEMORY.md
  echo ""
  echo "--- END WORKING MEMORY ---"
  echo ""
fi

# Layer 2: Last 3 Session Handoffs
echo "--- RECENT SESSION HANDOFFS ---"
HANDOFFS=$(ls -t memory/sessions/*.md 2>/dev/null | head -3)
if [ -n "$HANDOFFS" ]; then
  for f in $HANDOFFS; do
    echo ""
    echo ">> $(basename "$f")"
    head -30 "$f"
    echo "..."
    echo ""
  done
else
  echo "No previous session handoffs found."
fi
echo "--- END SESSION HANDOFFS ---"
echo ""

# Layer 3: Pending Actions
echo "--- PENDING ACTIONS ---"
if [ -f "memory/context/pending-actions.json" ]; then
  python3 -c "
import json
with open('memory/context/pending-actions.json') as f:
    data = json.load(f)
for a in data.get('actions', []):
    status = a.get('status', 'unknown')
    desc = a.get('description', 'No description')
    priority = a.get('priority', 'medium')
    blocker = a.get('blocker', '')
    print(f'  [{priority.upper()}] [{status}] {desc}')
    if blocker:
        print(f'    Blocker: {blocker}')
" 2>/dev/null || echo "  Unable to parse pending actions"
fi
echo "--- END PENDING ACTIONS ---"
echo ""

# Layer 4: Recent Learnings (last 10 from each category)
echo "--- RECENT LEARNINGS ---"
for f in memory/learnings/*.jsonl; do
  if [ -f "$f" ]; then
    CATEGORY=$(basename "$f" .jsonl)
    COUNT=$(wc -l < "$f")
    echo "  $CATEGORY: $COUNT entries"
    tail -3 "$f" | python3 -c "
import json, sys
for line in sys.stdin:
    try:
        d = json.loads(line.strip())
        insight = d.get('insight', d.get('content', 'No content'))
        print(f'    - {insight[:120]}')
    except:
        pass
" 2>/dev/null || true
  fi
done
echo "--- END LEARNINGS ---"
echo ""

# Layer 5: Entity Summary
echo "--- ENTITY GRAPH ---"
PEOPLE=$(wc -l < memory/entities/people.jsonl 2>/dev/null || echo "0")
COMPANIES=$(wc -l < memory/entities/companies.jsonl 2>/dev/null || echo "0")
RELS=$(wc -l < memory/entities/relationships.jsonl 2>/dev/null || echo "0")
echo "  People: $PEOPLE | Companies: $COMPANIES | Relationships: $RELS"
echo "--- END ENTITY GRAPH ---"
echo ""

echo "=== Memory loaded. Ready for session. ==="
