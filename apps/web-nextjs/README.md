# Web 前端应用

## 项目概述
这是一个基于 Next.js 15 (App Router) + TypeScript + Tailwind CSS 的现代化前端应用，位于 monorepo 项目结构中的 `apps/web` 目录。该应用使用了 Turbopack 作为构建工具，提供了高性能的开发体验。

## 技术栈
- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **构建工具**: Turbopack
- **样式**: Tailwind CSS 4
- **包管理**: pnpm

## 运行方式

### 1. 在 monorepo 根目录运行

#### 开发模式
```bash
# 启动 web 应用（使用 Turbopack）
pnpm dev --filter web

# 或启动所有应用
pnpm dev
```

#### 构建生产版本
```bash
# 构建 web 应用
pnpm build --filter web

# 或构建所有应用
pnpm build
```

### 2. 在应用目录直接运行

```bash
# 进入应用目录
cd apps/web

# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 启动生产版本
pnpm start

# 运行 ESLint 检查
pnpm lint
```

## 项目结构
```
apps/web/
├── app/                  # Next.js App Router 结构
│   ├── layout.tsx        # 根布局组件
│   ├── page.tsx          # 主页组件
│   ├── globals.css       # 全局样式
│   └── favicon.ico       # 网站图标
├── public/               # 静态资源
├── next.config.ts        # Next.js 配置
├── package.json          # 项目依赖和脚本
├── tsconfig.json         # TypeScript 配置
├── postcss.config.mjs    # PostCSS 配置
└── eslint.config.mjs     # ESLint 配置
```

## 集成共享包

要在该应用中使用 monorepo 中的共享包，可以使用以下命令安装：

```bash
# 在应用目录中安装共享包
cd apps/web
pnpm add @monorepo/api-client @monorepo/common-utils @monorepo/ui-components
```

## 环境变量

可以在应用根目录创建 `.env.local` 文件配置环境变量：

```env
# 示例环境变量
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development
```

## Turbopack 注意事项

该项目使用 Turbopack 作为构建工具，提供比传统 Webpack 更快的开发体验。`next dev --turbopack` 和 `next build --turbopack` 命令会使用 Turbopack 进行开发和构建。

## 开发指南

1. **修改页面**: 编辑 `app/page.tsx` 文件开始开发
2. **添加新页面**: 在 `app` 目录下创建新的文件夹和 `page.tsx` 文件
3. **添加布局**: 可以为不同的路由段创建专属的 `layout.tsx` 文件
4. **使用 Tailwind CSS**: 直接在组件的 className 中使用 Tailwind 类名

## 部署

### Vercel 部署

1. 连接你的 GitHub 仓库到 Vercel
2. Vercel 会自动识别 Next.js 项目并配置构建参数
3. 完成部署配置并部署

### 自定义部署

```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 注意事项
- 确保在 monorepo 根目录有正确的 pnpm-workspace.yaml 配置
- 开发过程中如果遇到依赖问题，可以尝试在根目录运行 `pnpm install`
- 如需修改 Next.js 配置，请编辑 `next.config.ts` 文件
- 项目使用了 Next.js 15 的最新特性，请确保使用兼容的 Node.js 版本
