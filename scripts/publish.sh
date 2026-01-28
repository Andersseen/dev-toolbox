#!/bin/bash

# Script to publish DevToolbox extension to VS Code Marketplace
# Usage: ./scripts/publish.sh [patch|minor|major]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 DevToolbox Publishing Script${NC}"
echo ""

# Check if vsce is installed
if ! command -v vsce &> /dev/null; then
    echo -e "${YELLOW}Installing @vscode/vsce...${NC}"
    pnpm add -g @vscode/vsce
fi

# Get current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "Current version: ${YELLOW}v${CURRENT_VERSION}${NC}"

# Determine version bump type
BUMP_TYPE=${1:-patch}
echo -e "Bump type: ${YELLOW}${BUMP_TYPE}${NC}"

# Run tests
echo -e "\n${GREEN}Running tests...${NC}"
pnpm test

# Build the extension
echo -e "\n${GREEN}Building extension...${NC}"
pnpm run package

# Package the extension
echo -e "\n${GREEN}Packaging extension...${NC}"
vsce package --no-dependencies

# Get the new version (after vsce package might update it)
NEW_VERSION=$(node -p "require('./package.json').version")
VSIX_FILE="dev-toolbox-${NEW_VERSION}.vsix"

echo -e "\n${GREEN}✅ Extension packaged: ${VSIX_FILE}${NC}"

# Ask for confirmation to publish
echo -e "\n${YELLOW}Do you want to publish v${NEW_VERSION} to the VS Code Marketplace? (y/n)${NC}"
read -r CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo -e "${RED}❌ Publishing cancelled${NC}"
    exit 0
fi

# Publish to marketplace
echo -e "\n${GREEN}Publishing to VS Code Marketplace...${NC}"
vsce publish ${BUMP_TYPE}

# Create git tag
echo -e "\n${GREEN}Creating git tag v${NEW_VERSION}...${NC}"
git tag "v${NEW_VERSION}"

# Ask to push tag
echo -e "\n${YELLOW}Do you want to push the tag to GitHub? (y/n)${NC}"
read -r PUSH_CONFIRM

if [ "$PUSH_CONFIRM" = "y" ]; then
    git push origin "v${NEW_VERSION}"
    echo -e "\n${GREEN}✅ Tag pushed to GitHub${NC}"
    echo -e "${GREEN}GitHub Release will be created automatically${NC}"
fi

echo -e "\n${GREEN}✅ Publishing complete!${NC}"
echo -e "Version: ${YELLOW}v${NEW_VERSION}${NC}"
echo -e "VSIX: ${YELLOW}${VSIX_FILE}${NC}"
