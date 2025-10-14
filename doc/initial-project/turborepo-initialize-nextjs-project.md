# Turborepo 在 apps/web 文件夹下初始化 Next.js 项目

本文档详细介绍如何在 Turborepo 工作区内的 `apps/web` 目录下初始化和配置 Next.js 项目。Next.js 是一个流行的 React 框架，提供了服务端渲染、静态站点生成、路由等高级功能，非常适合构建现代 Web 应用。

## 前提条件

在开始之前，请确保您已安装以下工具：

- Node.js (v18 或更高版本)
- pnpm (推荐的包管理工具)
- Git
- 已初始化的 Turborepo 工作区

## 步骤 1：创建项目目录

首先，在 Turborepo 工作区的 `apps` 目录下创建或使用现有的 `web` 目录：

```bash
# 在 Windows 命令提示符或 PowerShell 中执行
mkdir -p apps\web
cd apps\web
```

## 步骤 2：使用 create-next-app 初始化 Next.js 项目

我们将使用官方的 `create-next-app` 工具来初始化 Next.js 项目。这个工具可以帮助我们快速设置项目结构和基础配置。

```bash
# 在 apps/web 目录下执行
pnpm create next-app@latest . -- --ts --eslint --tailwind --src-dir --app --import-alias "@/*"
```

上面的命令包含了多个选项：
- `--ts`: 使用 TypeScript
- `--eslint`: 配置 ESLint
- `--tailwind`: 配置 Tailwind CSS
- `--src-dir`: 使用 `src` 目录组织源代码
- `--app`: 使用 App Router（Next.js 13+ 的新路由系统）
- `--import-alias "@/*"`: 配置路径别名，方便导入

## 步骤 3：项目结构介绍

初始化完成后，`apps/web` 目录下会生成以下基本结构：

```
apps/web/
├── .gitignore
├── README.md
├── next.config.ts      # Next.js 配置文件
├── package.json        # 项目配置和依赖
├── postcss.config.mjs  # PostCSS 配置
├── public/             # 静态资源目录
│   ├── next.svg
│   └── vercel.svg
├── src/                # 源代码目录
│   ├── app/            # App Router 路由目录
│   │   ├── api/        # API 路由
│   │   ├── favicon.ico
│   │   ├── globals.css # 全局样式
│   │   ├── layout.tsx  # 布局组件
│   │   └── page.tsx    # 主页组件
│   └── tsconfig.json   # TypeScript 配置
└── tsconfig.json       # TypeScript 根配置
```

## 步骤 4：配置 package.json

生成的 `package.json` 文件可能需要根据 Turborepo 的需求进行调整。以下是一个适合 Turborepo 环境的 `package.json` 示例：

```json
{
  "name": "web",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^15.5.0"
  },
  "devDependencies": {
    "typescript": "^5.4.5",
    "@types/node": "^20.14.5",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^4.0.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^15.5.0"
  }
}
```

## 步骤 5：配置 TypeScript

Next.js 已经生成了基本的 TypeScript 配置文件。您可以根据需要对 `tsconfig.json` 进行调整，以确保与 Turborepo 工作区的其他项目保持一致性。以下是一个推荐的 `tsconfig.json` 配置：

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["src/*"],
      "@ui/*": ["../../packages/ui-components/*"],
      "@utils/*": ["../../packages/common-utils/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 步骤 6：配置 Next.js

调整 `next.config.ts` 文件，添加对 Turborepo 的支持和其他自定义配置：

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'ui-components',
    'common-utils',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // 其他允许的图片源
    ],
  },
};

export default nextConfig;
```

## 步骤 7：配置 Tailwind CSS

如果您在初始化过程中选择了 Tailwind CSS，可以配置 `tailwind.config.ts` 文件：

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        dark: '#1F2937',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

## 步骤 8：安装依赖并验证项目

### 安装依赖

```bash
# 在项目根目录执行
pnpm install

# 或者在 apps/web 目录执行
pnpm install
```

### 验证项目构建

```bash
# 在项目根目录执行
pnpm run build --filter web

# 或者在 apps/web 目录执行
pnpm run build
```

## 步骤 9：在 Turborepo 中的集成

### 配置 turbo.json

确保 Turborepo 的根配置文件 `turbo.json` 中包含了 web 项目的任务定义：

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "persistent": true,
      "cache": false
    },
    "lint": {
      "dependsOn": ["^build"]
    }
  }
}
```

### 在工作区中运行 Next.js 项目

```bash
# 启动开发服务器
pnpm dev --filter web

# 构建生产版本
pnpm build --filter web

# 启动生产服务器
pnpm start --filter web
```

## 步骤 10：创建项目说明文档

创建 `README.md` 文件，提供项目的使用指南：

```markdown
# Web Application

This is a Next.js web application built in a Turborepo monorepo.

## Overview

This web application serves as the frontend interface for the project, built with Next.js, React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js** - React framework for production
- **React** - UI library
- **TypeScript** - Typed superset of JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting
- **Turborepo** - Monorepo management

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm

### Installation

#### From Monorepo Root

```bash
# Install dependencies
pnpm install

# Run the app in development mode
pnpm dev --filter web
```

#### From Direct Directory

```bash
# Navigate to the app directory
cd apps/web

# Install dependencies
pnpm install

# Run the app in development mode
pnpm dev
```

### Available Scripts

In the project directory, you can run:

| Script | Description |
|--------|-------------|
| `pnpm dev` | Runs the app in development mode on http://localhost:3000 |
| `pnpm build` | Builds the app for production to the `.next` folder |
| `pnpm start` | Runs the built app in production mode |
| `pnpm lint` | Runs ESLint to check for code issues |
```

## 扩展 Next.js 项目

### 添加 API 路由

Next.js 允许您在同一个项目中创建 API 端点。在 `src/app` 目录下创建 `api` 文件夹，然后添加路由处理程序：

```typescript
// src/app/api/hello/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello from Next.js API' });
}
```

这个 API 端点可以通过 `http://localhost:3000/api/hello` 访问。

### 集成共享包

在 Turborepo 中，您可以轻松集成工作区中的共享包：

```bash
# 添加工作区中的共享包依赖
pnpm add --workspace ui-components
pnpm add --workspace common-utils
```

然后在代码中导入并使用：

```tsx
import { Button, Card } from 'ui-components';
import { formatDate, validateEmail } from 'common-utils';

// 使用共享的 UI 组件和工具函数
const MyPage = () => {
  return (
    <Card>
      <h2>{formatDate(new Date())}</h2>
      <Button onClick={() => console.log('Clicked')}>Click Me</Button>
    </Card>
  );
};
```

### 添加状态管理

对于全局状态管理，可以使用 React Context 或更高级的解决方案如 Redux 或 Zustand：

```bash
# 安装 Zustand（轻量级状态管理库）
pnpm add zustand
```

创建 `src/store/app.ts` 文件：

```tsx
import { create } from 'zustand';

interface AppState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: {
    name: string;
    email: string;
  } | null;
  setUser: (user: { name: string; email: string } | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  user: null,
  setUser: (user) => set({ user }),
}));
```

在组件中使用状态管理：

```tsx
import { useAppStore } from '@/store/app';

const Header = () => {
  const { isDarkMode, toggleDarkMode, user } = useAppStore();

  return (
    <header className={isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}>
      <button onClick={toggleDarkMode}>
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      {user && <span>Welcome, {user.name}</span>}
    </header>
  );
};
```

## 环境变量配置

Next.js 支持通过 `.env` 文件或系统环境变量进行配置。在 Next.js 中，环境变量需要以 `NEXT_PUBLIC_` 前缀开头才能被客户端代码访问。

创建 `.env` 文件：

```env
# .env 文件内容
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=My Web App
```

在代码中使用环境变量：

```tsx
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const appName = process.env.NEXT_PUBLIC_APP_NAME;

console.log(`Connecting to API at ${apiUrl}`);
console.log(`Running ${appName}`);
```

## 部署 Next.js 项目

### 生产构建

```bash
pnpm build --filter web
```

### 部署方式

1. **Vercel 部署**：
   Vercel 是 Next.js 的创建者，提供了最简单的 Next.js 部署体验。只需连接您的 Git 仓库，Vercel 会自动检测 Next.js 项目并配置部署。

2. **Docker 容器化部署**：
   创建 `Dockerfile` 并构建 Docker 镜像：

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# Production image, copy all the files and run next start
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
```

3. **自定义服务器部署**：
   您还可以在自己的服务器上使用 PM2 等进程管理器来运行 Next.js 应用。

## 总结

通过以上步骤，您已成功在 Turborepo 工作区的 `apps/web` 目录下初始化了一个完整的 Next.js 项目。该项目具有以下特点：

- 使用 Next.js 15 和 App Router 构建现代 Web 应用
- 完整的 TypeScript 支持和类型检查
- 配置了 Tailwind CSS 用于快速 UI 开发
- 完全适配 Turborepo 的工作流
- 易于扩展和集成共享包
- 支持 API 路由、状态管理和环境变量配置
- 多种部署选项

现在，您可以根据实际需求进一步开发和定制您的 Next.js 应用。