# Turborepo turbo.json 文件的结构和配置选项

## 1. 概述

`turbo.json` 是 Turborepo 的核心配置文件，它定义了项目中任务的执行方式、依赖关系、缓存策略和其他高级设置。通过合理配置 `turbo.json`，可以最大化 Turborepo 的性能优势，实现高效的任务执行和缓存利用。本文将详细介绍 `turbo.json` 文件的结构和所有可用的配置选项。

## 2. 基本结构

一个基本的 `turbo.json` 文件包含以下核心部分：

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    // 任务定义和配置
  },
  "globalDependencies": [
    // 全局依赖文件
  ],
  "globalEnv": [
    // 全局环境变量
  ],
  "remoteCache": {
    // 远程缓存配置
  },
  "experimental": {
    // 实验性功能配置
  }
}
```

每个部分都有特定的用途，下面将详细介绍每个配置项。

## 3. 核心配置选项

### 3.1 `$schema`

指定 JSON Schema 文件的 URL，用于在支持的编辑器中提供自动补全和验证功能：

```json
{
  "$schema": "https://turbo.build/schema.json"
}
```

### 3.2 `pipeline`

`pipeline` 是 `turbo.json` 中最重要的配置项，用于定义项目中所有任务的执行方式、依赖关系和缓存策略。每个任务都可以有自己的配置：

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    }
  }
}
```

每个任务配置可以包含以下选项：

#### 3.2.1 `dependsOn`

定义任务的依赖关系。依赖关系可以是：
- 同一包中的其他任务
- 上游包中的同名任务（使用 `^` 前缀）
- 特定包中的特定任务

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build", "generate-files"]
    }
  }
}
```

#### 3.2.2 `outputs`

指定任务生成的输出文件或目录，这些文件将被缓存。可以使用 glob 模式匹配多个文件：

```json
{
  "pipeline": {
    "build": {
      "outputs": ["dist/**", "build/**", "!dist/**/*.map"]
    }
  }
}
```

使用 `!` 前缀可以排除特定文件。

#### 3.2.3 `inputs`

指定任务的输入文件或目录，这些文件的变更会导致缓存失效。默认情况下，Turborepo 会考虑所有源文件：

```json
{
  "pipeline": {
    "build": {
      "inputs": ["src/**", "package.json", "tsconfig.json"]
    }
  }
}
```

#### 3.2.4 `env`

指定影响任务执行的环境变量。这些环境变量的变更会导致缓存失效：

```json
{
  "pipeline": {
    "build": {
      "env": ["NODE_ENV", "API_URL"]
    }
  }
}
```

#### 3.2.5 `cache`

控制是否缓存任务的输出。默认为 `true`：

```json
{
  "pipeline": {
    "dev": {
      "cache": false
    }
  }
}
```

#### 3.2.6 `persistent`

标记任务是否是持久运行的（如开发服务器）。持久任务不会被缓存，且会阻止其他依赖它的任务执行：

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

#### 3.2.7 `dotEnv`

指定任务使用的 `.env` 文件路径。这些文件的变更会导致缓存失效：

```json
{
  "pipeline": {
    "build": {
      "dotEnv": [".env", ".env.build"]
    }
  }
}
```

#### 3.2.8 `outputMode`

控制任务输出的显示方式。可用值：`newline`（默认）、`stream` 或 `none`：

```json
{
  "pipeline": {
    "dev": {
      "outputMode": "stream"
    }
  }
}
```

#### 3.2.9 `runtimeDependencies`

指定在运行时依赖的可执行文件或脚本。这些文件的变更会导致缓存失效：

```json
{
  "pipeline": {
    "build": {
      "runtimeDependencies": ["scripts/build.sh"]
    }
  }
}
```

#### 3.2.10 `passThroughEnv`

指定需要传递给任务的环境变量，但这些变量的变更不会影响缓存：

```json
{
  "pipeline": {
    "dev": {
      "passThroughEnv": ["DEBUG", "LOG_LEVEL"]
    }
  }
}
```

#### 3.2.11 `shell`

指定执行任务时使用的 shell。默认为系统默认 shell：

```json
{
  "pipeline": {
    "build": {
      "shell": ["/bin/bash", "-c"]
    }
  }
}
```

#### 3.2.12 `workspaceDependencies`

指定任务依赖的其他工作区。这些工作区的变更会导致任务重新执行：

```json
{
  "pipeline": {
    "build": {
      "workspaceDependencies": ["common-utils", "ui-components"]
    }
  }
}
```

### 3.3 `globalDependencies`

指定对所有任务都有影响的全局依赖文件。这些文件的变更会导致所有任务的缓存失效：

```json
{
  "globalDependencies": ["tsconfig.base.json", ".eslintrc.js"]
}
```

### 3.4 `globalEnv`

指定对所有任务都有影响的全局环境变量。这些环境变量的变更会导致所有任务的缓存失效：

```json
{
  "globalEnv": ["NODE_ENV", "CI"]
}
```

### 3.5 `remoteCache`

配置 Turborepo 的远程缓存功能。远程缓存允许团队成员共享构建结果：

```json
{
  "remoteCache": {
    "team": "my-team",
    "token": "my-token",
    "endpoint": "https://remote-cache.example.com",
    "signature": {
      "enabled": true,
      "key": "my-signature-key"
    }
  }
}
```

### 3.6 `reporter`

指定任务执行结果的报告格式。可用值：`pretty`（默认）、`json` 或 `github-actions`：

```json
{
  "reporter": "json"
}
```

### 3.7 `logLevel`

控制日志输出的详细程度。可用值：`trace`、`debug`、`info`（默认）、`warn` 或 `error`：

```json
{
  "logLevel": "debug"
}
```

### 3.8 `concurrency`

控制并行执行的任务数量。默认为系统 CPU 核心数：

```json
{
  "concurrency": 8
}
```

### 3.9 `cwd`

指定 Turborepo 的工作目录。默认为当前目录：

```json
{
  "cwd": "./monorepo-root"
}
```

### 3.10 `experimental`

配置 Turborepo 的实验性功能：

```json
{
  "experimental": {
    "virtualModules": true,
    "tasks": {
      "cacheable": true
    }
  }
}
```

## 4. 任务配置示例

### 4.1 基础任务配置

以下是一个包含常见任务的基础配置示例：

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "persistent": true,
      "cache": false,
      "outputMode": "stream"
    },
    "clean": {
      "cache": false
    }
  }
}
```

### 4.2 特定项目类型的配置

#### 4.2.1 React + Vite 项目配置

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "!dist/**/*.map"],
      "inputs": ["src/**", "vite.config.ts", "tsconfig.json", "package.json"]
    },
    "dev": {
      "persistent": true,
      "cache": false,
      "outputMode": "stream"
    },
    "preview": {
      "dependsOn": ["build"],
      "cache": false
    }
  }
}
```

#### 4.2.2 Next.js 项目配置

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"],
      "inputs": ["src/**", "pages/**", "next.config.js", "tsconfig.json", "package.json"]
    },
    "dev": {
      "persistent": true,
      "cache": false,
      "outputMode": "stream"
    },
    "export": {
      "dependsOn": ["build"],
      "outputs": ["out/**"]
    }
  }
}
```

#### 4.2.3 Node.js 服务配置

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "inputs": ["src/**", "tsconfig.json", "package.json"]
    },
    "start": {
      "dependsOn": ["build"],
      "cache": false
    },
    "dev": {
      "persistent": true,
      "cache": false,
      "outputMode": "stream"
    }
  }
}
```

### 4.3 高级任务配置

以下是一些高级任务配置的示例：

#### 4.3.1 多步骤构建任务

```json
{
  "pipeline": {
    "build:prepare": {
      "outputs": ["generated/**"]
    },
    "build:compile": {
      "dependsOn": ["build:prepare"],
      "outputs": ["dist/**"]
    },
    "build": {
      "dependsOn": ["build:compile"]
    }
  }
}
```

#### 4.3.2 环境特定任务

```json
{
  "pipeline": {
    "build:dev": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "env": ["NODE_ENV", "API_URL"]
    },
    "build:prod": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "env": ["NODE_ENV", "API_URL", "CDN_URL"]
    }
  }
}
```

#### 4.3.3 包特定任务配置

可以为特定包配置任务行为：

```json
{
  "pipeline": {
    "web#build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "env": ["NODE_ENV", "API_URL", "CDN_URL"]
    },
    "api#build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "env": ["NODE_ENV", "DATABASE_URL"]
    }
  }
}
```

## 5. 缓存配置详解

### 5.1 缓存工作原理

Turborepo 的缓存系统基于以下几个因素生成缓存键：
- 任务输入文件的内容哈希
- 环境变量的值（在 `env` 中配置的）
- 依赖任务的缓存键
- 任务命令和参数

当这些因素中的任何一个发生变化时，缓存键也会发生变化，导致缓存失效。

### 5.2 缓存配置最佳实践

#### 5.2.1 精确配置 `outputs`

精确指定任务的输出文件可以避免不必要的缓存和文件复制：

```json
{
  "pipeline": {
    "build": {
      "outputs": [
        "dist/**",
        "!dist/**/*.map",
        "!dist/**/*.log"
      ]
    }
  }
}
```

#### 5.2.2 合理配置 `inputs`

如果任务只依赖于特定的输入文件，可以明确指定这些文件，减少不必要的缓存失效：

```json
{
  "pipeline": {
    "build": {
      "inputs": [
        "src/**",
        "package.json",
        "tsconfig.json",
        "!src/**/*.test.ts"
      ]
    }
  }
}
```

#### 5.2.3 环境变量配置

将影响构建结果的环境变量添加到 `env` 配置中：

```json
{
  "pipeline": {
    "build": {
      "env": ["NODE_ENV", "API_URL", "BUILD_VERSION"]
    }
  }
}
```

#### 5.2.4 全局依赖配置

将影响所有任务的共享配置文件添加到 `globalDependencies` 中：

```json
{
  "globalDependencies": [
    "tsconfig.base.json",
    ".eslintrc.js",
    "prettier.config.js"
  ]
}
```

### 5.3 远程缓存配置

配置远程缓存可以让团队成员共享构建结果，提高团队协作效率：

```json
{
  "remoteCache": {
    "team": "my-team",
    "token": "my-token",
    "endpoint": "https://remote-cache.example.com",
    "signature": {
      "enabled": true,
      "key": "my-signature-key"
    }
  }
}
```

## 6. 任务依赖配置

### 6.1 依赖关系类型

Turborepo 支持多种类型的依赖关系：

#### 6.1.1 同一包内的依赖

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["clean", "generate-files"]
    }
  }
}
```

#### 6.1.2 跨包依赖（上游依赖）

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

#### 6.1.3 特定包依赖

```json
{
  "pipeline": {
    "web#build": {
      "dependsOn": ["common-utils#build", "ui-components#build"]
    }
  }
}
```

### 6.2 复杂依赖关系配置

可以配置复杂的依赖关系网络：

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build", "build:prepare"]
    },
    "build:prepare": {
      "dependsOn": ["generate-types", "copy-assets"]
    },
    "test": {
      "dependsOn": ["build", "lint"]
    },
    "lint": {
      "dependsOn": ["build:prepare"]
    },
    "generate-types": {
      "outputs": ["src/types/**"]
    },
    "copy-assets": {
      "outputs": ["public/assets/**"]
    }
  }
}
```

### 6.3 依赖关系可视化

可以使用 `turbo run <task> --dry` 命令预览任务的执行顺序和依赖关系：

```bash
turbo run build --dry
```

## 7. 高级配置技巧

### 7.1 任务分组配置

可以将相关任务组合在一起，便于统一管理：

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "ci": {
      "dependsOn": ["build", "test", "lint"]
    }
  }
}
```

然后可以使用 `turbo run ci` 命令执行所有 CI 相关任务。

### 7.2 环境特定配置

可以为不同环境配置不同的任务行为：

```json
{
  "pipeline": {
    "build:dev": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "env": ["NODE_ENV", "DEV_API_URL"]
    },
    "build:staging": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "env": ["NODE_ENV", "STAGING_API_URL"]
    },
    "build:prod": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "env": ["NODE_ENV", "PROD_API_URL"]
    }
  }
}
```

### 7.3 使用继承配置

可以创建基础配置，然后在特定任务中覆盖它：

```json
{
  "pipeline": {
    "base": {
      "outputs": ["dist/**"],
      "env": ["NODE_ENV"]
    },
    "web#build": {
      "dependsOn": ["^build"],
      "extends": "base",
      "env": ["NODE_ENV", "API_URL", "CDN_URL"]
    },
    "api#build": {
      "dependsOn": ["^build"],
      "extends": "base",
      "env": ["NODE_ENV", "DATABASE_URL"]
    }
  }
}
```

### 7.4 动态配置生成

对于复杂项目，可以使用脚本动态生成 `turbo.json` 配置：

```javascript
// generate-turbo-config.js
const fs = require('fs');
const packages = getPackages(); // 自定义函数，获取所有包

const config = {
  $schema: 'https://turbo.build/schema.json',
  pipeline: {
    build: {
      dependsOn: ['^build'],
      outputs: ['dist/**']
    },
    test: {
      dependsOn: ['build'],
      outputs: []
    }
  }
};

// 为每个包添加特定配置
packages.forEach(pkg => {
  config.pipeline[`${pkg}#build`] = {
    dependsOn: ['^build'],
    outputs: ['dist/**']
  };
});

fs.writeFileSync('turbo.json', JSON.stringify(config, null, 2));
```

然后在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "generate-turbo-config": "node generate-turbo-config.js"
  }
}
```

## 8. 常见场景配置示例

### 8.1 前端应用开发配置

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "!.next/cache/**"]
    },
    "dev": {
      "persistent": true,
      "cache": false,
      "outputMode": "stream"
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "format": {
      "outputs": []
    },
    "typecheck": {
      "outputs": []
    },
    "validate": {
      "dependsOn": ["lint", "test", "typecheck"]
    }
  },
  "globalDependencies": [
    "tsconfig.base.json",
    ".eslintrc.js",
    "prettier.config.js"
  ],
  "globalEnv": ["NODE_ENV", "CI"]
}
```

### 8.2 后端服务配置

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "start": {
      "dependsOn": ["build"],
      "cache": false
    },
    "dev": {
      "persistent": true,
      "cache": false,
      "outputMode": "stream"
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "env": ["TEST_DATABASE_URL"]
    },
    "migrate": {
      "cache": false,
      "env": ["DATABASE_URL"]
    }
  },
  "globalDependencies": [
    "tsconfig.base.json",
    ".eslintrc.js"
  ],
  "globalEnv": ["NODE_ENV", "CI", "DATABASE_URL"]
}
```

### 8.3 混合项目配置

```json
{
  "pipeline": {
    "#build": {
      "dependsOn": ["^build"]
    },
    "web#build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "!.next/cache/**"]
    },
    "api#build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "common-utils#build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "ui-components#build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "web#dev": {
      "persistent": true,
      "cache": false,
      "outputMode": "stream"
    },
    "api#dev": {
      "persistent": true,
      "cache": false,
      "outputMode": "stream"
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "ci": {
      "dependsOn": ["build", "test", "lint"]
    }
  },
  "globalDependencies": [
    "tsconfig.base.json",
    ".eslintrc.js",
    "prettier.config.js"
  ],
  "globalEnv": ["NODE_ENV", "CI"]
}
```

## 9. 配置最佳实践

### 9.1 基本原则

1. **安全第一**：配置远程缓存时，确保使用安全的认证方式和传输协议
2. **最小化原则**：只配置必要的输入、输出和环境变量，避免过度配置
3. **清晰性**：使用有意义的任务名称和组织方式，便于理解和维护
4. **一致性**：在整个项目中保持一致的配置模式
5. **文档化**：为复杂的配置添加注释或文档说明

### 9.2 任务配置最佳实践

1. **合理设置依赖关系**：避免循环依赖和不必要的依赖
2. **为持久任务配置 `persistent: true`**：如开发服务器、监视任务等
3. **为不产生输出的任务设置 `outputs: []`**：如测试、 lint 等
4. **为开发任务禁用缓存**：如 `dev` 任务通常不需要缓存
5. **明确指定输出目录**：使用 glob 模式精确匹配输出文件

### 9.3 缓存配置最佳实践

1. **启用远程缓存**：对于团队项目，远程缓存可以显著提高协作效率
2. **精确配置 `inputs` 和 `outputs`**：避免不必要的缓存失效或缓存膨胀
3. **使用签名保护远程缓存**：防止未经授权的缓存访问和修改
4. **定期清理本地缓存**：使用 `turbo clean` 命令清除过时的缓存
5. **监控缓存命中率**：通过分析构建输出来评估缓存效果

### 9.4 性能优化最佳实践

1. **调整并行度**：根据系统资源和项目特点设置合适的 `concurrency` 值
2. **优化任务依赖关系**：使任务尽可能并行执行
3. **使用增量构建**：尽可能利用增量构建功能，只重新构建变更的部分
4. **合理使用过滤功能**：只运行需要的任务，避免不必要的执行
5. **为大型任务拆分为多个小任务**：提高缓存粒度和并行度

## 10. 常见问题与解决方案

### 10.1 缓存未按预期工作

**问题**：任务应该命中缓存但没有命中，或者缓存结果不正确。

**解决方案**：
- 检查 `inputs` 配置，确保包含了所有影响任务输出的文件
- 检查 `env` 配置，确保包含了所有影响任务输出的环境变量
- 检查 `outputs` 配置，确保包含了所有需要缓存的文件
- 运行 `turbo build --debug` 查看详细的缓存决策过程
- 尝试清除本地缓存：`turbo clean`

### 10.2 任务执行顺序问题

**问题**：任务没有按照预期的顺序执行。

**解决方案**：
- 检查 `dependsOn` 配置，确保依赖关系正确
- 避免循环依赖
- 运行 `turbo run <task> --dry` 预览任务执行顺序
- 确保上游依赖配置正确（使用 `^` 前缀）

### 10.3 远程缓存连接问题

**问题**：无法连接到远程缓存服务器或缓存上传/下载失败。

**解决方案**：
- 检查 `remoteCache` 配置，确保 `team`、`token` 和 `endpoint` 正确
- 验证网络连接和防火墙设置
- 检查认证令牌是否有效
- 尝试使用 `--local-only` 选项临时禁用远程缓存

### 10.4 任务输出冲突

**问题**：不同任务的输出文件相互冲突。

**解决方案**：
- 确保不同任务生成的文件路径不同
- 使用 `outputs` 配置精确指定每个任务的输出文件
- 考虑为不同任务使用不同的输出目录
- 调整任务依赖关系，避免并行执行可能产生冲突的任务

### 10.5 配置复杂性问题

**问题**：`turbo.json` 文件变得过于复杂，难以维护。

**解决方案**：
- 使用继承配置减少重复
- 将相关任务分组，便于管理
- 使用脚本动态生成配置
- 为复杂配置添加注释或单独的文档说明
- 定期重构和优化配置

## 11. 总结

`turbo.json` 文件是 Turborepo 的核心配置文件，它定义了项目中任务的执行方式、依赖关系、缓存策略和其他高级设置。通过合理配置 `turbo.json`，可以最大化 Turborepo 的性能优势，实现高效的任务执行和缓存利用。

本文详细介绍了 `turbo.json` 文件的结构和所有可用的配置选项，包括任务定义、依赖关系配置、缓存策略设置、远程缓存配置等。同时，提供了各种常见场景的配置示例和最佳实践，帮助开发者根据自己的项目需求进行配置。

在配置 `turbo.json` 时，应遵循安全第一、最小化原则、清晰性、一致性和文档化的基本原则，合理设置任务依赖关系、缓存策略和性能优化选项。同时，要注意解决可能出现的缓存问题、任务执行顺序问题、远程缓存连接问题、任务输出冲突和配置复杂性问题等。

随着项目的发展，`turbo.json` 配置也需要不断调整和优化，以适应项目的变化和需求。通过持续学习和实践，开发者可以掌握 `turbo.json` 的配置技巧，充分发挥 Turborepo 的性能优势，提高开发效率和项目质量。