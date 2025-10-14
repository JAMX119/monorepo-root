# 了解 Turborepo 项目结构和配置文件

## 1. 概述

Turborepo 项目拥有一套标准的目录结构和配置文件，这些结构和文件共同构成了 Monorepo 架构的基础。了解这些结构和文件的作用，对于高效使用 Turborepo 和维护大型代码库至关重要。本文将详细介绍 Turborepo 项目的标准结构和核心配置文件。

## 2. 整体项目结构

一个典型的 Turborepo 项目通常包含以下结构：

```
monorepo-root/
  ├── .gitignore           # Git 忽略配置
  ├── README.md            # 项目说明文档
  ├── package.json         # 根工作区配置
  ├── turbo.json           # Turbo 任务配置
  ├── tsconfig.json        # TypeScript 全局配置
  ├── apps/                # 应用程序目录
  │   ├── web/             # Web 应用示例
  │   ├── admin/           # 管理后台示例
  │   └── native/          # 原生应用示例
  ├── packages/            # 共享包目录
  │   ├── ui-components/   # UI 组件库
  │   ├── utils/           # 工具函数库
  │   └── api-client/      # API 客户端库
  ├── configs/             # 共享配置目录
  │   ├── eslint-config/   # ESLint 配置
  │   └── ts-config/       # TypeScript 配置
  └── scripts/             # 共享脚本目录
```

### 2.1 目录结构说明

- **根目录**：包含项目级别的配置文件和文档
- **apps/**：存放可独立部署的应用程序，每个子目录都是一个完整的应用
- **packages/**：存放共享的代码包，这些包可以被 apps 中的应用引用
- **configs/**：存放共享的配置文件，如 ESLint、TypeScript 等配置
- **scripts/**：存放共享的脚本，如部署脚本、数据迁移脚本等

## 3. 根目录配置文件

### 3.1 package.json

根目录下的 `package.json` 是整个 Monorepo 的核心配置文件，用于定义工作区、共享依赖和根级脚本。

#### 3.1.1 基本配置示例

```json
{
  "name": "my-turborepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*",
    "configs/*"
  ],
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "test": "turbo test",
    "clean": "turbo clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "latest",
    "eslint": "^8.45.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0"
  },
  "engines": {
    "node": "^16.0.0",
    "npm": "^8.0.0",
    "yarn": "^1.22.0",
    "pnpm": "^7.0.0"
  }
}
```

#### 3.1.2 关键配置项说明

- **`name`**：项目名称，通常设置为私有包的名称
- **`private`**：设置为 `true`，确保根包不会被发布到 npm
- **`workspaces`**：定义工作区路径，支持 glob 模式
- **`scripts`**：定义根级脚本，通常使用 `turbo` 命令来运行子项目的脚本
- **`devDependencies`**：定义共享的开发依赖
- **`engines`**：指定项目支持的 Node.js 和包管理器版本

### 3.2 turbo.json

`turbo.json` 是 Turborepo 的核心配置文件，用于定义任务管道和缓存策略。

#### 3.2.1 基本配置示例

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [
    "package.json",
    "turbo.json",
    "tsconfig.json"
  ],
  "globalEnv": ["NODE_ENV", "BUILD_VERSION"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "lint": {
      "dependsOn": [],
      "outputs": []
    },
    "test": {
      "dependsOn": ["lint"],
      "outputs": ["coverage/**"]
    },
    "dev": {
      "persistent": true,
      "cache": false
    },
    "clean": {
      "cache": false
    }
  }
}
```

#### 3.2.2 关键配置项说明

- **`$schema`**：指定 JSON Schema 文件，用于编辑器自动补全和验证
- **`globalDependencies`**：定义全局依赖文件，这些文件的变更会导致所有任务缓存失效
- **`globalEnv`**：定义全局环境变量，这些变量的变更会影响所有任务的缓存
- **`pipeline`**：定义任务管道配置
  - **`dependsOn`**：指定任务依赖关系，`^build` 表示依赖于所有依赖项的 build 任务
  - **`outputs`**：指定任务输出目录，用于缓存
  - **`persistent`**：指定任务是否持续运行（如开发服务器）
  - **`cache`**：指定是否缓存任务结果
  - **`inputs`**：指定任务的输入文件
  - **`env`**：指定任务依赖的环境变量

### 3.3 tsconfig.json

根目录下的 `tsconfig.json` 通常用于定义全局 TypeScript 配置，可以被子项目继承。

#### 3.3.1 基本配置示例

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@my-turborepo/*": ["packages/*"]
    }
  },
  "exclude": ["node_modules", "dist", "build"]
}
```

#### 3.3.2 关键配置项说明

- **`compilerOptions`**：定义 TypeScript 编译选项
- **`baseUrl`**：设置模块解析的基础目录
- **`paths`**：定义路径别名，方便引用共享包
- **`exclude`**：排除不需要编译的目录

### 3.4 .gitignore

根目录下的 `.gitignore` 文件用于定义 Git 应忽略的文件和目录。

#### 3.4.1 基本配置示例

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

# Production
dist
dist-ssr
build
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
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

# Package manager files
package-lock.json
yarn.lock
pnpm-lock.yaml

# Temporary files
*.tmp
*.temp
*.cache
```

### 3.5 其他根配置文件

根据项目需求，根目录可能还包含以下配置文件：

- **`.eslintrc.json`**：ESLint 配置
- **`.prettierrc.json`**：Prettier 配置
- **`commitlint.config.js`**：Commitlint 配置
- **`husky.config.js`**：Husky 配置
- **`lint-staged.config.js`**：Lint-staged 配置
- **`jest.config.js`**：Jest 配置

## 4. Apps 目录结构

`apps` 目录用于存放可独立部署的应用程序。每个应用都是一个完整的项目，拥有自己的目录结构和配置文件。

### 4.1 典型的 Web 应用结构

```
apps/web/
  ├── public/
  │   ├── favicon.ico
  │   └── index.html
  ├── src/
  │   ├── components/
  │   ├── pages/
  │   ├── utils/
  │   ├── App.tsx
  │   └── index.tsx
  ├── .eslintrc.json
  ├── package.json
  ├── tsconfig.json
  └── vite.config.ts
```

### 4.2 应用级配置文件

#### 4.2.1 应用 package.json

```json
{
  "name": "web",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@my-turborepo/ui-components": "workspace:*",
    "@my-turborepo/utils": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
```

#### 4.2.2 应用 tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "jsx": "react-jsx",
    "types": ["vite/client"]
  },
  "include": ["src"],
  "references": [{ "path": "../../tsconfig.node.json" }]
}
```

## 5. Packages 目录结构

`packages` 目录用于存放共享的代码包，这些包可以被 `apps` 目录中的应用引用。

### 5.1 典型的共享包结构

```
packages/ui-components/
  ├── src/
  │   ├── components/
  │   │   ├── Button/
  │   │   ├── Card/
  │   │   └── ...
  │   ├── hooks/
  │   ├── utils/
  │   └── index.ts
  ├── .eslintrc.json
  ├── package.json
  ├── tsconfig.json
  └── tsup.config.ts  # 或其他打包配置
```

### 5.2 共享包配置文件

#### 5.2.1 共享包 package.json

```json
{
  "name": "@my-turborepo/ui-components",
  "version": "1.0.0",
  "description": "UI components library",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "require": "./dist/index.js",
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.45.0",
    "tsup": "^7.2.0",
    "typescript": "^5.0.2"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

#### 5.2.2 共享包 tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src"]
}
```

## 6. 不同类型项目的配置示例

### 6.1 React + Vite 应用

#### 6.1.1 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### 6.2 Next.js 应用

#### 6.2.1 next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone'
}

module.exports = nextConfig
```

#### 6.2.2 package.json

```json
{
  "name": "next-app",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "13.4.12",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "@my-turborepo/ui-components": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "20.4.2",
    "@types/react": "18.2.15",
    "@types/react-dom": "18.2.7",
    "eslint": "8.45.0",
    "eslint-config-next": "13.4.12",
    "typescript": "5.1.6"
  }
}
```

### 6.3 Node.js 服务

#### 6.3.1 package.json

```json
{
  "name": "api-service",
  "private": true,
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src --ext ts --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@my-turborepo/api-client": "workspace:*"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.4.2",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.45.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.0.2"
  }
}
```

## 7. 高级项目结构模式

### 7.1 分层架构

在大型项目中，可以采用分层架构来组织代码：

```
monorepo-root/
  ├── apps/
  │   ├── frontend/
  │   └── admin/
  ├── packages/
  │   ├── api/
  │   ├── domain/
  │   ├── infrastructure/
  │   └── presentation/
  └── ...
```

这种结构遵循六边形架构（端口和适配器模式），将业务逻辑与外部依赖分离。

### 7.2 微前端架构

对于大型前端应用，可以采用微前端架构：

```
monorepo-root/
  ├── apps/
  │   ├── shell/          # 主应用（微前端容器）
  │   ├── auth-app/       # 认证子应用
  │   ├── dashboard-app/  # 仪表盘子应用
  │   └── settings-app/   # 设置子应用
  ├── packages/
  │   ├── shared-ui/
  │   └── shared-state/
  └── ...
```

### 7.3 多服务后端架构

对于后端服务，可以采用多服务架构：

```
monorepo-root/
  ├── apps/
  │   ├── web/
  ├── packages/
  │   ├── shared/
  ├── services/
  │   ├── api-gateway/
  │   ├── user-service/
  │   ├── product-service/
  │   └── order-service/
  └── ...
```

## 8. 配置继承与覆盖

Turborepo 支持配置的继承与覆盖，可以在不同层级定义和覆盖配置。

### 8.1 TypeScript 配置继承

根 `tsconfig.json` 可以被子项目继承和扩展：

```json
// 根 tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "strict": true,
    // ... 其他配置
  }
}

// 子项目 tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    // 覆盖或添加特定配置
  }
}
```

### 8.2 ESLint 配置继承

ESLint 配置也可以类似地继承：

```json
// 根 .eslintrc.json
{
  "root": true,
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    // 全局规则
  }
}

// 子项目 .eslintrc.json
{
  "extends": ["../../.eslintrc.json"],
  "rules": {
    // 覆盖或添加特定规则
  }
}
```

### 8.3 Turbo 配置覆盖

虽然 `turbo.json` 通常只在根目录定义，但任务配置可以在子项目的 `package.json` 中覆盖：

```json
// 子项目 package.json
{
  "name": "special-app",
  "scripts": {
    "build": "special-build-script"
  },
  "turbo": {
    "build": {
      "outputs": ["build/**", "special-output/**"],
      "dependsOn": ["special-dependency"]
    }
  }
}
```

## 9. 项目结构最佳实践

### 9.1 保持一致性

- 在整个项目中保持一致的目录结构和命名约定
- 为相似类型的项目使用相同的配置模式
- 定义清晰的代码所有权和责任边界

### 9.2 优化性能

- 合理划分工作区，避免过大的工作区
- 利用 Turborepo 的缓存功能，合理配置 `outputs` 和 `inputs`
- 对大型项目考虑使用远程缓存

### 9.3 可维护性

- 将共享代码提取到 `packages` 目录
- 避免循环依赖
- 为每个工作区提供清晰的文档
- 使用自动化工具（如 lint、prettier、commitlint 等）维护代码质量

### 9.4 扩展性

- 设计灵活的配置系统，支持继承和覆盖
- 考虑未来可能的项目类型和技术栈变化
- 为新团队成员提供清晰的项目结构指南

## 10. 常见问题与解决方案

### 10.1 项目结构问题

**问题：项目变得过于复杂，难以导航**

**解决方案：**
- 重新评估项目结构，考虑进一步拆分或重组
- 引入更细粒度的工作区
- 为关键目录和文件添加详细的 README 文档
- 使用工具如 `nx` 或 `turborepo` 的过滤功能来管理大型项目

**问题：不同团队成员有不同的结构偏好**

**解决方案：**
- 制定并文档化项目结构规范
- 提供项目模板和脚手架工具
- 定期审查和重构项目结构

### 10.2 配置问题

**问题：配置重复，难以维护**

**解决方案：**
- 将共享配置提取到 `configs` 目录
- 使用配置继承机制减少重复
- 使用工具如 `@rushstack/eslint-patch` 来解决 ESLint 配置共享问题

**问题：配置冲突**

**解决方案：**
- 明确配置的继承层次
- 使用工具验证配置的一致性
- 为特定场景定义覆盖规则

## 11. 总结

了解 Turborepo 项目结构和配置文件是高效使用 Monorepo 架构的关键。通过本文的介绍，你应该能够：

1. 理解 Turborepo 项目的标准目录结构
2. 掌握根目录配置文件（package.json、turbo.json、tsconfig.json 等）的作用和配置方法
3. 了解 apps 和 packages 目录的组织结构
4. 学习不同类型项目（Web 应用、Node.js 服务等）的配置示例
5. 掌握高级项目结构模式和配置继承机制
6. 应用项目结构最佳实践，优化项目的可维护性和扩展性

合理的项目结构和配置可以显著提升团队协作效率和代码质量，特别是在大型项目中。随着项目的发展，你可能需要根据具体需求调整和优化项目结构，但理解这些基本概念和原则将为你的项目奠定坚实的基础。