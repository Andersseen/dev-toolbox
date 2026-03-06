import * as vscode from "vscode";
import * as cp from "child_process";
import * as util from "util";

const exec = util.promisify(cp.exec);

export async function killPort() {
  const portInput = await vscode.window.showInputBox({
    prompt: "Enter the port number to kill (e.g. 3000, 4200)",
    placeHolder: "3000",
    validateInput: (value) => {
      const port = parseInt(value, 10);
      if (isNaN(port) || port <= 0 || port > 65535) {
        return "Please enter a valid port number (1-65535)";
      }
      return null;
    },
  });

  if (!portInput) {
    return; // Cancelled
  }

  const port = parseInt(portInput, 10);
  const isWindows = process.platform === "win32";

  try {
    let pid = "";
    let processName = "Unknown";

    if (isWindows) {
      // Find PID on Windows
      const { stdout } = await exec(`netstat -ano | findstr :${port}`);
      if (!stdout) throw new Error("No output");

      const lines = stdout.split("\n");
      for (const line of lines) {
        if (line.includes(`:${port}`)) {
          const parts = line.trim().split(/\s+/);
          pid = parts[parts.length - 1];
          break;
        }
      }
    } else {
      // Find PID on Mac/Linux using lsof
      try {
        const { stdout } = await exec(`lsof -i :${port} -t`);
        pid = stdout.trim().split("\n")[0]; // Get the first PID if multiple
      } catch (err) {
        // lsof exits with 1 if nothing is found
      }
    }

    if (!pid) {
      vscode.window.showInformationMessage(
        `Port ${port} is currently free. No process to kill.`,
      );
      return;
    }

    // Confirm before killing
    const action = await vscode.window.showWarningMessage(
      `Port ${port} is occupied by process PID: ${pid}. Do you want to forcefully terminate it?`,
      { modal: true },
      "Kill Process",
    );

    if (action !== "Kill Process") {
      return;
    }

    // Kill the process
    if (isWindows) {
      await exec(`taskkill /PID ${pid} /F`);
    } else {
      await exec(`kill -9 ${pid}`);
    }

    vscode.window.showInformationMessage(
      `Successfully killed process ${pid} on port ${port}.`,
    );
  } catch (error: any) {
    if (error.message.includes("lsof") || error.message.includes("findstr")) {
      vscode.window.showInformationMessage(
        `Port ${port} seems to be free or cannot be checked.`,
      );
    } else {
      vscode.window.showErrorMessage(
        `Failed to kill process on port ${port}: ${error.message}`,
      );
    }
  }
}
