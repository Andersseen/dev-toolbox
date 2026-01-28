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
    if (element) {
      return Promise.resolve([]);
    }

    return Promise.resolve([
      new ToolItem(
        "Remove Console Logs",
        "devtoolbox.removeLogs",
        new vscode.ThemeIcon("trash"),
      ),
      new ToolItem(
        "Prune Merged Branches",
        "devtoolbox.pruneBranches",
        new vscode.ThemeIcon("git-merge"),
      ),
    ]);
  }
}

class ToolItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly commandId: string,
    public readonly iconPath: vscode.ThemeIcon,
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = this.label;
    this.command = {
      command: this.commandId,
      title: this.label,
    };
  }
}
