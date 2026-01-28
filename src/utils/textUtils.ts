/**
 * Removes comments from the given text while preserving strings.
 * @param text The text to process
 * @returns Text with comments removed
 */
export function stripComments(text: string): string {
  // Regex to remove comments:
  // 1. Single line comments: // ... (handles potential lack of newline at file end)
  // 2. Multi-line comments: /* ... */

  // Regex that respects strings:
  // /((["'])(?:\\.|[^\\\n])*?\2)|(\/\*[\s\S]*?\*\/|\/\/.*)/g
  // If group 1 exists (string), we keep it. If group 3 exists (comment), we replace with empty.

  const betterRegex = /((["'])(?:\\.|[^\\\n])*?\2)|(\/\*[\s\S]*?\*\/|\/\/.*)/g;

  return text.replace(
    betterRegex,
    (match, stringGroup, quote, commentGroup) => {
      if (stringGroup) {
        return stringGroup; // Keep strings as is
      }
      // If it's a comment group, replace with empty string
      return "";
    },
  );
}
