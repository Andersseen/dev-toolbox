import * as assert from "assert";
import { stripComments } from "../utils/textUtils";

suite("Remove Comments Logic Test Suite", () => {
  test("Removes single line comments", () => {
    const input = "const a = 1; // comment";
    const expected = "const a = 1; ";
    assert.strictEqual(stripComments(input), expected);
  });

  test("Removes multi-line comments", () => {
    const input = "const a = 1; /* comment \n continued */";
    const expected = "const a = 1; ";
    assert.strictEqual(stripComments(input), expected);
  });

  test("Preserves strings with comment-like content", () => {
    const input = 'const s = "// not a comment";';
    const expected = 'const s = "// not a comment";';
    assert.strictEqual(stripComments(input), expected);
  });

  test("Preserves strings with multi-line comment-like content", () => {
    const input = 'const s = "/* not a comment */";';
    const expected = 'const s = "/* not a comment */";';
    assert.strictEqual(stripComments(input), expected);
  });

  test("Mixed content", () => {
    const input = `
            const a = 1; // line comment
            /* block comment */
            const b = "string // kept";
        `;
    // Note: The newline after block comment might remain depending on implementation
    // stripComments replaces match with "" so it eats the comment characters.
    // It does NOT eat the preceding or following whitespace/newline unless matched.
    assert.ok(!stripComments(input).includes("line comment"));
    assert.ok(!stripComments(input).includes("block comment"));
    assert.ok(stripComments(input).includes('const b = "string // kept";'));
  });
});
