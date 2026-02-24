# ADR-001: Vue3 模板技术基线与工程方案

## 状态

Accepted

## 日期

2026-02-24

## 背景

需要构建一个“个人可复用的通用中后台模板”，要求包含 Vue3 全家桶、权限、i18n、主题/暗黑、mock、测试、CI/CD、Docker，且可快速启动并稳定复用。

核心问题：

1. 如何选择稳定且现代的前端技术基线？
2. 如何在无真实后端前提下保证模板可演示和可测试？
3. 如何把质量保障（lint/test/build）固化为默认能力？

## 决策

采用以下技术基线：

- 核心框架：`Vue 3 + Vite + TypeScript(strict)`。
- 状态与路由：`Pinia + Vue Router`。
- 请求层：`axios` 统一封装（实例 + 拦截器 + 错误归一化）。
- 样式：`Tailwind CSS + CSS Variables`。
- 国际化：`vue-i18n`（zh-CN / en-US）。
- 测试：`Vitest`（单元）+ `Playwright`（E2E）。
- Mock：开发态接口模拟，提供 auth/menu 等核心接口。
- 工程化：`pnpm`、Node `20 LTS`、CI 流水线、Docker 多阶段构建。

## 理由

- 该组合在 Vue3 生态中成熟度高，学习与维护成本可控。
- axios 对模板场景中的鉴权、重试、错误处理更直观。
- Tailwind + CSS 变量可同时满足快速开发与主题扩展。
- Unit + E2E 可覆盖“逻辑正确性 + 用户关键路径”。
- CI 与 Docker 让模板具备“可复现、可验证、可分发”能力。

## 后果

### 正面

- 模板具备开箱即用能力，能快速复制到新项目。
- 技术栈统一，降低重复决策与维护心智负担。
- 质量门禁前置，减少后期返工概率。

### 负面

- 初始配置成本高于“纯最小模板”。
- 依赖项较多，需要持续维护版本兼容。

### 风险

- **风险 1:** 最新依赖版本出现破坏性变更。
  - 缓解措施: 锁定稳定版本，依赖升级走 CI 回归。
- **风险 2:** E2E 在 CI 环境偶发不稳定。
  - 缓解措施: 固定浏览器版本，减少脆弱选择器，隔离外部依赖。

## 备选方案

### 方案 A: 极简模板（仅 Vue3 + Router + Pinia）

**描述:** 只提供最小运行能力，去掉测试、CI、Docker、i18n、主题等。

**优点:**
- 启动快，配置少。

**缺点:**
- 后续每个项目都要重复补工程能力。
- 难以满足本次验收标准。

**不选择原因:** 与“完整可复用中后台模板”目标不符。

### 方案 B: Nuxt（SSR）为基础

**描述:** 使用 Nuxt 作为框架核心。

**优点:**
- 生态完整，约定式开发体验好。

**缺点:**
- 引入 SSR/全栈心智与额外复杂度。
- 与“不做 SSR”边界冲突。

**不选择原因:** 与需求明确边界不一致。

## 相关

- [Plan: vue3-template-architecture-plan](../plans/2026-02-24-vue3-template-architecture-plan.md)
- [Architecture: vue3-template-architecture](../architecture/vue3-template-architecture.md)

## 附录

### 参考资料

- Vue 3 官方文档
- Vite 官方文档
- Pinia / Vue Router / vue-i18n 官方文档
- Vitest / Playwright 官方文档

### 讨论记录

与需求方确认：请求层选 `axios`；Node 最低版本定为 `20 LTS`；不做 SSR、不做微前端，仅 mock。
