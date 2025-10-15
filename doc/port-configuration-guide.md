# Monorepo 项目端口配置指南

## 整体端口规划

在这个 monorepo 项目中，我们遵循以下端口规划原则：
- `apps` 目录下的前端项目：端口从 **8000** 开始编号
- `services` 目录下的后端服务：端口从 **3000** 开始编号

## 端口配置文件

所有端口配置集中在 monorepo 根目录的 `.env` 文件中进行管理：

```env
# Apps项目端口配置
# Web Next.js项目端口
WEB_NEXTJS_PORT=8000
# Admin React项目端口
ADMIN_REACT_PORT=8001
# React Native Expo项目端口
REACT_NATIVE_EXPO_PORT=8002

# Services项目端口配置
# Express服务端口
EXPRESS_SERVICE_PORT=3000

# 通用环境变量
NODE_ENV=development
```

## 各项目端口配置方法

### 1. Web Next.js 项目

项目路径：`apps/web-nextjs`

配置方式：
- 使用自定义的 Node.js 启动脚本 `start-script.js` 读取环境变量并启动服务器
- 通过环境变量 `WEB_NEXTJS_PORT` 读取配置值
- 使用 `dotenv` 库加载根目录的 `.env` 文件

启动脚本内容 (`start-script.js`):

```javascript
// 启动脚本 - 用于正确读取环境变量并启动Next.js服务器
const { spawn } = require('child_process');
const path = require('path');

// 读取环境变量
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// 获取端口号
const port = process.env.WEB_NEXTJS_PORT || 3000;

// 构建命令参数
const command = 'next';
const args = ['dev', '--turbopack', '--port', port];

// 启动Next.js服务器
const nextProcess = spawn(command, args, {
  stdio: 'inherit',
  shell: true
});

nextProcess.on('close', (code) => {
  process.exit(code);
});
```

`package.json` 脚本配置：

```json
"scripts": {
  "dev": "node start-script.js",
  "build": "next build --turbopack",
  "start": "node start-script.js"
}
```

### 2. Admin React 项目 (Vite)

项目路径：`apps/admin-react`

配置方式：
- 使用 Vite 的 `--port` 参数指定端口
- 通过环境变量 `ADMIN_REACT_PORT` 读取配置值
- 使用 `dotenv` 工具加载根目录的 `.env` 文件

`package.json` 脚本配置：

```json
"scripts": {
  "dev": "dotenv -e ../../.env -- vite --port %ADMIN_REACT_PORT%",
  "preview": "dotenv -e ../../.env -- vite preview --port %ADMIN_REACT_PORT%"
}
```

### 3. React Native Expo 项目

项目路径：`apps/react-native-expo`

配置方式：
- 使用自定义的 Node.js 启动脚本 `start-script.js` 读取环境变量并启动服务器
- 通过环境变量 `REACT_NATIVE_EXPO_PORT` 读取配置值
- 使用 `dotenv` 库加载根目录的 `.env` 文件

启动脚本内容 (`start-script.js`):

```javascript
const { spawn } = require('child_process');
const dotenv = require('dotenv');
const path = require('path');

// 加载根目录的.env文件
dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

// 获取端口环境变量
const port = process.env.REACT_NATIVE_EXPO_PORT || '8002';

console.log(`Starting Expo server on port ${port}...`);

// 启动Expo开发服务器
const expoProcess = spawn('npx', ['expo', 'start', '--port', port], {
  stdio: 'inherit',
  shell: true
});

expoProcess.on('close', (code) => {
  console.log(`Expo server exited with code ${code}`);
  process.exit(code);
});

expoProcess.on('error', (error) => {
  console.error('Failed to start Expo server:', error);
  process.exit(1);
});
```

`package.json` 脚本配置：

```json
"scripts": {
  "start": "node start-script.js",
  "dev": "node start-script.js",
  "web": "node start-script.js"
}
```

### 4. Express 服务项目

项目路径：`services/express`

配置方式：
- 在代码中通过 `process.env.EXPRESS_SERVICE_PORT` 读取环境变量
- 设置默认端口值以确保服务在环境变量未设置时仍能启动
- 使用 `dotenv` 工具加载根目录的 `.env` 文件

`src/index.ts` 代码配置：

```typescript
const PORT = process.env.EXPRESS_SERVICE_PORT || 3000;

express.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

`package.json` 脚本配置：

```json
"scripts": {
  "dev": "dotenv -e ../../.env -- ts-node-dev --respawn src/index.ts",
  "start": "dotenv -e ../../.env -- node dist/index.js"
}
```

## 统一启动项目

在 monorepo 根目录的 `package.json` 中，我们添加了单独启动各个项目的脚本，方便统一管理：

```json
"scripts": {
  "dev:web": "dotenv -e .env -- turbo run dev --filter=web-nextjs",
  "dev:admin": "dotenv -e .env -- turbo run dev --filter=admin-react",
  "dev:expo": "dotenv -e .env -- turbo run dev --filter=react-native-expo",
  "dev:express": "dotenv -e .env -- turbo run dev --filter=express"
}
```

使用方法：
- 启动 Web Next.js 项目：`pnpm dev:web`
- 启动 Admin React 项目：`pnpm dev:admin`
- 启动 React Native Expo 项目：`pnpm dev:expo`
- 启动 Express 服务：`pnpm dev:express`

## 环境变量使用注意事项

1. **环境变量加载**
   - 所有项目都使用 `dotenv-cli` 工具加载根目录的 `.env` 文件
   - 确保已在项目中安装 `dotenv-cli` 依赖：`pnpm add dotenv-cli -D`

2. **Windows 与 Unix 系统差异**
   - 在 Windows 系统中，使用 `%环境变量名%` 引用环境变量
   - 在 Unix/Linux/macOS 系统中，使用 `$环境变量名` 引用环境变量
   - 当前配置已针对 Windows 环境进行了优化

3. **端口冲突解决**
   - 如果启动项目时遇到端口被占用的情况，可以在根目录的 `.env` 文件中修改对应项目的端口号
   - 修改后无需更新各个项目的配置文件，只需重新启动项目即可应用新端口

## 最佳实践

1. **集中管理配置**：所有端口配置集中在根目录的 `.env` 文件中，便于统一管理和修改
2. **使用环境变量**：通过环境变量传递端口配置，避免硬编码
3. **设置默认值**：在代码中为端口设置默认值，提高应用的健壮性
4. **统一启动脚本**：使用 monorepo 根目录的启动脚本统一管理各个项目的启动
5. **添加文档说明**：维护清晰的端口配置文档，方便团队成员了解和使用