#!/bin/bash
# Dashboard Sync Script
# Pushes updates to OmnicoreX dashboard API
# Usage: ./scripts/dashboard-sync.sh --action "project_status_update" --project_id "johnson_dental_website" --status "in_development" --progress 45

set -e

# Configuration
DASHBOARD_URL="${DASHBOARD_URL:-https://omnicorex-dashboard.vercel.app/api}"
API_KEY="${OMNICOREX_API_KEY:-}"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Default values
ACTION=""
PROJECT_ID=""
STATUS=""
PROGRESS=""
NEXT_MILESTONE=""
DEADLINE=""
NOTES=""
AGENT="${AGENT:-system}"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --action)
      ACTION="$2"
      shift 2
      ;;
    --project_id)
      PROJECT_ID="$2"
      shift 2
      ;;
    --status)
      STATUS="$2"
      shift 2
      ;;
    --progress)
      PROGRESS="$2"
      shift 2
      ;;
    --next_milestone)
      NEXT_MILESTONE="$2"
      shift 2
      ;;
    --deadline)
      DEADLINE="$2"
      shift 2
      ;;
    --notes)
      NOTES="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Validate action
if [ -z "$ACTION" ]; then
  echo "Error: --action is required"
  exit 1
fi

# Build JSON payload
PAYLOAD="{
  \"timestamp\": \"$TIMESTAMP\",
  \"action\": \"$ACTION\",
  \"agent\": \"$AGENT\",
  \"api_key\": \"$API_KEY\""

if [ -n "$PROJECT_ID" ]; then
  PAYLOAD+=",\"project_id\": \"$PROJECT_ID\""
fi

if [ -n "$STATUS" ]; then
  PAYLOAD+=",\"status\": \"$STATUS\""
fi

if [ -n "$PROGRESS" ]; then
  PAYLOAD+=",\"progress\": $PROGRESS"
fi

if [ -n "$NEXT_MILESTONE" ]; then
  PAYLOAD+=",\"next_milestone\": \"$NEXT_MILESTONE\""
fi

if [ -n "$DEADLINE" ]; then
  PAYLOAD+=",\"deadline\": \"$DEADLINE\""
fi

if [ -n "$NOTES" ]; then
  PAYLOAD+=",\"notes\": \"$NOTES\""
fi

PAYLOAD+="}"

# Send to dashboard API
echo "📤 Syncing to dashboard..."
echo "Action: $ACTION"
[ -n "$PROJECT_ID" ] && echo "Project: $PROJECT_ID"
[ -n "$STATUS" ] && echo "Status: $STATUS"
[ -n "$PROGRESS" ] && echo "Progress: $PROGRESS%"

RESPONSE=$(curl -s -X POST "$DASHBOARD_URL/activity" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

# Check response
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ Dashboard updated successfully"
  exit 0
else
  echo "❌ Dashboard update failed"
  echo "Response: $RESPONSE"
  # Don't fail the entire operation if dashboard is offline
  exit 0
fi
