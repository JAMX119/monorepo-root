# 初始化一个新的 Turborepo 项目

## 1. 概述

初始化一个新的 Turborepo 项目是开始使用 Monorepo 架构的第一步。本文将详细介绍如何使用不同的包管理器（npm、yarn、pnpm）来初始化一个新的 Turborepo 项目，以及项目的基本结构和配置方法。

## 2. 初始化前的准备工作

在开始初始化 Turborepo 项目之前，确保你已经完成了以下准备工作：

### 2.1 安装 Node.js 和包管理器

确保你的系统上安装了最新版本的 Node.js 和至少一个包管理器（npm、yarn 或 pnpm）。

- **Node.js**：建议安装 v16 或更高版本
- **包管理器**：npm v7+、yarn v1.22+ 或 pnpm v6+ 都支持工作区（workspaces）功能

如果还没有安装这些工具，可以参考我们的 [安装 Node.js 和 pnpm/yarn/npm](install-nodejs-pnpm-yarn-npm.md) 文档。

### 2.2 检查 Git 环境

确保你的系统上安装了 Git，并配置了基本的用户信息：

```bash
# 检查 Git 版本
git --version

# 配置 Git 用户信息（如果尚未配置）
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 3. 初始化 Turborepo 项目

Turborepo 提供了多种初始化方式，你可以根据自己的需求选择合适的方法。

### 3.1 使用官方模板初始化

Turborepo 提供了官方模板，可以通过以下命令快速初始化一个新项目：

#### 3.1.1 使用 npm

```bash
npx create-turbo@latest
```

#### 3.1.2 使用 yarn

```bash
yarn create turbo
```

#### 3.1.3 使用 pnpm

```bash
pnpm create turbo@latest
```

运行上述命令后，会出现一个交互式向导，引导你完成项目初始化：

1. **选择项目路径**：输入你想要创建项目的目录路径
2. **选择包管理器**：选择你想要在项目中使用的包管理器（npm、yarn 或 pnpm）
3. **选择模板**：选择适合你项目需求的模板（默认、最小、nextjs、react-native 等）

### 3.2 手动初始化项目

如果你想要更精细地控制项目结构，也可以手动创建一个 Turborepo 项目。

#### 3.2.1 创建项目目录

```bash
mkdir my-turborepo
cd my-turborepo
```

#### 3.2.2 初始化 Git 仓库

```bash
git init
```

#### 3.2.3 创建 .gitignore 文件

创建一个合理的 `.gitignore` 文件，包含以下内容：

```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
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

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Turbo cache
.turbo
```

#### 3.2.4 创建 package.json 文件

创建根目录下的 `package.json` 文件，配置工作区和基本信息：

```json
{
  "name": "my-turborepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "test": "turbo test"
  },
  "devDependencies": {
    "turbo": "latest"
  }
}
```

#### 3.2.5 创建 turbo.json 文件

创建 `turbo.json` 配置文件，定义任务管道：

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["lint"],
      "outputs": ["coverage/**"]
    },
    "dev": {
      "persistent": true,
      "cache": false
    }
  }
}
```

#### 3.2.6 创建项目结构

根据工作区配置，创建相应的目录结构：

```bash
# 创建 apps 目录和 packages 目录
mkdir -p apps packages
```

### 3.3 为不同的包管理器初始化

根据你选择的包管理器，初始化过程会略有不同：

#### 3.3.1 使用 npm 初始化

```bash
# 在项目根目录下运行
npm install
```

#### 3.3.2 使用 yarn 初始化

```bash
# 在项目根目录下运行
yarn install
```

#### 3.3.3 使用 pnpm 初始化

对于 pnpm，你需要先创建一个 `pnpm-workspace.yaml` 文件：

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

然后运行：

```bash
pnpm install
```

## 4. 项目结构说明

初始化完成后，Turborepo 项目通常包含以下结构：

```
my-turborepo/
  ├── .gitignore           # Git 忽略配置
  ├── package.json         # 根工作区配置
  ├── turbo.json           # Turbo 任务配置
  ├── apps/                # 应用程序目录
  │   ├── web/             # Web 应用示例
  │   └── native/          # 原生应用示例（可选）
  └── packages/            # 共享包目录
      ├── ui/              # UI 组件库
      └── utils/           # 工具函数库
```

### 4.1 核心目录说明

- **apps/**：存放可独立部署的应用程序，每个子目录都是一个独立的应用
- **packages/**：存放共享的代码包，这些包可以被 apps 中的应用引用
- **根配置文件**：包括 `package.json`、`turbo.json`、`.gitignore` 等

### 4.2 工作区（Workspaces）概念

Turborepo 基于包管理器的工作区（workspaces）功能，允许多个项目在同一个仓库中共享依赖和开发环境。工作区的主要优势包括：

- **共享依赖**：避免多个项目重复安装相同的依赖
- **本地包引用**：允许一个包直接引用另一个本地包，无需发布到 npm
- **统一脚本执行**：可以在根目录执行脚本，统一管理所有项目

## 5. 创建第一个应用和共享包

初始化完成后，让我们创建第一个应用和共享包来熟悉 Turborepo 的工作方式。

### 5.1 创建共享包

#### 5.1.1 创建共享工具包

```bash
# 创建工具包目录
mkdir -p packages/common-utils
cd packages/common-utils

# 初始化包
npm init -y
```

修改 `packages/common-utils/package.json`：

```json
{
  "name": "@my-turborepo/common-utils",
  "version": "1.0.0",
  "description": "共享工具函数库",
  "main": "index.js",
  "exports": {
    ".": "./index.js"
  }
}
```

创建 `packages/common-utils/index.js` 文件：

```javascript
// 导出一个简单的工具函数
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN');
};

export const calculateSum = (numbers) => {
  return numbers.reduce((sum, num) => sum + num, 0);
};
```

### 5.2 创建 Web 应用

#### 5.2.1 使用 Vite 创建 React 应用

```bash
# 返回到项目根目录
cd ../../

# 在 apps 目录下创建 React 应用
npm create vite@latest apps/web -- --template react
```

#### 5.2.2 修改 Web 应用配置

修改 `apps/web/package.json`，添加对共享包的依赖：

```json
{
  "name": "web",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@my-turborepo/common-utils": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "vite": "^4.4.5"
  }
}
```

#### 5.2.3 在 Web 应用中使用共享包

修改 `apps/web/src/App.jsx`，使用我们创建的共享工具函数：

```jsx
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { formatDate, calculateSum } from '@my-turborepo/common-utils'

function App() {
  const [count, setCount] = useState(0)
  const today = formatDate(new Date())
  const sum = calculateSum([1, 2, 3, 4, 5])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        <p>Today is: {today}</p>
        <p>Sum of [1, 2, 3, 4, 5] is: {sum}</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
```

## 6. 运行和构建项目

### 6.1 安装依赖

在项目根目录运行以下命令安装所有依赖：

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

### 6.2 运行开发服务器

```bash
# 在根目录运行所有应用的 dev 脚本
npm run dev

# 或仅运行特定应用
npm run dev -- --filter=web
```

### 6.3 构建项目

```bash
# 构建所有项目
npm run build

# 或仅构建特定项目及其依赖
npm run build -- --filter=web^...
```

### 6.4 运行 lint 和测试

```bash
# 运行 lint
npm run lint

# 运行测试
npm run test
```

## 7. 配置 turbo.json

`turbo.json` 是 Turborepo 的核心配置文件，用于定义任务管道和缓存策略。让我们深入了解其配置选项。

### 7.1 基本配置

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["lint"],
      "outputs": ["coverage/**"]
    },
    "dev": {
      "persistent": true,
      "cache": false
    }
  }
}
```

### 7.2 配置说明

- **`pipeline`**：定义项目中的任务管道
  - **`build`**：构建任务配置
    - **`dependsOn`**：依赖的其他任务，`^build` 表示依赖于所有依赖项的 build 任务
    - **`outputs`**：构建输出目录，用于缓存
  - **`lint`**：代码检查任务配置
  - **`test`**：测试任务配置
  - **`dev`**：开发服务器任务配置
    - **`persistent`**：表示任务是持续运行的
    - **`cache`**：是否缓存任务结果

### 7.3 高级配置选项

#### 7.3.1 全局依赖

```json
{
  "globalDependencies": ["package.json", "turbo.json"],
  "pipeline": {
    // ... 任务配置
  }
}
```

#### 7.3.2 环境变量

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "env": ["NODE_ENV", "API_URL"]
    }
  }
}
```

#### 7.3.3 输入文件

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "inputs": ["src/**/*.ts", "src/**/*.tsx", "!src/**/*.test.ts", "!src/**/*.test.tsx"]
    }
  }
}
```

## 8. 使用过滤（Filter）功能

Turborepo 的过滤功能允许你精确控制要运行的任务范围，这在大型项目中特别有用。

### 8.1 基本过滤语法

```bash
# 运行特定项目的任务
npx turbo run build --filter=web

# 运行特定项目及其所有依赖的任务
npx turbo run build --filter=web^...

# 运行所有依赖于特定项目的任务
npx turbo run build --filter=...^web

# 运行特定组的项目
npx turbo run build --filter="apps/*"

# 排除特定项目
npx turbo run build --filter=!docs
```

### 8.2 组合过滤条件

```bash
# 运行多个特定项目
npx turbo run build --filter=web --filter=mobile

# 复杂过滤条件
npx turbo run build --filter="apps/*" --filter=!apps/docs
```

## 9. 常见问题与解决方案

### 9.1 依赖安装问题

**问题：安装依赖时出现冲突**

**解决方案：**
- 检查是否有重复的依赖项
- 使用包管理器的 `--force` 或 `--legacy-peer-deps` 选项
- 对于 pnpm，可以尝试使用 `pnpm install --shamefully-hoist`

**问题：无法解析本地包依赖**

**解决方案：**
- 确保包的名称在 `package.json` 中正确设置
- 检查 `workspaces` 配置是否包含了包的路径
- 确认包已正确导出所需的模块（检查 `exports` 字段）

### 9.2 构建和运行问题

**问题：构建时找不到依赖的类型定义**

**解决方案：**
- 确保依赖的包包含类型定义或安装了相应的 `@types/` 包
- 检查 TypeScript 配置中的 `paths` 和 `baseUrl` 设置

**问题：运行时出现模块解析错误**

**解决方案：**
- 检查包的导入路径是否正确
- 确认包的 `main` 或 `exports` 字段配置正确
- 对于 TypeScript 项目，检查 `tsconfig.json` 中的模块解析配置

### 9.3 缓存问题

**问题：缓存没有生效**

**解决方案：**
- 检查 `turbo.json` 中的 `outputs` 配置是否正确
- 确保没有修改 `globalDependencies` 中指定的文件
- 尝试使用 `npx turbo clean` 清除缓存后重新构建

**问题：缓存结果不正确**

**解决方案：**
- 检查 `inputs` 配置是否包含了所有影响输出的文件
- 使用 `--force` 参数强制重新执行任务
- 确保环境变量配置正确，特别是在 CI/CD 环境中

## 10. 总结

初始化一个新的 Turborepo 项目是开始使用 Monorepo 架构的重要一步。通过本文的指南，你应该能够：

1. 准备好开发环境，包括 Node.js 和包管理器
2. 使用官方模板或手动方式初始化 Turborepo 项目
3. 理解 Turborepo 的项目结构和工作区概念
4. 创建第一个应用和共享包
5. 配置和运行基本的任务（构建、开发、测试等）
6. 使用过滤功能精确控制任务运行范围
7. 解决常见的问题和挑战

Turborepo 提供了强大的工具来管理大型代码库，通过智能缓存、并行执行和任务依赖管理，可以显著提升开发效率和构建性能。随着你对 Turborepo 的深入了解，你将能够更好地利用其功能来优化你的项目结构和工作流程。

## 11. 下一步学习建议

- [智能缓存、并行执行和任务依赖的基本原理](turbo-core-concepts.md)
- [Turborepo 与其他构建工具对比](turborepo-comparison.md)
- [Monorepo 架构的优势和挑战](monorepo-advantages-challenges.md)