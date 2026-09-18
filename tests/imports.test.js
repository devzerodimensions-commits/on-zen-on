import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

/* A helper used without being imported is a plain ReferenceError at runtime.
   The bundler does not catch it — an unknown identifier is assumed to be a
   global — and neither does any test that only calls the modules directly.
   It took down every page on the site once: one template called a helper the
   file had never imported, React threw while rendering, and the whole app
   rendered nothing at all, including inside the admin's preview.

   This walks the site source and, for every name a shared module exports,
   checks that a file mentioning it also imports it. */

const sharedDirs = ["shared", "cms/shared"];
const sourceDirs = ["src", "cms/src"];

const exportedNames = async (file) => {
  const text = await readFile(file, "utf8");
  return [
    ...text.matchAll(
      /export\s+(?:async\s+)?(?:function|const|let|class)\s+([A-Za-z_$][\w$]*)/g,
    ),
  ].map((m) => m[1]);
};

const importedNames = (text) =>
  new Set(
    [...text.matchAll(/import\s+(?:[\w$]+\s*,\s*)?\{([^}]*)\}\s*from/g)]
      .flatMap((m) => m[1].split(","))
      .map((name) => name.split(" as ").pop().trim())
      .filter(Boolean)
      .concat(
        [...text.matchAll(/import\s+([\w$]+)\s+from/g)].map((m) => m[1]),
      ),
  );

test("every shared helper a source file uses is imported by it", async () => {
  const shared = new Set();
  for (const dir of sharedDirs)
    for (const entry of await readdir(dir))
      if (entry.endsWith(".js"))
        for (const name of await exportedNames(join(dir, entry)))
          shared.add(name);
  assert.ok(shared.size > 10, "found suspiciously few shared exports");

  const problems = [];
  for (const dir of sourceDirs) {
    for (const entry of await readdir(dir)) {
      if (!/\.jsx?$/.test(entry)) continue;
      const path = join(dir, entry);
      const text = await readFile(path, "utf8");
      const imported = importedNames(text);
      /* Ignore the import lines themselves when looking for usage. */
      const body = text.replace(/^import[\s\S]*?from\s*["'][^"']+["'];?$/gm, "");
      for (const name of shared) {
        if (imported.has(name)) continue;
        /* Declared locally in this file under the same name is fine. */
        if (new RegExp(`(?:function|const|let|class)\\s+${name}\\b`).test(body))
          continue;
        if (new RegExp(`\\b${name}\\s*\\(`).test(body))
          problems.push(`${path} calls ${name}() without importing it`);
      }
    }
  }
  assert.deepEqual(problems, []);
});
