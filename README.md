# SrP-Sheet

SrP-Sheet 是一个静态导出的 Next.js 吉他谱例站，用来整理 PDF 谱例、PNG 预览图和少量 Bilibili 演示视频。站点定位是轻量、可维护、有编辑感的谱例索引：内容通过 Markdown 维护，构建期校验 metadata，最终导出为静态文件并由 Cloudflare Workers Static Assets 托管。

## 当前功能

- 谱例列表与详情页
- 客户端搜索、类型筛选、调弦筛选、附件筛选
- PDF 下载与 PNG 谱例预览
- Bilibili 播放器嵌入，iframe 地址由结构化 metadata 生成
- 关于页与站外链接入口
- 静态导出部署到 Cloudflare Workers Static Assets

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS + CSS variables
- Markdown frontmatter 内容文件
- Zod 构建期 schema 校验
- Vitest 单元测试
- Wrangler / Cloudflare Workers Static Assets

关键约束：

- `next.config.ts` 使用 `output: "export"`
- 动态谱例路由使用 `generateStaticParams()`
- 内容来自 `content/sheets/*.md`，不在页面组件中硬编码谱例数据
- Bilibili 内容只存 `bvid/page/start`，不存 iframe HTML
- 第一版不使用数据库、登录、评论、投稿、Server Actions、ISR、cookies、需要运行时 Request 的 Route Handlers

## 目录结构

```text
app/                    Next.js App Router 页面
components/             站点 UI 组件
content/sheets/         谱例 Markdown 内容
lib/                    内容加载、schema、搜索、排序、外链数据
public/assets/sheets/   PDF 与 PNG 谱例预览
public/assets/social/   导航与关于页使用的外链 SVG
tests/                  Vitest 测试
wrangler.jsonc          Cloudflare Workers Static Assets 配置
```

## 内容模型

每个谱例是一个 Markdown 文件，文件名与 `slug` 保持一致：

```text
content/sheets/haru-dorobou.md
```

当前 frontmatter 重点字段：

```yaml
title: "春泥棒"
slug: "haru-dorobou"
type: "full-score" # full-score = 整谱, lick = 乐句
summary: "《春泥棒》的吉他谱 PDF 与 Bilibili 演示视频整理页。"
instrument: "acoustic-guitar"
tuning: "E Standard"
capo: 3品
featured: true
publishedAt: "2026-06-03"
pdf: "/assets/sheets/pdf/haru-dorobou.pdf"
preview: "/assets/sheets/previews/haru-dorobou.png"
bilibili:
  bvid: "BV1kzwpeaE4h"
  page: 1
  start: 0
rights: "用户提供的学习用途谱例与公开 Bilibili 演示链接；如涉及权利问题请联系移除。"
```

说明：

- `type` 只允许 `full-score` 或 `lick`
- `preview` 可以是 PNG/JPG/WebP 路径，也可以是空字符串 `""`
- 只有 `pdf` 和非空 `preview` 同时存在时，详情页才显示谱例预览
- Markdown body 当前保持为空，详情页不默认渲染“练习说明”正文
- `source`、`updatedAt`、`difficulty`、`tags`、`techniques` 不属于当前公开内容模型

## Bilibili 嵌入

内容文件只写结构化 metadata：

```yaml
bilibili:
  bvid: "BV1Pt4y1v7Bb"
  page: 3
  start: 0
```

播放器地址由 `lib/bilibili.ts` 生成，统一关闭自动播放和弹幕参数。不要在 Markdown 中粘贴任意 iframe HTML。

## 开发命令

安装依赖：

```bash
pnpm install
```

本地开发：

```bash
pnpm dev
```

质量检查：

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

静态产物本地预览：

```bash
pnpm build
pnpm start:static
```

`pnpm start:static` 使用 Wrangler 预览 `out/`。如果 Windows 上构建报 `EBUSY`，通常是旧的 Wrangler / workerd 进程仍锁住 `out/`，先停止预览进程再重新构建。

## 部署

`wrangler.jsonc` 指向静态导出目录：

```jsonc
{
  "name": "srp-sheet",
  "assets": {
    "directory": "./out",
    "not_found_handling": "404-page"
  }
}
```

部署前运行完整检查：

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start:static
```

部署：

```bash
pnpm deploy
```

## 维护约定

- 新增谱例时同时添加或确认 PDF、preview 图片路径存在
- 修改内容 schema、Bilibili、搜索筛选、PDF/preview 行为时必须补测试
- `tests/` 是源码测试目录，必须保留在仓库中
- `.gitignore` 会忽略本地 agent 输出、临时 docs、coverage、test-results、Wrangler/Next 产物和日志
- 已跟踪的 `docs/` 项目资料仍保留在历史中；忽略规则只避免未来本地临时文档误提交

## 外链

导航栏和关于页外链统一配置在 `lib/social-links.ts`：

- 博客：<https://blog.srprolin.top>
- Bilibili：<https://space.bilibili.com/422744280>
- 个人主页：<https://www.srprolin.top>
