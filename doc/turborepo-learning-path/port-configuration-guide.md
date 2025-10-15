# Monorepo 端口配置指南

本指南详细说明如何在 monorepo 项目中配置和使用统一的端口管理方案。

## 一、整体端口规划

根据需求，我们已在根目录的 `.env` 文件中为各项目配置了端口号：

- **apps 目录下项目**：从 8000 开始
- **services 目录下项目**：从 3000 开始

具体配置如下：
```
# Apps项目端口配置
# Web Next.js项目端口
export WEB_NEXTJS_PORT=8000
# Admin React项目端口
export ADMIN_REACT_PORT=8001
# React Native Expo项目端口
export REACT_NATIVE_EXPO_PORT=8002

# Services项目端口配置
# Express服务端口
export EXPRESS_SERVICE_PORT=3000
```

## 二、各项目端口配置方法

### 1. Next.js 项目 (web-nextjs)

当前配置：
```json
"scripts": {
  "dev": "next dev --turbopack --port 8001",
  "build": "next build --turbopack",
  "start": "next start --port 8001",
  "lint": "eslint"
}
```

**修改方法**：

打开 `apps/web-nextjs/package.json` 文件，更新 scripts 部分：

```json
"scripts": {
  "dev": "next dev --turbopack --port $WEB_NEXTJS_PORT",
  "build": "next build --turbopack",
  "start": "next start --port $WEB_NEXTJS_PORT",
  "lint": "eslint"
}
```

> **注意**：在 Windows PowerShell 环境中，需要使用 `%WEB_NEXTJS_PORT%` 替代 `$WEB_NEXTJS_PORT`。

### 2. React + Vite 项目 (admin-react)

当前配置：
```json
"scripts": {
  "dev": "vite --port 8000",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

**修改方法**：

打开 `apps/admin-react/package.json` 文件，更新 scripts 部分：

```json
"scripts": {
  "dev": "vite --port $ADMIN_REACT_PORT",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview --port $ADMIN_REACT_PORT"
}
```

> **注意**：在 Windows PowerShell 环境中，需要使用 `%ADMIN_REACT_PORT%` 替代 `$ADMIN_REACT_PORT`。

### 3. Express 服务项目 (services/express)

当前配置（在 `src/index.ts` 中）：
```typescript
const PORT = process.env.PORT || 3000;

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

**修改方法**：

打开 `services/express/src/index.ts` 文件，更新端口配置：

```typescript
const PORT = process.env.EXPRESS_SERVICE_PORT || 3000;

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

同时，需要更新 `services/express/package.json` 中的 scripts 部分，确保在启动时加载环境变量：

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "lint": "eslint . --ext .ts,.tsx",
  "format": "prettier --write ."
}
```

## 三、使用环境变量的注意事项

1. **环境变量加载**：
   - 在根目录执行 `pnpm dev` 或 `turbo dev` 时，根目录的 `.env` 文件会被自动加载
   - 如果需要在子项目中单独执行命令，确保环境变量已正确加载

2. **Windows 兼容性**：
   - Windows PowerShell 使用 `%变量名%` 语法
   - Linux/macOS 使用 `$变量名` 语法
   - 为了跨平台兼容，推荐使用 `dotenv-cli` 工具

3. **添加 dotenv-cli 支持**（推荐）：

在根目录安装 `dotenv-cli`：
```bash
pnpm add -w dotenv-cli
```

然后更新各项目的 scripts 部分，以 admin-react 为例：
```json
"scripts": {
  "dev": "dotenv -e ../../.env -- vite --port $ADMIN_REACT_PORT",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "dotenv -e ../../.env -- vite preview --port $ADMIN_REACT_PORT"
}
```

## 四、统一启动项目

为了方便统一管理所有项目，可以在根目录的 `package.json` 中添加启动脚本：

```json
"scripts": {
  "dev:all": "turbo run dev",
  "dev:web": "turbo run dev --filter=web-nextjs",
  "dev:admin": "turbo run dev --filter=admin-react",
  "dev:express": "turbo run dev --filter=express"
}
```

这样就可以通过 `pnpm dev:all` 启动所有项目，或通过 `pnpm dev:web` 只启动特定项目。

## 五、最佳实践总结

1. 所有端口配置集中在根目录的 `.env` 文件中管理
2. 使用环境变量而非硬编码端口号
3. 为不同类型的项目（apps/services）分配不同的端口段
4. 使用 `turbo` 统一管理和启动项目
5. 考虑跨平台兼容性，使用 `dotenv-cli` 辅助加载环境变量

通过以上配置，可以实现 monorepo 项目中端口的统一管理，避免端口冲突，提高开发效率。