# Changelog

All notable changes to the "DevToolbox" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-01-28

### Added

- Initial release of DevToolbox extension
- Sidebar view with developer tools
- **Remove Console Logs**: Automatically remove all console.log statements from active file
- **Remove Comments**: Remove all comments from active file
- **Prune Merged Branches**: Clean up merged Git branches
- **Auto-Update System**: Checks for updates on startup (once per day)
- **Manual Update Check**: Command to manually check for updates
- Extension icon and marketplace metadata
- GitHub Actions workflows for CI/CD and automated releases

### Features

- Automatic version checking against GitHub releases
- User notifications for available updates
- Configurable update check settings
- One-click download and installation of updates

## [Unreleased]

## [0.0.2] - 2026-02-06

### Changed

- **Prune Merged Branches**: Now uses a native QuickPick UI (checkboxes) instead of automatic deletion. Allows selecting which branches to delete.
- **Remove Console Logs**:
  - Now scans the entire workspace for logs.
  - Shows a QuickPick list to select files to clean.
  - Immediately cleans the active file.
- **Remove Comments**:
  - Now scans the entire workspace for comments.
  - Shows a QuickPick list to select files to clean.
  - Immediately cleans the active file.

## [0.0.1] - 2026-01-28
