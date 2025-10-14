# 运行和管理 monorepo 中的任务

## 1. 概述

在 Monorepo 架构中，有效管理和运行各种任务（如构建、测试、打包、部署等）是提高开发效率的关键。Turborepo 提供了强大的任务管理功能，通过智能缓存、并行执行和依赖管理等机制，可以显著提升大型代码库的构建和开发效率。本文将详细介绍如何在 Turborepo 中定义、配置、运行和优化各种任务。

## 2. 任务定义与配置基础

### 2.1 任务类型与生命周期

在 Monorepo 中，常见的任务类型包括：

- **构建任务（Build）**：将源代码转换为可执行或可部署的产物
- **开发任务（Dev）**：启动开发服务器，支持热重载
- **测试任务（Test）**：运行单元测试、集成测试等
- **代码质量任务（Lint/Format）**：检查和格式化代码
- **打包任务（Package）**：创建发布包
- **部署任务（Deploy）**：将应用部署到目标环境

这些任务通常遵循一定的生命周期，例如：先 lint，再 test，最后 build 和 deploy。

### 2.2 在 package.json 中定义任务

每个工作区的任务首先在其自身的 `package.json` 文件中的 `scripts` 字段中定义：

```json
// apps/web/package.json
{
  "name": "web",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "test": "vitest"
  }
}
```

### 2.3 在 turbo.json 中配置任务

为了利用 Turborepo 的高级功能，需要在根目录的 `turbo.json` 文件中配置任务：

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

#### 2.3.1 关键配置项说明

- **`dependsOn`**：定义任务依赖关系
  - `"^build"` 表示依赖于所有依赖项的 `build` 任务
  - `"lint"` 表示依赖于当前包的 `lint` 任务
- **`outputs`**：指定任务输出目录，用于缓存
- **`persistent`**：指定任务是否持续运行（如开发服务器）
- **`cache`**：指定是否缓存任务结果
- **`inputs`**：指定任务的输入文件，默认为 `["**/*.*"]`
- **`env`**：指定任务依赖的环境变量

## 3. 运行基本任务

### 3.1 运行单个任务

可以使用 `turbo` 命令运行定义的任务：

```bash
turbo <task-name>
```

**示例：**

```bash
# 运行所有包的 build 任务
turbo build

# 运行所有包的 lint 任务
turbo lint
```

### 3.2 运行多个任务

可以在一条命令中运行多个任务，它们将按顺序执行：

```bash
turbo <task1> <task2> <task3>
```

**示例：**

```bash
# 依次运行 lint、test 和 build 任务
turbo lint test build
```

### 3.3 使用过滤功能

在大型 Monorepo 中，通常只需要针对特定的包运行任务。Turborepo 提供了强大的过滤功能：

#### 3.3.1 按包名过滤

```bash
turbo <task> --filter=<package-name>
```

**示例：**

```bash
# 仅在 web 包中运行 build 任务
turbo build --filter=web
```

#### 3.3.2 按依赖关系过滤

```bash
turbo <task> --filter=<package>...
```

**示例：**

```bash
# 在 web 包及其所有依赖项中运行 build 任务
turbo build --filter=web...
```

#### 3.3.3 按被依赖关系过滤

```bash
turbo <task> --filter=...<package>
```

**示例：**

```bash
# 在所有依赖于 ui-components 包的包中运行 build 任务
turbo build --filter=...ui-components
```

#### 3.3.4 组合过滤

可以组合使用多种过滤语法：

```bash
turbo <task> --filter=<package1>...<package2> --filter=!<package3>
```

**示例：**

```bash
# 在依赖于 shared-utils 且被 web 依赖的包中运行 build 任务，但排除 legacy-app 包
turbo build --filter=shared-utils...web --filter=!legacy-app
```

## 4. 任务依赖管理

### 4.1 理解任务依赖关系

在 Turborepo 中，任务依赖关系分为两种类型：

1. **内部依赖**：同一包内的任务依赖（如 `test` 依赖于 `lint`）
2. **外部依赖**：跨包的任务依赖（如 `app` 依赖于 `shared` 包的构建）

### 4.2 定义任务依赖

在 `turbo.json` 中，使用 `dependsOn` 字段定义任务依赖：

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build", "generate-types"]
    },
    "test": {
      "dependsOn": ["build", "lint"]
    },
    "deploy": {
      "dependsOn": ["build", "test", "e2e"]
    }
  }
}
```

### 4.3 可视化任务依赖图

可以使用 `turbo graph` 命令生成任务依赖图，帮助理解和调试复杂的任务关系：

```bash
turbo graph <task> --format=<format> > <output-file>
```

**示例：**

```bash
# 生成 build 任务的依赖图并保存为 dot 格式
turbo graph build --format=dot > build-graph.dot

# 将 dot 文件转换为 SVG 图像（需要安装 graphviz）
dot -Tsvg build-graph.dot -o build-graph.svg
```

## 5. 任务缓存策略

### 5.1 智能缓存工作原理

Turborepo 的智能缓存基于以下因素决定是否重用缓存结果：

- 任务的输入文件内容
- 任务的命令和参数
- 环境变量（在 `env` 中配置的）
- 依赖任务的输出
- 工作区的 `package.json` 内容

### 5.2 配置缓存输出

在 `turbo.json` 中，使用 `outputs` 字段配置需要缓存的输出：

```json
{
  "pipeline": {
    "build": {
      "outputs": ["dist/**", "build/**", "*.tsbuildinfo"]
    },
    "test": {
      "outputs": ["coverage/**"]
    }
  }
}
```

### 5.3 配置缓存输入

使用 `inputs` 字段配置影响任务结果的输入文件：

```json
{
  "pipeline": {
    "generate-docs": {
      "inputs": ["src/**/*.ts", "docs/templates/**/*"],
      "outputs": ["docs/generated/**"]
    }
  }
}
```

### 5.4 环境变量与缓存

使用 `env` 字段配置影响缓存的环境变量：

```json
{
  "pipeline": {
    "build": {
      "env": ["NODE_ENV", "BUILD_VERSION", "API_URL"]
    }
  }
}
```

### 5.5 缓存管理命令

```bash
# 清除所有本地缓存
turbo clean

# 强制重新运行任务，忽略缓存
turbo build --force

# 禁用缓存执行任务
turbo build --no-cache
```

## 6. 并行执行与性能优化

### 6.1 并行执行原理

Turborepo 默认会并行执行不相互依赖的任务，充分利用多核 CPU 资源。任务并行执行的前提是：

- 任务之间没有依赖关系
- 任务不会竞争共享资源（如端口、文件锁等）

### 6.2 控制并行度

可以使用 `--concurrency` 选项控制并行任务数量：

```bash
turbo build --concurrency=4
```

也可以在 `turbo.json` 中全局配置：

```json
{
  "concurrency": 4,
  "pipeline": {
    // ...
  }
}
```

### 6.3 禁用并行执行

对于某些需要顺序执行的任务，可以使用 `--sequential` 选项：

```bash
turbo deploy --sequential
```

或者在 `turbo.json` 中配置特定任务：

```json
{
  "pipeline": {
    "deploy": {
      "dependsOn": ["build"],
      "sequential": true
    }
  }
}
```

### 6.4 持续运行的任务

对于开发服务器等需要持续运行的任务，使用 `persistent` 配置：

```json
{
  "pipeline": {
    "dev": {
      "persistent": true,
      "cache": false
    }
  }
}
```

## 7. 高级任务管理技巧

### 7.1 自定义任务配置

可以为不同类型的工作区定义不同的任务配置：

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "build:nextjs": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "public/**"]
    }
  }
}
```

然后在不同工作区中使用相应的脚本：

```json
// apps/next-app/package.json
{
  "name": "next-app",
  "scripts": {
    "build": "turbo run build:nextjs"
  }
}
```

### 7.2 动态任务生成

对于某些动态生成的任务（如根据环境或参数变化的任务），可以使用脚本动态生成配置：

```javascript
// scripts/generate-turbo-config.js
const fs = require('fs');

const environments = ['development', 'staging', 'production'];
const pipeline = {};

environments.forEach(env => {
  pipeline[`build:${env}`] = {
    dependsOn: [`^build:${env}`],
    outputs: [`dist/${env}/**`],
    env: [`NODE_ENV=${env}`]
  };
});

const config = {
  $schema: 'https://turbo.build/schema.json',
  pipeline
};

fs.writeFileSync('turbo.json', JSON.stringify(config, null, 2));
```

然后在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "generate-turbo-config": "node scripts/generate-turbo-config.js",
    "build:all": "npm run generate-turbo-config && turbo build:development build:staging build:production"
  }
}
```

### 7.3 任务分组与流水线

可以将相关任务组合成流水线，例如 CI/CD 流水线：

```json
{
  "pipeline": {
    "ci:install": {
      "cache": false
    },
    "ci:lint": {
      "dependsOn": ["ci:install"],
      "outputs": []
    },
    "ci:test": {
      "dependsOn": ["ci:lint"],
      "outputs": ["coverage/**"]
    },
    "ci:build": {
      "dependsOn": ["ci:test"],
      "outputs": ["dist/**"]
    },
    "ci:deploy": {
      "dependsOn": ["ci:build"],
      "cache": false
    },
    "ci": {
      "dependsOn": ["ci:deploy"]
    }
  }
}
```

然后运行整个流水线：

```bash
turbo ci
```

### 7.4 利用工作区配置覆盖

可以在工作区的 `package.json` 中覆盖全局 `turbo.json` 中的配置：

```json
// apps/special-app/package.json
{
  "name": "special-app",
  "scripts": {
    "build": "special-build-command"
  },
  "turbo": {
    "build": {
      "outputs": ["custom-dist/**", "special-files/**"],
      "dependsOn": ["special-prebuild-task"]
    }
  }
}
```

## 8. 实际案例与最佳实践

### 8.1 前端应用开发工作流

**场景：** 开发一个包含多个前端应用和共享库的 Monorepo

**配置：**

```json
// turbo.json
{
  "pipeline": {
    "dev": {
      "persistent": true,
      "cache": false
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["lint"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    }
  }
}
```

**工作流：**

```bash
# 启动所有应用的开发服务器
turbo dev

# 仅启动 web 应用的开发服务器
turbo dev --filter=web

# 构建整个项目
turbo build

# 运行测试并生成覆盖率报告
turbo test
```

### 8.2 多服务后端开发工作流

**场景：** 开发一个包含多个微服务的后端 Monorepo

**配置：**

```json
// turbo.json
{
  "pipeline": {
    "dev": {
      "persistent": true,
      "cache": false
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "*.tsbuildinfo"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "migrate": {
      "dependsOn": ["build"],
      "cache": false
    },
    "seed": {
      "dependsOn": ["migrate"],
      "cache": false
    }
  }
}
```

**工作流：**

```bash
# 启动所有服务的开发模式
turbo dev

# 运行数据库迁移
turbo migrate --filter=user-service

# 为特定服务填充种子数据
turbo seed --filter=product-service

# 构建并测试特定服务
turbo build test --filter=api-gateway...
```

### 8.3 CI/CD 集成工作流

**场景：** 在 CI/CD 环境中自动化构建、测试和部署流程

**配置：**

```json
// turbo.json
{
  "pipeline": {
    "ci:install": {
      "cache": false
    },
    "ci:lint": {
      "dependsOn": ["ci:install"],
      "outputs": []
    },
    "ci:test": {
      "dependsOn": ["ci:lint"],
      "outputs": ["coverage/**"]
    },
    "ci:build": {
      "dependsOn": ["ci:test"],
      "outputs": ["dist/**"]
    },
    "ci:deploy:staging": {
      "dependsOn": ["ci:build"],
      "cache": false,
      "env": ["STAGING_API_KEY"]
    },
    "ci:deploy:production": {
      "dependsOn": ["ci:build"],
      "cache": false,
      "env": ["PRODUCTION_API_KEY"]
    }
  }
}
```

**GitHub Actions 配置示例：**

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 7
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'pnpm'
      - name: Install dependencies
        run: pnpm install
      - name: Lint, test and build
        run: pnpm dlx turbo lint test build
  deploy-staging:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to staging
        run: pnpm dlx turbo ci:deploy:staging
        env:
          STAGING_API_KEY: ${{ secrets.STAGING_API_KEY }}
```

## 9. 常见问题与解决方案

### 9.1 任务执行顺序问题

**问题：** 任务执行顺序不符合预期

**解决方案：**
- 检查 `turbo.json` 中的 `dependsOn` 配置是否正确
- 确认没有循环依赖
- 使用 `turbo graph` 命令可视化任务依赖关系
- 对于需要严格顺序执行的任务，使用 `--sequential` 选项

### 9.2 缓存未命中问题

**问题：** 任务缓存没有被正确命中

**解决方案：**
- 检查 `outputs` 和 `inputs` 配置是否包含所有相关文件
- 确认是否有未配置的环境变量影响了任务结果
- 检查依赖项是否有变更
- 使用 `--log-level=debug` 查看缓存决策过程
- 运行 `turbo clean` 清除本地缓存后重试

### 9.3 资源竞争问题

**问题：** 并行执行的任务竞争共享资源

**解决方案：**
- 为资源密集型任务设置不同的端口或资源路径
- 使用 `--concurrency` 限制并行任务数量
- 对于关键资源，将任务配置为顺序执行
- 使用文件锁或其他同步机制协调资源访问

### 9.4 任务超时问题

**问题：** 某些任务执行时间过长导致超时

**解决方案：**
- 分析任务执行时间长的原因，考虑优化或拆分任务
- 对于确实需要长时间运行的任务，配置适当的超时时间
- 如果是网络相关任务，检查网络连接和超时设置
- 对于资源密集型任务，考虑增加系统资源或限制并行度

### 9.5 环境变量问题

**问题：** 环境变量未正确传递给任务

**解决方案：**
- 确保在 `turbo.json` 的 `env` 字段中配置了所有必要的环境变量
- 对于敏感信息，使用安全的方式（如 secrets manager）管理
- 在 CI/CD 环境中，确保正确设置了所有环境变量
- 检查是否有 `.env` 文件被忽略或未正确加载

## 10. 总结

在 Monorepo 中有效运行和管理任务是提高开发效率的关键环节。通过本文的介绍，你应该能够：

1. 理解 Monorepo 中任务的基本概念和类型
2. 在 `package.json` 和 `turbo.json` 中定义和配置任务
3. 使用各种命令运行和过滤任务
4. 管理任务依赖关系，避免冲突和循环依赖
5. 配置和优化任务缓存策略，提高构建速度
6. 控制并行执行，优化性能和资源利用
7. 应用高级任务管理技巧，如自定义配置、动态任务和任务分组
8. 实现各种实际工作流，如前端开发、后端服务和 CI/CD 集成
9. 解决常见的任务管理问题

Turborepo 提供的任务管理功能强大而灵活，通过合理配置和使用，可以显著提高大型代码库的开发效率和构建速度。随着项目的发展，你可能需要根据具体需求调整和优化任务配置，但掌握这些基本概念和原则将为你的项目奠定坚实的基础。