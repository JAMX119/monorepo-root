# Turborepo 配置任务输出（outputs）和环境变量（env）

## 1. 概述

在 Turborepo 中，正确配置任务输出（`outputs`）和环境变量（`env`）是优化构建性能、确保缓存有效性和控制任务执行环境的关键步骤。通过精确定义任务的输出目录和依赖的环境变量，Turborepo 能够更智能地管理缓存、避免不必要的重复构建，并确保任务在一致的环境中执行。本文将详细介绍 Turborepo 中任务输出和环境变量的配置方法、最佳实践和常见应用场景。

## 2. 任务输出（outputs）配置

### 2.1 输出配置的基本概念

任务输出配置（`outputs`）用于指定任务执行过程中生成的文件和目录。Turborepo 使用这些配置来：

- **管理缓存**：确定哪些文件需要被缓存，以及从缓存中恢复时需要还原哪些文件
- **优化增量构建**：通过比较输出文件的变化，决定是否需要重新执行任务
- **共享构建结果**：在远程缓存中正确存储和检索构建输出

### 2.2 输出配置的基本语法

输出配置位于 `turbo.json` 文件的 `pipeline` 部分，针对每个任务进行定义：

```json
{
  "pipeline": {
    "<task-name>": {
      "outputs": ["<glob-pattern-1>", "<glob-pattern-2>", ...]
    }
  }
}
```

其中，`<task-name>` 是任务名称，`<glob-pattern-*>` 是用于匹配输出文件和目录的 glob 模式。

### 2.3 常用的 Glob 模式

Turborepo 支持标准的 glob 模式来匹配文件和目录：

- `*`：匹配任意数量的字符（不包括路径分隔符）
- `**`：匹配任意数量的字符（包括路径分隔符）
- `?`：匹配单个字符
- `[seq]`：匹配序列中的任意字符
- `[!seq]`：匹配不在序列中的任意字符
- `{a,b}`：匹配 a 或 b

### 2.4 输出配置的类型

#### 2.4.1 标准输出配置

标准输出配置用于指定任务生成的主要文件和目录：

```json
{
  "pipeline": {
    "build": {
      "outputs": ["dist/**", "build/**", "*.tsbuildinfo"]
    }
  }
}
```

在上面的示例中，`build` 任务的输出包括 `dist` 和 `build` 目录下的所有文件，以及根目录下的所有 `.tsbuildinfo` 文件。

#### 2.4.2 无输出配置

对于某些任务（如 lint、test 等），如果它们不生成需要缓存的持久化输出，可以将 `outputs` 设置为空数组：

```json
{
  "pipeline": {
    "lint": {
      "outputs": []
    },
    "test": {
      "outputs": []
    }
  }
}
```

#### 2.4.3 临时输出配置

对于生成临时文件的任务，可以指定临时目录作为输出：

```json
{
  "pipeline": {
    "generate-temp-files": {
      "outputs": ["tmp/**"]
    }
  }
}
```

#### 2.4.4 特定文件输出配置

有时可能需要指定特定的文件作为输出：

```json
{
  "pipeline": {
    "generate-config": {
      "outputs": ["config.json", "src/config.ts"]
    }
  }
}
```

### 2.5 输出配置的最佳实践

1. **精确指定输出**：尽可能精确地指定任务的输出，避免包含不必要的文件
2. **包含所有构建产物**：确保包含任务生成的所有重要文件和目录
3. **排除临时文件**：避免将临时文件和日志文件包含在输出配置中
4. **考虑中间产物**：对于复杂任务，可能需要包含中间产物以支持增量构建
5. **统一输出目录**：在项目中保持一致的输出目录命名规范（如 `dist`、`build` 等）

## 3. 环境变量（env）配置

### 3.1 环境变量配置的基本概念

环境变量配置（`env`）用于指定任务执行过程中依赖的环境变量。Turborepo 使用这些配置来：

- **确定缓存键值**：将指定的环境变量值纳入缓存键的计算中
- **维持构建一致性**：确保任务在相同的环境变量下执行时产生相同的结果
- **控制构建行为**：通过环境变量控制构建过程的不同行为

### 3.2 环境变量配置的基本语法

环境变量配置位于 `turbo.json` 文件的 `pipeline` 部分，针对每个任务进行定义：

```json
{
  "pipeline": {
    "<task-name>": {
      "env": ["<env-var-1>", "<env-var-2>", ...]
    }
  }
}
```

其中，`<task-name>` 是任务名称，`<env-var-*>` 是任务依赖的环境变量名称。

### 3.3 环境变量配置的类型

#### 3.3.1 标准环境变量配置

标准环境变量配置用于指定任务依赖的普通环境变量：

```json
{
  "pipeline": {
    "build": {
      "env": ["NODE_ENV", "API_URL", "BUILD_VERSION"]
    }
  }
}
```

#### 3.3.2 模式匹配环境变量配置

Turborepo 还支持使用模式匹配来指定一组相关的环境变量：

```json
{
  "pipeline": {
    "build": {
      "env": ["NODE_ENV", "API_*", "FEATURE_*"]
    }
  }
}
```

在上面的示例中，所有以 `API_` 或 `FEATURE_` 开头的环境变量都会被包含在内。

#### 3.3.3 全局环境变量配置

对于所有任务都依赖的环境变量，可以在 `turbo.json` 的根级别使用 `globalEnv` 配置：

```json
{
  "globalEnv": ["NODE_ENV", "CI", "DEBUG"],
  "pipeline": {
    "build": {
      /* 特定于 build 任务的配置 */
    }
  }
}
```

### 3.4 环境变量与缓存的关系

Turborepo 使用环境变量的值来计算缓存键。当配置的环境变量值发生变化时，Turborepo 会认为任务的输入发生了变化，从而触发重新执行任务，而不是使用缓存的结果。

需要注意的是，只有在 `env` 配置中明确指定的环境变量才会影响缓存键的计算。未指定的环境变量即使发生变化，也不会影响缓存的有效性。

### 3.5 环境变量配置的最佳实践

1. **只包含必要的环境变量**：只将真正影响任务输出的环境变量包含在配置中
2. **使用模式匹配简化配置**：对于相关的环境变量，使用模式匹配简化配置
3. **区分全局和任务特定变量**：将所有任务都依赖的环境变量配置为全局环境变量
4. **避免敏感信息**：不要将包含敏感信息的环境变量用于计算缓存键
5. **文档化环境变量**：为项目中使用的环境变量提供清晰的文档说明

## 4. outputs 和 env 的综合配置

### 4.1 基本综合配置示例

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**", "*.tsbuildinfo"],
      "env": ["NODE_ENV", "API_URL", "BUILD_VERSION"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": [],
      "env": ["NODE_ENV", "TEST_*"]
    },
    "lint": {
      "outputs": [],
      "env": ["ESLINT_*"]
    }
  }
}
```

### 4.2 多环境配置示例

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "env": ["NODE_ENV", "API_URL"]
    },
    "build:dev": {
      "dependsOn": ["build"],
      "outputs": ["dist-dev/**"],
      "env": ["NODE_ENV", "API_URL", "DEV_FEATURES"]
    },
    "build:prod": {
      "dependsOn": ["build"],
      "outputs": ["dist-prod/**"],
      "env": ["NODE_ENV", "API_URL", "CDN_URL", "ANALYTICS_KEY"]
    }
  }
}
```

### 4.3 针对不同项目类型的配置

#### 4.3.1 前端项目配置

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**", "public/build/**"],
      "env": ["NODE_ENV", "API_URL", "PUBLIC_URL", "VERSION"]
    },
    "dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["NODE_ENV", "API_URL", "WEBPACK_DEV_SERVER_PORT"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "env": ["NODE_ENV", "TEST_REPORT_FORMAT"]
    }
  }
}
```

#### 4.3.2 后端项目配置

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "*.js", "*.d.ts"],
      "env": ["NODE_ENV", "BUILD_TARGET", "TS_NODE_PROJECT"]
    },
    "start": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["NODE_ENV", "PORT", "DB_URL", "LOG_LEVEL"]
    },
    "migrate": {
      "outputs": [],
      "env": ["NODE_ENV", "DB_URL", "MIGRATION_DIR"]
    }
  }
}
```

#### 4.3.3 库项目配置

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "lib/**", "*.d.ts", "*.tsbuildinfo"],
      "env": ["NODE_ENV", "BUILD_FORMAT", "TARGET_ES_VERSION"]
    },
    "typecheck": {
      "outputs": [],
      "env": ["TSC_COMPILE_ON_ERROR"]
    },
    "docs": {
      "outputs": ["docs/**"],
      "env": ["DOCS_VERSION", "DOCS_THEME"]
    }
  }
}
```

## 5. 高级配置技巧

### 5.1 配置输出文件的优先级

在某些情况下，可能需要控制输出文件的优先级。Turborepo 按照配置中指定的顺序处理输出文件，先指定的模式具有更高的优先级：

```json
{
  "pipeline": {
    "build": {
      "outputs": ["dist/main.js", "dist/**"]
    }
  }
}
```

在上面的示例中，`dist/main.js` 文件具有比 `dist/**` 更高的优先级。

### 5.2 处理动态生成的输出

对于输出路径包含动态部分的任务，可以使用更通用的 glob 模式来匹配这些输出：

```json
{
  "pipeline": {
    "generate-reports": {
      "outputs": ["reports/*/*.html", "reports/*/*.json"]
    }
  }
}
```

### 5.3 配置多个缓存键维度

通过组合环境变量和其他输入（如文件内容、依赖版本等），可以创建多维度的缓存键，实现更精细的缓存控制：

```json
{
  "pipeline": {
    "build": {
      "outputs": ["dist/**"],
      "env": ["NODE_ENV", "BUILD_TARGET", "FEATURE_FLAGS"],
      "inputs": ["src/**", "package.json"]
    }
  }
}
```

### 5.4 使用工作区特定的输出和环境变量

对于大型 Monorepo 项目，可能需要为不同的工作区配置不同的输出和环境变量：

```json
{
  "pipeline": {
    "#build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "web#build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "public/build/**"],
      "env": ["NODE_ENV", "API_URL", "CDN_URL"]
    },
    "api#build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "env": ["NODE_ENV", "DB_URL", "PORT"]
    }
  }
}
```

### 5.5 结合远程缓存使用

当使用远程缓存时，正确配置输出和环境变量尤为重要：

```json
{
  "remoteCache": "https://your-remote-cache-server",
  "teamId": "your-team-id",
  "pipeline": {
    "build": {
      "outputs": ["dist/**"],
      "env": ["NODE_ENV", "BUILD_VERSION"],
      "cache": true
    }
  }
}
```

## 6. 实际应用场景

### 6.1 前端应用构建

**场景**：为前端应用配置构建任务的输出和环境变量

**配置示例**：

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**", "public/assets/**"],
      "env": [
        "NODE_ENV",
        "API_URL",
        "CDN_URL",
        "GOOGLE_ANALYTICS_ID",
        "SENTRY_DSN",
        "FEATURE_*"
      ]
    }
  }
}
```

### 6.2 多平台构建

**场景**：为不同平台（如 Web、Android、iOS）配置构建任务

**配置示例**：

```json
{
  "pipeline": {
    "build:web": {
      "dependsOn": ["^build"],
      "outputs": ["dist-web/**"],
      "env": ["NODE_ENV", "WEB_API_URL", "WEB_PUBLIC_URL"]
    },
    "build:android": {
      "dependsOn": ["^build"],
      "outputs": ["build-android/**"],
      "env": ["NODE_ENV", "ANDROID_API_URL", "ANDROID_APP_ID"]
    },
    "build:ios": {
      "dependsOn": ["^build"],
      "outputs": ["build-ios/**"],
      "env": ["NODE_ENV", "IOS_API_URL", "IOS_APP_ID"]
    },
    "build:all": {
      "dependsOn": ["build:web", "build:android", "build:ios"]
    }
  }
}
```

### 6.3 CI/CD 环境配置

**场景**：在 CI/CD 环境中配置特定的输出和环境变量

**配置示例**：

```json
{
  "pipeline": {
    "ci:build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"],
      "env": [
        "NODE_ENV",
        "API_URL",
        "CI",
        "BUILD_NUMBER",
        "BRANCH_NAME",
        "COMMIT_HASH"
      ]
    },
    "ci:test": {
      "dependsOn": ["ci:build"],
      "outputs": ["coverage/**", "test-results/**"],
      "env": ["NODE_ENV", "CI", "TEST_REPORT_FORMAT"]
    },
    "ci:deploy": {
      "dependsOn": ["ci:test"],
      "outputs": [],
      "env": [
        "NODE_ENV",
        "DEPLOY_ENV",
        "AWS_ACCESS_KEY_ID",
        "AWS_SECRET_ACCESS_KEY",
        "DEPLOY_BUCKET"
      ]
    }
  }
}
```

### 6.4 性能优化场景

**场景**：通过精细配置输出和环境变量优化构建性能

**配置示例**：

```json
{
  "pipeline": {
    "build:fast": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "env": ["NODE_ENV", "SKIP_TYPECHECK", "SKIP_OPTIMIZATION"]
    },
    "build:full": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "stats.json"],
      "env": [
        "NODE_ENV",
        "API_URL",
        "ENABLE_OPTIMIZATION",
        "GENERATE_SOURCEMAPS",
        "ANALYZE_BUNDLE"
      ]
    },
    "build:watch": {
      "persistent": true,
      "cache": false,
      "outputs": ["dist/**"],
      "env": ["NODE_ENV", "WATCH_POLL_INTERVAL"]
    }
  }
}
```

## 7. 输出和环境变量的调试与问题排查

### 7.1 验证输出配置

可以使用 `turbo run <task> --dry` 命令来预览任务执行，并检查输出配置是否正确：

```bash
turbo run build --dry
```

### 7.2 查看实际使用的环境变量

可以在任务执行时添加 `--debug` 标志，查看 Turborepo 实际使用的环境变量：

```bash
turbo run build --debug
```

### 7.3 常见问题及解决方案

#### 7.3.1 缓存未按预期工作

**问题**：任务应该使用缓存但没有使用，或者应该重新执行但使用了缓存

**可能原因**：
- 输出配置不完整，没有包含所有生成的文件
- 环境变量配置不完整，没有包含影响输出的所有环境变量
- 环境变量值发生变化，但未在配置中指定

**解决方案**：
- 检查并完善输出配置，确保包含所有生成的文件
- 检查并完善环境变量配置，确保包含所有影响输出的环境变量
- 使用 `turbo run <task> --force` 强制重新执行任务

#### 7.3.2 输出文件未正确缓存

**问题**：任务的输出文件没有被正确缓存或从缓存中恢复

**可能原因**：
- 输出路径使用了相对路径而不是相对于工作区根目录的路径
- 输出路径包含动态部分，没有使用正确的 glob 模式
- 输出文件权限问题

**解决方案**：
- 确保使用相对于工作区根目录的路径
- 使用更通用的 glob 模式来匹配动态路径
- 检查文件权限设置

#### 7.3.3 环境变量冲突

**问题**：不同任务或工作区之间的环境变量存在冲突

**可能原因**：
- 全局环境变量与任务特定环境变量冲突
- 不同工作区使用了相同的环境变量但具有不同的含义

**解决方案**：
- 为不同的工作区或任务使用不同的环境变量命名约定
- 避免不必要的全局环境变量配置
- 使用更具体的环境变量名称

#### 7.3.4 敏感信息泄露

**问题**：包含敏感信息的环境变量可能被包含在缓存中

**可能原因**：
- 敏感环境变量被错误地包含在 `env` 配置中
- 敏感信息被写入到输出文件中

**解决方案**：
- 不要将包含敏感信息的环境变量包含在 `env` 配置中
- 确保敏感信息不被写入到输出文件中
- 使用 `.env` 文件和 `.gitignore` 来管理敏感信息

## 8. 总结

正确配置 Turborepo 中的任务输出（`outputs`）和环境变量（`env`）是优化 Monorepo 项目构建性能和确保构建一致性的关键步骤。通过精确指定任务的输出文件和依赖的环境变量，Turborepo 能够更智能地管理缓存、避免不必要的重复构建，并确保任务在一致的环境中执行。

本文详细介绍了 Turborepo 中任务输出和环境变量的基本概念、配置语法、不同类型的配置、实际应用场景、高级配置技巧以及常见问题和解决方案。通过学习和掌握这些知识，开发者可以更好地配置和优化 Monorepo 项目的构建流程，充分发挥 Turborepo 的性能优势。

在实际项目中，输出和环境变量的配置需要根据项目的具体需求和结构进行调整和优化。随着项目的发展，这些配置也需要不断演进，以适应项目的变化和新需求。通过持续学习和实践，开发者可以掌握更高级的配置技巧，构建更高效、更可靠的 Monorepo 项目构建流程。