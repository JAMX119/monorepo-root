# 安装 Node.js 和 pnpm/yarn/npm

## 1. 概述

在使用 Turborepo 进行 Monorepo 开发之前，首先需要安装 Node.js 和合适的包管理器。本文档提供了在不同操作系统上安装 Node.js 以及 pnpm、Yarn 和 npm 这三种主流包管理器的详细步骤。

## 2. 安装 Node.js

Node.js 是运行 JavaScript 代码的运行时环境，是现代前端开发的基础。以下是在不同操作系统上安装 Node.js 的方法。

### 2.1 Windows 系统安装 Node.js

#### 方法一：通过官方安装程序安装

1. 访问 [Node.js 官方网站](https://nodejs.org/)
2. 根据你的系统选择下载 **LTS (长期支持) 版本**（推荐用于大多数用户）或 **Current 版本**（包含最新特性）
3. 下载完成后，双击安装程序并按照提示完成安装
4. 安装过程中，确保勾选 "Automatically install the necessary tools" 选项（推荐）
5. 安装完成后，打开命令提示符（CMD）或 PowerShell，执行以下命令验证安装：

```bash
node -v
npm -v
```

如果显示版本号，则表示安装成功。

#### 方法二：使用包管理器安装

在 Windows 上，你也可以使用 Chocolatey 包管理器来安装 Node.js：

```powershell
# 首先安装 Chocolatey（如果尚未安装）
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# 安装 Node.js LTS 版本
choco install nodejs-lts -y

# 验证安装
node -v
npm -v
```

### 2.2 macOS 系统安装 Node.js

#### 方法一：通过官方安装程序安装

1. 访问 [Node.js 官方网站](https://nodejs.org/)
2. 下载 macOS 版安装程序
3. 双击安装程序并按照提示完成安装
4. 安装完成后，打开终端，执行以下命令验证安装：

```bash
node -v
npm -v
```

#### 方法二：使用 Homebrew 安装

Homebrew 是 macOS 上的包管理器，使用它可以更方便地安装和管理 Node.js：

```bash
# 首先安装 Homebrew（如果尚未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Node.js
brew install node

# 验证安装
node -v
npm -v
```

### 2.3 Linux 系统安装 Node.js

#### Ubuntu/Debian 系统

```bash
# 使用 NodeSource PPA 安装
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v
npm -v
```

#### CentOS/RHEL 系统

```bash
# 使用 NodeSource 安装
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node -v
npm -v
```

#### 使用 NVM 管理多个 Node.js 版本

NVM (Node Version Manager) 允许你在同一台机器上安装和切换多个 Node.js 版本，这对于需要在不同项目间切换的开发者特别有用。

**Windows 系统：**

1. 访问 [nvm-windows 发布页](https://github.com/coreybutler/nvm-windows/releases)
2. 下载最新的 `nvm-setup.zip` 文件
3. 解压并运行安装程序
4. 安装完成后，打开 PowerShell，执行以下命令：

```powershell
# 安装特定版本的 Node.js
nvm install lts

# 使用安装的版本
nvm use lts

# 验证安装
node -v
npm -v
```

**macOS/Linux 系统：**

```bash
# 安装 NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
# 或
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# 安装完成后，重新打开终端，安装 Node.js
nvm install --lts

# 使用安装的版本
nvm use --lts

# 验证安装
node -v
npm -v
```

## 3. 安装包管理器

Node.js 安装完成后，系统会默认安装 npm。但在 Monorepo 项目中，我们通常推荐使用更高效的包管理器如 pnpm 或 Yarn。

### 3.1 安装 pnpm

pnpm 是一个快速的、节省磁盘空间的包管理器，特别适合大型 Monorepo 项目。

#### 全局安装 pnpm

```bash
# 使用 npm 安装 pnpm
npm install -g pnpm

# 验证安装
pnpm -v
```

#### 通过独立脚本安装 pnpm

**Windows (PowerShell):**

```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

**macOS/Linux:**

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

#### 配置 pnpm

pnpm 安装完成后，你可以进行一些基本配置：

```bash
# 设置存储路径（可选）
pnpm config set store-dir ~/.pnpm-store

# 启用 pnpm 的 symlink 模式
pnpm config set symlink true
```

### 3.2 安装 Yarn

Yarn 是由 Facebook 开发的另一个流行的包管理器，提供了确定性安装和良好的性能。

#### 全局安装 Yarn

```bash
# 使用 npm 安装 Yarn
npm install -g yarn

# 验证安装
yarn -v
```

#### 通过独立安装程序安装 Yarn

**Windows:**

下载并运行 [Yarn 安装程序](https://classic.yarnpkg.com/latest.msi)。

**macOS:**

```bash
# 使用 Homebrew 安装
brew install yarn
```

**Linux:**

```bash
# Debian/Ubuntu
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn

# CentOS/RHEL
sudo wget https://dl.yarnpkg.com/rpm/yarn.repo -O /etc/yum.repos.d/yarn.repo
sudo yum install yarn
```

#### 配置 Yarn

```bash
# 设置 Yarn 缓存目录（可选）
yarn config set cache-folder ~/.yarn-cache
```

### 3.3 使用 npm

npm 是 Node.js 默认的包管理器，在安装 Node.js 时会自动安装。

#### 升级 npm 到最新版本

```bash
npm install -g npm@latest

# 验证安装
npm -v
```

#### 配置 npm

```bash
# 设置 npm 缓存目录（可选）
npm config set cache ~/.npm-cache

# 设置 npm 全局安装路径（可选，避免权限问题）
npm config set prefix ~/.npm
```

## 4. 配置 npm 镜像源（可选）

在中国大陆，由于网络原因，可能需要配置 npm 镜像源以提高包安装速度。

### 4.1 配置 npm 镜像源

```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com/

# 验证配置
npm config get registry
```

### 4.2 配置 pnpm 镜像源

```bash
# 使用淘宝镜像
pnpm config set registry https://registry.npmmirror.com/

# 验证配置
pnpm config get registry
```

### 4.3 配置 Yarn 镜像源

```bash
# 使用淘宝镜像
yarn config set registry https://registry.npmmirror.com/

# 验证配置
yarn config get registry
```

### 4.4 使用 nrm 管理镜像源（推荐）

nrm 是一个镜像源管理工具，可以帮助你快速切换不同的 npm 镜像源。

```bash
# 全局安装 nrm
npm install -g nrm

# 列出可用的镜像源
nrm ls

# 切换到淘宝镜像
nrm use npmmirror

# 测试镜像源速度
nrm test
```

## 5. 包管理器的选择建议

在 Turborepo 项目中，我们推荐使用以下包管理器：

### 5.1 推荐使用 pnpm

**优点：**
- 性能最好，特别是在大型 Monorepo 项目中
- 磁盘空间占用最小，通过内容寻址存储和硬链接实现
- 对工作区（Workspaces）支持良好
- 与 Turborepo 配合使用效果最佳

**适用场景：**
- 大型 Monorepo 项目
- 对构建性能要求高的项目
- 需要优化磁盘空间使用的场景

### 5.2 推荐使用 Yarn

**优点：**
- 良好的性能和稳定性
- 丰富的功能集
- 广泛的社区支持
- 对工作区（Workspaces）支持良好

**适用场景：**
- 中大型项目
- 团队已经熟悉 Yarn 的项目
- 需要确定性安装的项目

### 5.3 使用 npm

**优点：**
- Node.js 默认包管理器，无需额外安装
- 不断改进的性能和功能
- 广泛的兼容性

**适用场景：**
- 小型项目
- 快速原型开发
- 对包管理器没有特殊要求的场景

## 6. 常见问题及解决方案

### 6.1 权限问题

**问题：** 在全局安装包时遇到权限错误。

**解决方案：**

**macOS/Linux:**
```bash
# 方案一：使用 sudo（不推荐）
sudo npm install -g [package]

# 方案二：更改 npm 全局安装目录（推荐）
mkdir ~/.npm
npm config set prefix ~/.npm
echo 'export PATH="$HOME/.npm/bin:$PATH"' >> ~/.bashrc
# 或对于使用 zsh 的用户
echo 'export PATH="$HOME/.npm/bin:$PATH"' >> ~/.zshrc
source ~/.bashrc  # 或 source ~/.zshrc
```

**Windows:**
以管理员身份运行命令提示符或 PowerShell。

### 6.2 安装速度慢

**问题：** 包安装过程非常缓慢。

**解决方案：**
- 配置镜像源（参见第 4 节）
- 使用更高效的包管理器（如 pnpm）
- 检查网络连接或使用 VPN

### 6.3 版本冲突

**问题：** 不同项目需要不同版本的 Node.js。

**解决方案：**
- 使用 NVM (Node Version Manager) 管理多个 Node.js 版本
- 在项目根目录创建 `.nvmrc` 文件指定所需的 Node.js 版本

### 6.4 环境变量配置

**问题：** 安装完成后，在命令行中无法识别 node 或 npm 命令。

**解决方案：**
确保 Node.js 的安装路径已添加到系统的环境变量中。

**Windows:**
1. 右键点击 "此电脑" -> "属性" -> "高级系统设置" -> "环境变量"
2. 在 "系统变量" 中找到 "Path" 变量，点击 "编辑"
3. 确保 Node.js 的安装路径（通常是 `C:\Program Files\nodejs\`）已添加

**macOS/Linux:**
检查 `~/.bashrc`, `~/.bash_profile` 或 `~/.zshrc` 文件中是否包含 Node.js 的路径配置。

## 7. 下一步

完成 Node.js 和包管理器的安装后，你可以继续学习 Turborepo 的使用：

1. 初始化一个新的 Turborepo 项目
2. 了解项目结构和配置文件
3. 学习基本的 Turborepo 命令

## 8. 参考资料

- [Node.js 官方文档](https://nodejs.org/en/docs/)
- [pnpm 官方文档](https://pnpm.io/)
- [Yarn 官方文档](https://yarnpkg.com/)
- [npm 官方文档](https://docs.npmjs.com/)
- [NVM 官方文档](https://github.com/nvm-sh/nvm)
- [Turborepo 官方文档](https://turbo.build/repo)