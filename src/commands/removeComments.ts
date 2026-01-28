import * as vscode from "vscode";
import { stripComments } from "../utils/textUtils";

export async function removeComments() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("No active editor found.");
    return;
  }

  const document = editor.document;
  const text = document.getText();

  const newText = stripComments(text);

  const fullRange = new vscode.Range(
    document.positionAt(0),
    document.positionAt(text.length),
  );

  const success = await editor.edit((editBuilder) => {
    editBuilder.replace(fullRange, newText);
  });

  if (success) {
    vscode.window.showInformationMessage("Removed comments from file.");
  } else {
    vscode.window.showErrorMessage("Failed to remove comments.");
  }
}
