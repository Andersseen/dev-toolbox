import * as vscode from "vscode";
import * as cp from "child_process";
import * as util from "util";

const exec = util.promisify(cp.exec);

export async function removeConsoleLogs() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("No workspace open.");
    return;
  }
  const rootPath = workspaceFolders[0].uri.fsPath;
  const editor = vscode.window.activeTextEditor;

  // 1. Clean current file immediately if active
  if (editor) {
    const document = editor.document;
    const logRegex = /^.*console\.log\(.*\);?.*$/gm;
    const text = document.getText();

    // We can use WorkspaceEdit or editor.edit.
    // Using editor.edit for immediate visual feedback in the active editor is often nicer/safer for "current file" operations.
    // However, since we might also do a WorkspaceEdit later for other files, let's stick to editor.edit for the active one to be synchronous-ish and separate.

    // Actually, let's find ranges to delete
    const rangesToDelete: vscode.Range[] = [];
    let match;
    while ((match = logRegex.exec(text))) {
      const startPos = document.positionAt(match.index);
      const line = document.lineAt(startPos.line);
      rangesToDelete.push(line.rangeIncludingLineBreak);
    }

    if (rangesToDelete.length > 0) {
      await editor.edit((editBuilder) => {
        // Iterate in reverse to avoid shifting issues if we were using indices, but ranges should be fine if distinct.
        // However, standard practice is reverse for deletions.
        for (const range of rangesToDelete.reverse()) {
          editBuilder.delete(range);
        }
      });
      vscode.window.showInformationMessage(
        "Removed console.log from current file.",
      );
    } else {
      // Optional: notify if none found in current file? Maybe too noisy if checking workspace.
      // pass
    }
  }

  try {
    // 2. Find files with console.log in workspace
    // -l: only file names
    // -I: ignore binary files
    const { stdout } = await exec('git grep -l -I "console\\.log"', {
      cwd: rootPath,
    });

    let filesWithLogs = stdout
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // 3. Exclude current file from the list
    if (editor) {
      const currentFilePath = editor.document.uri.fsPath;
      filesWithLogs = filesWithLogs.filter((file) => {
        const absPath = vscode.Uri.joinPath(
          workspaceFolders[0].uri,
          file,
        ).fsPath;
        return absPath !== currentFilePath;
      });
    }

    if (filesWithLogs.length === 0) {
      if (!editor) {
        // If no editor was open and no logs found
        vscode.window.showInformationMessage(
          "No console.log statements found in workspace.",
        );
      } else {
        // If we cleaned the current file, we might just stop here if no others found.
        // But user might want to know that no *other* files have logs.
        // Let's just return silently or maybe a small info message if user explicitly ran the command?
        // Since we already showed "Removed from current file" (if applicable), we can stop.
      }
      return;
    }

    // 4. Show QuickPick to select files
    // Create items, pre-selecting all
    const items: vscode.QuickPickItem[] = filesWithLogs.map((file) => ({
      label: file,
      picked: true,
      description: "Contains console.log",
    }));

    const selectedItems = await vscode.window.showQuickPick(items, {
      canPickMany: true,
      placeHolder: "Select other files to remove console.log from",
      title: "Remove Console Logs (Workspace)",
    });

    if (!selectedItems || selectedItems.length === 0) {
      return;
    }

    // 5. Process selected files
    const edit = new vscode.WorkspaceEdit();
    const logRegex = /^.*console\.log\(.*\);?.*$/gm;

    // We process sequentially to read files.
    // For a large number of files, this might take a moment, but typically okay for dev tools.
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Removing console logs from other files...",
        cancellable: false,
      },
      async (progress) => {
        const increment = 100 / selectedItems.length;

        for (const item of selectedItems) {
          const relativePath = item.label;
          progress.report({ message: relativePath, increment });

          const uri = vscode.Uri.joinPath(
            workspaceFolders[0].uri,
            relativePath,
          );
          try {
            const document = await vscode.workspace.openTextDocument(uri);
            const text = document.getText();
            let match;
            while ((match = logRegex.exec(text))) {
              const startPos = document.positionAt(match.index);
              const line = document.lineAt(startPos.line);
              // Delete the entire line including the break
              edit.delete(uri, line.rangeIncludingLineBreak);
            }
          } catch (err) {
            console.error(`Failed to process ${relativePath}:`, err);
          }
        }
      },
    );

    // 6. Apply edits
    const success = await vscode.workspace.applyEdit(edit);
    if (success) {
      vscode.window.showInformationMessage(
        `Removed console.log from ${selectedItems.length} other files.`,
      );
    } else {
      vscode.window.showErrorMessage("Failed to apply edits.");
    }
  } catch (error: any) {
    // If git grep fails (e.g. no matches), stdout is empty or throws.
    // If we already cleaned current file, we shouldn't show "No logs found" error if it was just that git grep didn't find *others*.
    if (error.code === 1) {
      // Code 1 means no matches found.
      // This is fine.
    } else {
      vscode.window.showErrorMessage(
        `Error scanning workspace: ${error.message}`,
      );
    }
  }
}
