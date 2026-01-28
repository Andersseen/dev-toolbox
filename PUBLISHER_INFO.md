# VS Code Marketplace Publisher Information

## Publisher Details

When creating your publisher account at https://marketplace.visualstudio.com/manage, use:

- **Publisher ID**: `andersseen`
- **Publisher Display Name**: `Andersseen`
- **Publisher Description**: `Developer creating productivity tools and utilities for VS Code`

## Extension Information

The following information is already configured in `package.json`:

### Basic Info

- **Extension ID**: `andersseen.dev-toolbox`
- **Display Name**: DevToolbox - Developer Utilities
- **Short Description**: Essential developer utilities: remove logs, clean code, prune branches
- **Version**: 0.0.1
- **License**: MIT

### Categories

- Other
- Formatters
- Linters
- SCM Providers

### Keywords/Tags

- developer tools
- productivity
- utilities
- code cleanup
- remove console
- remove comments
- git branches
- code formatter
- developer productivity
- workspace tools

### Links

- **Repository**: https://github.com/andersseen/dev-toolbox
- **Issues**: https://github.com/andersseen/dev-toolbox/issues
- **Homepage**: https://github.com/andersseen/dev-toolbox#readme

## Marketplace Listing Checklist

✅ **Required Files**

- [x] package.json (with all metadata)
- [x] README.md (with badges and features)
- [x] CHANGELOG.md (version history)
- [x] LICENSE (MIT License)
- [x] icon.png (extension icon)

✅ **Metadata**

- [x] Display name
- [x] Description
- [x] Categories
- [x] Keywords
- [x] Repository URL
- [x] License

✅ **Documentation**

- [x] Feature descriptions
- [x] Installation instructions
- [x] Usage examples
- [x] Configuration options
- [x] Known issues
- [x] Support links

## Publishing Checklist

Before publishing to the marketplace:

1. ✅ Create publisher account
2. ✅ Generate Personal Access Token (PAT)
3. ✅ Add PAT to GitHub secrets as `VSCE_PAT`
4. ✅ Test extension locally
5. ✅ Verify all files are included
6. ✅ Update version in package.json
7. ✅ Update CHANGELOG.md
8. ✅ Create git tag and push

## After Publishing

Your extension will be available at:

- **Marketplace URL**: https://marketplace.visualstudio.com/items?itemName=andersseen.dev-toolbox
- **Install Command**: `code --install-extension andersseen.dev-toolbox`

## Updating the Extension

To publish updates:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit changes
4. Create and push tag: `git tag v0.0.2 && git push origin v0.0.2`
5. GitHub Actions will automatically publish

## Marketing Tips

To increase visibility:

1. **Add screenshots** showing the extension in action
2. **Create a demo GIF** of key features
3. **Share on social media** (Twitter, Reddit, Dev.to)
4. **Write a blog post** about the extension
5. **Respond to user reviews** and feedback
6. **Keep it updated** with regular releases

## Support

For help with publishing:

- [VS Code Publishing Guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Marketplace Management](https://marketplace.visualstudio.com/manage)
- [Azure DevOps PAT](https://dev.azure.com/)
