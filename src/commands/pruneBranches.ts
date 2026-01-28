import * as vscode from "vscode";
import * as cp from "child_process";
import * as util from "util";

const exec = util.promisify(cp.exec);

export async function pruneMergedBranches() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("No workspace open. Cannot prune branches.");
    return;
  }

  const rootPath = workspaceFolders[0].uri.fsPath;

  try {
    vscode.window.showInformationMessage("Pruning merged branches...");

    // 1. Get merged branches
    // --merged implies HEAD if not specified, which is current branch.
    // We want branches merged into current branch.
    const { stdout } = await exec("git branch --merged", { cwd: rootPath });

    const lines = stdout.split("\n");
    const branchesToDelete: string[] = [];

    // 2. Filter branches
    for (const line of lines) {
      const branch = line.trim();
      // Skip empty lines
      if (!branch) {
        continue;
      }
      // Skip current branch (marked with *)
      if (branch.startsWith("*")) {
        continue;
      }
      // Skip main/master/custom protected branches
      if (
        branch === "main" ||
        branch === "master" ||
        branch === "dev" ||
        branch === "development"
      ) {
        continue;
      }

      branchesToDelete.push(branch);
    }

    if (branchesToDelete.length === 0) {
      vscode.window.showInformationMessage("No merged branches to delete.");
      return;
    }

    // 3. Delete branches
    // We can do this in one command or loop. One command is safer/faster for many: git branch -d b1 b2 b3
    const branchList = branchesToDelete.join(" ");
    await exec(`git branch -d ${branchList}`, { cwd: rootPath });

    vscode.window.showInformationMessage(
      `Deleted ${branchesToDelete.length} branches: ${branchList}`,
    );
  } catch (error: any) {
    vscode.window.showErrorMessage(
      `Failed to prune branches: ${error.message}`,
    );
  }
}
