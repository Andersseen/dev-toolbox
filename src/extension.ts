import * as vscode from "vscode";
import { ToolProvider } from "./sidebar/ToolProvider";
import { removeConsoleLogs } from "./commands/removeLogs";
import { pruneMergedBranches } from "./commands/pruneBranches";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "DevToolbox" is now active!');

  // Register Sidebar Tree Data Provider
  const toolProvider = new ToolProvider();
  vscode.window.registerTreeDataProvider("devtoolbox-sidebar", toolProvider);

  // Register Commands
  const removeLogsDisposable = vscode.commands.registerCommand(
    "devtoolbox.removeLogs",
    () => {
      removeConsoleLogs();
    },
  );

  const pruneBranchesDisposable = vscode.commands.registerCommand(
    "devtoolbox.pruneBranches",
    () => {
      pruneMergedBranches();
    },
  );

  context.subscriptions.push(removeLogsDisposable, pruneBranchesDisposable);
}

export function deactivate() {}
