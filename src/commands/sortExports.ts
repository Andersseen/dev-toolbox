import * as vscode from "vscode";

interface ExportLine {
  originalText: string;
  type: "named" | "wildcard" | "other";
  pathString?: string;
  content?: string;
}

export async function sortExports() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found to sort exports.");
    return;
  }

  const document = editor.document;
  const text = document.getText();
  const lines = text.split("\n");

  const exportRegexTemplate =
    /export\s+(?:\{([^}]+)\}|\*)\s+from\s+['"]([^'"]+)['"]\s*;?/g;

  let hasChanges = false;
  let linesProcessed = 0;

  // We will simply group all full export lines, sort them, and place them at the top.
  // Other lines (comments, imports) will go below.
  const namedExports: ExportLine[] = [];
  const wildcardExports: ExportLine[] = [];
  const otherLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      // keep empty lines as other, we can filter them out later or compress them.
      otherLines.push(line);
      continue;
    }

    // Reset regex index
    exportRegexTemplate.lastIndex = 0;
    const match = exportRegexTemplate.exec(line);

    if (match) {
      const isNamed = !!match[1];
      const content = match[1] ? match[1].trim() : "";
      const pathString = match[2];

      if (isNamed) {
        // Sort the content inside the {}
        const sortedContent = content
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
          .sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: "base" }),
          )
          .join(", ");

        namedExports.push({
          originalText: `export { ${sortedContent} } from '${pathString}';`,
          type: "named",
          pathString,
          content: sortedContent,
        });
      } else {
        // Wildcard
        wildcardExports.push({
          originalText: `export * from '${pathString}';`,
          type: "wildcard",
          pathString,
        });
      }
      hasChanges = true;
      linesProcessed++;
    } else {
      otherLines.push(line);
    }
  }

  if (!hasChanges) {
    vscode.window.showInformationMessage("No export statements found to sort.");
    return;
  }

  // Sort named exports by path
  namedExports.sort((a, b) => {
    return (a.pathString || "").localeCompare(b.pathString || "", undefined, {
      sensitivity: "base",
    });
  });

  // Sort wildcard exports by path
  wildcardExports.sort((a, b) => {
    return (a.pathString || "").localeCompare(b.pathString || "", undefined, {
      sensitivity: "base",
    });
  });

  // Reconstruct file
  const newLines: string[] = [];

  if (namedExports.length > 0) {
    namedExports.forEach((ex) => newLines.push(ex.originalText));
  }

  if (wildcardExports.length > 0) {
    wildcardExports.forEach((ex) => newLines.push(ex.originalText));
  }

  // Append other lines (excluding consecutive empty lines at the start)
  let firstRealLine = false;
  for (const line of otherLines) {
    if (line.trim().length > 0) {
      firstRealLine = true;
    }
    if (firstRealLine) {
      newLines.push(line);
    }
  }

  const newText = newLines.join("\n");

  if (newText !== text) {
    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(text.length),
    );

    await editor.edit((editBuilder) => {
      editBuilder.replace(fullRange, newText);
    });

    // Auto save
    await document.save();

    vscode.window.showInformationMessage(
      `Sorted ${linesProcessed} export statements.`,
    );
  } else {
    vscode.window.showInformationMessage(
      "Exports are already sorted perfectly.",
    );
  }
}
