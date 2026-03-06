import * as vscode from "vscode";
import { ToolProvider } from "./sidebar/ToolProvider";
import { removeConsoleLogs } from "./commands/removeLogs";
import { removeComments } from "./commands/removeComments";
import { pruneMergedBranches } from "./commands/pruneBranches";
import {
  showMemoryUsage,
  openProcessExplorer,
  restartExtensionHost,
} from "./commands/diagnostics";
import {
  checkForUpdates,
  shouldCheckForUpdates,
  updateLastCheckTimestamp,
} from "./utils/updateChecker";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "DevToolbox" is now active!');

  // Register Sidebar Tree Data Provider
  const toolProvider = new ToolProvider();
  const treeDataProviderDisposable = vscode.window.registerTreeDataProvider(
    "devtoolbox-sidebar",
    toolProvider,
  );

  // Check for updates on activation (rate-limited to once per day)
  if (shouldCheckForUpdates(context)) {
    checkForUpdates(context, false).then(() => {
      updateLastCheckTimestamp(context);
    });
  }

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

  const removeCommentsDisposable = vscode.commands.registerCommand(
    "devtoolbox.removeComments",
    () => {
      removeComments();
    },
  );

  const checkUpdatesDisposable = vscode.commands.registerCommand(
    "devtoolbox.checkForUpdates",
    async () => {
      await checkForUpdates(context, true);
      updateLastCheckTimestamp(context);
    },
  );

  const showMemoryDisposable = vscode.commands.registerCommand(
    "devtoolbox.showMemory",
    showMemoryUsage,
  );

  const processExplorerDisposable = vscode.commands.registerCommand(
    "devtoolbox.openProcessExplorer",
    openProcessExplorer,
  );

  const restartExtensionHostDisposable = vscode.commands.registerCommand(
    "devtoolbox.restartExtensionHost",
    restartExtensionHost,
  );

  context.subscriptions.push(
    treeDataProviderDisposable,
    removeLogsDisposable,
    pruneBranchesDisposable,
    removeCommentsDisposable,
    checkUpdatesDisposable,
    showMemoryDisposable,
    processExplorerDisposable,
    restartExtensionHostDisposable,
  );
}

export function deactivate() {}
