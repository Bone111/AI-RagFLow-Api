# AI小智 - 智能对话助手

<div align="center">

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/Bone111/AI-RagFLow-Api/blob/main/LICENSE)&emsp;[![Vue 3.5](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)&emsp;[![Vite 6](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)&emsp;[![TypeScript 5.8](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)&emsp;[![RAGFlow API](https://img.shields.io/badge/RAGFlow-API-orange)](https://ragflow.io/)&emsp;

</div>

<div align="center">
<img src="./src/assets/images/AI小智.png" width="200" alt="AI小智" />
<h3>🤖 基于RAGFlow API的智能对话助手</h3>
<p>让知识问答变得更智能，让对话体验更流畅</p>
</div>

## 🚀 项目亮点

**AI小智** 是基于 **RAGFlow API** + **Vue3.5** + **Element-Plus** + **hook-fetch** + **TypeScript** 开发的智能对话助手，专注于提供流畅的知识问答体验和文档理解能力。

### ✨ 核心特色
- 🧠 **智能问答**：集成RAGFlow API，支持文档上传和智能检索
- 💬 **流式对话**：实时流式回复，提供类ChatGPT的对话体验  
- 📚 **知识库管理**：支持多种文档格式，构建专属知识库
- 🎨 **现代界面**：精美的UI设计，响应式布局，支持深色模式

## 💡 核心优势
- 🔥 **最新技术栈**：Vue3.5+ / Vite6 / Pinia3 / TypeScript5 / RAGFlow API
- 🚀 **流式交互**：Hook-Fetch支持Server-Sent Events，实现流畅的对话体验
- 📖 **RAG增强**：集成RAGFlow API，提供准确的文档问答能力
- 🛡️ **企业级规范**：ESLint9 / Stylelint / husky / commitlint全链路代码校验
- 🎯 **开箱即用**：内置会话管理、知识库管理、模型配置等完整功能
- 🔧 **易于扩展**：模块化架构，支持自定义插件和主题

## 📖 快速开始

### 环境要求
- Node.js 18+
- pnpm 8+
- RAGFlow API 服务

### 安装启动
```bash
# 克隆项目
git clone https://github.com/Bone111/AI-RagFLow-Api.git
cd AI-RagFLow-Api

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 🔗 相关资源

| 资源类型                | 说明                          | 链接                                                                 |
|---------------------|-------------------------------|----------------------------------------------------------------------|
| 🚀 **项目仓库**         | GitHub 代码仓库 (欢迎 ⭐️ Star) | [AI-RagFLow-Api](https://github.com/Bone111/AI-RagFLow-Api) |
| 🤖 **RAGFlow 官方**    | RAGFlow API 官方文档          | [RAGFlow.io](https://ragflow.io/) |
| 📚 **Element Plus**   | UI 组件库文档                 | [Element Plus](https://element-plus.org/) |
| 🎨 **Vue 3**          | Vue.js 官方文档               | [Vue.js](https://vuejs.org/) |

## 🧰 核心功能

### 🤖 AI对话功能
- **智能问答**：集成RAGFlow API，支持基于文档内容的精准问答
- **流式回复**：实时流式对话体验，支持打字机效果
- **会话管理**：支持多会话切换，会话历史持久化保存
- **上下文理解**：维护对话上下文，提供连贯的对话体验

### 📚 知识库管理
- **文档上传**：支持PDF、Word、TXT等多种文档格式
- **智能解析**：自动提取文档内容，构建向量索引
- **知识库切换**：支持多个知识库管理和快速切换
- **文档预览**：内置文档查看器，支持在线预览

### 🎨 用户界面
- **响应式设计**：适配桌面端和移动端，提供一致的用户体验
- **深色模式**：支持明暗主题切换，保护用户视力
- **组件化架构**：使用Element Plus构建现代化UI界面
- **动画效果**：流畅的页面转场和交互动画

### 🔧 技术特性
- **Vue3.5+ Composition API**：使用最新的Vue特性，代码更简洁高效
- **Vite6.3+ 构建工具**：极速的开发服务器和优化的生产构建
- **TypeScript5.8+**：全面的类型支持，提升代码质量和开发效率
- **Pinia3.0+ 状态管理**：轻量级状态管理，支持持久化
- **Hook-Fetch 网络请求**：支持流式请求，完美适配AI对话场景
- **UnoCSS 原子化CSS**：快速样式开发，减小样式包体积
- **ESLint9+ 代码规范**：严格的代码校验和格式化规则

## 🎯 项目结构

```
AI-RagFLow-Api/
├── src/                    # 源代码目录
│   ├── api/               # API接口管理
│   │   ├── auth/          # 认证相关API
│   │   ├── chat/          # 对话相关API
│   │   ├── knowledge.ts   # 知识库API
│   │   └── model/         # 模型配置API
│   ├── components/        # 公共组件
│   ├── pages/            # 页面组件
│   │   ├── chat/         # 对话页面
│   │   └── knowledge/    # 知识库页面
│   ├── stores/           # Pinia状态管理
│   ├── styles/           # 样式文件
│   └── utils/            # 工具函数
├── .build/               # 构建配置
└── types/                # TypeScript类型定义
```

## 🚀 部署

### 环境变量配置
```bash
# .env.local
VITE_APP_ENV=production
VITE_API_BASE_URL=https://your-ragflow-api.com
VITE_APP_TITLE=AI小智
```

### 构建部署
```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

## 🙏 致谢

- [RAGFlow](https://ragflow.io/) - 提供强大的RAG API支持
- [Vue.js](https://vuejs.org/) - 优秀的前端框架
- [Element Plus](https://element-plus.org/) - 精美的Vue组件库
- [Vite](https://vitejs.dev/) - 快速的构建工具

---

<div align="center">
  <p>如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！</p>
  <p>Made with ❤️ by <a href="https://github.com/Bone111">Bone111</a></p>
</div>
