# 理解 Turborepo 任务过滤（filtering）机制

## 1. 概述

在大型 Monorepo 项目中，高效地执行特定任务而不是对所有包运行相同的命令是提高开发效率的关键。Turborepo 提供了强大的任务过滤机制，允许开发者精确控制哪些包应该执行特定任务。本文将详细介绍 Turborepo 的任务过滤机制，包括各种过滤语法、使用场景、高级技巧和最佳实践。

## 2. 基本过滤概念

### 2.1 什么是任务过滤

任务过滤是 Turborepo 提供的一种机制，允许开发者在运行任务时限制任务的执行范围，只对符合特定条件的包执行任务。这对于大型 Monorepo 项目尤为重要，可以显著减少不必要的任务执行，提高开发效率和构建速度。

### 2.2 过滤的作用

- **提高开发效率**：只对相关的包执行任务，避免不必要的工作
- **减少构建时间**：跳过无关包的构建，加快整体构建速度
- **降低资源消耗**：减少 CPU、内存和磁盘 I/O 等资源的使用
- **简化开发流程**：允许开发者专注于特定的工作区
- **支持复杂工作流**：可以组合不同的过滤条件以支持复杂的开发场景

## 3. 基本过滤语法

### 3.1 按包名过滤

最简单的过滤方式是直接指定包名：

```bash
turbo <task> --filter=<package-name>
```

**示例：**

```bash
# 只在 web 包中运行 build 任务
turbo build --filter=web

# 只在 ui-components 包中运行 test 任务
turbo test --filter=ui-components
```

### 3.2 包含依赖关系的过滤

使用三点语法 `...` 可以包含依赖关系：

```bash
turbo <task> --filter=<package>...
```

这种语法会匹配指定包及其所有依赖项（包括直接和间接依赖）。

**示例：**

```bash
# 在 web 包及其所有依赖项中运行 build 任务
turbo build --filter=web...
```

### 3.3 包含被依赖关系的过滤

使用反向三点语法 `...<package>` 可以包含被依赖关系：

```bash
turbo <task> --filter=...<package>
```

这种语法会匹配所有依赖于指定包的包（包括直接和间接依赖）。

**示例：**

```bash
# 在所有依赖于 ui-components 包的包中运行 build 任务
turbo build --filter=...ui-components
```

### 3.4 精确匹配路径

使用 `//` 前缀可以精确匹配路径：

```bash
turbo <task> --filter=//<path-to-package>
```

**示例：**

```bash
# 只在 apps/web 包中运行 build 任务
turbo build --filter=//apps/web

# 在 apps 目录下的所有包中运行 test 任务
turbo build --filter=//apps/*
```

## 4. 高级过滤语法

### 4.1 组合过滤条件

可以组合使用多种过滤语法来创建更精确的过滤条件：

```bash
turbo <task> --filter=<pattern1> --filter=<pattern2> --filter=<patternN>
```

**示例：**

```bash
# 在 web 包及其所有依赖项中运行 build 任务，但排除 legacy-app 包
turbo build --filter=web... --filter=!legacy-app

# 在所有依赖于 shared-utils 且被 web 依赖的包中运行 build 任务
turbo build --filter=shared-utils...web
```

### 4.2 排除过滤

使用感叹号 `!` 可以排除特定的包：

```bash
turbo <task> --filter=!<package-name>
```

**示例：**

```bash
# 运行所有包的 build 任务，但排除 legacy-app 包
turbo build --filter=!legacy-app

# 在 web 包及其依赖项中运行 build 任务，但排除 node_modules 中的依赖
turbo build --filter=web... --filter=!node_modules/*
```

### 4.3 路径模式匹配

可以使用通配符 `*` 进行路径模式匹配：

```bash
turbo <task> --filter=<pattern-with-wildcards>
```

**示例：**

```bash
# 在所有以 "app-" 开头的包中运行 build 任务
turbo build --filter=app-*

# 在 packages 目录下的所有包中运行 test 任务
turbo build --filter=packages/*

# 在 apps 目录下所有包含 "admin" 的包中运行 lint 任务
turbo lint --filter=apps/*admin*
```

### 4.4 范围过滤

使用逗号 `,` 可以指定多个包：

```bash
turbo <task> --filter=<package1>,<package2>,<package3>
```

**示例：**

```bash
# 在 web 和 mobile 包中运行 build 任务
turbo build --filter=web,mobile

# 在 core, utils 和 api 包中运行 test 任务
turbo test --filter=core,utils,api
```

### 4.5 基于 git 的过滤

Turborepo 还提供了基于 Git 的过滤功能，可以根据 Git 变更来确定需要运行任务的包：

```bash
turbo <task> --filter=git diff [options] <commit>...<commit>
```

**示例：**

```bash
# 只在与 main 分支相比有变更的包中运行 build 任务
turbo build --filter=git diff main

# 只在最近一次提交中变更的包中运行 test 任务
turbo test --filter=git diff HEAD^ HEAD
```

## 5. 实际应用场景

### 5.1 开发特定应用

在开发过程中，通常只需要专注于特定的应用或服务：

```bash
# 仅启动 web 应用的开发服务器
turbo dev --filter=web

# 仅构建和测试 api-service
turbo build test --filter=api-service
```

### 5.2 跨依赖更新

当修改了一个被多个应用依赖的共享库时，可以使用过滤来确保所有依赖它的应用都被重新构建：

```bash
# 修改了 ui-components 后，重新构建所有依赖它的应用
turbo build --filter=...ui-components
```

### 5.3 增量构建

在 CI/CD 环境中，可以使用基于 Git 的过滤来执行增量构建，只构建有变更的包及其依赖：

```bash
# 在 CI 环境中，只构建与上次提交相比有变更的包
turbo build --filter=git diff HEAD^ HEAD...
```

### 5.4 排除特定环境

在多环境配置中，可以排除特定环境的包：

```bash
# 构建所有包，但排除 production-only 包
turbo build --filter=!production-only

# 仅为开发环境构建包
turbo build --filter=*-dev
```

### 5.5 运行特定类型的任务

可以针对不同类型的包运行特定的任务：

```bash
# 对所有前端应用运行 lint 任务
turbo lint --filter=apps/frontend-*

# 对所有共享库运行 test 任务
turbo test --filter=packages/*
```

## 6. 过滤与任务依赖管理

### 6.1 过滤与任务依赖图

当使用过滤功能时，Turborepo 会构建一个过滤后的任务依赖图，只包含符合过滤条件的包及其必要依赖。这确保了即使在过滤的情况下，任务仍然能够按照正确的依赖顺序执行。

```bash
# 查看过滤后的任务依赖图
turbo graph build --filter=web... --format=dot > filtered-graph.dot
```

### 6.2 过滤与任务缓存

过滤功能与 Turborepo 的智能缓存系统协同工作，可以进一步提高性能：

- 过滤后的任务执行只会重新计算和缓存必要的结果
- 可以避免重新构建已经缓存的、未变更的包
- 基于过滤条件的任务执行结果仍然会被正确缓存

### 6.3 过滤与并行执行

过滤功能可以与并行执行结合使用，进一步优化性能：

```bash
# 在 web 及其依赖中并行运行 build 任务，限制并行度为 4
turbo build --filter=web... --concurrency=4
```

## 7. 高级使用技巧

### 7.1 创建自定义过滤别名

为了简化常用的过滤命令，可以在 `package.json` 中创建自定义脚本：

```json
{
  "scripts": {
    "build:web": "turbo build --filter=web...",
    "build:mobile": "turbo build --filter=mobile...",
    "test:all": "turbo test --filter=!node_modules/*",
    "dev:all-frontend": "turbo dev --filter=apps/frontend-*"
  }
}
```

然后可以通过 `npm run build:web` 或 `pnpm run build:web` 等命令来运行这些自定义脚本。

### 7.2 动态生成过滤条件

对于复杂的场景，可以使用脚本动态生成过滤条件：

```javascript
// scripts/generate-filter.js
const fs = require('fs');
const { execSync } = require('child_process');

// 获取当前分支名称
const branch = execSync('git branch --show-current').toString().trim();

// 根据分支名称生成过滤条件
let filter = '';
if (branch.startsWith('feature/')) {
  const featureName = branch.replace('feature/', '');
  filter = `--filter=feature-${featureName}...`;
} else if (branch === 'main') {
  filter = '--filter=!experimental-*';
}

// 将过滤条件写入文件
fs.writeFileSync('.filter-cache', filter);

console.log(`Generated filter: ${filter}`);
```

然后在 `package.json` 中使用：

```json
{
  "scripts": {
    "generate-filter": "node scripts/generate-filter.js",
    "build:branch": "npm run generate-filter && turbo build $(cat .filter-cache)"
  }
}
```

### 7.3 结合环境变量

可以结合环境变量来创建更灵活的过滤条件：

```bash
# 根据环境变量选择要构建的应用
turbo build --filter=${APP_NAME}...
```

在 `package.json` 中：

```json
{
  "scripts": {
    "build:app": "turbo build --filter=${APP_NAME:-default-app}..."
  }
}
```

### 7.4 过滤条件的程序化使用

在 JavaScript/TypeScript 文件中，可以使用 Turborepo 的 API 来程序化地应用过滤条件：

```javascript
// scripts/build-specific.js
const { execSync } = require('child_process');

// 获取命令行参数\const targetApp = process.argv[2] || 'web';

// 运行带过滤条件的构建命令
execSync(`turbo build --filter=${targetApp}...`, { stdio: 'inherit' });
```

然后通过 `node scripts/build-specific.js mobile` 来运行。

## 8. 最佳实践

### 8.1 命名约定与过滤

建立一致的包命名约定可以使过滤更加高效：

- 使用前缀（如 `app-`、`pkg-`、`lib-`）来区分不同类型的包
- 使用有意义的后缀（如 `-common`、`-utils`、`-api`）来表示包的功能
- 按业务领域组织包，并使用相应的命名模式

```bash
# 使用前缀过滤
 turbo build --filter=app-*

# 使用后缀过滤
 turbo test --filter=*-utils

# 结合前缀和后缀过滤
 turbo lint --filter=pkg-*-common
```

### 8.2 避免过度过滤

虽然过滤可以提高性能，但过度过滤可能导致依赖关系不完整：

- 确保过滤条件包含所有必要的依赖
- 对于关键任务（如生产构建），考虑不过滤以确保所有包都被正确构建
- 了解过滤条件对任务依赖图的影响

### 8.3 与缓存策略结合

将过滤与缓存策略结合使用可以获得最佳性能：

- 使用过滤来减少需要执行的任务数量
- 确保适当配置缓存，以避免重复工作
- 考虑使用远程缓存来进一步提高性能

### 8.4 CI/CD 集成最佳实践

在 CI/CD 环境中使用过滤的最佳实践：

- 使用基于 Git 的过滤来实现增量构建
- 对于 PR 构建，只构建和测试相关的包
- 对于主分支构建，考虑运行完整的构建以确保整体稳定性
- 记录和监控过滤条件对构建时间的影响

```yaml
# GitHub Actions 示例
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build with Turbo
        run: |
          if [ "${{ github.ref }}" == "refs/heads/main" ]; then
            # 主分支运行完整构建
            turbo build
          else
            # PR 只构建相关包
            turbo build --filter=git diff origin/main...
          fi
```

## 9. 常见问题与解决方案

### 9.1 过滤条件不生效

**问题：** 运行带过滤条件的命令时，似乎所有包都被执行了

**解决方案：**
- 检查过滤语法是否正确，特别是三点语法的位置
- 确认包名或路径是否与实际项目结构匹配
- 使用 `--dry` 选项查看哪些包会被包含
- 检查是否有其他过滤条件覆盖了当前条件

### 9.2 依赖关系错误

**问题：** 过滤后的任务执行出现依赖关系错误

**解决方案：**
- 确保使用了 `...` 语法来包含必要的依赖
- 检查 `turbo.json` 中的任务依赖配置是否正确
- 使用 `turbo graph` 查看过滤后的依赖图
- 考虑调整过滤条件以包含更多相关包

### 9.3 性能没有提升

**问题：** 使用过滤后性能没有明显提升

**解决方案：**
- 检查过滤条件是否真正减少了任务数量
- 确认缓存是否正确工作
- 考虑调整并行度设置
- 分析任务执行时间，找出瓶颈所在

### 9.4 与环境变量冲突

**问题：** 过滤条件中的特殊字符与环境变量冲突

**解决方案：**
- 对包含特殊字符的过滤条件使用引号
- 避免在过滤条件中使用与环境变量相同的名称
- 考虑使用脚本生成和管理复杂的过滤条件

### 9.5 基于 Git 的过滤不可靠

**问题：** 基于 Git 的过滤结果不一致

**解决方案：**
- 确保 Git 工作区干净，没有未提交的更改
- 检查 Git 分支和提交历史
- 考虑使用绝对路径而不是相对路径
- 对于 CI 环境，确保正确配置了 Git 深度

## 10. 总结

Turborepo 的任务过滤机制是其最强大的功能之一，它允许开发者精确控制任务的执行范围，从而显著提高开发效率和构建速度。通过本文的介绍，你应该能够：

1. 理解任务过滤的基本概念和作用
2. 掌握各种过滤语法，包括基本过滤、高级过滤和基于 Git 的过滤
3. 应用过滤功能到实际开发场景中，如开发特定应用、跨依赖更新和增量构建
4. 理解过滤与任务依赖、缓存和并行执行的关系
5. 使用高级技巧，如创建自定义过滤别名、动态生成过滤条件等
6. 遵循最佳实践，如建立命名约定、避免过度过滤和与缓存策略结合
7. 解决常见的过滤相关问题

通过合理使用 Turborepo 的任务过滤机制，可以使大型 Monorepo 项目的开发和构建更加高效、灵活和可管理。随着项目的发展，你可能需要根据具体需求调整和优化过滤策略，但掌握这些基本概念和技术将为你的项目奠定坚实的基础。