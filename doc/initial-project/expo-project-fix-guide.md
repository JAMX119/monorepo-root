# Expo项目创建错误分析与修复指南

## 问题分析

通过检查项目结构和配置文件，发现以下关键问题：

1. 根目录的`package.json`明确指定了使用pnpm作为包管理器：
   ```json
   "packageManager": "pnpm@10.18.2"
   ```

2. 但在创建Expo项目时使用了npm命令：
   ```bash
   npx create-expo-app@latest
   ```

3. 错误信息：`npm error Cannot read properties of null (reading 'name')`

这是一个典型的**包管理器混用问题**。在monorepo环境中，应该统一使用同一种包管理器（这里是pnpm）来避免依赖解析冲突和安装路径问题。

## 解决方案

### 方案1：使用pnpm重新初始化Expo项目

1. 首先删除现有的错误项目：
   ```bash
   cd c:/Users/Admin/Desktop/work/monorepo-root/apps
   rm -rf react-native-expo
   ```

2. 使用pnpm创建新的Expo项目：
   ```bash
   pnpm dlx create-expo-app react-native-expo
   ```

3. 进入项目目录并安装依赖：
   ```bash
   cd react-native-expo
   pnpm install
   ```

### 方案2：修复现有项目

如果希望保留已创建的项目结构，可以执行以下步骤：

1. 清理npm缓存和node_modules：
   ```bash
   cd c:/Users/Admin/Desktop/work/monorepo-root/apps/react-native-expo
   rm -rf node_modules
   rm package-lock.json
   pnpm store prune
   ```

2. 使用pnpm安装依赖：
   ```bash
   pnpm install
   ```

## 最佳实践建议

1. **统一包管理器**：在monorepo中始终使用同一种包管理器（这里是pnpm）

2. **使用正确的命令**：
   - 安装依赖：`pnpm install` 或 `pnpm add [package]`
   - 创建项目：`pnpm dlx [create-tool]`
   - 运行脚本：`pnpm run [script]`

3. **检查项目配置**：确保项目根目录的`pnpm-workspace.yaml`正确包含所有子项目路径

4. **版本一致性**：在monorepo根目录的`pnpm.overrides`中统一管理共享依赖的版本，如已有的React 19.1.0

遵循这些实践可以避免常见的依赖管理问题，确保项目构建和运行的稳定性。