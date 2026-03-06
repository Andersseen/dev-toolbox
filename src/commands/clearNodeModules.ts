import * as vscode from "vscode";
import * as cp from "child_process";
import * as util from "util";
import * as fs from "fs";
import * as path from "path";

const exec = util.promisify(cp.exec);

export async function clearNodeModules() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("No workspace open.");
    return;
  }

  const rootPath = workspaceFolders[0].uri.fsPath;

  // Confirm action
  const action = await vscode.window.showWarningMessage(
    "This will delete your node_modules folder and lockfile, then do a fresh install. Continue?",
    { modal: true },
    "Yes, clear and install",
  );

  if (action !== "Yes, clear and install") {
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Clearing node_modules...",
      cancellable: false,
    },
    async (progress) => {
      // 1. Detect Package Manager
      let pm = "npm";
      let lockfile = "package-lock.json";

      if (fs.existsSync(path.join(rootPath, "pnpm-lock.yaml"))) {
        pm = "pnpm";
        lockfile = "pnpm-lock.yaml";
      } else if (fs.existsSync(path.join(rootPath, "yarn.lock"))) {
        pm = "yarn";
        lockfile = "yarn.lock";
      } else if (fs.existsSync(path.join(rootPath, "package-lock.json"))) {
        pm = "npm";
        lockfile = "package-lock.json";
      }

      const isWindows = process.platform === "win32";

      try {
        // 2. Delete node_modules and lockfile
        progress.report({
          message: `Deleting node_modules and ${lockfile}...`,
        });

        let deleteCommand = "";
        if (isWindows) {
          // In CMD/Powershell usually rmdir or del
          deleteCommand = `if exist node_modules rmdir /s /q node_modules & if exist ${lockfile} del /f /q ${lockfile}`;
        } else {
          deleteCommand = `rm -rf node_modules ${lockfile}`;
        }

        await exec(deleteCommand, { cwd: rootPath });

        // 3. Reinstall dependencies
        progress.report({
          message: `Reinstalling via ${pm} install... (this might take a while)`,
        });
        await exec(`${pm} install`, { cwd: rootPath });

        vscode.window.showInformationMessage(
          `Successfully cleared node_modules and reinstalled using ${pm}.`,
        );
      } catch (error: any) {
        vscode.window.showErrorMessage(
          `Error during operation: ${error.message}`,
        );
      }
    },
  );
}
