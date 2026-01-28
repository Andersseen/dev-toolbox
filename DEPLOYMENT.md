# Deployment Guide for DevToolbox Extension

## Overview

This guide explains how to deploy and release new versions of the DevToolbox VS Code extension using GitHub Releases and automated workflows.

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to GitHub at `https://github.com/andersseen/dev-toolbox`
2. **Git**: Installed and configured locally
3. **pnpm**: Package manager (or npm/yarn)

## Release Process

### 1. Update Version and Changelog

Before creating a release, update the version number and changelog:

```bash
# Edit package.json and update the version field
# For example: "version": "0.0.2"

# Edit CHANGELOG.md and add release notes
```

**CHANGELOG.md format:**

```markdown
## [0.0.2] - 2026-01-28

### Added

- Auto-update checker that compares local version with GitHub releases
- Manual update check command
- Extension icon

### Changed

- Updated package.json with publisher and repository metadata

### Fixed

- (List any bug fixes)
```

### 2. Commit and Push Changes

```bash
git add .
git commit -m "chore: bump version to 0.0.2"
git push origin main
```

### 3. Create and Push a Version Tag

The release workflow is triggered by pushing a tag that starts with `v`:

```bash
# Create a tag matching the version in package.json
git tag v0.0.2

# Push the tag to GitHub
git push origin v0.0.2
```

### 4. Automated Release

Once the tag is pushed, GitHub Actions will automatically:

1. ✅ Checkout the code
2. ✅ Install dependencies
3. ✅ Build the extension
4. ✅ Package it into a `.vsix` file
5. ✅ Create a GitHub Release with the changelog
6. ✅ Upload the `.vsix` file as a release asset

You can monitor the progress at: `https://github.com/andersseen/dev-toolbox/actions`

### 5. Verify the Release

1. Go to `https://github.com/andersseen/dev-toolbox/releases`
2. Verify the new release appears with the correct version
3. Download the `.vsix` file to test installation
4. Install it in VS Code: `Extensions > ... > Install from VSIX`

## Manual Release (Alternative)

If you prefer to create releases manually without GitHub Actions:

```bash
# 1. Build the extension
pnpm run package

# 2. Package into .vsix
npx @vscode/vsce package

# 3. Create a GitHub release manually
# - Go to https://github.com/andersseen/dev-toolbox/releases/new
# - Create a new tag (e.g., v0.0.2)
# - Fill in the release notes
# - Upload the .vsix file
# - Publish the release
```

## Publishing to VS Code Marketplace (Optional)

If you want to publish to the official VS Code Marketplace:

### Prerequisites

1. Create a publisher account at https://marketplace.visualstudio.com/manage
2. Generate a Personal Access Token (PAT) from Azure DevOps
3. Add the PAT as a GitHub secret named `VSCE_PAT`

### Update Release Workflow

Add this step to `.github/workflows/release.yml` after packaging:

```yaml
- name: Publish to VS Code Marketplace
  run: vsce publish -p ${{ secrets.VSCE_PAT }}
```

### Manual Publish

```bash
# Login to your publisher account
npx @vscode/vsce login andersseen

# Publish the extension
npx @vscode/vsce publish
```

## Auto-Update System

Users who have the extension installed will be notified of updates through:

1. **Automatic Check**: Once per day when VS Code starts
2. **Manual Check**: Command Palette > "DevToolbox: Check for Updates"

The extension compares its local version with the latest GitHub release and shows a notification if an update is available.

## Distribution

Users can install the extension in three ways:

1. **GitHub Releases** (Current method):
   - Download `.vsix` from releases page
   - Install via VS Code: `Extensions > ... > Install from VSIX`

2. **VS Code Marketplace** (If published):
   - Search for "DevToolbox" in VS Code Extensions
   - Click Install

3. **Direct Link**:
   - Share the `.vsix` file directly
   - Users install via `code --install-extension dev-toolbox-0.0.2.vsix`

## Troubleshooting

### GitHub Actions Fails

- Check the workflow logs at `https://github.com/andersseen/dev-toolbox/actions`
- Ensure all tests pass locally: `pnpm test`
- Verify the tag format matches `v*.*.*`

### Extension Won't Install

- Ensure the `.vsix` file is not corrupted
- Check VS Code version compatibility in `package.json`
- Try: `code --install-extension path/to/extension.vsix --force`

### Update Checker Not Working

- Verify the repository URL in settings matches your GitHub repo
- Check that releases are public
- Ensure the release has a `.vsix` file attached

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backwards compatible
- **PATCH** (0.0.1): Bug fixes, backwards compatible
