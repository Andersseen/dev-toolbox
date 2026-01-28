# DevToolbox - Developer Utilities

[![Version](https://img.shields.io/visual-studio-marketplace/v/andersseen.dev-toolbox)](https://marketplace.visualstudio.com/items?itemName=andersseen.dev-toolbox)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/andersseen.dev-toolbox)](https://marketplace.visualstudio.com/items?itemName=andersseen.dev-toolbox)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/andersseen.dev-toolbox)](https://marketplace.visualstudio.com/items?itemName=andersseen.dev-toolbox)
[![License](https://img.shields.io/github/license/andersseen/dev-toolbox)](https://github.com/andersseen/dev-toolbox/blob/main/LICENSE)

> 🛠️ Essential utilities to boost your development productivity

DevToolbox is a lightweight VS Code extension that provides essential developer utilities right in your sidebar. Clean up your code, manage Git branches, and stay updated - all with a single click.

## ✨ Features

### 🗑️ Remove Console Logs

Instantly remove all `console.log()` statements from your active file. Perfect for cleaning up debugging code before committing.

**Usage:** Click the tool in sidebar or run `DevToolbox: Remove Console Logs` from Command Palette

### 💬 Remove Comments

Strip all comments (single-line and multi-line) from your active file. Useful for creating minified versions or cleaning up heavily commented code.

**Usage:** Click the tool in sidebar or run `DevToolbox: Remove Comments` from Command Palette

### 🌿 Prune Merged Branches

Clean up your local Git repository by removing branches that have already been merged into main/master. Keeps your branch list tidy and organized.

**Usage:** Click the tool in sidebar or run `DevToolbox: Prune Merged Branches` from Command Palette

### 🔄 Auto-Update System

- ✅ Automatically checks for updates once per day
- ✅ Notifies you when new versions are available
- ✅ One-click download from GitHub Releases
- ✅ Manual update check available

**Usage:** Run `DevToolbox: Check for Updates` from Command Palette

## 🚀 Quick Start

1. Install the extension
2. Click the **DevToolbox** icon in the Activity Bar (left sidebar)
3. Browse and click any tool to use it
4. All tools also available via Command Palette (`Cmd/Ctrl+Shift+P`)

## 📦 Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (`Cmd+Shift+X` / `Ctrl+Shift+X`)
3. Search for "DevToolbox"
4. Click Install

### From GitHub Releases

1. Download the latest `.vsix` from [Releases](https://github.com/andersseen/dev-toolbox/releases)
2. In VS Code: Extensions → `...` → Install from VSIX

## ⚙️ Configuration

Configure update checking in your VS Code settings:

```json
{
  "devtoolbox.updateCheck.owner": "andersseen",
  "devtoolbox.updateCheck.repo": "dev-toolbox"
}
```

## 📋 Requirements

- VS Code 1.108.1 or higher
- Git (for branch pruning feature)

## 🎯 Use Cases

- **Before committing**: Remove console logs and clean up comments
- **Repository maintenance**: Prune old merged branches
- **Code cleanup**: Quickly strip debugging code
- **Stay updated**: Get notified of new features and fixes

## 🐛 Known Issues

- Branch pruning requires Git to be installed and available in PATH
- Update checking requires internet connection

## 📝 Release Notes

See [CHANGELOG](https://github.com/andersseen/dev-toolbox/blob/main/CHANGELOG.md) for detailed release notes.

### Recent Updates

#### 0.0.1 - Initial Release

- ✨ Remove Console Logs tool
- ✨ Remove Comments tool
- ✨ Prune Merged Branches tool
- ✨ Auto-update system with daily checks
- 🎨 Sidebar integration with Activity Bar icon
- ⚙️ Configurable update checking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This extension is licensed under the [MIT License](https://github.com/andersseen/dev-toolbox/blob/main/LICENSE).

## 💬 Support

- 🐛 [Report a bug](https://github.com/andersseen/dev-toolbox/issues)
- 💡 [Request a feature](https://github.com/andersseen/dev-toolbox/issues)
- ⭐ [Star on GitHub](https://github.com/andersseen/dev-toolbox)

---

**Enjoy coding with DevToolbox!** 🚀
