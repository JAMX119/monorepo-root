# Turborepo 设置持久化任务（persistent）

## 1. 概述

在 Turborepo 中，持久化任务（Persistent Tasks）是一种特殊类型的任务，它不会自动退出，而是保持运行状态以支持开发过程中的实时更新。持久化任务最常见的应用场景是开发服务器（如 webpack-dev-server、Vite dev server、Next.js 开发服务器等），这些服务器需要持续运行以监视文件变化并提供热重载功能。本文将详细介绍 Turborepo 中持久化任务的配置、使用场景、最佳实践和常见问题解决方案。

## 2. 持久化任务的基本原理

### 2.1 什么是持久化任务

持久化任务是指那些设计为长期运行而不自动终止的任务。在 Turborepo 中，通过设置 `persistent: true` 来标记一个任务为持久化任务。与普通任务不同，持久化任务：

- 不会自动退出，会一直保持运行状态
- 通常用于提供开发过程中的实时反馈或服务
- 不会被缓存，因为它们的输出是动态变化的
- 可能会与其他任务有特殊的交互方式

### 2.2 持久化任务与普通任务的区别

| 特性 | 普通任务 | 持久化任务 |
|------|----------|------------|
| 运行方式 | 执行完成后自动退出 | 持续运行直到手动终止 |
| 缓存行为 | 默认启用缓存 | 通常禁用缓存 (`cache: false`) |
| 输出处理 | 输出被缓存以供后续使用 | 输出通常是实时控制台输出或服务 |
| 依赖处理 | 等待所有依赖任务完成后执行 | 可能需要特殊处理依赖关系 |
| 并行执行 | 可以与其他任务完全并行 | 可能需要协调端口或资源使用 |

### 2.3 持久化任务的内部机制

Turborepo 对持久化任务的处理机制与普通任务有所不同：

1. 当启动持久化任务时，Turborepo 会等待它的所有依赖任务完成
2. 启动持久化任务后，Turborepo 不会等待它完成，而是继续执行其他任务
3. 如果有多个持久化任务，Turborepo 会尝试并行启动它们
4. 当用户中断 Turborepo 进程时，它会自动终止所有正在运行的持久化任务

## 3. 配置持久化任务

### 3.1 基本配置语法

在 `turbo.json` 文件中，可以通过以下方式配置持久化任务：

```json
{
  "pipeline": {
    "<task-name>": {
      "persistent": true,
      "cache": false,
      "outputs": []
    }
  }
}
```

其中：
- `persistent: true` 标记任务为持久化任务
- `cache: false` 通常与持久化任务一起使用，因为持久化任务的输出是动态的，不适合缓存
- `outputs: []` 表示该任务没有需要缓存的输出文件

### 3.2 基本配置示例

以下是配置前端开发服务器作为持久化任务的基本示例：

```json
{
  "pipeline": {
    "dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "dependsOn": ["^build"]
    },
    "build": {
      "outputs": ["dist/**"]
    }
  }
}
```

在上面的示例中，`dev` 任务被配置为持久化任务，它依赖于所有上游包的 `build` 任务完成后才会启动。

### 3.3 配置环境变量

持久化任务通常需要特定的环境变量来控制其行为。可以在 `env` 配置中指定这些环境变量：

```json
{
  "pipeline": {
    "dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["PORT", "HOST", "API_URL", "WATCH_MODE"]
    }
  }
}
```

### 3.4 配置依赖关系

持久化任务可以依赖于其他任务，通常是构建任务或准备任务：

```json
{
  "pipeline": {
    "dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "dependsOn": ["build:dev", "generate-types"]
    },
    "build:dev": {
      "outputs": ["dist-dev/**"]
    },
    "generate-types": {
      "outputs": ["src/types/**"]
    }
  }
}
```

在上面的示例中，`dev` 任务依赖于 `build:dev` 和 `generate-types` 任务，Turborepo 会确保在启动 `dev` 任务之前，这两个依赖任务都已成功完成。

## 4. 持久化任务的应用场景

### 4.1 前端开发服务器

**场景**：启动前端应用的开发服务器，提供热重载功能

**配置示例**：

```json
{
  "pipeline": {
    "dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "dependsOn": ["^build"],
      "env": ["PORT", "HOST", "API_URL"]
    }
  }
}
```

**package.json 示例**：

```json
{
  "scripts": {
    "dev": "vite"
  }
}
```

### 4.2 后端API服务器

**场景**：启动后端API服务器，支持开发过程中的API调用

**配置示例**：

```json
{
  "pipeline": {
    "dev:api": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["PORT", "DB_URL", "LOG_LEVEL"]
    }
  }
}
```

**package.json 示例**：

```json
{
  "scripts": {
    "dev:api": "nodemon --watch src --exec ts-node src/index.ts"
  }
}
```

### 4.3 文件监视任务

**场景**：监视文件变化并自动执行特定操作（如编译、格式化等）

**配置示例**：

```json
{
  "pipeline": {
    "watch:css": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["WATCH_PATTERN"]
    }
  }
}
```

**package.json 示例**：

```json
{
  "scripts": {
    "watch:css": "sass --watch src/styles:dist/styles"
  }
}
```

### 4.4 测试监视模式

**场景**：以监视模式运行测试，在文件变化时自动重新运行测试

**配置示例**：

```json
{
  "pipeline": {
    "test:watch": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["TEST_MATCH_PATTERN"]
    }
  }
}
```

**package.json 示例**：

```json
{
  "scripts": {
    "test:watch": "jest --watch"
  }
}
```

### 4.5 多服务开发环境

**场景**：在微服务架构中，同时启动多个服务的开发服务器

**配置示例**：

```json
{
  "pipeline": {
    "dev:all": {
      "dependsOn": ["web#dev", "api#dev", "auth#dev"]
    },
    "web#dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["PORT=3000", "API_URL=http://localhost:4000"]
    },
    "api#dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["PORT=4000", "DB_URL=mongodb://localhost:27017"]
    },
    "auth#dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["PORT=4100", "JWT_SECRET=dev-secret"]
    }
  }
}
```

## 5. 持久化任务与其他任务类型的结合

### 5.1 与构建任务结合

持久化任务经常与构建任务结合使用，特别是在需要先构建依赖包的场景：

```json
{
  "pipeline": {
    "dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "dependsOn": ["^build", "build:dev"]
    },
    "build": {
      "outputs": ["dist/**"]
    },
    "build:dev": {
      "outputs": ["dist-dev/**"],
      "env": ["NODE_ENV=development"]
    }
  }
}
```

在这个配置中，`dev` 任务依赖于所有上游包的 `build` 任务和当前包的 `build:dev` 任务，确保在启动开发服务器之前，所有必要的构建都已完成。

### 5.2 与监视任务结合

在某些情况下，可能需要同时运行多个监视任务：

```json
{
  "pipeline": {
    "watch": {
      "dependsOn": ["watch:js", "watch:css", "watch:assets"]
    },
    "watch:js": {
      "persistent": true,
      "cache": false,
      "outputs": []
    },
    "watch:css": {
      "persistent": true,
      "cache": false,
      "outputs": []
    },
    "watch:assets": {
      "persistent": true,
      "cache": false,
      "outputs": []
    }
  }
}
```

### 5.3 与过滤功能结合

可以使用 Turborepo 的过滤功能来选择性地启动持久化任务：

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

然后使用以下命令启动特定工作区的开发服务器：

```bash
turbo run dev --filter=web
turbo run dev --filter=api
turbo run dev --filter=web... # 启动web及其依赖的开发服务器
```

### 5.4 与环境变量配置结合

可以为不同环境配置不同的持久化任务：

```json
{
  "pipeline": {
    "dev:local": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["NODE_ENV=development", "API_URL=http://localhost:4000"]
    },
    "dev:staging": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["NODE_ENV=development", "API_URL=https://api.staging.example.com"]
    }
  }
}
```

## 6. 持久化任务的高级配置技巧

### 6.1 配置端口和资源分配

在运行多个持久化任务时，需要确保它们使用不同的端口和资源：

```json
{
  "pipeline": {
    "web#dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["PORT=3000"]
    },
    "api#dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["PORT=4000"]
    },
    "auth#dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["PORT=4100"]
    }
  }
}
```

### 6.2 创建复合持久化任务

可以创建一个复合任务来启动多个持久化任务：

```json
{
  "pipeline": {
    "dev:all": {
      "dependsOn": ["web#dev", "api#dev", "docs#dev"]
    },
    "web#dev": {
      "persistent": true,
      "cache": false,
      "outputs": []
    },
    "api#dev": {
      "persistent": true,
      "cache": false,
      "outputs": []
    },
    "docs#dev": {
      "persistent": true,
      "cache": false,
      "outputs": []
    }
  }
}
```

然后可以使用 `turbo run dev:all` 命令启动所有开发服务器。

### 6.3 配置任务启动顺序

在某些情况下，可能需要控制持久化任务的启动顺序：

```json
{
  "pipeline": {
    "dev:sequential": {
      "dependsOn": ["api#dev-ready", "web#dev"]
    },
    "api#dev-ready": {
      "dependsOn": ["api#dev"],
      "cache": false,
      "outputs": []
    },
    "api#dev": {
      "persistent": true,
      "cache": false,
      "outputs": []
    },
    "web#dev": {
      "persistent": true,
      "cache": false,
      "outputs": []
    }
  }
}
```

在这个配置中，需要创建一个额外的非持久化任务 `api#dev-ready` 来模拟 API 服务器准备就绪的状态。

### 6.4 使用脚本协调持久化任务

对于更复杂的场景，可以使用脚本文件来协调多个持久化任务：

```javascript
// scripts/start-dev.js
const { spawn } = require('child_process');
const path = require('path');

// 启动API服务器
const apiProcess = spawn('pnpm', ['run', 'dev:api'], {
  cwd: path.join(__dirname, '../services/api'),
  stdio: 'inherit',
  shell: true
});

// 等待API服务器启动（简单实现，实际项目中可能需要更复杂的健康检查）
setTimeout(() => {
  // 启动Web服务器
  const webProcess = spawn('pnpm', ['run', 'dev:web'], {
    cwd: path.join(__dirname, '../apps/web'),
    stdio: 'inherit',
    shell: true
  });

  // 处理终止信号
  process.on('SIGINT', () => {
    webProcess.kill();
    apiProcess.kill();
  });
}, 3000);
```

然后在 `package.json` 中添加一个脚本：

```json
{
  "scripts": {
    "dev:coordinated": "node scripts/start-dev.js"
  }
}
```

### 6.5 配置持久化任务的输入

虽然持久化任务通常不缓存，但在某些情况下，可能需要指定输入以影响其他任务：

```json
{
  "pipeline": {
    "dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "inputs": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.css"]
    }
  }
}
```

## 7. 持久化任务的性能优化

### 7.1 限制并行度

当运行多个持久化任务时，可能需要限制并行度以避免资源竞争：

```bash
turbo run dev:all --concurrency=2
```

这将限制同时运行的持久化任务数量为 2。

### 7.2 优化依赖关系

确保持久化任务的依赖关系尽可能精简，只包含必要的前置任务：

```json
{
  "pipeline": {
    "dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "dependsOn": ["^build:minimal"] // 使用精简的构建任务
    },
    "build:minimal": {
      "outputs": ["dist/**"],
      "env": ["SKIP_OPTIMIZATION=true"] // 跳过优化步骤以加快构建速度
    }
  }
}
```

### 7.3 使用增量构建

对于持久化任务依赖的构建任务，使用增量构建可以显著提高启动速度：

```json
{
  "pipeline": {
    "dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "dependsOn": ["build:dev"]
    },
    "build:dev": {
      "outputs": ["dist/**"],
      "cache": true // 启用缓存以支持增量构建
    }
  }
}
```

### 7.4 配置日志级别

调整持久化任务的日志级别可以减少输出噪音，提高开发体验：

```json
{
  "pipeline": {
    "dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["LOG_LEVEL=info"]
    }
  }
}
```

### 7.5 使用轻量级开发服务器

选择轻量级的开发服务器可以显著提高持久化任务的性能：

- 对于前端项目，考虑使用 Vite 而不是 webpack-dev-server
- 对于 Node.js 项目，考虑使用 `ts-node-dev` 而不是普通的 `nodemon` + `ts-node` 组合
- 对于静态站点，考虑使用 `serve` 或类似的轻量级服务器

## 8. 持久化任务的调试与监控

### 8.1 查看任务输出

可以使用 Turborepo 的日志选项来查看持久化任务的输出：

```bash
turbo run dev --loglevel=verbose
```

### 8.2 排查启动失败的任务

如果持久化任务启动失败，可以使用以下方法进行排查：

1. 检查依赖任务是否成功完成
2. 检查环境变量是否正确设置
3. 检查端口是否被占用
4. 尝试直接运行任务（不通过 Turborepo）以查看详细错误信息

```bash
cd apps/web
npm run dev
```

### 8.3 监控资源使用情况

对于长时间运行的持久化任务，监控资源使用情况很重要：

```bash
# 在 macOS/Linux 上
htop

# 查看特定端口的使用情况
lsof -i :3000

# 在 Windows 上
netstat -ano | findstr :3000
```

### 8.4 自动重启崩溃的任务

可以使用工具如 `nodemon` 或 `pm2` 来自动重启崩溃的持久化任务：

```json
{
  "scripts": {
    "dev:restartable": "nodemon --exec \"turbo run dev\" --watch src"
  }
}
```

### 8.5 调试任务间的依赖关系

可以使用 `--dry` 选项来预览持久化任务的依赖关系：

```bash
turbo run dev --dry
```

## 9. 实际案例分析

### 9.1 前端应用开发环境

**场景**：为 React 应用配置开发环境，包括开发服务器、API 模拟服务和样式监视

**配置示例**：

```json
{
  "pipeline": {
    "dev": {
      "dependsOn": ["dev:web", "dev:api", "dev:css"]
    },
    "dev:web": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "dependsOn": ["^build"],
      "env": ["PORT=3000", "API_URL=http://localhost:4000"]
    },
    "dev:api": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["PORT=4000", "MOCK_DATA=true"]
    },
    "dev:css": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["WATCH=true"]
    }
  }
}
```

### 9.2 微服务开发环境

**场景**：为微服务架构配置开发环境，包括多个后端服务和前端应用

**配置示例**：

```json
{
  "pipeline": {
    "dev:all": {
      "dependsOn": ["web#dev", "api-gateway#dev", "user-service#dev", "product-service#dev"]
    },
    "web#dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["PORT=3000", "API_GATEWAY_URL=http://localhost:8000"]
    },
    "api-gateway#dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["PORT=8000", "USER_SERVICE_URL=http://localhost:8100", "PRODUCT_SERVICE_URL=http://localhost:8200"]
    },
    "user-service#dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["PORT=8100", "DB_URL=mongodb://localhost:27017/users"]
    },
    "product-service#dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["PORT=8200", "DB_URL=mongodb://localhost:27017/products"]
    }
  }
}
```

### 9.3 全栈开发环境

**场景**：为全栈应用配置开发环境，包括前端、后端、数据库和缓存服务

**配置示例**：

```json
{
  "pipeline": {
    "dev:all": {
      "dependsOn": ["web#dev", "api#dev", "services#up"]
    },
    "web#dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["PORT=3000", "API_URL=http://localhost:4000"]
    },
    "api#dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "dependsOn": ["services#up"],
      "env": ["PORT=4000", "DB_URL=postgresql://localhost:5432/app", "REDIS_URL=redis://localhost:6379"]
    },
    "services#up": {
      "cache": false,
      "outputs": [],
      "env": ["COMPOSE_PROJECT_NAME=app-dev"]
    }
  }
}
```

在这个配置中，`services#up` 任务可以是一个启动 Docker 容器的脚本，用于运行数据库和缓存服务。

## 10. 常见问题与解决方案

### 10.1 端口冲突

**问题**：多个持久化任务尝试使用相同的端口

**症状**：
- 任务启动失败，显示 "EADDRINUSE" 错误
- 服务无法访问或行为异常

**解决方案**：
- 为每个持久化任务配置不同的端口
- 使用环境变量控制端口配置
- 实现端口自动检测和分配机制

```json
{
  "pipeline": {
    "web#dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["PORT=3000"]
    },
    "api#dev": {
      "persistent": true,
      "cache": false,
      "outputs": [],
      "env": ["PORT=4000"]
    }
  }
}
```

### 10.2 任务启动顺序问题

**问题**：需要确保一个持久化任务在另一个任务完全启动后再启动

**症状**：
- 服务依赖关系错误
- 连接超时或失败
- 应用初始化错误

**解决方案**：
- 使用脚本来协调任务启动顺序
- 实现健康检查机制
- 为依赖服务添加适当的等待时间

```javascript
// scripts/start-services.js
const { spawn } = require('child_process');

// 启动API服务
const api = spawn('turbo', ['run', 'api#dev']);

// 简单的健康检查实现
let apiReady = false;
setInterval(() => {
  // 检查API服务是否就绪
  if (!apiReady) {
    // 这里应该实现实际的健康检查逻辑
    apiReady = true; // 假设API服务已经就绪
    
    if (apiReady) {
      console.log('API服务已就绪，启动Web服务...');
      // 启动Web服务
      spawn('turbo', ['run', 'web#dev'], { stdio: 'inherit' });
    }
  }
}, 1000);
```

### 10.3 资源占用过高

**问题**：运行多个持久化任务导致系统资源占用过高

**症状**：
- 系统卡顿或变慢
- 任务运行缓慢
- 任务意外终止

**解决方案**：
- 限制并行运行的持久化任务数量
- 优化各个任务的资源使用
- 使用更轻量级的开发工具
- 考虑使用容器化技术隔离资源

```bash
turbo run dev:all --concurrency=2
```

### 10.4 任务无法正常终止

**问题**：当停止 Turborepo 时，持久化任务没有被正确终止

**症状**：
- 端口仍然被占用
- 进程继续在后台运行
- 下次启动时出现端口冲突

**解决方案**：
- 确保正确发送终止信号给所有持久化任务
- 使用 `--signal` 选项指定终止信号类型
- 实现自定义的清理逻辑

```bash
turbo run dev --signal=SIGTERM
```

### 10.5 持久化任务与缓存冲突

**问题**：持久化任务的行为受到缓存影响

**症状**：
- 任务使用过期的缓存数据
- 任务行为不一致

**解决方案**：
- 确保为持久化任务设置 `cache: false`
- 检查是否有其他配置影响了缓存行为
- 使用 `--force` 选项强制重新执行依赖任务

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

## 11. 总结与最佳实践

### 11.1 持久化任务配置最佳实践

1. **始终设置 `cache: false`**：持久化任务的输出是动态的，不适合缓存
2. **设置明确的端口和环境变量**：避免端口冲突和环境配置问题
3. **精简依赖关系**：只包含必要的前置任务，提高启动速度
4. **使用增量构建**：对于依赖的构建任务，启用缓存以支持增量构建
5. **提供清晰的文档**：记录持久化任务的用途、配置和使用方法

### 11.2 持久化任务使用建议

1. **为开发环境设计**：持久化任务主要用于开发环境，不建议在生产环境中使用
2. **合理组织任务**：将相关的持久化任务组织到复合任务中，简化命令执行
3. **监控资源使用**：定期监控持久化任务的资源使用情况，避免资源浪费
4. **实现健康检查**：为关键服务实现健康检查机制，确保服务正常运行
5. **定期更新依赖**：保持开发工具和依赖库的更新，以获得更好的性能和稳定性

### 11.3 未来趋势与展望

随着 Turborepo 和现代前端开发工具的不断发展，持久化任务的配置和管理也将变得更加简单和高效。未来可能的发展趋势包括：

1. **更智能的任务协调**：自动检测服务启动状态，优化任务启动顺序
2. **更精细的资源管理**：自动分配和优化资源使用，避免资源冲突
3. **更丰富的监控功能**：提供内置的持久化任务监控和调试工具
4. **更好的跨平台支持**：优化在不同操作系统上的持久化任务行为
5. **更深入的工具集成**：与更多开发工具和框架深度集成，提供无缝的开发体验

通过合理配置和使用持久化任务，开发者可以创建高效、稳定的开发环境，提高开发效率和体验。Turborepo 的持久化任务功能为 Monorepo 项目中的多服务开发提供了强大的支持，使开发者能够更轻松地管理复杂的开发工作流。