import * as vscode from "vscode";

export async function removeConsoleLogs() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("No active editor found.");
    return;
  }

  const document = editor.document;
  const text = document.getText();
  // Regex to match console.log statements.
  // Matches: console.log(...) or console.log(...);
  // Handles optional whitespace around arguments.
  // This simple regex assumes the log is on a single line as per MVP requirements.
  const logRegex = /^.*console\.log\(.*\);?.*$/gm;

  const edits: vscode.TextEdit[] = [];
  let match;
  while ((match = logRegex.exec(text))) {
    // Create a range for the whole line including the newline if possible
    // Ideally we want to delete the whole line.
    const startPos = document.positionAt(match.index);
    const endPos = document.positionAt(match.index + match[0].length);

    const line = document.lineAt(startPos.line);
    edits.push(vscode.TextEdit.delete(line.rangeIncludingLineBreak));
  }

  if (edits.length === 0) {
    vscode.window.showInformationMessage("No console.log statements found.");
    return;
  }

  // Use edit builder to apply edits
  const success = await editor.edit((editBuilder) => {
    // We need to apply edits in reverse order or be careful about ranges shifting?
    // editor.edit handles coordinate mapping if we provide valid Ranges.
    // However, simple way is just iterating.
    // But wait, if we delete lines, subsequent lines shift up.
    // Actually, TextEditorEdit allows us to make multiple edits at once.
    // But typically for full document search & replace, workspaceEdit might be better or just careful loop.

    // Simpler approach: iterate lines of the document and delete matching ones.
    for (let i = document.lineCount - 1; i >= 0; i--) {
      const line = document.lineAt(i);
      if (line.text.match(/console\.log\(.*\)/)) {
        editBuilder.delete(line.rangeIncludingLineBreak);
      }
    }
  });

  if (success) {
    vscode.window.showInformationMessage("Removed console.log statements.");
  } else {
    vscode.window.showErrorMessage("Failed to remove console.log statements.");
  }
}
