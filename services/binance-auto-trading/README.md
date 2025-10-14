# Binance Auto Trading Service

## 项目简介

Binance Auto Trading Service 是一个基于 Express 和 TypeScript 的服务，用于提供与 Binance 交易所相关的自动交易功能。该服务作为微服务架构中的一部分，在 monorepo 环境下进行开发和管理。

## 目录结构

```
├── .gitignore        # Git 忽略规则配置
├── package.json      # 项目依赖和脚本配置
├── README.md         # 项目说明文档（当前文件）
├── src/              # 源代码目录
│   └── index.ts      # 服务入口文件
└── tsconfig.json     # TypeScript 配置
```

## 快速开始

### 前提条件

- Node.js >= 18
- pnpm >= 10

### 安装依赖

在 monorepo 根目录执行：

```bash
pnpm install
```

或在服务目录执行：

```bash
cd services/binance-auto-trading
pnpm install
```

### 启动开发服务器

在 monorepo 根目录使用 Turbo 运行：

```bash
pnpm dev --filter binance-auto-trading
```

服务将在默认端口 3001 启动。

### 构建项目

```bash
pnpm build --filter binance-auto-trading
```

构建后的文件将输出到 `dist` 目录。

### 运行生产版本

```bash
pnpm start --filter binance-auto-trading
```

## 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| PORT | 服务监听端口 | 3001 |

## API 端点

### 健康检查

- **URL**: `/health`
- **方法**: `GET`
- **描述**: 检查服务健康状态
- **响应**: 
  ```json
  {
    "status": "ok"
  }
  ```

## 开发指南

### 代码风格

项目使用 ESLint 进行代码风格检查：

```bash
pnpm lint --filter binance-auto-trading
```

### 测试

```bash
pnpm test --filter binance-auto-trading
```

## 集成与依赖

- 作为 monorepo 的一部分，与其他服务通过 HTTP API 进行通信
- 依赖于根目录中的共享配置和工具

## 注意事项

- 开发过程中，使用 `pnpm dev` 命令会启用热重载功能，方便快速迭代开发
- 请确保在提交代码前运行 `pnpm lint` 和 `pnpm test` 确保代码质量