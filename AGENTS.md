# AGENTS.md

本文件是 SrP-Sheet 工程的 agent 开发契约。任何开发 agent 在动手前必须阅读本文件和 `docs/` 下的项目文档。

## 项目目标

SrP-Sheet 是一个静态导出的 Next.js 内容站，用于分享吉他谱例和少量 Bilibili 演示视频。第一版必须优先保证内容可维护、页面有设计感、构建可静态导出、可通过 Wrangler 部署到 Cloudflare Workers Static Assets。

## 硬性技术约束

- 必须使用 Next.js App Router。
- 必须使用 TypeScript。
- 必须配置 `next.config.ts` 或 `next.config.mjs`：`output: "export"`。
- 必须通过 `wrangler.jsonc` 部署 `out/` 静态导出产物到 Cloudflare Workers Static Assets。
- 必须使用 Markdown 内容文件维护谱例，不允许把谱例数据硬编码在页面组件里。
- 必须使用结构化 frontmatter，并用 Zod 在构建期校验。
- Bilibili 视频必须从结构化 bvid/page/start metadata 生成 iframe src，不允许在内容文件中直接粘贴任意 iframe HTML。
- 静态导出第一版不允许使用数据库、登录、投稿、评论、后台、Server Actions、需要 Request 的 Route Handlers、ISR、cookies、rewrites、redirects、headers 或默认 Next Image Optimization。
- 动态路由必须实现 `generateStaticParams()`。
- 客户端搜索和筛选必须只依赖构建期生成的静态数据。

## 设计约束

界面必须有明确设计方向，不能做默认模板感页面。设计方向见 `docs/04-ui-design-system.md`。

关键词：谱纸、工作室、木质乐器、编辑感、清爽但不普通。避免通用紫色渐变、默认卡片堆叠、无个性的 SaaS 风。

## 内容边界

第一版内容类型：

- 谱例列表
- 谱例详情
- Bilibili 演示视频嵌入
- 标签和难度筛选
- 关于页

第一版不做：

- 用户账号
- 投稿和审核
- 评论
- 收藏
- 在线编辑器
- 支付
- 需要服务端运行时的 API

## 质量要求

开发完成前必须运行并通过：

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build`
- `pnpm start:static` 本地预览 Wrangler 静态产物

如果实现 agent 新增或修改了内容解析、视频嵌入、搜索筛选逻辑，必须补对应测试。测试必须验证行为，不允许只测试默认文案。

## 推荐阅读顺序

1. `docs/00-agent-project-brief.md`
2. `docs/01-product-requirements.md`
3. `docs/02-technical-architecture.md`
4. `docs/03-content-model.md`
5. `docs/04-ui-design-system.md`
6. `docs/05-page-and-component-spec.md`
7. `docs/06-deployment-and-ops.md`
8. `docs/07-quality-and-acceptance.md`
9. `docs/superpowers/plans/2026-06-02-srp-sheet-implementation-plan.md`
