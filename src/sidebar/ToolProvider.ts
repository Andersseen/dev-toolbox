import * as vscode from "vscode";

export class ToolProvider implements vscode.TreeDataProvider<ToolItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    ToolItem | undefined | null | void
  > = new vscode.EventEmitter<ToolItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    ToolItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  getTreeItem(element: ToolItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ToolItem): Thenable<ToolItem[]> {
    if (!element) {
      // Root level (Categories)
      return Promise.resolve([
        new ToolItem(
          "🧰 Code Utilities",
          undefined,
          undefined,
          vscode.TreeItemCollapsibleState.Expanded,
        ),
        new ToolItem(
          "💻 System & Diagnostics",
          undefined,
          undefined,
          vscode.TreeItemCollapsibleState.Expanded,
        ),
      ]);
    }

    if (element.label === "🧰 Code Utilities") {
      return Promise.resolve([
        new ToolItem(
          "Remove Console Logs",
          "devtoolbox.removeLogs",
          new vscode.ThemeIcon("trash"),
          vscode.TreeItemCollapsibleState.None,
        ),
        new ToolItem(
          "Prune Merged Branches",
          "devtoolbox.pruneBranches",
          new vscode.ThemeIcon("git-merge"),
          vscode.TreeItemCollapsibleState.None,
        ),
        new ToolItem(
          "Remove Comments",
          "devtoolbox.removeComments",
          new vscode.ThemeIcon("comment"),
          vscode.TreeItemCollapsibleState.None,
        ),
      ]);
    }

    if (element.label === "💻 System & Diagnostics") {
      return Promise.resolve([
        new ToolItem(
          "Extension Host Memory",
          "devtoolbox.showMemory",
          new vscode.ThemeIcon("pulse"),
          vscode.TreeItemCollapsibleState.None,
        ),
        new ToolItem(
          "Open Process Explorer",
          "devtoolbox.openProcessExplorer",
          new vscode.ThemeIcon("server-process"),
          vscode.TreeItemCollapsibleState.None,
        ),
        new ToolItem(
          "Restart Extension Host",
          "devtoolbox.restartExtensionHost",
          new vscode.ThemeIcon("refresh"),
          vscode.TreeItemCollapsibleState.None,
        ),
      ]);
    }

    return Promise.resolve([]);
  }
}

class ToolItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly commandId?: string,
    public readonly iconPath?: vscode.ThemeIcon,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.None,
  ) {
    super(label, collapsibleState);

    if (this.commandId) {
      this.tooltip = this.label;
      this.command = {
        command: this.commandId,
        title: this.label,
      };
    }
  }
}
