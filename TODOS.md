# TODOS

## Architecture

### DioramaCard AI 背景集成方案

**What:** AI 生成图片作为 DioramaCard 背景层，保留 markers/petals 作为 SVG overlay。
**Why:** 当前 8 层 SVG 是手工硬编码场景，无法体现用户输入内容。AI 图片让每张卡片独一无二，直接驱动分享率。
**Context:** DioramaCard.tsx (468行) 有 8 层视差。Phase 1 方案：AI 图替换 sky gradient + hills layers，保留 markers (layer 7) 和 petals (layer 8) 作为 SVG overlay。视差效果会减弱但保留交互。需要修改 layers 1-6 为单张背景图 + 简单 CSS mask 分层。
**Effort:** M
**Priority:** P1
**Depends on:** lib/scene/imageProvider.ts, /api/generate

### @vercel/og 卡片合成 - 简化版布局

**What:** 为 /api/card/[id].png 创建不依赖 CSS 3D 的简化卡片布局。
**Why:** Satori 不支持 perspective/preserve-3d/blur/radial-gradient。分享图片需要独立的静态布局。
**Context:** 浏览器内交互卡片用完整 CSS 3D (DioramaCard.tsx)，分享图片用简化的 satori JSX 布局。两套布局是合理的 (屏幕上看 vs 图片中看 是不同体验)。布局内容：顶部日期条 + AI 场景图 + 3 个 marker 图标 + 底部文字区 + Bloom 品牌。
**Effort:** M
**Priority:** P1
**Depends on:** /api/card/[id].png 路由

### ShareScreen 数据流修复

**What:** ShareScreen 组件需要接收 entries、mood、imageUrl 才能实现实际分享。
**Why:** 当前签名只有 (onBack, palette, date)，无法生成或下载卡片。
**Context:** BloomFlow.tsx 需要传递 entries/mood 到 ShareScreen。同时实现: (1) html2canvas 或 canvas API 前端截图用于下载 (2) navigator.share() 用于 Web Share API (3) 后端接入后改为下载 /api/card/[id].png。
**Effort:** M
**Priority:** P1
**Depends on:** None (可先实现前端截图版本)

### PWA 基础设施

**What:** 添加 manifest.json + service worker + App icons。
**Why:** 产品定位为 PWA，需要 "Add to Home Screen" 功能。每日使用产品的核心入口。
**Context:** 使用 next-pwa 或 @serwist/next。manifest 需要: name, short_name, icons (192/512), display: standalone, theme_color, background_color。Service worker 策略: 静态资源 cache-first，API 请求 network-first。
**Effort:** S
**Priority:** P1
**Depends on:** None

## Code Quality

### 提取 entryColor() 工具函数

**What:** 将 `palette[i === 2 ? 3 : i]` 映射逻辑提取为共享函数。
**Why:** DRY 违反，同一逻辑在 DioramaCard.tsx:443、TearAwayLoading.tsx:96、GoodThingScreen.tsx:50 出现 3 次。
**Context:** 在 lib/constants.ts 加 `export function entryColor(palette: Palette, index: number): string { return palette[index === 2 ? 3 : index]; }`。然后替换 3 处引用。
**Effort:** S
**Priority:** P2
**Depends on:** None

### Phase 2 注释 + "AI is painting" 文案清理

**What:** 删除 DioramaCard.tsx:95 的 Phase 2 注释，替换 TearAwayLoading.tsx:321 的 "AI is painting today" 文案。
**Why:** 违反 DESIGN-DOC 工程原则 #5 (不写未来代码) 和 D5 (禁止 AI 认知触发文案)。
**Context:** DioramaCard 中 `_mood reserved for AI scene generation (Phase 2)` 删除。TearAwayLoading 中 "AI is painting today" 替换为安静的等待文案或完全移除。
**Effort:** S
**Priority:** P2
**Depends on:** None

### localStorage 状态持久化

**What:** BloomFlow 的 entries/mood/step 状态写入 localStorage，重新打开时恢复。
**Why:** 用户刷新页面或 Safari 后台杀 tab 会丢失所有输入。7 步流程在移动端容易被打断。
**Context:** 在 BloomFlow.tsx 中用 useEffect 将 {entries, mood, step} 序列化写入 localStorage key "bloom-draft"。初始化时读取恢复。reset() 时清除。添加日期检查：跨天自动清除旧草稿。
**Effort:** S
**Priority:** P1
**Depends on:** None

## Content

### Placeholder 池扩充到 60-90 条

**What:** PROMPTS 从 15 条扩充到 60-90 条，按 DESIGN-DOC D6/D9 要求。
**Why:** 5 条/组意味着 5 天后重复。Placeholder 是产品的第一句话，教用户"我们在乎什么样的细节"。
**Context:** constants.ts PROMPTS 当前 3 组 x 5 条 = 15 条。需要改为按日期轮换 (同一天相同)，不再按 index 分组。文案风格参考 DESIGN-DOC: 具体到几乎私密 ("the way oat milk curled in my coffee this morning")，禁止 wellness 死亡话术。时段微调：早上偏早餐/通勤，下午偏午后。
**Effort:** M
**Priority:** P2
**Depends on:** None

## Performance

### WelcomeScreen 呼吸动画改 CSS

**What:** 呼吸动画从 setInterval + setState 改为 CSS @keyframes。
**Why:** 每 60ms 触发 React 重渲染，低端手机 CPU 消耗高。CSS animation 由 GPU 加速。
**Context:** WelcomeScreen.tsx:13-15 使用 setInterval 驱动 breath state → 计算 wave → 设置 transform。改为 CSS animation: @keyframes breathe { 0%,100% { transform: scale(1) } 50% { transform: scale(1.25) } } 分别应用到 3 个圆圈层。
**Effort:** S
**Priority:** P3
**Depends on:** None

### Google Fonts 迁移到 next/font

**What:** 将 globals.css 的 @import Google Fonts 改为 next/font/google。
**Why:** CSS @import 阻塞渲染，next/font 自动子集化 + 预加载 + 无布局偏移。
**Context:** globals.css:2 导入 Fraunces, Newsreader, JetBrains Mono。改为 layout.tsx 中 import { Fraunces, Newsreader, JetBrains_Mono } from 'next/font/google'，通过 CSS 变量注入。
**Effort:** S
**Priority:** P3
**Depends on:** None

## Security

### API 速率限制 + 匿名上限

**What:** /api/generate 加 IP 限流，匿名用户每日 3 张卡片上限。
**Why:** 无认证 + 无限制 = 一个 Reddit 帖子可能几小时内消耗数百美元 AI 成本。
**Context:** 方案: Upstash Redis + @upstash/ratelimit (或 Vercel KV)。匿名用户 IP 维度每日 3 次。登录用户 user_id 维度每日 10 次。超限返回 429 + 友好提示 "today's cards are done, come back tomorrow"。早期 0-100 DAU 时可暂缓。
**Effort:** S
**Priority:** P2
**Depends on:** /api/generate 路由, Supabase Auth (optional)

## Completed
