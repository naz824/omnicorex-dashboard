#!/bin/bash
# On-stop hook: Summarize work and update dashboard
# Triggered when Claude stops working

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_LOG=".claude/session.log"

# Summarize what was done (read activity log)
echo "=== Session Complete ===" >> "$SESSION_LOG"
echo "Timestamp: $TIMESTAMP" >> "$SESSION_LOG"
echo "User: $USER" >> "$SESSION_LOG"

# Count files changed
FILES_CHANGED=$(git diff --name-only 2>/dev/null | wc -l)
echo "Files Changed: $FILES_CHANGED" >> "$SESSION_LOG"

# List files changed
if [ "$FILES_CHANGED" -gt 0 ]; then
  echo "Changed Files:" >> "$SESSION_LOG"
  git diff --name-only 2>/dev/null | sed 's/^/  - /' >> "$SESSION_LOG"
fi

# Attempt to update dashboard (if API available)
if command -v curl &> /dev/null; then
  DASHBOARD_URL="${DASHBOARD_URL:-https://omnicorex-dashboard.vercel.app/api}"

  curl -X POST "$DASHBOARD_URL/activity" \
    -H "Content-Type: application/json" \
    -d "{
      \"timestamp\": \"$TIMESTAMP\",
      \"event_type\": \"session_complete\",
      \"files_changed\": $FILES_CHANGED,
      \"agent\": \"${AGENT:-system}\"
    }" \
    2>/dev/null || echo "Dashboard update failed (offline or not available)"
fi

echo "✓ Session logged"
