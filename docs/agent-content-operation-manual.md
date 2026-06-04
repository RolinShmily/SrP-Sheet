# Agent 内容填充操作手册

本手册用于指导开发者把“谱例、PDF、图片、Bilibili 链接”等素材交给 agent，由 agent 按当前网站的数据模型填充内容。目标是让每次新增内容都能被静态构建读取、校验并展示，而不是临时改页面或硬编码数据。

## 适用范围

agent 可以处理：

- 新增或更新 `content/sheets/` 下的谱例 Markdown。
- 放置或引用 PDF 文件。
- 放置或引用谱例预览图、封面图、附件图。
- 把 Bilibili 视频链接转换为结构化 frontmatter metadata。
- 运行必要校验，确认内容能被当前站点读取。

agent 不应处理：

- 把谱例数据硬编码进 React 页面或组件。
- 在 Markdown 或 frontmatter 中粘贴 iframe HTML。
- 新增数据库、CMS、登录、评论、投稿或运行时 API。
- 为了容纳单条内容随意修改 `lib/sheet-schema.ts`。
- 在没有素材或授权说明的情况下编造 PDF、图片、视频或版权状态。

## 开发者提供素材的推荐格式

开发者给 agent 的信息越结构化，新增内容越稳定。推荐一次提供以下字段：

```text
标题：Wonderful U
类型：lick / full-score
乐器：acoustic-guitar / electric-guitar / classical-guitar / bass
调弦：E Standard
变调夹：6品 / 无
调性：C / A minor / 未提供
BPM：92 / 未提供
发布日期：2026-06-04
是否精选：true / false
一句话摘要：用于列表页和详情页顶部
PDF：本地文件路径、已有站内路径，或说明与哪几首共用同一个 PDF
预览图：本地文件路径或已有站内路径
附件图：本地文件路径列表，可选
Bilibili：视频链接，可选
版权说明：素材来源、授权状态、学习用途或移除联系方式
正文说明：演奏提示、段落说明、谱例备注，可选
```

如果开发者只提供曲名和文件，agent 需要补齐当前 schema 必需字段；无法从素材判断的字段必须向开发者确认，不能伪造。

## 当前内容文件位置

谱例内容文件：

```text
content/sheets/<slug>.md
```

PDF 文件：

```text
public/assets/sheets/pdf/<file-name>.pdf
```

预览图文件：

```text
public/assets/sheets/previews/<slug>.png
public/assets/sheets/previews/<slug>.jpg
public/assets/sheets/previews/<slug>.jpeg
public/assets/sheets/previews/<slug>.webp
```

站内 URL 写法必须以 `/assets/sheets/` 开头，例如：

```yaml
pdf: "/assets/sheets/pdf/wonderful-u.pdf"
preview: "/assets/sheets/previews/wonderful-u.png"
```

## slug 与文件命名

slug 用于 Markdown 文件名和详情页路由。

规则：

- 只能使用小写字母、数字和连字符。
- 不能有空格、中文、下划线或连续连字符。
- Markdown 文件名必须与 frontmatter 中的 `slug` 完全一致。

示例：

```text
标题：Merry Christmas Mr. Lawrence
slug：merry-christmas-mr-lawrence
文件：content/sheets/merry-christmas-mr-lawrence.md
路由：/sheets/merry-christmas-mr-lawrence/
```

如果已有同名 slug，agent 应更新现有文件或向开发者确认新 slug；不要静默覆盖不相关内容。

## frontmatter 模板

当前 schema 以 `lib/sheet-schema.ts` 为准。新增内容时使用下列模板：

```yaml
---
title: "曲目标题"
slug: "kebab-case-slug"
type: "lick"
summary: "一句话说明这份谱例的内容、用途或素材来源。"
instrument: "acoustic-guitar"
tuning: "E Standard"
key: "C"
capo: null
bpm: 92
featured: false
publishedAt: "2026-06-04"
pdf: "/assets/sheets/pdf/kebab-case-slug.pdf"
preview: "/assets/sheets/previews/kebab-case-slug.png"
images: []
bilibili:
  bvid: "BV1ho4y1U7tK"
  page: 1
  start: 0
rights: "开发者提供的学习用途谱例与公开演示链接；如涉及权利问题请联系移除。"
---

## 演奏提示

这里写谱例说明、段落备注、练习建议或其他正文内容。
```

字段说明：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 页面和卡片展示标题。 |
| `slug` | 是 | 必须匹配文件名。 |
| `type` | 是 | 当前只支持 `lick` 或 `full-score`。 |
| `summary` | 是 | 一句话摘要，列表页和详情页都会使用。 |
| `instrument` | 是 | `acoustic-guitar`、`electric-guitar`、`classical-guitar`、`bass` 之一。 |
| `tuning` | 是 | 调弦文本，例如 `E Standard`。 |
| `key` | 否 | 调性；未知时省略。 |
| `capo` | 否 | 变调夹文本；没有时写 `null` 或省略。 |
| `bpm` | 否 | 正数；未知时省略。 |
| `featured` | 否 | 是否首页精选，默认 `false`。 |
| `publishedAt` | 是 | `YYYY-MM-DD` 日期。 |
| `cover` | 否 | 以 `/assets/sheets/` 开头的封面路径。 |
| `pdf` | 否 | 必须以 `/assets/sheets/` 开头并以 `.pdf` 结尾。 |
| `preview` | 否 | 空字符串或图片路径；支持 `png`、`jpg`、`jpeg`、`webp`。 |
| `images` | 否 | 附件图数组，默认 `[]`。 |
| `bilibili` | 否 | 结构化视频 metadata。 |
| `rights` | 是 | 版权、授权、来源或移除说明。 |

不在 schema 中的字段不要写入 frontmatter。尤其不要写旧文档中的 `tags`、`techniques`、`updatedAt` 或 `bilibili.title`，除非代码 schema 已明确支持。

## PDF 与预览图规则

详情页只有在 `pdf` 和 `preview` 同时存在时才显示“谱例预览”模块。

agent 处理 PDF 和图片时应遵守：

1. PDF 放入 `public/assets/sheets/pdf/`。
2. 主预览图放入 `public/assets/sheets/previews/`。
3. 单曲独立文件优先使用 `<slug>.pdf` 和 `<slug>.png`。
4. 多首曲目共用同一个 PDF 时，文件名可以包含多个 slug；每首曲目的 frontmatter 指向同一个 PDF。
5. `preview` 应尽量使用与当前曲目同名的图片，方便维护。
6. 不要引用 `public/` 绝对磁盘路径；页面路径从 `/assets/` 开始。

示例：

```yaml
pdf: "/assets/sheets/pdf/collapsing-world-creep-free-lucky-love-is-gone-wonderful-u.pdf"
preview: "/assets/sheets/previews/wonderful-u.png"
```

附件图使用 `images`：

```yaml
images:
  - src: "/assets/sheets/previews/wonderful-u.png"
    alt: "Wonderful U 谱例预览图"
```

如果图片是主预览图，通常只写 `preview` 即可；只有额外附件才写入 `images`。

## Bilibili 链接处理

内容文件中只能写结构化 metadata：

```yaml
bilibili:
  bvid: "BV1ho4y1U7tK"
  page: 1
  start: 0
```

禁止写：

```html
<iframe src="https://player.bilibili.com/player.html?...">
```

agent 从开发者提供的链接中提取：

- `bvid`：路径中的 `BV...`，必须符合 `BV` 加 10 位字母或数字。
- `page`：链接参数 `p`；没有时写 `1`。
- `start`：链接参数 `t` 或起播秒数；没有时写 `0`。

示例输入：

```text
https://www.bilibili.com/video/BV1ho4y1U7tK/?p=2&t=30
```

写入：

```yaml
bilibili:
  bvid: "BV1ho4y1U7tK"
  page: 2
  start: 30
```

播放器 URL 由 `lib/bilibili.ts` 生成，agent 不需要也不应该手写 iframe 地址。

## Markdown 正文规则

正文位于 frontmatter 之后。当前页面主要依赖 PDF、预览图和视频；正文可以为空，但有演奏提示时应写 Markdown。

推荐正文结构：

```md
## 演奏提示

右手保持稳定分解，先慢速确认换把位置。

## 内容说明

这份谱例整理了主旋律片段与和弦位置，适合作为学习参考。
```

如果开发者没有提供正文说明，可以只保留 frontmatter，不要编造乐理分析。

## 新增一首谱例的标准流程

1. **读取现有 schema 和相近内容**
   - 核对 `lib/sheet-schema.ts`。
   - 参考 `content/sheets/` 中同类型曲目的写法。

2. **确认素材完整性**
   - 至少需要标题、类型、乐器、调弦、发布日期、摘要、版权说明。
   - 如果要展示 PDF 预览，需要同时有 PDF 和 preview。
   - 如果有 Bilibili 链接，必须能提取合法 bvid。

3. **生成 slug**
   - 使用小写 kebab-case。
   - 检查 `content/sheets/<slug>.md` 是否已存在。

4. **放置资产**
   - PDF 放入 `public/assets/sheets/pdf/`。
   - 预览图放入 `public/assets/sheets/previews/`。
   - 复用已有 PDF 或图片时，不重复复制。

5. **写 Markdown 文件**
   - 文件路径为 `content/sheets/<slug>.md`。
   - frontmatter 只写当前 schema 支持的字段。
   - `slug` 必须与文件名一致。

6. **运行校验**
   - 内容解析、Bilibili、搜索或 schema 有改动时运行 `pnpm test`。
   - 新增或更新内容后至少运行 `pnpm build`，确认静态导出不会因 frontmatter 失败。

7. **人工检查展示路径**
   - 确认列表页能看到新谱例。
   - 确认 `/sheets/<slug>/` 能打开。
   - 有 PDF 和 preview 时确认“谱例预览”模块显示。
   - 有 Bilibili metadata 时确认视频模块显示且不 autoplay。

## 更新已有谱例的标准流程

1. 找到 `content/sheets/<slug>.md`。
2. 只修改开发者要求的字段或素材路径。
3. 如果替换 PDF 或图片，确认旧文件是否仍被其他曲目引用；被引用时不要删除。
4. 如果修改 slug，必须同步修改文件名、资产命名和所有引用；除非明确需要，否则不要改 slug。
5. 运行 `pnpm build` 验证内容仍能静态导出。

## 常见输入示例

开发者输入：

```text
新增 Wonderful U：
- 类型：lick
- 乐器：acoustic-guitar
- 调弦：E Standard
- 变调夹：6品
- 发布日期：2021-08-18
- PDF：public/assets/sheets/pdf/collapsing-world-creep-free-lucky-love-is-gone-wonderful-u.pdf
- 预览图：public/assets/sheets/previews/wonderful-u.png
- Bilibili：https://www.bilibili.com/video/BV1ho4y1U7tK
- 版权：用户提供的学习用途谱例与公开 Bilibili 演示链接；如涉及权利问题请联系移除。
```

agent 应生成：

```md
---
title: "Wonderful U"
slug: "wonderful-u"
type: "lick"
summary: "《Wonderful U》的吉他谱 PDF 与 Bilibili 演示视频整理页；该 PDF 与同组曲目共用。"
instrument: "acoustic-guitar"
tuning: "E Standard"
capo: 6品
featured: false
publishedAt: "2021-08-18"
pdf: "/assets/sheets/pdf/collapsing-world-creep-free-lucky-love-is-gone-wonderful-u.pdf"
preview: "/assets/sheets/previews/wonderful-u.png"
bilibili:
  bvid: "BV1ho4y1U7tK"
  page: 1
  start: 0
rights: "用户提供的学习用途谱例与公开 Bilibili 演示链接；如涉及权利问题请联系移除。"
---
```

## 验证命令

内容填充后的最低验证：

```bash
pnpm build
```

涉及下列文件或逻辑时，还必须运行测试：

- `lib/sheet-schema.ts`
- `lib/content.ts`
- `lib/bilibili.ts`
- `lib/search.ts`
- 页面或组件渲染逻辑

对应命令：

```bash
pnpm test
pnpm build
```

完整交付前可按项目要求运行：

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start:static
```

`pnpm start:static` 会启动本地 Wrangler 预览，不是一次性命令；运行后需要实际打开页面检查，再停止进程。

## agent 交付说明模板

完成内容填充后，agent 应向开发者说明：

```text
已新增/更新：
- content/sheets/<slug>.md
- public/assets/sheets/pdf/<file>.pdf
- public/assets/sheets/previews/<slug>.png

关键 metadata：
- slug: <slug>
- pdf: <path>
- preview: <path>
- bilibili: <bvid>, page <n>, start <seconds>

验证：
- pnpm build：通过/失败，失败原因为 ...
- pnpm test：通过/未运行，原因 ...
```

不要声称未运行的命令已通过。若缺少素材或字段，明确列出缺失项，并只完成能被验证的部分。
