#!/bin/bash
# Post-edit hook: Log file changes to activity feed
# Triggered after any Edit or Write action

FILE_PATH="$1"
ACTION="$2"  # "edit" or "write"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
AGENT="${AGENT:-unknown}"

# Create activity log entry
ACTIVITY_LOG=".claude/activity.log"

echo "[${TIMESTAMP}] ${AGENT} ${ACTION} ${FILE_PATH}" >> "$ACTIVITY_LOG"

# If file is code-related, run type check
if [[ "$FILE_PATH" == *.ts || "$FILE_PATH" == *.tsx || "$FILE_PATH" == *.js ]]; then
  if command -v npx &> /dev/null; then
    echo "Running TypeScript type check on $FILE_PATH..."
    npx tsc --noEmit --skipLibCheck 2>&1 | head -10
  fi
fi

echo "✓ Activity logged: $FILE_PATH ($ACTION)"
