import * as vscode from "vscode";
import * as cp from "child_process";
import * as util from "util";
import { stripComments } from "../utils/textUtils";

const exec = util.promisify(cp.exec);

export async function removeComments() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("No workspace open.");
    return;
  }
  const rootPath = workspaceFolders[0].uri.fsPath;
  const editor = vscode.window.activeTextEditor;

  // 1. Clean current file immediately
  if (editor) {
    const document = editor.document;
    const text = document.getText();
    const newText = stripComments(text);

    // Limit replacement range to the whole document
    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(text.length),
    );

    await editor.edit((editBuilder) => {
      editBuilder.replace(fullRange, newText);
    });

    vscode.window.showInformationMessage("Removed comments from current file.");
  }

  try {
    // 2. Find files with comments // or /*
    // git grep -E "(\/\/|\/\*)" -l -I
    const { stdout } = await exec('git grep -l -I -E "(\\/\\/|\\/\\*)"', {
      cwd: rootPath,
    });

    let filesWithComments = stdout
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // 3. Exclude current file
    if (editor) {
      const currentFilePath = editor.document.uri.fsPath;
      filesWithComments = filesWithComments.filter((file) => {
        const absPath = vscode.Uri.joinPath(
          workspaceFolders[0].uri,
          file,
        ).fsPath;
        return absPath !== currentFilePath;
      });
    }

    if (filesWithComments.length === 0) {
      if (!editor) {
        vscode.window.showInformationMessage("No comments found in workspace.");
      }
      return;
    }

    // 4. Show QuickPick
    const items: vscode.QuickPickItem[] = filesWithComments.map((file) => ({
      label: file,
      picked: true,
      description: "Contains comments",
    }));

    const selectedItems = await vscode.window.showQuickPick(items, {
      canPickMany: true,
      placeHolder: "Select other files to remove comments from",
      title: "Remove Comments (Workspace)",
    });

    if (!selectedItems || selectedItems.length === 0) {
      return;
    }

    // 5. Process selected files
    const edit = new vscode.WorkspaceEdit();

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Removing comments from other files...",
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
            const newText = stripComments(text);

            // Limit replacement range to the whole document
            const fullRange = new vscode.Range(
              document.positionAt(0),
              document.positionAt(text.length),
            );

            edit.replace(uri, fullRange, newText);
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
        `Removed comments from ${selectedItems.length} other files.`,
      );
    } else {
      vscode.window.showErrorMessage("Failed to apply edits.");
    }
  } catch (error: any) {
    if (error.code === 1) {
      // No matches found
    } else {
      vscode.window.showErrorMessage(
        `Error scanning workspace: ${error.message}`,
      );
    }
  }
}
