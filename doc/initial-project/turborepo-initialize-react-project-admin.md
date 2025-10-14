# Turborepo 在 apps/admin 文件夹下初始化 React 项目

本文档详细介绍如何在 Turborepo 工作区内的 `apps/admin` 目录下初始化和配置 React + TypeScript 项目。

## 前提条件

在开始之前，请确保您已安装以下工具：

- Node.js (v18 或更高版本)
- pnpm (推荐的包管理工具)
- Git
- 已初始化的 Turborepo 工作区

## 步骤 1：创建项目目录

首先，在 Turborepo 工作区的 `apps` 目录下创建或使用现有的 `admin` 目录：

```bash
# 在 Windows 命令提示符或 PowerShell 中执行
mkdir -p apps\admin
cd apps\admin
```

## 步骤 2：使用 Vite 初始化 React + TypeScript 项目

我们将使用 Vite 作为构建工具来初始化 React + TypeScript 项目。Vite 是一个现代化的构建工具，提供了快速的开发服务器和优化的生产构建。

```bash
# 在 apps/admin 目录下执行
pnpm create vite@latest . -- --template react-ts
```

执行上述命令后，Vite 会在当前目录初始化一个 React + TypeScript 项目，生成基本的项目结构和配置文件。

## 步骤 3：项目结构介绍

初始化完成后，`apps/admin` 目录下会生成以下基本结构：

```
apps/admin/
├── .gitignore
├── index.html          # HTML 入口文件
├── package.json        # 项目配置和依赖
├── public/             # 静态资源目录
│   └── vite.svg        # Vite 图标
├── src/                # 源代码目录
│   ├── App.css         # App 组件样式
│   ├── App.tsx         # App 组件
│   ├── assets/         # 资源文件
│   │   └── react.svg   # React 图标
│   ├── index.css       # 全局样式
│   └── main.tsx        # 应用入口文件
├── tsconfig.json       # TypeScript 配置
├── tsconfig.node.json  # Node.js TypeScript 配置
└── vite.config.ts      # Vite 配置
```

## 步骤 4：配置 package.json

生成的 `package.json` 文件可能需要根据 Turborepo 的需求进行调整。以下是一个适合 Turborepo 环境的 `package.json` 示例：

```json
{
  "name": "admin",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

## 步骤 5：配置 TypeScript

Vite 已经生成了基本的 TypeScript 配置文件。您可以根据需要对 `tsconfig.json` 和 `tsconfig.node.json` 进行调整。以下是一个推荐的 `tsconfig.json` 配置：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    /* Path mapping for monorepo */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@ui/*": ["../../packages/ui-components/*"],
      "@utils/*": ["../../packages/common-utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 步骤 6：配置 Vite

调整 `vite.config.ts` 文件，添加对路径别名和其他 Vite 功能的支持：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@ui': resolve(__dirname, '../../packages/ui-components'),
      '@utils': resolve(__dirname, '../../packages/common-utils')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

## 步骤 7：安装依赖并验证项目

### 安装依赖

```bash
# 在项目根目录执行
pnpm install

# 或者在 apps/admin 目录执行
pnpm install
```

### 验证项目构建

```bash
# 在项目根目录执行
pnpm run build --filter admin

# 或者在 apps/admin 目录执行
pnpm run build
```

## 步骤 8：在 Turborepo 中的集成

### 配置 turbo.json

确保 Turborepo 的根配置文件 `turbo.json` 中包含了 admin 项目的任务定义：

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
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

### 在工作区中运行 React 项目

```bash
# 启动开发服务器
pnpm dev --filter admin

# 构建生产版本
pnpm build --filter admin

# 预览生产版本
pnpm preview --filter admin
```

## 步骤 9：创建项目说明文档

创建 `README.md` 文件，提供项目的使用指南：

```markdown
# Admin Panel

This is an admin panel application built with React, TypeScript, and Vite in a Turborepo monorepo.

## Overview

This admin panel provides a user interface for managing the application's backend resources, users, and settings.

## Tech Stack

- **React** - UI library
- **TypeScript** - Typed superset of JavaScript
- **Vite** - Modern build tool
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
pnpm dev --filter admin
```

#### From Direct Directory

```bash
# Navigate to the app directory
cd apps/admin

# Install dependencies
pnpm install

# Run the app in development mode
pnpm dev
```

### Available Scripts

In the project directory, you can run:

| Script | Description |
|--------|-------------|
| `pnpm dev` | Runs the app in development mode |
| `pnpm build` | Builds the app for production to the `dist` folder |
| `pnpm lint` | Runs ESLint to check for code issues |
| `pnpm preview` | Serves the production build locally for preview |
```

## 扩展 React 项目

### 添加路由

要添加路由功能，我们可以使用 React Router：

```bash
# 在 apps/admin 目录下执行
pnpm add react-router-dom
pnpm add -D @types/react-router-dom
```

创建 `src/routes.tsx` 文件：

```tsx
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
```

然后更新 `src/main.tsx` 文件以使用路由：

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

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
const MyComponent = () => {
  return (
    <Card>
      <h2>{formatDate(new Date())}</h2>
      <Button onClick={() => console.log('Clicked')}>Click Me</Button>
    </Card>
  );
};
```

### 添加状态管理

对于更复杂的状态管理需求，可以集成 Redux 或 Zustand：

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
    role: string;
  } | null;
  setUser: (user: { name: string; role: string } | null) => void;
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
    <header className={isDarkMode ? 'dark' : ''}>
      <button onClick={toggleDarkMode}>
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      {user && <span>Welcome, {user.name}</span>}
    </header>
  );
};
```

## 环境变量配置

Vite 支持通过 `.env` 文件或系统环境变量进行配置。在 Vite 中，环境变量需要以 `VITE_` 前缀开头才能被客户端代码访问。

创建 `.env` 文件：

```env
# .env 文件内容
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Admin Panel
```

在代码中使用环境变量：

```tsx
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;

console.log(`Connecting to API at ${apiUrl}`);
console.log(`Running ${appName}`);
```

## 部署 React 项目

### 生产构建

```bash
pnpm build --filter admin
```

### 部署方式

1. **静态网站托管**：将 `dist` 目录部署到 Vercel、Netlify、GitHub Pages 等静态网站托管服务。

2. **容器化部署**：创建 `Dockerfile` 并构建 Docker 镜像：

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 总结

通过以上步骤，您已成功在 Turborepo 工作区的 `apps/admin` 目录下初始化了一个完整的 React + TypeScript 项目。该项目具有以下特点：

- 使用 Vite 作为现代化的构建工具，提供快速的开发体验
- 完整的 TypeScript 支持和类型检查
- 配置了 ESLint 以确保代码质量
- 完全适配 Turborepo 的工作流
- 易于扩展和集成共享包
- 支持路由、状态管理和环境变量配置

现在，您可以根据实际需求进一步开发和定制 admin 面板应用。