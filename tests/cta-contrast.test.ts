import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("primary CTA contrast", () => {
  it("uses the semantic high-contrast CTA class on home and about buttons", () => {
    const home = readFileSync("app/page.tsx", "utf8");
    const about = readFileSync("app/about/page.tsx", "utf8");

    expect(home).toContain("className=\"srp-primary-cta");
    expect(about).toContain("className=\"mt-10 inline-flex srp-primary-cta");
    expect(home).not.toContain("text-[#fff8e8]");
    expect(about).not.toContain("text-[#fff8e8]");
  });
});
