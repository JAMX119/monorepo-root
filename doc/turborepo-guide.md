# Turborepo 入门指南

## 1. Turborepo 简介

Turborepo 是一个高性能的 JavaScript/TypeScript 代码仓库构建系统，专为 monorepo 设计，可以显著提升大型代码库的构建速度。它由 Vercel 开发并维护，通过智能缓存、并行执行和任务优化，使开发者能够更高效地管理和构建多项目代码库。

### 主要特点
- **智能缓存**：只重新构建必要的部分，避免重复工作
- **并行执行**：同时运行多个任务以提高效率
- **依赖感知**：理解项目间的依赖关系，按正确顺序执行任务
- **增量构建**：利用之前构建的结果加速后续构建
- **跨平台支持**：在 Windows、macOS 和 Linux 上提供一致的体验

## 2. 为什么选择 Turborepo

对于管理多个相关项目的团队来说，Turborepo 提供了以下优势：

- **提高开发效率**：减少等待构建的时间，让开发者专注于编码
- **统一工作流**：在整个 monorepo 中强制执行一致的构建流程
- **优化 CI/CD**：通过远程缓存显著减少 CI 构建时间
- **更好的代码共享**：轻松在多个项目间共享代码和配置
- **降低维护成本**：集中管理依赖和脚本

## 3. 项目结构

我们的 monorepo 采用标准的 Turborepo 结构，包含以下主要部分：

```
monorepo-root/
├── apps/            # 应用程序（前端、移动应用等）
│   ├── native/      # 移动应用
│   └── web/         # Web 应用
├── packages/        # 共享库和工具
│   ├── api-client/  # API 客户端库
│   ├── common-utils/ # 通用工具函数
│   └── ui-components/ # 共享 UI 组件
├── services/        # 后端服务
│   ├── api-gateway/ # API 网关
│   ├── order-service/ # 订单服务
│   ├── payment-service/ # 支付服务
│   └── user-service/ # 用户服务
├── configs/         # 共享配置
├── scripts/         # 辅助脚本
├── package.json     # 根级 package.json
└── turbo.json       # Turborepo 配置
```

### 目录说明
- **apps/**：存放可独立部署的应用程序
- **packages/**：存放可在多个应用间共享的代码库
- **services/**：存放后端微服务
- **configs/**：存放共享的配置文件
- **scripts/**：存放辅助构建和开发的脚本

## 4. 快速开始

### 前提条件
- Node.js >= 16.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
# 在项目根目录运行
pnpm install
```

### 启动开发服务器

```bash
# 启动所有应用的开发服务器
pnpm dev

# 仅启动特定应用
pnpm dev --filter web
```

### 构建项目

```bash
# 构建所有项目
pnpm build

# 仅构建特定项目及其依赖
pnpm build --filter web
```

### 运行测试

```bash
# 运行所有测试
pnpm test

# 仅运行特定项目的测试
pnpm test --filter ui-components
```

### 代码 lint

```bash
# lint 所有项目
pnpm lint

# 格式化代码
pnpm format
```

## 5. 核心功能

### 任务缓存

Turborepo 最强大的功能之一是其智能缓存系统。它会缓存任务的输出，并在输入不变的情况下重用这些输出。

```bash
# 清除缓存
npx turbo clean

# 强制重新构建，忽略缓存
npx turbo build --force
```

### 任务管道

`turbo.json` 文件定义了任务之间的关系和执行方式：

```json
{
  "pipeline": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {
      "cache": true
    }
  }
}
```

### 远程缓存

Turborepo 支持远程缓存，可以在团队成员和 CI/CD 之间共享构建缓存：

```bash
# 连接到远程缓存
npx turbo link

# 断开远程缓存连接
npx turbo unlink
```

## 6. 配置指南

### package.json 配置

根级 `package.json` 定义了工作区和共享脚本：

```json
{
  "name": "microservices-monorepo",
  "private": true,
  "workspaces": [
    "packages/*",
    "services/*",
    "apps/*"
  ],
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "format": "prettier --write '**/*.{ts,tsx,js,jsx,json,md}'"
  },
  "dependencies": {
    "turbo": "^2.5.8"
  },
  "packageManager": "pnpm@8.6.0"
}
```

### turbo.json 配置

`turbo.json` 文件是 Turborepo 的核心配置文件，用于定义任务管道和缓存策略：

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `pipeline` | 定义任务依赖关系和执行规则 | - |
| `globalDependencies` | 全局依赖文件列表 | - |
| `globalEnv` | 全局环境变量列表 | - |
| `cacheDir` | 缓存目录路径 | `.turbo/cache` |
| `remoteCache` | 远程缓存配置 | - |

## 7. 工作流

### 添加新应用

1. 在 `apps/` 目录下创建新的应用目录
2. 在新目录中初始化项目
3. 更新根级 `package.json` 中的 `workspaces` 配置（如有必要）
4. 在 `turbo.json` 中为新项目配置任务管道

### 添加新包

1. 在 `packages/` 目录下创建新的包目录
2. 使用 `pnpm init` 初始化包
3. 实现包的功能
4. 在其他项目中通过 `pnpm add <包名>` 引用该包

### 更新依赖

```bash
# 更新根级依赖
pnpm add -w <依赖名>

# 更新特定项目的依赖
pnpm add <依赖名> --filter <项目名>
```

## 8. 高级功能

### 过滤

Turborepo 提供强大的过滤功能，允许你精确控制要运行的任务：

```bash
# 运行 web 应用及其依赖的任务
pnpm build --filter web...

# 运行依赖于 ui-components 的所有项目的任务
pnpm build --filter ...ui-components

# 运行特定目录下的项目任务
pnpm build --filter "./apps/*"
```

### 环境变量

你可以在 `turbo.json` 中定义任务的环境变量：

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

### 增量构建

Turborepo 会自动检测文件变化，并只重新构建受影响的部分：

```bash
# 查看任务图，了解任务之间的依赖关系
npx turbo run build --dry-run
```

## 9. 最佳实践

### 项目结构
- 保持应用和库的职责单一
- 使用清晰的命名约定
- 遵循一致的代码风格

### 任务配置
- 为所有任务定义明确的输出目录
- 合理设置任务依赖关系
- 对开发任务禁用缓存 (`"cache": false`) 和启用持久化 (`"persistent": true`)

### 性能优化
- 使用 `.turboignore` 文件排除不需要缓存的文件
- 利用远程缓存加速团队协作和 CI/CD
- 定期清理旧缓存

### 安全性
- 不要在代码库中存储敏感信息
- 使用 `.env` 文件管理环境变量
- 遵循最小权限原则

## 10. 常见问题

### 缓存不生效
- 检查 `turbo.json` 中的 `outputs` 配置是否正确
- 确认没有更改会影响缓存的文件
- 尝试使用 `--force` 标志强制重新构建

### 任务执行顺序问题
- 检查 `dependsOn` 配置是否正确
- 确保任务依赖关系没有循环

### 内存使用过高
- 减少并行执行的任务数量
- 对大型任务进行拆分
- 增加系统内存限制

## 11. 资源链接

- [Turborepo 官方文档](https://turbo.build/repo)
- [Monorepo 最佳实践](https://turbo.build/repo/docs/guides/best-practices)
- [配置参考](https://turbo.build/repo/docs/reference/configuration)
- [远程缓存设置](https://turbo.build/repo/docs/features/remote-caching)

---

希望这个指南能帮助你快速上手 Turborepo！如果有任何问题或建议，请随时联系团队。