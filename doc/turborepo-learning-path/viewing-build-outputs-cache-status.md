# 查看 Turborepo 构建输出和缓存状态

## 1. 概述

Turborepo 的高效性能很大程度上依赖于其智能缓存系统和并行执行机制。对于开发者来说，了解如何查看和分析构建输出以及缓存状态是优化开发流程、排查问题和提高效率的关键。本文将详细介绍如何在 Turborepo 项目中查看构建输出和缓存状态，包括各种命令、配置选项和最佳实践。

## 2. 构建输出基础

### 2.1 什么是构建输出

构建输出是指任务执行后生成的文件和数据，包括但不限于：

- 编译后的代码文件
- 打包后的资源文件
- 测试报告和覆盖率数据
- 日志文件和错误信息
- 缓存状态和统计数据

### 2.2 构建输出的重要性

- **问题排查**：构建输出生成的日志和错误信息可以帮助开发者快速定位和解决问题
- **性能分析**：通过分析构建输出，可以识别性能瓶颈并进行优化
- **缓存验证**：确认缓存是否正常工作，以及哪些任务命中了缓存
- **质量保证**：验证构建产物是否符合预期质量标准
- **持续集成**：在 CI/CD 环境中，构建输出是评估构建是否成功的重要依据

## 3. 查看基本构建输出

### 3.1 命令行输出

执行 Turborepo 命令时，默认会在控制台输出构建过程的基本信息：

```bash
turbo build
```

**输出示例：**

```
• Packages in scope: api-client, common-utils, ui-components, web
• Running build in 4 packages
• Remote cache not configured
web:build: cache miss, executing 85d0f14b859f4a8d
web:build: 
web:build: > web@1.0.0 build
web:build: > tsc && vite build
web:build: 
web:build: vite v4.4.9 building for production...
web:build: ✓ 24 modules transformed.
web:build: dist/index.html                  0.45 kB │ gzip:  0.30 kB
web:build: dist/assets/index.574d3a0f.css   1.28 kB │ gzip:  0.63 kB
web:build: dist/assets/index.e8b6d0fb.js   45.63 kB │ gzip: 17.82 kB
web:build: ✓ built in 782ms
common-utils:build: cache miss, executing a6c3e5f29b8d4e7f
common-utils:build: 
common-utils:build: > common-utils@1.0.0 build
common-utils:build: > tsc
common-utils:build: 
api-client:build: cache miss, executing c2d4f8a7b9e63d5c
api-client:build: 
api-client:build: > api-client@1.0.0 build
api-client:build: > tsc
api-client:build: 
ui-components:build: cache miss, executing e1f3d5b7a9c84e62
ui-components:build: 
ui-components:build: > ui-components@1.0.0 build
ui-components:build: > tsc
ui-components:build: 
• Done in 1.4s
```

### 3.2 日志级别控制

可以使用 `--log-level` 选项控制输出的详细程度：

```bash
turbo build --log-level=debug
```

**可用的日志级别：**

- `error`：只显示错误信息
- `warn`：显示警告和错误信息
- `info`：显示一般信息、警告和错误（默认）
- `debug`：显示调试信息、一般信息、警告和错误
- `trace`：显示所有可能的信息，包括非常详细的调试信息

**示例：**

```bash
# 只显示错误信息
turbo build --log-level=error

# 显示详细的调试信息
turbo build --log-level=debug
```

### 3.3 输出格式控制

可以使用 `--output-logs` 选项控制日志的输出格式：

```bash
turbo build --output-logs=newline
```

**可用的输出格式：**

- `newline`：每个任务的输出以换行符分隔（默认）
- `stream`：以流式方式输出任务日志，适合长时间运行的任务
- `none`：不输出任何任务日志

**示例：**

```bash
# 以流式方式输出日志
turbo dev --output-logs=stream

# 不输出任何任务日志
turbo build --output-logs=none
```

## 4. 缓存状态查看

### 4.1 缓存状态标识

在 Turborepo 的命令行输出中，每个任务执行前都会显示其缓存状态：

- `cache hit`：任务命中了缓存，可以直接使用缓存结果
- `cache miss`：任务未命中缓存，需要重新执行
- `remote cache hit`：任务命中了远程缓存
- `remote cache miss`：任务未命中远程缓存

**示例：**

```
web:build: cache hit, replaying output e8b6d0fb
common-utils:build: cache miss, executing a6c3e5f29b8d4e7f
api-client:build: remote cache hit, downloading output c2d4f8a7b9e63d5c
```

### 4.2 缓存统计信息

可以使用 `turbo run <task> --dry` 命令查看任务的缓存统计信息，而不实际执行任务：

```bash
turbo build --dry
```

**输出示例：**

```
• Packages in scope: api-client, common-utils, ui-components, web
• Running build in 4 packages
• Remote cache not configured
• web:build: cache hit, would replay output 85d0f14b859f4a8d
• common-utils:build: cache hit, would replay output a6c3e5f29b8d4e7f
• api-client:build: cache hit, would replay output c2d4f8a7b9e63d5c
• ui-components:build: cache hit, would replay output e1f3d5b7a9c84e62
• Would execute 0 tasks
• Would cache 0 new outputs
• Would save 1.4s
```

### 4.3 缓存键值查看

在调试缓存问题时，可以使用 `--debug` 选项查看每个任务的缓存键值：

```bash
turbo build --debug
```

这将输出详细的缓存键值信息，包括输入哈希、环境变量哈希等。

### 4.4 缓存位置查看

Turborepo 的缓存存储在本地文件系统中，可以通过以下方式查看缓存位置：

```bash
turbo info
```

**输出示例：**

```
Turbo version: 1.10.12
Local cache location: C:\Users\Admin\AppData\Local\Turbo\v5\cache
Remote cache: Not configured
```

## 5. 构建输出和缓存状态分析

### 5.1 分析构建时间

可以通过构建输出来分析每个任务的执行时间，找出性能瓶颈：

```bash
turbo build --log-level=info
```

**分析示例：**

```
• Done in 1.4s
```

从输出中可以看到整个构建过程耗时 1.4 秒。如果需要更详细的时间分析，可以使用 `--log-level=debug`。

### 5.2 分析缓存命中率

通过多次运行相同的任务，可以分析缓存命中率：

```bash
# 第一次运行，所有任务都是 cache miss
turbo build

# 第二次运行，如果没有变更，所有任务都应该是 cache hit
turbo build
```

**分析示例：**

```
# 第一次运行
• Done in 1.4s

# 第二次运行
• Done in 0.2s
```

从执行时间的显著减少可以看出缓存机制正常工作。

### 5.3 分析缓存失效原因

当缓存未命中预期时，可以使用 `--debug` 选项分析原因：

```bash
turbo build --debug
```

这将输出详细的缓存决策过程，包括哪些输入发生了变化，导致缓存失效。

### 5.4 生成构建报告

可以使用第三方工具或脚本处理 Turborepo 的输出，生成更详细的构建报告：

```bash
turbo build --log-level=debug | tee build-log.txt
```

然后可以使用文本处理工具或自定义脚本分析 `build-log.txt` 文件。

## 6. 高级查看技巧

### 6.1 自定义输出格式

可以通过环境变量 `TURBO_REPORTER` 自定义输出格式：

```bash
# 使用简洁的输出格式
export TURBO_REPORTER=pretty
turbo build

# 使用JSON格式输出
export TURBO_REPORTER=json
turbo build
```

也可以在 `turbo.json` 中全局配置：

```json
{
  "reporter": "pretty",
  "pipeline": {
    // ...
  }
}
```

### 6.2 保存构建输出到文件

可以使用重定向操作符将构建输出保存到文件：

```bash
turbo build > build-output.txt 2>&1
```

这将把标准输出和错误输出都保存到 `build-output.txt` 文件中。

### 6.3 查看特定任务的输出

可以使用过滤功能只查看特定任务的输出：

```bash
turbo build --filter=web
```

这将只显示 `web` 包的构建输出。

### 6.4 监控实时输出

对于长时间运行的任务，可以使用 `--output-logs=stream` 选项监控实时输出：

```bash
turbo dev --output-logs=stream
```

这对于调试开发服务器或持续集成任务特别有用。

### 6.5 使用进度指示器

Turborepo 默认提供了简单的进度指示器，可以通过 `--no-progress` 禁用：

```bash
turbo build --no-progress
```

## 7. 缓存管理与操作

### 7.1 清除本地缓存

当需要重新构建所有任务时，可以清除本地缓存：

```bash
turbo clean
```

这将删除所有本地缓存的任务结果。

### 7.2 强制重新执行任务

如果只想重新执行特定任务，而不清除所有缓存，可以使用 `--force` 选项：

```bash
turbo build --force
```

这将强制重新执行所有任务，忽略缓存。

### 7.3 禁用特定任务的缓存

可以在 `turbo.json` 中为特定任务禁用缓存：

```json
{
  "pipeline": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "cache": true,
      "outputs": ["dist/**"]
    }
  }
}
```

### 7.4 远程缓存操作

如果配置了远程缓存，可以使用以下命令管理远程缓存：

```bash
# 仅使用本地缓存
turbo build --local-only

# 强制上传缓存到远程服务器
turbo build --team=<team-slug> --token=<token>
```

## 8. 实际应用场景

### 8.1 性能优化分析

**场景：** 分析构建过程的性能瓶颈，找出优化点

**操作步骤：**

```bash
# 清除缓存以获得干净的构建环境
turbo clean

# 运行构建并记录详细日志
turbo build --log-level=debug | tee build-performance.log

# 分析日志，查找耗时最长的任务
```

**优化方向：**
- 对于耗时较长的任务，考虑优化其执行逻辑
- 调整任务依赖关系，使更多任务可以并行执行
- 增加并行度设置
- 考虑使用远程缓存

### 8.2 缓存问题排查

**场景：** 任务缓存没有按预期工作

**操作步骤：**

```bash
# 查看缓存状态
turbo build --dry

# 运行任务并查看详细的缓存决策过程
turbo build --debug

# 检查缓存键值和输入变更
```

**排查方向：**
- 确认输入文件是否有未预期的变更
- 检查环境变量是否正确配置
- 验证 `turbo.json` 中的 `inputs` 和 `outputs` 配置
- 确认依赖关系是否正确

### 8.3 CI/CD 环境中的输出管理

**场景：** 在 CI/CD 环境中管理和分析构建输出

**GitHub Actions 示例：**

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build with Turbo
        run: |
          turbo build --log-level=info | tee build-output.txt
      - name: Upload build logs
        uses: actions/upload-artifact@v3
        with:
          name: build-logs
          path: build-output.txt
      - name: Check build status
        run: |
          if grep -q "error" build-output.txt; then
            echo "Build failed with errors"
            exit 1
          fi
```

### 8.4 多环境构建比较

**场景：** 比较不同环境下的构建输出和性能

**操作步骤：**

```bash
# 在开发环境构建
export NODE_ENV=development
turbo build --log-level=debug | tee dev-build.log

# 在生产环境构建
export NODE_ENV=production
turbo build --log-level=debug | tee prod-build.log

# 比较两个构建日志
diff dev-build.log prod-build.log
```

## 9. 最佳实践

### 9.1 日志管理最佳实践

- **适当设置日志级别**：在开发环境使用 `debug` 级别，在 CI/CD 环境使用 `info` 级别
- **保存关键构建日志**：对于重要的构建（如生产构建），保存完整的日志供日后分析
- **使用结构化日志**：在复杂项目中，考虑使用 JSON 格式的日志以便于自动化分析
- **定期清理日志文件**：避免日志文件占用过多磁盘空间

### 9.2 缓存状态监控最佳实践

- **监控缓存命中率**：定期检查缓存命中率，确保缓存机制正常工作
- **建立缓存基线**：记录正常情况下的缓存命中率和构建时间，作为性能评估的基准
- **分析缓存失效模式**：了解哪些类型的变更最常导致缓存失效
- **设置缓存大小限制**：避免缓存过大影响系统性能

### 9.3 性能优化最佳实践

- **识别瓶颈任务**：通过分析构建输出来识别耗时最长的任务
- **优化依赖关系**：合理配置任务依赖，最大化并行执行
- **利用远程缓存**：在团队环境中，使用远程缓存共享构建结果
- **定期清理缓存**：定期清除过时的缓存，避免缓存膨胀
- **使用增量构建**：尽可能利用增量构建功能，只重新构建变更的部分

### 9.4 CI/CD 集成最佳实践

- **在 CI 中记录完整输出**：保存完整的构建输出和缓存状态信息
- **在 PR 中显示构建摘要**：使用 GitHub Actions 等工具在 PR 中显示构建和缓存状态摘要
- **设置构建时间阈值**：为构建时间设置阈值，超出阈值时发出警报
- **利用远程缓存加速 CI 构建**：配置远程缓存以加速 CI 环境中的构建过程

## 10. 常见问题与解决方案

### 10.1 缓存未命中问题

**问题：** 预期会命中缓存的任务却未命中

**解决方案：**
- 检查输入文件是否有未预期的变更（使用 `git status` 或 `git diff`）
- 确认环境变量是否正确设置（特别是在 `turbo.json` 中配置的 `env` 变量）
- 验证 `turbo.json` 中的 `inputs` 和 `outputs` 配置是否完整
- 检查依赖项是否有变更
- 考虑使用 `--debug` 选项查看详细的缓存决策过程

### 10.2 缓存结果不正确

**问题：** 任务命中了缓存，但结果不正确

**解决方案：**
- 清除本地缓存（`turbo clean`）并重新构建
- 检查 `turbo.json` 中的 `outputs` 配置是否包含了所有必要的输出文件
- 确认任务的输入是否被正确识别
- 考虑禁用特定任务的缓存，直到问题解决

### 10.3 构建输出过多

**问题：** 构建输出过多，难以分析

**解决方案：**
- 使用 `--log-level` 选项降低日志详细程度
- 使用过滤功能只查看相关包的输出
- 将输出重定向到文件，使用文本编辑器分析
- 考虑使用自定义报告工具处理输出

### 10.4 远程缓存问题

**问题：** 无法连接到远程缓存服务器或缓存上传/下载失败

**解决方案：**
- 检查网络连接和防火墙设置
- 验证认证令牌是否有效
- 确认远程缓存服务器配置正确
- 尝试使用 `--local-only` 选项临时禁用远程缓存

### 10.5 构建时间过长

**问题：** 构建时间过长，即使启用了缓存

**解决方案：**
- 分析构建输出，找出耗时最长的任务
- 调整并行度设置（使用 `--concurrency` 选项）
- 优化任务依赖关系，增加并行执行的可能性
- 考虑使用远程缓存
- 检查系统资源（CPU、内存、磁盘 I/O）是否充足

## 11. 总结

查看和分析 Turborepo 的构建输出和缓存状态是优化开发流程、排查问题和提高效率的重要手段。通过本文的介绍，你应该能够：

1. 理解构建输出的基本概念和重要性
2. 使用各种命令和选项查看基本的构建输出
3. 控制日志级别和输出格式以满足不同需求
4. 查看和分析缓存状态，包括缓存命中情况和统计信息
5. 分析构建时间和缓存命中率，找出性能瓶颈
6. 使用高级技巧自定义输出格式、保存输出到文件、查看特定任务输出等
7. 管理缓存，包括清除、强制重新执行和禁用特定任务的缓存
8. 将这些技巧应用到实际场景中，如性能优化分析、缓存问题排查和 CI/CD 集成
9. 遵循最佳实践，如日志管理、缓存状态监控和性能优化
10. 解决常见的问题，如缓存未命中、缓存结果不正确和构建时间过长等

通过合理利用 Turborepo 提供的工具和选项，可以更好地理解和优化构建过程，提高开发效率和项目质量。随着项目的发展，你可能需要根据具体需求调整和优化这些策略，但掌握这些基本概念和技术将为你的项目奠定坚实的基础。