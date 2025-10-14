# Turborepo 初始化 Express 项目

本文档详细介绍如何在 Turborepo 工作区内初始化和配置 Express + TypeScript 项目。

## 前提条件

在开始之前，请确保您已安装以下工具：

- Node.js (v18 或更高版本)
- pnpm (推荐的包管理工具)
- Git
- 已初始化的 Turborepo 工作区

## 步骤 1：创建项目目录

首先，在 Turborepo 工作区的 `services` 目录下创建 Express 项目文件夹：

```bash
# 在 Windows 命令提示符或 PowerShell 中执行
mkdir -p services\express
cd services\express
```

## 步骤 2：初始化 package.json

在 `services/express` 目录下创建 `package.json` 文件，定义项目的基本信息、依赖和脚本：

```json
{
  "name": "express-service",
  "version": "1.0.0",
  "description": "Express.js service with TypeScript",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write ."
  },
  "dependencies": {
    "express": "^4.19.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.12.7",
    "@typescript-eslint/eslint-plugin": "^7.9.0",
    "@typescript-eslint/parser": "^7.9.0",
    "eslint": "^8.57.0",
    "prettier": "^3.2.5",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.4.5"
  },
  "author": "",
  "license": "ISC"
}
```

## 步骤 3：配置 TypeScript

创建 `tsconfig.json` 文件，配置 TypeScript 编译选项：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 步骤 4：配置 ESLint

创建 `eslint.config.mjs` 文件，配置代码质量检查规则：

```javascript
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['node_modules/**', 'dist/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs.strict.rules,
      'no-console': 'warn',
      'no-debugger': 'error',
    },
  },
];
```

## 步骤 5：配置 Prettier

创建 `.prettierrc.json` 文件，定义代码格式化规则：

```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

## 步骤 6：创建 .gitignore 文件

创建 `.gitignore` 文件，排除不需要纳入版本控制的文件和目录：

```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage
*.lcov
.nyc_output

# Production
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Temporary files
*.tmp
*.temp
.cache

# OS generated files
Thumbs.db

# Package manager files
package-lock.json
yarn.lock
pnpm-lock.yaml
```

## 步骤 7：创建项目源码文件

### 创建 src 目录结构

```bash
mkdir src
```

### 创建 Express 应用配置文件

创建 `src/app.ts` 文件，定义 Express 应用的基本配置：

```typescript
import express, { Express, Request, Response } from 'express';

// 创建 Express 应用实例
const app: Express = express();

// 中间件配置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 基本路由示例
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

// 健康检查路由
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

export default app;
```

### 创建服务器入口文件

创建 `src/index.ts` 文件，作为 Express 服务器的入口点：

```typescript
import app from './app';

const PORT = process.env.PORT || 3000;

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## 步骤 8：安装依赖并验证项目

### 安装依赖

```bash
# 在项目根目录执行
pnpm install

# 或者在 services/express 目录执行
pnpm install
```

### 验证项目构建

```bash
# 在项目根目录执行
pnpm run build --filter express-service

# 或者在 services/express 目录执行
pnpm run build
```

## 步骤 9：创建项目说明文档

创建 `README.md` 文件，提供项目的使用指南：

```markdown
# Express Service

This is an Express.js service built with TypeScript for the monorepo.

## Overview

This service provides a RESTful API backend using Express.js and TypeScript.
It's designed to be part of a monorepo structure and can be integrated with other services and applications.

## Tech Stack

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Typed superset of JavaScript
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **ts-node-dev** - Development server with hot reloading

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm

### Installation

#### From Monorepo Root

```bash
# Install dependencies
pnpm install

# Run the service in development mode
pnpm dev --filter express-service
```

#### From Direct Directory

```bash
# Navigate to the service directory
cd services/express

# Install dependencies
pnpm install

# Run the service in development mode
pnpm dev
```

### Available Scripts

In the project directory, you can run:

| Script | Description |
|--------|-------------|
| `pnpm dev` | Runs the app in development mode with hot reloading |
| `pnpm build` | Builds the app for production to the `dist` folder |
| `pnpm start` | Runs the production build from the `dist` folder |
| `pnpm lint` | Runs ESLint to check for code issues |
| `pnpm format` | Formats code using Prettier |
```

## 在 Turborepo 中的集成

### 配置 turbo.json

确保 Turborepo 的根配置文件 `turbo.json` 中包含了 Express 服务的任务定义：

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "cache": true
    },
    "dev": {
      "persistent": true,
      "cache": false
    },
    "lint": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "format": {
      "cache": true
    }
  }
}
```

### 在工作区中运行 Express 服务

```bash
# 启动开发服务器
pnpm dev --filter express-service

# 构建生产版本
pnpm build --filter express-service

# 运行生产版本
pnpm start --filter express-service
```

## 扩展 Express 服务

### 添加新的路由

1. 创建路由目录和文件：

```bash
mkdir src/routes
```

2. 创建 `src/routes/users.ts` 示例文件：

```typescript
import { Router, Request, Response } from 'express';

const router = Router();

// 获取所有用户
router.get('/', (req: Request, res: Response) => {
  res.json({ users: [] });
});

// 获取单个用户
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ userId: id });
});

export default router;
```

3. 在 `src/app.ts` 中导入并使用路由：

```typescript
import express, { Express, Request, Response } from 'express';
import userRoutes from './routes/users';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 挂载用户路由
app.use('/api/users', userRoutes);

// 其他路由和中间件...

export default app;
```

### 集成共享包

在 Turborepo 中，您可以轻松集成工作区中的共享包：

```bash
# 添加工作区中的共享包依赖
pnpm add --workspace common-utils
```

然后在代码中导入并使用：

```typescript
import { logger } from 'common-utils';

// 使用共享的日志工具
logger.info('Server starting...');
```

## 环境变量配置

Express 服务支持通过 `.env` 文件或系统环境变量进行配置。创建 `.env` 文件：

```env
# .env 文件内容
PORT=3000
NODE_ENV=development
```

要在代码中使用环境变量，您可以安装 `dotenv` 包：

```bash
pnpm add dotenv
```

然后在 `src/index.ts` 中加载环境变量：

```typescript
import dotenv from 'dotenv';
// 加载环境变量
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## 部署 Express 服务

### 生产构建

```bash
pnpm build --filter express-service
```

### 部署方式

1. **传统部署**：将 `dist` 目录、`package.json` 和 `pnpm-lock.yaml` 部署到目标服务器，然后运行 `pnpm install --prod` 和 `pnpm start`。

2. **Docker 容器化**：创建 `Dockerfile` 并构建 Docker 镜像：

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod
COPY dist ./dist
EXPOSE 3000
CMD ["pnpm", "start"]
```

## 总结

通过以上步骤，您已成功在 Turborepo 工作区内初始化了一个完整的 Express + TypeScript 项目。该项目具有以下特点：

- 完整的 TypeScript 支持和类型检查
- 配置了 ESLint 和 Prettier 以确保代码质量和一致性
- 提供了开发热重载和生产构建能力
- 完全适配 Turborepo 的工作流
- 易于扩展和集成共享包

现在，您可以根据实际需求进一步开发和定制 Express 服务。