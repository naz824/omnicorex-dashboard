#!/bin/bash
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
  echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
  echo -e "${RED}✗${NC} $1"
}

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Validate environment
validate_env() {
  log_info "Validating environment..."

  if [[ -z "${VERCEL_TOKEN:-}" ]]; then
    log_error "VERCEL_TOKEN environment variable is required"
    echo "Set it with: export VERCEL_TOKEN=your-token"
    return 1
  fi

  if [[ -z "${VERCEL_SCOPE:-}" ]]; then
    log_warning "VERCEL_SCOPE not set, using default scope"
  fi

  log_success "Environment validated"
}

# Build the project
build_project() {
  log_info "Building project..."

  cd "$PROJECT_ROOT" || exit 1

  if ! npm run build; then
    log_error "Build failed"
    return 1
  fi

  log_success "Build completed"
}

# Prepare dist directory
prepare_dist() {
  log_info "Preparing dist directory..."

  # Copy vercel.json to dist/
  if [[ -f "${PROJECT_ROOT}/vercel.json" ]]; then
    cp "${PROJECT_ROOT}/vercel.json" "${PROJECT_ROOT}/dist/"
    log_success "Copied vercel.json to dist/"
  else
    log_warning "vercel.json not found in project root"
  fi

  # Create .vercel directory in dist if it doesn't exist
  mkdir -p "${PROJECT_ROOT}/dist/.vercel"

  # Copy .vercel/project.json to dist/.vercel/
  if [[ -f "${PROJECT_ROOT}/.vercel/project.json" ]]; then
    cp "${PROJECT_ROOT}/.vercel/project.json" "${PROJECT_ROOT}/dist/.vercel/"
    log_success "Copied .vercel/project.json to dist/.vercel/"
  else
    log_warning ".vercel/project.json not found"
  fi
}

# Deploy to Vercel
deploy_to_vercel() {
  log_info "Deploying to Vercel (production)..."

  cd "${PROJECT_ROOT}/dist" || exit 1

  local vercel_args="--prod --yes"

  if [[ -n "${VERCEL_SCOPE:-}" ]]; then
    vercel_args="$vercel_args --scope ${VERCEL_SCOPE}"
  fi

  # Ensure VERCEL_TOKEN is in environment
  export VERCEL_TOKEN="${VERCEL_TOKEN}"

  if ! npx vercel deploy $vercel_args; then
    log_error "Vercel deployment failed"
    return 1
  fi

  log_success "Deployed to Vercel"
}

# Print deployment summary
print_summary() {
  echo ""
  echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}✓ Vercel Deployment Complete!${NC}"
  echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
  echo ""
  echo "Deployment details:"
  echo "  Project root: $PROJECT_ROOT"
  echo "  Build output: ${PROJECT_ROOT}/dist"
  if [[ -n "${VERCEL_SCOPE:-}" ]]; then
    echo "  Vercel scope: $VERCEL_SCOPE"
  fi
  echo ""
  echo "Next steps:"
  echo "1. Visit your Vercel dashboard to monitor the deployment"
  echo "2. Check deployment logs: vercel logs"
  echo "3. View live site in Vercel dashboard"
  echo ""
  echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
  echo ""
}

# Main execution
main() {
  echo ""
  echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}Vercel Deployment Script${NC}"
  echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
  echo ""

  validate_env || exit 1
  build_project || exit 1
  prepare_dist || exit 1
  deploy_to_vercel || exit 1
  print_summary
}

main "$@"
