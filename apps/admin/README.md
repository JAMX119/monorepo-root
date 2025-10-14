# Admin 管理后台应用

这是一个基于React和TypeScript的管理后台应用，位于monorepo项目中的`apps/admin`目录。该应用使用Vite作为构建工具，提供现代化的用户界面和高效的开发体验。

## 项目概述

此管理后台应用旨在为整个系统提供统一的管理界面，包括用户管理、系统配置、数据监控等功能。作为monorepo的一部分，它可以方便地与其他服务和共享库进行集成。

## 技术栈

- React 19
- TypeScript
- Vite/Rolldown
- ESLint
- 支持Hot Module Replacement (HMR)

## 快速开始

### 在monorepo中运行

在monorepo根目录执行以下命令：

```bash
# 安装所有依赖
pnpm install

# 仅启动admin应用
pnpm dev --filter admin

# 构建admin应用
pnpm build --filter admin

# 预览构建后的应用
pnpm preview --filter admin
```

### 直接在应用目录运行

```bash
cd apps/admin

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建应用
pnpm build

# 预览构建后的应用
pnpm preview
```

## 项目结构

```
apps/admin/
├── src/                  # 源代码目录
│   ├── assets/           # 静态资源
│   ├── App.tsx           # 应用主组件
│   ├── main.tsx          # 应用入口文件
│   ├── index.css         # 全局样式
│   └── App.css           # 应用组件样式
├── index.html            # HTML入口文件
├── package.json          # 项目配置和依赖
├── tsconfig.json         # TypeScript配置
├── tsconfig.app.json     # 应用TypeScript配置
├── tsconfig.node.json    # Node环境TypeScript配置
├── vite.config.ts        # Vite配置
└── .gitignore            # Git忽略文件
```

## 在monorepo中的集成

此应用可以轻松集成monorepo中的共享包：

```bash
# 安装共享包作为依赖
pnpm add @your-monorepo/ui-components -F admin
pnpm add @your-monorepo/common-utils -F admin
```

## 环境变量

创建`.env`或`.env.local`文件来配置环境变量：

```
# 开发环境配置
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE=管理后台
```

在代码中使用环境变量：

```tsx
const apiUrl = import.meta.env.VITE_API_URL
```

## 扩展配置

### React Compiler

要启用React Compiler，可以参考[官方文档](https://react.dev/learn/react-compiler/installation)进行配置。

### ESLint配置

对于生产环境，建议更新ESLint配置以启用类型感知的lint规则。请参考默认README中的详细配置说明。

## 注意事项

- 此应用使用了Rolldown-Vite作为构建工具，这是Vite的实验性版本，提供更好的性能
- 所有依赖应通过pnpm安装以保持monorepo的一致性
- 构建后的文件位于`dist`目录，可以部署到任何静态文件服务器
