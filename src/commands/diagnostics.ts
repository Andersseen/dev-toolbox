import * as vscode from "vscode";

export async function showMemoryUsage() {
  const memoryData = process.memoryUsage();

  // Convert from bytes to MB
  const toMB = (bytes: number) => (bytes / 1024 / 1024).toFixed(2);

  const rss = toMB(memoryData.rss);
  const heapTotal = toMB(memoryData.heapTotal);
  const heapUsed = toMB(memoryData.heapUsed);

  const message = `🧠 Extension Host Memory:
• Total Process (RSS): ${rss} MB
• V8 Heap Limit: ${heapTotal} MB
• V8 Heap Used: ${heapUsed} MB`;

  vscode.window.showInformationMessage(message, { modal: false });
}

export async function openProcessExplorer() {
  // Execute the internal VS Code command to open its process explorer
  await vscode.commands.executeCommand("workbench.action.openProcessExplorer");
}

export async function restartExtensionHost() {
  const action = await vscode.window.showWarningMessage(
    "Are you sure you want to restart the Extension Host? This will forcefully clear the memory of all running extensions (Sonar, ESLint, Git, etc).",
    { modal: true },
    "Restart Now",
  );

  if (action === "Restart Now") {
    await vscode.commands.executeCommand(
      "workbench.action.restartExtensionHost",
    );
  }
}
