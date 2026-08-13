import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("project scaffold", () => {
  it("defines required npm scripts", () => {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    expect(pkg.scripts.dev).toBe("next dev");
    expect(pkg.scripts.build).toBe("next build");
    expect(pkg.scripts.test).toBe("vitest run");
    expect(pkg.scripts["test:e2e"]).toBe("playwright test");
    expect(pkg.scripts.lint).toBe("eslint .");
  });
});
