# Microservices Monorepo

<div align="center">
  <img src="https://img.shields.io/badge/Monorepo-Turborepo-blue" alt="Turborepo" />
  <img src="https://img.shields.io/badge/Architecture-Microservices-green" alt="Microservices" />
  <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Next.js-yellow" alt="Frontend" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20TypeScript-red" alt="Backend" />
  <img src="https://img.shields.io/badge/License-MIT-purple" alt="License" />
</div>

## 项目简介

这是一个基于 Turborepo 的现代化微服务架构 monorepo 项目，集成了前端应用、后端服务和共享库。项目采用当代 JavaScript/TypeScript 技术栈，旨在提供一个高效、可扩展且易于维护的全栈开发环境，特别适合中大型团队协作开发复杂应用。

## 项目特点

- **📦 Monorepo 架构**: 使用 Turborepo 管理多个相关项目，实现代码复用和依赖共享
- **🔄 微服务设计**: 后端采用微服务架构，服务间低耦合，易于独立开发、测试和部署
- **🔗 共享代码**: 在多个项目间共享 UI 组件、工具函数和 API 客户端，减少代码重复
- **⚡ 高效构建**: 利用 Turborepo 的智能缓存和并行执行能力，显著提升构建和测试速度
- **🛠️ 统一工作流**: 标准化开发、构建、测试和部署流程，提高团队协作效率
- **📱 多平台支持**: 同时支持 Web 和原生应用开发，共享业务逻辑和数据模型

## 技术栈

### 核心技术
- **Node.js**: JavaScript 运行时环境
- **TypeScript**: 类型安全的 JavaScript 超集
- **pnpm**: 高性能的包管理器
- **Turborepo**: 高性能的 monorepo 构建系统

### 前端技术
- **React**: 用于构建用户界面的 JavaScript 库
- **Next.js**: React 应用框架，支持服务端渲染和静态生成

### 后端技术
- **Node.js**: 服务端 JavaScript 运行时
- **Express**: Web 应用框架

### 测试工具
- **Jest**: JavaScript 测试框架
- **ESLint**: 代码质量工具
- **Prettier**: 代码格式化工具

## 项目结构

```
monorepo-root/
├── apps/            # 应用程序（可独立部署的项目）
│   ├── admin-react/ # 管理后台（基于 React + Vite）
│   ├── native/      # 移动应用（预留目录）
│   └── web-nextjs/  # Web 应用（基于 Next.js）
├── packages/        # 共享库和工具（供多个应用使用）
│   ├── api-client/  # API 客户端库（统一的 API 调用接口）
│   ├── common-utils/ # 通用工具函数库（业务无关的工具方法）
│   └── ui-components/ # 共享 UI 组件库（可复用的界面组件）
├── services/        # 后端微服务
│   ├── binance-auto-trading/ # 币安自动交易服务
│   └── express/     # Express 基础服务
├── configs/         # 共享配置文件（跨项目的配置项）
├── doc/             # 项目文档（指南、API 文档等）
│   ├── initial-project/ # 项目初始化相关文档
│   └── turborepo-learning-path/ # Turborepo 学习路径文档
├── scripts/         # 辅助脚本（自动化任务、部署脚本等）
├── .gitignore       # Git 忽略配置
├── package.json     # 根级 package.json（定义工作区和公共脚本）
├── pnpm-workspace.yaml # pnpm 工作区配置
├── tsconfig.json    # TypeScript 全局配置
└── turbo.json       # Turborepo 配置（任务定义、依赖关系等）
```

## 快速开始

### 前提条件
- Node.js >= 18.0.0（推荐使用 [nvm](https://github.com/nvm-sh/nvm) 管理 Node.js 版本）
- pnpm >= 9.0.0（可通过 `npm install -g pnpm` 安装）

### 安装依赖

在项目根目录运行以下命令安装所有依赖：

```bash
# 在项目根目录运行
pnpm install
```

此命令会使用 pnpm 的工作区功能，一次性安装所有子项目的依赖，同时优化依赖重复。

### 启动开发服务器

#### 启动所有应用

```bash
# 启动所有应用的开发服务器
pnpm dev
```

此命令会并行启动所有应用和服务的开发服务器，并利用 Turborepo 的缓存功能加速启动过程。

#### 仅启动特定应用

```bash
# 仅启动 Web 应用
pnpm dev --filter web-nextjs

# 仅启动管理后台
pnpm dev --filter admin-react

# 仅启动 Express 服务
pnpm dev --filter express

# 仅启动币安自动交易服务
pnpm dev --filter binance-auto-trading

# 启动多个特定项目
pnpm dev --filter web-nextjs --filter express
```

### 构建项目

#### 构建所有项目

```bash
# 构建所有项目
pnpm build
```

此命令会按正确顺序构建所有项目，确保依赖项先于依赖它的项目构建。

#### 仅构建特定项目及其依赖

```bash
# 仅构建 Web 应用及其依赖
pnpm build --filter web-nextjs

# 仅构建管理后台及其依赖
pnpm build --filter admin-react

# 仅构建 Express 服务及其依赖
pnpm build --filter express
```

### 运行测试

#### 运行所有测试

```bash
# 运行所有项目的测试
pnpm test
```

#### 仅运行特定项目的测试

```bash
# 仅运行 UI 组件库的测试
pnpm test --filter ui-components

# 仅运行 Express 服务的测试
pnpm test --filter express
```

### 代码质量检查

#### 代码质量检查

#### Lint 检查

```bash
# 对所有项目进行代码质量检查
pnpm lint
```

#### 代码格式化

```bash
# 格式化所有项目的代码
pnpm format
```

## Turborepo 指南

本项目使用 Turborepo 作为 monorepo 管理工具，它提供了智能缓存、并行任务执行等高级功能。

有关 Turborepo 的详细使用指南，请查看项目文档：

```bash
# 查看 Turborepo 详细指南
cat doc/turborepo-guide.md
```

项目还包含完整的 Turborepo 学习路径文档：

```bash
# 查看 Turborepo 学习路径文档
ls doc/turborepo-learning-path/
```

### 常用 Turborepo 命令

```bash
# 查看缓存状态
npx turbo status

# 清除缓存
npx turbo clean

# 运行自定义任务
npx turbo run <task-name>

# 运行任务并强制重新构建
npx turbo run <task-name> --force
```

## 部署指南

### 环境配置

项目支持多种部署环境，需要在各项目中配置对应的环境变量文件：
- `.env.development`：开发环境配置
- `.env.test`：测试环境配置
- `.env.production`：生产环境配置
- `.env.local`：本地开发环境配置（不会被 Git 跟踪）

### 端口配置

各项目默认端口配置如下：
- web-nextjs：8001（可在 package.json 中修改）
- admin-react：8000（可在 vite.config.ts 中修改）
- express：3000（可在 src/index.ts 中修改）
- binance-auto-trading：3001（可在 src/index.ts 中修改）

### 部署流程

1. **构建项目**：在部署前，确保已成功构建所有必要的项目
   ```bash
   pnpm build
   ```

2. **部署应用**：根据目标环境，部署相应的应用和服务
   - Web 应用：可部署到 Vercel、Netlify、AWS 等平台
   - 微服务：可部署到容器化平台如 Kubernetes、Docker Swarm 等

3. **配置服务发现**：确保微服务之间能够正确地相互发现和通信

4. **设置监控**：配置日志收集和性能监控系统

## 贡献指南

### 开发工作流

1. **克隆仓库**：`git clone <仓库地址>`
2. **创建分支**：
   - 功能分支：`git checkout -b feature/your-feature-name`
   - 修复分支：`git checkout -b fix/your-bugfix-name`
3. **提交更改**：遵循语义化提交格式
   ```bash
   git commit -m "feat: 添加新功能描述"
   git commit -m "fix: 修复问题描述"
   git commit -m "docs: 更新文档描述"
   git commit -m "chore: 日常维护描述"
   ```
4. **推送到远程**：`git push origin feature/your-feature-name`
5. **创建 PR**：提交合并请求到主分支，并提供清晰的描述

### 代码规范

- 遵循项目的 ESLint 和 Prettier 配置
- 为新增代码编写单元测试
- 确保所有测试通过后再提交 PR
- 更新相关文档以反映代码变更

## 监控与维护

### 日志管理

各服务的日志会输出到控制台，可根据需要配置日志持久化。

### 常见问题排查

1. **依赖冲突**：尝试使用 `pnpm dedupe` 命令解决依赖冲突
2. **缓存问题**：如果构建或测试出现异常，可以尝试使用 `npx turbo clean` 清除缓存后重试
3. **端口占用**：检查是否有其他进程占用了所需端口，可在各项目的配置文件中修改默认端口
4. **TypeScript 编译错误**：确保所有项目都符合 TypeScript 类型检查要求，可运行 `pnpm type-check` 检查类型错误

## 许可信息

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件

---

© 2024 Microservices Team. All rights reserved.