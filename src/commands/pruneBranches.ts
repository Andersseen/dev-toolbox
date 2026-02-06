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
    // 1. Get all local branches
    const { stdout: allBranchesOut } = await exec("git branch", {
      cwd: rootPath,
    });
    const allBranches = allBranchesOut
      .split("\n")
      .map((b) => b.trim())
      .filter((b) => b);

    // 2. Get merged branches
    const { stdout: mergedBranchesOut } = await exec("git branch --merged", {
      cwd: rootPath,
    });
    const mergedBranches = new Set(
      mergedBranchesOut
        .split("\n")
        .map((b) => b.trim())
        .filter((b) => b),
    );

    // 3. Create QuickPick items
    const items: vscode.QuickPickItem[] = [];
    for (const branch of allBranches) {
      // Clean branch name (remove * for current branch)
      const isCurrent = branch.startsWith("*");
      const branchName = branch.replace("*", "").trim();

      // Skip main/master/custom protected branches and current branch
      if (
        isCurrent ||
        branchName === "main" ||
        branchName === "master" ||
        branchName === "dev" ||
        branchName === "development"
      ) {
        continue;
      }

      const isMerged = mergedBranches.has(branchName);
      items.push({
        label: branchName,
        description: isMerged ? "Merged" : "Not Merged",
        picked: isMerged, // Pre-select if merged
      });
    }

    if (items.length === 0) {
      vscode.window.showInformationMessage(
        "No branches available to prune (excluding current and protected branches).",
      );
      return;
    }

    // 4. Show QuickPick
    const selected = await vscode.window.showQuickPick(items, {
      canPickMany: true,
      placeHolder:
        "Select branches to delete (Merged branches are pre-selected)",
      title: "Prune Branches",
    });

    if (!selected || selected.length === 0) {
      return;
    }

    // 5. Delete selected branches
    const branchesToDelete = selected.map((item) => item.label);
    const branchList = branchesToDelete.join(" ");

    // Using -D (force delete) because the user explicitly selected these branches for deletion.
    await exec(`git branch -D ${branchList}`, { cwd: rootPath });

    vscode.window.showInformationMessage(
      `Deleted ${branchesToDelete.length} branches: ${branchList}`,
    );
  } catch (error: any) {
    vscode.window.showErrorMessage(
      `Failed to prune branches: ${error.message}`,
    );
  }
}
