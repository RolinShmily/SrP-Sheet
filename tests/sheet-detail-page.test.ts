import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("sheet detail page body rendering", () => {
  it("does not render Markdown body content by default", () => {
    const source = readFileSync("app/sheets/[slug]/page.tsx", "utf8");

    expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toContain("sheet-prose");
  });
});
