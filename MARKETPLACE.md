# VS Code Marketplace Publishing Guide

## 🎯 Quick Start

### Option 1: Automated Script (Recommended)

```bash
# Make script executable
chmod +x scripts/publish.sh

# Publish with version bump (patch/minor/major)
./scripts/publish.sh patch
```

### Option 2: Manual Publishing

```bash
# Login first (one-time setup)
npx @vscode/vsce login andersseen

# Publish
npx @vscode/vsce publish
```

---

## 📋 Prerequisites

### 1. Create Publisher Account

1. Go to [Visual Studio Marketplace](https://marketplace.visualstudio.com/manage)
2. Sign in with Microsoft account
3. Click **"Create publisher"**
4. Enter publisher ID: `andersseen` (must match `package.json`)

### 2. Generate Personal Access Token (PAT)

1. Go to [Azure DevOps](https://dev.azure.com/)
2. Click on **User Settings** (top right) → **Personal Access Tokens**
3. Click **"+ New Token"**
4. Configure:
   - **Name**: `vscode-marketplace-publish`
   - **Organization**: All accessible organizations
   - **Expiration**: Custom (1 year recommended)
   - **Scopes**:
     - ✅ **Marketplace** → **Manage** (check this!)
5. Click **"Create"**
6. **⚠️ COPY THE TOKEN NOW** (you won't see it again!)

### 3. Store Token Securely

#### For Local Publishing:

```bash
# Login with your token
npx @vscode/vsce login andersseen
# Paste your PAT when prompted
```

#### For GitHub Actions (Automated):

1. Go to your GitHub repo: `https://github.com/andersseen/dev-toolbox`
2. Settings → Secrets and variables → Actions
3. Click **"New repository secret"**
4. Name: `VSCE_PAT`
5. Value: Paste your Personal Access Token
6. Click **"Add secret"**

---

## 🚀 Publishing Workflow

### Manual Publishing

```bash
# 1. Run tests
pnpm test

# 2. Build and package
pnpm run package

# 3. Publish (will auto-increment patch version)
npx @vscode/vsce publish

# Or specify version type
npx @vscode/vsce publish patch  # 0.0.1 → 0.0.2
npx @vscode/vsce publish minor  # 0.0.2 → 0.1.0
npx @vscode/vsce publish major  # 0.1.0 → 1.0.0

# 4. Create and push git tag
git tag v0.0.3
git push origin v0.0.3
```

### Automated Publishing (GitHub Actions)

Once you've added `VSCE_PAT` secret to GitHub:

```bash
# 1. Update version in package.json
# 2. Update CHANGELOG.md
# 3. Commit changes
git add .
git commit -m "chore: bump version to 0.0.3"
git push origin main

# 4. Create and push tag
git tag v0.0.3
git push origin v0.0.3
```

The GitHub Action will automatically:

- ✅ Run tests
- ✅ Build extension
- ✅ Publish to VS Code Marketplace
- ✅ Create GitHub Release with .vsix file

---

## 📦 What Gets Published

The extension will be available at:

- **Marketplace**: `https://marketplace.visualstudio.com/items?itemName=andersseen.dev-toolbox`
- **VS Code**: Search for "DevToolbox" in Extensions panel

Users can install with:

```bash
code --install-extension andersseen.dev-toolbox
```

---

## ✅ Verification

After publishing, verify:

1. **Marketplace Page**: Check your extension appears at the marketplace URL
2. **VS Code**: Search for your extension in the Extensions panel
3. **Install Test**: Install it in a fresh VS Code instance
4. **Version**: Confirm the version number is correct

---

## 🔧 Troubleshooting

### "Publisher not found"

- Ensure you created a publisher with ID `andersseen`
- Check `package.json` has `"publisher": "andersseen"`

### "Authentication failed"

- Your PAT may have expired
- Generate a new PAT with **Marketplace → Manage** scope
- Run `npx @vscode/vsce login andersseen` again

### "Extension already exists"

- You can't publish the same version twice
- Increment version: `npx @vscode/vsce publish patch`

### "Missing README or LICENSE"

- Ensure `README.md` exists and has content
- Add a `LICENSE` file (MIT recommended)

---

## 📝 Best Practices

1. **Always test before publishing**: `pnpm test`
2. **Update CHANGELOG.md**: Document what changed
3. **Use semantic versioning**: patch/minor/major
4. **Keep README updated**: Users see this on marketplace
5. **Add screenshots**: Visual appeal matters
6. **Set icon**: Already done with `icon.png`

---

## 🔄 Update Existing Extension

To publish an update:

```bash
# Option 1: Auto-increment
npx @vscode/vsce publish patch

# Option 2: Specific version
npx @vscode/vsce publish 0.0.4

# Option 3: Use the script
./scripts/publish.sh minor
```

Users will be notified automatically in VS Code.

---

## 📊 Analytics

View extension statistics:

1. Go to [Marketplace Management](https://marketplace.visualstudio.com/manage)
2. Click on your extension
3. View installs, ratings, and reviews
