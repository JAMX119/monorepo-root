# Turborepo 学习路线

## 1. 学习路线概览

本学习路线旨在帮助开发者系统地学习和掌握 Turborepo，从基础概念到高级应用，循序渐进地提升技能。无论你是前端开发者、全栈工程师还是技术负责人，这个学习路线都能帮助你在实际项目中高效地使用 Turborepo。

![学习路线图]→ 前置知识 → 入门阶段 → 进阶阶段 → 高级阶段 → 实践项目

## 2. 前置知识

在开始学习 Turborepo 之前，建议你具备以下基础知识：

### 2.1 JavaScript/TypeScript 基础
- 熟悉 ES6+ 特性（箭头函数、解构赋值、模块化等）
- 了解 TypeScript 基本语法和类型系统
- 掌握异步编程（Promise、async/await）

### 2.2 Node.js 和包管理器
- 理解 Node.js 基本概念和模块系统
- 熟悉至少一种包管理器（npm、yarn 或 pnpm）的使用
- 了解 package.json 的基本配置

### 2.3 前端构建工具
- 了解前端构建流程（编译、打包、优化等）
- 对 Webpack、Rollup 或 Vite 等构建工具有基本认识
- 理解构建缓存的概念

### 2.4 Git 版本控制
- 掌握 Git 的基本操作（克隆、提交、分支等）
- 了解工作流概念（如 Git Flow）

## 3. 入门阶段（1-2 周）

### 3.1 Turborepo 基础概念

**学习目标**：理解 Turborepo 的核心概念和价值

**学习内容**：
- [Turborepo 的定义和主要特点](./turborepo-definition-features.md)
- [Monorepo 架构的优势和挑战](./monorepo-advantages-challenges.md)
- [Turborepo 与其他构建工具的对比](./turborepo-comparison.md)
- [智能缓存、并行执行和任务依赖的基本原理](./turbo-core-concepts.md)

**学习资源**：
- [Turborepo 官方文档](https://turbo.build/repo)
- [Monorepo 介绍](https://turbo.build/repo/docs/handbook/what-is-a-monorepo)


### 3.2 环境搭建

**学习目标**：搭建 Turborepo 开发环境

**学习内容**：
- [安装 Node.js 和 pnpm/yarn/npm](./install-nodejs-pnpm-yarn-npm.md)
- [初始化一个新的 Turborepo 项目](./initialize-turborepo-project.md)
- [了解 Turborepo 项目结构和配置文件](./turborepo-project-structure.md)


### 3.3 基本使用

**学习目标**：掌握 Turborepo 的基本命令和用法

**学习内容**：
- [turbo 命令行工具的基本用法](./turbo-cli-basic-usage.md)
- [运行和管理 monorepo 中的任务](./running-managing-tasks.md)
- [理解 Turborepo 任务过滤（filtering）机制](./turborepo-task-filtering.md)
- [查看 Turborepo 构建输出和缓存状态](./viewing-build-outputs-cache-status.md)


## 4. 进阶阶段（2-3 周）

### 4.1 任务配置

**学习目标**：掌握 turbo.json 的配置和任务管道设计

**学习内容**：
- [Turborepo turbo.json 文件的结构和配置选项](./turbo-json-configuration.md)
- [Turborepo 定义任务依赖关系（dependsOn）](./turborepo-task-dependencies.md)
- [Turborepo 配置任务输出（outputs）和环境变量（env）](./turborepo-task-outputs-env.md)
- [Turborepo 设置持久化任务（persistent）](./turborepo-persistent-tasks.md)


### 4.2 缓存策略

**学习目标**：优化 Turborepo 的缓存策略

**学习内容**：
- 理解 Turborepo 的缓存机制
- 配置全局依赖（globalDependencies）
- 使用 .turboignore 文件排除不需要缓存的内容
- 处理缓存失效问题

**实践任务**：
在项目根目录创建 .turboignore 文件：
```
# 排除大型二进制文件
*.exe
*.dll

# 排除日志文件
*.log

# 排除临时文件
*.tmp
*.temp
```

### 4.3 工作流优化

**学习目标**：优化团队开发工作流

**学习内容**：
- 在 package.json 中配置共享脚本
- 实现增量构建和部分构建
- 设置 IDE 支持和自动完成
- 集成代码格式化和 lint 工具

**实践任务**：
优化根级 package.json 文件：
```json
{
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "format": "prettier --write '**/*.{ts,tsx,js,jsx,json,md}'",
    "type-check": "turbo run type-check"
  }
}
```

## 5. 高级阶段（2-3 周）

### 5.1 性能优化

**学习目标**：深入优化 Turborepo 的性能

**学习内容**：
- 分析和优化构建时间
- 配置远程缓存（Remote Caching）
- 调整并行度和内存使用
- 实现自定义缓存键（cacheKey）

**实践任务**：
```bash
# 连接到远程缓存
npx turbo link

# 查看缓存统计信息
npx turbo run build --dry-run --graph
```

### 5.2 CI/CD 集成

**学习目标**：将 Turborepo 集成到 CI/CD 流程中

**学习内容**：
- 在 GitHub Actions 或其他 CI 平台中设置 Turborepo
- 配置 CI 环境中的远程缓存
- 实现条件构建和增量部署
- 处理 CI 环境中的特殊情况

**实践任务**：
创建 GitHub Actions 配置文件（.github/workflows/ci.yml）：
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      - name: Install dependencies
        run: pnpm install
      - name: Build
        run: npx turbo build
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
```

### 5.3 自定义扩展

**学习目标**：扩展 Turborepo 的功能

**学习内容**：
- 创建自定义脚本和工具
- 实现自定义任务和插件
- 集成第三方工具和服务
- 解决复杂的构建场景

**实践任务**：
创建一个自定义脚本（scripts/custom-task.js）：
```javascript
const { execSync } = require('child_process');

// 自定义任务逻辑
try {
  console.log('Running custom task...');
  // 执行一些自定义操作
  execSync('npx turbo run build --filter "apps/*"', {
    stdio: 'inherit'
  });
  console.log('Custom task completed successfully!');
} catch (error) {
  console.error('Custom task failed:', error);
  process.exit(1);
}
```

## 6. 实践项目

通过实际项目巩固所学知识：

### 6.1 小型项目（1-2 周）
**项目目标**：创建一个简单的 monorepo，包含两个共享代码的前端应用

**技术栈**：React, TypeScript, Vite, Turborepo

**项目结构**：
```
monorepo/
├── apps/
│   ├── app1/        # 第一个 React 应用
│   └── app2/        # 第二个 React 应用
├── packages/
│   └── ui/          # 共享 UI 组件库
├── package.json
└── turbo.json
```

**关键任务**：
- 使用 create-turbo 初始化项目
- 创建共享的 UI 组件库
- 在两个应用中使用共享组件
- 配置任务管道和缓存

### 6.2 中型项目（3-4 周）
**项目目标**：创建一个包含前后端的全栈 monorepo

**技术栈**：React, Next.js, Node.js, Express, Turborepo

**项目结构**：
```
monorepo/
├── apps/
│   ├── web/         # Next.js Web 应用
│   └── admin/       # 管理后台应用
├── packages/
│   ├── api-client/  # API 客户端库
│   ├── common-types/ # 共享类型定义
│   └── utils/       # 共享工具函数
├── services/
│   └── api/         # Express API 服务
├── package.json
└── turbo.json
```

**关键任务**：
- 设置前后端分离的 monorepo 结构
- 创建共享的 API 客户端和类型定义
- 实现开发模式下的并行启动
- 配置 CI/CD 流水线

### 6.3 大型项目（6-8 周）
**项目目标**：构建一个复杂的微服务架构 monorepo

**技术栈**：React, Next.js, Node.js, GraphQL, Docker, Turborepo

**项目结构**：
```
monorepo/
├── apps/
│   ├── web/         # 主 Web 应用
│   ├── mobile-web/  # 移动 Web 应用
│   └── docs/        # 文档站点
├── packages/
│   ├── ui/          # UI 组件库
│   ├── graphql/     # GraphQL 客户端和模式
│   ├── auth/        # 认证库
│   └── config/      # 共享配置
├── services/
│   ├── api-gateway/ # API 网关
│   ├── user-service/ # 用户服务
│   ├── product-service/ # 产品服务
│   └── order-service/ # 订单服务
├── configs/
│   ├── eslint/      # ESLint 配置
│   └── jest/        # Jest 配置
├── scripts/
│   ├── deploy.sh    # 部署脚本
│   └── release.sh   # 发布脚本
├── package.json
└── turbo.json
```

**关键任务**：
- 设计和实现复杂的任务依赖关系
- 配置远程缓存和 CI/CD 集成
- 实现微服务之间的通信
- 优化构建性能和开发体验

## 7. 学习资源

### 7.1 官方文档
- [Turborepo 官方文档](https://turbo.build/repo)
- [Turborepo GitHub 仓库](https://github.com/vercel/turbo)
- [Vercel 博客中的 Turborepo 文章](https://vercel.com/blog/tag/turborepo)

### 7.2 视频教程
- [Turborepo 入门教程](https://www.youtube.com/watch?v=z95O0q7l_Wc)
- [Monorepo 最佳实践](https://www.youtube.com/watch?v=7l_98YHnB8M)
- [Turborepo 高级配置](https://www.youtube.com/watch?v=5fD89qE0oNk)

### 7.3 博客文章
- [为什么选择 Turborepo](https://blog.logrocket.com/why-you-should-consider-turborepo-for-your-next-project/)
- [Turborepo 性能优化指南](https://dev.to/this-is-learning/turborepo-performance-optimization-guide-3a6d)
- [Monorepo 架构设计模式](https://www.builder.io/blog/monorepo-patterns)

### 7.4 社区资源
- [Discord 社区](https://discord.com/invite/turbo)
- [Twitter 标签](https://twitter.com/hashtag/turborepo)
- [Reddit 社区](https://www.reddit.com/r/javascript/)

## 8. 学习时间线

| 阶段 | 时间 | 主要目标 | 完成标准 |
|------|------|----------|----------|
| 入门阶段 | 1-2 周 | 理解基本概念和操作 | 能初始化项目并运行基本命令 |
| 进阶阶段 | 2-3 周 | 掌握配置和优化 | 能配置复杂任务和优化缓存 |
| 高级阶段 | 2-3 周 | 深入理解和扩展 | 能集成 CI/CD 和解决复杂问题 |
| 实践项目 | 4-8 周 | 应用所学知识 | 完成 1-2 个实际项目 |

## 9. 常见问题解答

### 9.1 Turborepo 与其他构建工具的区别？
Turborepo 专注于 monorepo 的构建优化，相比 Lerna、Nx 等工具，它在缓存策略和构建速度方面有明显优势，特别是对于大型代码库。

### 9.2 什么时候应该使用 Turborepo？
当你管理多个相关项目，希望共享代码和优化构建流程时，Turborepo 是一个很好的选择。特别是对于前端团队、全栈开发团队和微服务架构。

### 9.3 如何解决缓存不生效的问题？
检查 turbo.json 中的 outputs 配置是否正确，确保所有输出文件都被正确声明。同时检查是否有未声明的依赖会影响构建结果。

### 9.4 Turborepo 支持哪些包管理器？
Turborepo 支持 npm、yarn 和 pnpm，但推荐使用 pnpm，因为它在 monorepo 中具有更好的性能和空间效率。

### 9.5 如何在 CI 环境中使用 Turborepo？
在 CI 环境中，你需要设置 TURBO_TOKEN 和 TURBO_TEAM 环境变量来启用远程缓存。详细配置请参考官方文档中的 CI 集成部分。

---

希望这个学习路线能帮助你系统地掌握 Turborepo！学习是一个持续的过程，建议你在实际项目中不断实践和探索，以深化对 Turborepo 的理解和应用。