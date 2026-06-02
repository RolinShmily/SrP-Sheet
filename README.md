# SrP-Sheet

SrP-Sheet 是一个用于分享吉他谱例与少量 Bilibili 演示视频的静态内容站。

当前目录是给后续开发 agent 使用的项目文档包，不是已经完成的应用工程。agent 应按文档创建 Next.js 静态导出项目，并通过 Cloudflare Workers Static Assets + Wrangler CLI 部署。

## 已确定技术路线

- Framework: Next.js App Router
- Output: static export (`output: "export"`)
- Language: TypeScript
- Styling: Tailwind CSS + CSS variables
- Content: Markdown files with typed frontmatter
- Video: Bilibili iframe embeds from validated metadata
- Search/filter: client-side index generated from static content
- Deploy: Cloudflare Workers Static Assets using `wrangler.jsonc`

## 文档入口

开发 agent 必须先读：

1. `AGENTS.md`
2. `docs/00-agent-project-brief.md`
3. `docs/02-technical-architecture.md`
4. `docs/03-content-model.md`
5. `docs/04-ui-design-system.md`
6. `docs/superpowers/plans/2026-06-02-srp-sheet-implementation-plan.md`

## 第一版边界

第一版只做公开静态内容站：谱例浏览、筛选、详情、Bilibili 演示视频、关于页。不做登录、投稿、评论、后台、数据库、服务端渲染和动态 API。
