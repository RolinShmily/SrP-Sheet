import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AboutPage from "@/app/about/page";
import { SiteHeader } from "@/components/site-header";

const socialLinks = [
  { label: "博客", href: "https://blog.srprolin.top" },
  { label: "Bilibili", href: "https://space.bilibili.com/422744280" },
  { label: "个人主页", href: "https://www.srprolin.top" }
] as const;

describe("social links", () => {
  it("renders external social links in the navigation", () => {
    const html = renderToStaticMarkup(<SiteHeader />);

    for (const link of socialLinks) {
      expect(html).toContain(`href="${link.href}"`);
      expect(html).toContain(`aria-label="${link.label}"`);
    }

    expect(html).toContain("target=\"_blank\"");
    expect(html).toContain("rel=\"noreferrer\"");
    expect(html).toContain("/assets/social/bilibili.svg");
    expect(html).toContain("/assets/social/blog-solid-full.svg");
    expect(html).toContain("https://www.srprolin.top/assets/avatar.jpg");
  });

  it("renders a contact section on the about page", () => {
    const html = renderToStaticMarkup(<AboutPage />);

    expect(html).toContain("找到我");
    for (const link of socialLinks) {
      expect(html).toContain(link.label);
      expect(html).toContain(`href="${link.href}"`);
    }
  });

  it("keeps local social svg assets in public assets", () => {
    expect(existsSync("public/assets/social/bilibili.svg")).toBe(true);
    expect(existsSync("public/assets/social/blog-solid-full.svg")).toBe(true);
  });
});
