# Vue3 全家桶中后台模板

基于 `Vue3 + Vite + TypeScript + Pinia + Vue Router + Axios + Tailwind CSS` 的通用中后台模板，内置权限、i18n、主题/暗黑、mock、单测、端测、CI、Docker。

## 环境要求

- Node.js: `>=20`（推荐 20 LTS）
- pnpm: `>=10`

## 快速开始

```bash
pnpm install
pnpm dev
```

默认账号（mock）：

- username: `admin`
- password: `123456`

## 常用脚本

```bash
pnpm dev        # 启动开发服务
pnpm lint       # ESLint
pnpm test       # Vitest + coverage
pnpm test:e2e   # Playwright
pnpm build      # 类型检查 + 构建
```

## 功能清单

- 登录页、首页、权限路由示例
- 中英文国际化切换
- 主题模式（light/dark/system）
- Tailwind 响应式布局
- axios 请求层与统一错误处理
- mock 接口（auth/navigation）
- CI 工作流与 Docker 交付

## Docker

```bash
docker build -t vue3-admin-template .
docker run --rm -p 8080:80 vue3-admin-template
```

访问：`http://localhost:8080`

## 目录规范

详见 `docs/project-structure.md`。
