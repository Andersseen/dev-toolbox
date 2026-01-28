import * as vscode from "vscode";

interface GitHubRelease {
  tag_name: string;
  html_url: string;
  name: string;
  body: string;
  published_at: string;
}

/**
 * Compares two semantic version strings
 * @returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal
 */
function compareVersions(v1: string, v2: string): number {
  const v1Parts = v1.replace(/^v/, "").split(".").map(Number);
  const v2Parts = v2.replace(/^v/, "").split(".").map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const part1 = v1Parts[i] || 0;
    const part2 = v2Parts[i] || 0;

    if (part1 > part2) {
      return 1;
    }
    if (part1 < part2) {
      return -1;
    }
  }

  return 0;
}

/**
 * Fetches the latest release from GitHub
 */
async function fetchLatestRelease(
  owner: string,
  repo: string,
): Promise<GitHubRelease | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "VSCode-DevToolbox-Extension",
        },
      },
    );

    if (!response.ok) {
      console.error(
        `GitHub API error: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const data = await response.json();
    return data as GitHubRelease;
  } catch (error) {
    console.error("Failed to fetch latest release:", error);
    return null;
  }
}

/**
 * Checks if an update is available and notifies the user
 */
export async function checkForUpdates(
  context: vscode.ExtensionContext,
  showNoUpdateMessage = false,
): Promise<void> {
  const config = vscode.workspace.getConfiguration("devtoolbox");
  const owner = config.get<string>("updateCheck.owner", "andersseen");
  const repo = config.get<string>("updateCheck.repo", "dev-toolbox");

  // Get current version from package.json
  const currentVersion =
    vscode.extensions.getExtension("andersseen.dev-toolbox")?.packageJSON
      .version || "0.0.1";

  // Fetch latest release
  const latestRelease = await fetchLatestRelease(owner, repo);

  if (!latestRelease) {
    if (showNoUpdateMessage) {
      vscode.window.showWarningMessage(
        "DevToolbox: Unable to check for updates. Please try again later.",
      );
    }
    return;
  }

  const latestVersion = latestRelease.tag_name.replace(/^v/, "");

  // Compare versions
  if (compareVersions(latestVersion, currentVersion) > 0) {
    const action = await vscode.window.showInformationMessage(
      `DevToolbox: Update available! v${latestVersion} is now available (you have v${currentVersion})`,
      "View Release",
      "Download",
      "Remind Me Later",
    );

    if (action === "View Release") {
      vscode.env.openExternal(vscode.Uri.parse(latestRelease.html_url));
    } else if (action === "Download") {
      // Find the .vsix asset in the release
      const vsixAsset = (latestRelease as any).assets?.find((asset: any) =>
        asset.name.endsWith(".vsix"),
      );

      if (vsixAsset) {
        vscode.env.openExternal(
          vscode.Uri.parse(vsixAsset.browser_download_url),
        );
        vscode.window.showInformationMessage(
          "After downloading, install the extension using: Extensions > ... > Install from VSIX",
        );
      } else {
        vscode.env.openExternal(vscode.Uri.parse(latestRelease.html_url));
      }
    }
  } else if (showNoUpdateMessage) {
    vscode.window.showInformationMessage(
      `DevToolbox: You're up to date! (v${currentVersion})`,
    );
  }
}

/**
 * Checks if enough time has passed since last update check
 */
export function shouldCheckForUpdates(
  context: vscode.ExtensionContext,
): boolean {
  const lastCheck = context.globalState.get<number>("lastUpdateCheck", 0);
  const now = Date.now();
  const oneDayInMs = 24 * 60 * 60 * 1000;

  return now - lastCheck > oneDayInMs;
}

/**
 * Updates the last update check timestamp
 */
export function updateLastCheckTimestamp(
  context: vscode.ExtensionContext,
): void {
  context.globalState.update("lastUpdateCheck", Date.now());
}
