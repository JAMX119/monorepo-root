# turbo 命令行工具的基本用法

## 1. 概述

Turbo 命令行工具是 Turborepo 的核心组件，用于执行和管理 Monorepo 中的构建任务。通过合理使用 Turbo 命令，开发者可以充分利用 Turborepo 的智能缓存、并行执行和任务依赖管理功能，显著提高大型代码库的构建效率。本文将详细介绍 Turbo 命令行工具的基本用法和最佳实践。

## 2. 安装与配置

### 2.1 安装 Turborepo

在使用 Turbo 命令之前，需要先安装 Turborepo。可以通过以下方式在项目中安装：

```bash
# 使用 npm
npm install turbo --save-dev

# 使用 yarn
yarn add turbo --dev

# 使用 pnpm
pnpm add turbo --save-dev
```

### 2.2 全局安装（可选）

也可以选择全局安装 Turborepo，这样可以在任何项目中使用 `turbo` 命令：

```bash
# 使用 npm
npm install -g turbo

# 使用 yarn
yarn global add turbo

# 使用 pnpm
pnpm add -g turbo
```

### 2.3 基本配置

Turbo 命令的行为由项目根目录下的 `turbo.json` 文件配置。在使用 Turbo 命令之前，需要确保项目中已创建正确的 `turbo.json` 配置文件。一个基本的配置示例：

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
    }
  }
}
```

## 3. 基本命令结构

Turbo 命令的基本结构如下：

```bash
turbo [command] [options]
```

其中：
- `[command]` 是要执行的命令，如 `build`、`dev`、`lint` 等
- `[options]` 是可选的命令行参数，用于调整命令的行为

## 4. 常用命令详解

### 4.1 执行任务命令

#### 4.1.1 执行指定任务

```bash
turbo <task>
```

执行项目中定义的指定任务。Turbo 会根据 `turbo.json` 中的配置，确定任务依赖关系并执行相应的任务。

**示例：**

```bash
# 执行 build 任务
turbo build

# 执行 lint 任务
turbo lint

# 执行 test 任务
turbo test
```

#### 4.1.2 执行多个任务

```bash
turbo <task1> <task2> <task3>
```

依次执行多个任务。

**示例：**

```bash
# 依次执行 lint、test 和 build 任务
turbo lint test build
```

### 4.2 过滤命令

Turbo 提供了强大的过滤功能，可以限制任务执行的范围。

#### 4.2.1 按包名过滤

```bash
turbo <task> --filter=<package>
```

仅在指定的包中执行任务。

**示例：**

```bash
# 仅在 web 包中执行 build 任务
turbo build --filter=web

# 仅在 ui-components 包中执行 lint 任务
turbo lint --filter=ui-components
```

#### 4.2.2 按依赖关系过滤

```bash
turbo <task> --filter=<package>...
```

在指定的包及其依赖项中执行任务。

**示例：**

```bash
# 在 web 包及其所有依赖项中执行 build 任务
turbo build --filter=web...
```

#### 4.2.3 按被依赖关系过滤

```bash
turbo <task> --filter=...<package>
```

在依赖于指定包的所有包中执行任务。

**示例：**

```bash
# 在所有依赖于 ui-components 包的包中执行 build 任务
turbo build --filter=...ui-components
```

#### 4.2.4 组合过滤

```bash
turbo <task> --filter=<package1>...<package2>
```

在依赖于 `package1` 且 `package2` 依赖的包中执行任务（交集）。

**示例：**

```bash
# 在依赖于 shared-utils 且被 web 依赖的包中执行 build 任务
turbo build --filter=shared-utils...web
```

#### 4.2.5 排除过滤

```bash
turbo <task> --filter=!<package>
```

排除指定的包，在其他所有包中执行任务。

**示例：**

```bash
# 在除了 legacy-app 之外的所有包中执行 lint 任务
turbo lint --filter=!legacy-app
```

### 4.3 缓存命令

Turbo 的一个核心功能是智能缓存，可以显著提高构建速度。

#### 4.3.1 清除缓存

```bash
turbo clean
```

清除 Turborepo 的本地缓存。

**示例：**

```bash
# 清除所有本地缓存
turbo clean
```

#### 4.3.2 强制重新运行任务

```bash
turbo <task> --force
```

忽略缓存，强制重新运行指定任务。

**示例：**

```bash
# 忽略缓存，强制重新运行 build 任务
turbo build --force
```

#### 4.3.3 禁用缓存

```bash
turbo <task> --no-cache
```

执行任务时不使用缓存，也不更新缓存。

**示例：**

```bash
# 执行 build 任务时不使用缓存
turbo build --no-cache
```

### 4.4 并行执行命令

Turbo 默认会并行执行任务，但可以通过参数调整并行度。

#### 4.4.1 设置并行度

```bash
turbo <task> --concurrency=<number>
```

设置任务并行执行的最大数量。

**示例：**

```bash
# 限制最多 4 个任务并行执行
turbo build --concurrency=4
```

#### 4.4.2 禁用并行执行

```bash
turbo <task> --sequential
```

按顺序执行任务，不使用并行执行。

**示例：**

```bash
# 按顺序执行 build 任务
turbo build --sequential
```

### 4.5 日志和输出命令

Turbo 提供了多种日志和输出选项，方便调试和监控。

#### 4.5.1 设置日志级别

```bash
turbo <task> --log-level=<level>
```

设置日志输出级别，可选值：`trace`, `debug`, `info`, `warn`, `error`。

**示例：**

```bash
# 设置日志级别为 debug
turbo build --log-level=debug
```

#### 4.5.2 只显示任务输出

```bash
turbo <task> --output-logs=<mode>
```

控制任务输出日志的显示方式，可选值：`new-only`, `errors-only`, `all`。

**示例：**

```bash
# 只显示新执行的任务的输出
turbo build --output-logs=new-only

# 只显示执行出错的任务的输出
turbo build --output-logs=errors-only
```

## 5. 高级命令和选项

### 5.1 环境变量

Turbo 支持多种环境变量，用于控制其行为：

```bash
# 设置远程缓存服务器地址
TURBO_API=http://my-cache-server.com turbo build

# 设置缓存签名密钥
TURBO_TEAM=my-team TURBO_TOKEN=my-token turbo build

# 禁用远程缓存
TURBO_REMOTE_CACHE_SKIP_WRITE=true turbo build
```

### 5.2 自定义任务配置

可以在执行任务时覆盖 `turbo.json` 中的配置：

```bash
turbo <task> --<config-key>=<value>
```

**示例：**

```bash
# 覆盖 build 任务的输出目录配置
turbo build --outputs=dist/**,public/**

# 覆盖 build 任务的依赖配置
turbo build --dependsOn=^build,prepare
```

### 5.3 运行脚本命令

除了执行 `turbo.json` 中定义的任务，还可以直接运行脚本命令：

```bash
turbo run <script> [options]
```

**示例：**

```bash
# 运行名为 "deploy" 的脚本
turbo run deploy

# 在 web 包中运行 "deploy" 脚本
turbo run deploy --filter=web
```

### 5.4 工作区命令

Turbo 提供了一些命令用于管理工作区：

#### 5.4.1 列出工作区

```bash
turbo list
```

列出项目中的所有工作区。

**示例：**

```bash
# 列出所有工作区
turbo list

# 以 JSON 格式列出所有工作区
turbo list --json
```

#### 5.4.2 检查任务依赖图

```bash
turbo graph <task> --format=<format>
```

生成并显示任务依赖图。

**示例：**

```bash
# 生成 build 任务的依赖图并以 dot 格式输出
turbo graph build --format=dot

# 生成 build 任务的依赖图并保存为 JSON 文件
turbo graph build --format=json > build-graph.json
```

## 6. 常见用例和示例

### 6.1 基本构建工作流

**场景：** 执行整个项目的构建任务

**命令：**

```bash
turbo build
```

**说明：** 此命令会根据 `turbo.json` 中的配置，确定任务依赖关系并执行所有包的 `build` 任务，利用智能缓存和并行执行提高效率。

### 6.2 开发服务器工作流

**场景：** 启动开发服务器并监视文件变化

**配置：** 在 `turbo.json` 中添加：

```json
{
  "pipeline": {
    "dev": {
      "persistent": true,
      "cache": false,
      "outputs": []
    }
  }
}
```

**命令：**

```bash
turbo dev
```

**说明：** 此命令会启动所有包的开发服务器，并保持运行状态（`persistent: true`），同时禁用缓存（`cache: false`）以便实时反映代码变更。

### 6.3 特定包的开发工作流

**场景：** 仅对特定包进行开发和构建

**命令：**

```bash
# 仅在 web 包中启动开发服务器
turbo dev --filter=web

# 构建 web 包及其依赖项
turbo build --filter=web...

# 在依赖于 shared-utils 包的所有包中运行测试
turbo test --filter=...shared-utils
```

**说明：** 使用 `--filter` 选项可以限制任务执行的范围，适用于大型项目中仅需关注部分包的场景。

### 6.4 持续集成工作流

**场景：** 在 CI/CD 环境中执行构建和测试

**命令：**

```bash
# 配置远程缓存
TURBO_TEAM=my-team TURBO_TOKEN=my-token \

# 执行 lint、test 和 build 任务
turbo lint test build
```

**说明：** 在 CI/CD 环境中，结合远程缓存可以显著提高构建速度，减少重复工作。

### 6.5 缓存管理工作流

**场景：** 管理和调试缓存

**命令：**

```bash
# 强制重新运行所有任务
turbo build --force

# 清除本地缓存
turbo clean

# 禁用缓存执行任务
turbo build --no-cache

# 查看缓存命中率（需要开启 debug 日志）
turbo build --log-level=debug
```

**说明：** 这些命令有助于管理和调试 Turbo 的缓存功能，解决可能出现的缓存相关问题。

## 7. 命令行选项参考

以下是 Turbo 命令行工具的常用选项：

| 选项 | 描述 | 示例 |
|------|------|------|
| `--filter=<package>` | 过滤要执行任务的包 | `--filter=web` |
| `--force` | 强制重新运行任务，忽略缓存 | `--force` |
| `--no-cache` | 不使用缓存，也不更新缓存 | `--no-cache` |
| `--concurrency=<number>` | 设置并行执行的任务数量 | `--concurrency=4` |
| `--sequential` | 按顺序执行任务，禁用并行 | `--sequential` |
| `--log-level=<level>` | 设置日志级别 | `--log-level=debug` |
| `--output-logs=<mode>` | 控制任务输出日志显示方式 | `--output-logs=errors-only` |
| `--dry-run` | 模拟执行任务，不实际运行 | `--dry-run` |
| `--graph=<file>` | 生成任务依赖图并保存 | `--graph=graph.dot` |
| `--json` | 以 JSON 格式输出结果 | `--json` |
| `--help`, `-h` | 显示帮助信息 | `-h` |
| `--version`, `-v` | 显示版本信息 | `-v` |

## 8. 环境变量参考

以下是影响 Turbo 行为的主要环境变量：

| 环境变量 | 描述 | 默认值 |
|---------|------|-------|
| `TURBO_API` | 远程缓存服务器地址 | `https://vercel.com/api` |
| `TURBO_TEAM` | 远程缓存团队 ID | - |
| `TURBO_TOKEN` | 远程缓存访问令牌 | - |
| `TURBO_REMOTE_CACHE_SKIP_READ` | 是否跳过读取远程缓存 | `false` |
| `TURBO_REMOTE_CACHE_SKIP_WRITE` | 是否跳过写入远程缓存 | `false` |
| `TURBO_CACHE_DIR` | 本地缓存目录路径 | `.turbo` |
| `TURBO_LOG_LEVEL` | 日志级别 | `info` |
| `NODE_ENV` | 节点环境 | - |

## 9. 最佳实践

### 9.1 合理使用过滤功能

- 在大型项目中，使用 `--filter` 选项限制任务执行范围，提高效率
- 结合 `...` 和 `!...` 等操作符，精确控制任务执行的包范围
- 为常用的过滤组合创建 npm/yarn/pnpm 脚本

### 9.2 优化缓存策略

- 合理配置 `turbo.json` 中的 `outputs` 和 `inputs`，确保缓存有效性
- 定期清理无效缓存，但避免过度使用 `--force` 选项
- 在 CI/CD 环境中配置远程缓存，提高团队协作效率

### 9.3 并行执行优化

- 根据项目规模和硬件配置，调整 `--concurrency` 参数
- 对于资源密集型任务，考虑使用 `--sequential` 选项避免资源竞争
- 将长时间运行的任务拆分为多个小任务，充分利用并行执行

### 9.4 日志和调试

- 使用 `--log-level=debug` 选项获取详细的执行信息
- 使用 `--output-logs=errors-only` 在 CI/CD 环境中只关注错误信息
- 利用 `turbo graph` 命令可视化任务依赖关系，优化任务配置

## 10. 常见问题与解决方案

### 10.1 缓存问题

**问题：** 缓存没有被正确命中

**解决方案：**
- 检查 `turbo.json` 中的 `outputs` 和 `inputs` 配置是否正确
- 确认所有影响任务输出的文件都被包含在 `inputs` 中
- 检查环境变量是否发生变化，可能导致缓存失效
- 运行 `turbo clean` 清理本地缓存后重试

**问题：** 远程缓存无法正常工作

**解决方案：**
- 确认 `TURBO_TEAM` 和 `TURBO_TOKEN` 环境变量是否正确设置
- 检查网络连接和防火墙设置
- 查看是否有 `TURBO_REMOTE_CACHE_SKIP_READ` 或 `TURBO_REMOTE_CACHE_SKIP_WRITE` 环境变量被设置

### 10.2 任务执行问题

**问题：** 任务执行顺序不正确

**解决方案：**
- 检查 `turbo.json` 中的 `dependsOn` 配置是否正确
- 确保依赖关系没有循环依赖
- 使用 `turbo graph` 命令检查任务依赖图

**问题：** 并行执行导致资源竞争

**解决方案：**
- 使用 `--concurrency` 选项减少并行任务数量
- 对于关键资源，使用 `--sequential` 选项按顺序执行任务
- 考虑调整任务配置，将资源密集型任务安排在不同时间执行

### 10.3 过滤功能问题

**问题：** 过滤选项不生效

**解决方案：**
- 检查过滤表达式语法是否正确
- 确认包名是否与 `package.json` 中的 `name` 字段一致
- 尝试使用更简单的过滤表达式，逐步增加复杂度

## 11. 总结

Turbo 命令行工具是 Turborepo 的核心组件，提供了强大的任务执行、缓存管理和工作区过滤功能。通过本文的介绍，你应该能够：

1. 理解 Turbo 命令的基本结构和使用方法
2. 掌握常用命令（如 `build`、`dev`、`lint` 等）的用法
3. 学会使用过滤功能限制任务执行范围
4. 了解缓存管理、并行执行和日志配置的选项
5. 应用最佳实践优化 Turbo 命令的使用
6. 解决常见问题，确保 Turbo 命令的正常运行

合理使用 Turbo 命令行工具，可以充分发挥 Turborepo 的优势，显著提高 Monorepo 项目的开发和构建效率。随着项目的发展，你可能需要根据具体需求调整和优化 Turbo 命令的使用方式，但掌握这些基本概念和原则将为你的项目奠定坚实的基础。