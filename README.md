<h1 align="center">📚 Echo 学习平台（前端）</h1>

<p align="center">
  <strong>基于 Uni-app 的校园学习社区微信小程序</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/框架-Uni--app-green?style=flat-square" alt="Uni-app" />
  <img src="https://img.shields.io/badge/Vue-2.x-brightgreen?style=flat-square&logo=vue.js" alt="Vue 2" />
  <img src="https://img.shields.io/badge/状态管理-Vuex%203-blueviolet?style=flat-square" alt="Vuex" />
  <img src="https://img.shields.io/badge/UI%20组件库-uView%202.x-blue?style=flat-square" alt="uView UI" />
  <img src="https://img.shields.io/badge/CSS%20预处理-SCSS-ff69b4?style=flat-square&logo=sass" alt="SCSS" />
  <img src="https://img.shields.io/badge/平台-微信小程序%20%7C%20H5%20%7C%20App-orange?style=flat-square" alt="Platform" />
</p>

---

## 📖 项目简介

**Echo 学习平台**（原"江农学习星"）是一款面向高校学生的多功能学习社区微信小程序，致力于为学生提供优质的学习资源分享、在线练习、社区交流等一站式服务。前端采用 **Uni-app（Vue 2）** 跨平台方案开发，同时支持微信小程序、H5 网页端和 App 端。

### ✨ 核心亮点

- 🏠 **内容聚合首页** — 文章 / 视频 / 资源三合一，支持推荐算法与分页加载
- 📝 **智能题库系统** — 单选 / 多选题型，自动评分，解析查看与错题本
- 💬 **活跃社区互动** — 帖子发布、评论回复、点赞、收藏、WebSocket 实时私信
- 👤 **完整用户体系** — 微信一键登录、手机验证码登录、Token 身份认证
- 📊 **学习数据追踪** — 在线学习时长统计、浏览记录、个人创作管理

---

## 🛠️ 技术栈

| 分类 | 技术 | 说明 |
| :--- | :--- | :--- |
| 框架 | **Uni-app (Vue 2)** | 跨平台应用开发框架，一套代码多端运行 |
| 状态管理 | **Vuex 3** | 集中式用户状态管理（Token、用户信息等） |
| UI 组件库 | **uView UI 2.x** | 丰富的跨端 UI 组件，开箱即用 |
| CSS 预处理 | **SCSS** | 结构化样式编写，支持变量与嵌套 |
| 图标库 | **Iconfont** | 阿里巴巴图标库，支持多色图标 |
| 构建工具 | **Vue CLI 4 + Webpack** | 项目构建与编译 |
| 代码规范 | **Prettier** | 统一代码格式化 |
| 版本控制 | **Git (Gitee)** | 多人协作，远程仓库托管 |
| Mock 数据 | **Mock.js** | 前端数据模拟，独立开发调试 |
| 网络请求 | **uni.request + 拦截器** | 统一请求/响应拦截，自动 Token 注入 |

---

## 🏗️ 系统架构

```
┌──────────────────────────────────────────────────────────────┐
│                         用户端                                │
│         微信小程序  │   H5 网页端   │   App (Android/iOS)      │
└──────────┬───────────────┬──────────────────┬─────────────────┘
           │               │                  │
           └───────────────┼──────────────────┘
                           │
              ┌────────────▼────────────────┐
              │        Uni-app (Vue 2)      │
              │   ┌──────────────────────┐  │
              │   │      Vuex Store       │  │
              │   │  (用户状态/Token管理)  │  │
              │   └──────────────────────┘  │
              │   ┌──────────────────────┐  │
              │   │    uView UI 组件库    │  │
              │   └──────────────────────┘  │
              │   ┌──────────────────────┐  │
              │   │   请求拦截器 / Mock   │  │
              │   └──────────┬───────────┘  │
              └──────────────┼──────────────┘
                             │
                ┌────────────▼────────────────┐
                │       后端 API 服务          │
                │  (RESTful + WebSocket 私信)  │
                └─────────────────────────────┘
```

---

## 📁 项目结构

```
echolearning/
├── public/                         # 静态公共资源
├── dist/                           # 编译输出目录（自动生成）
├── src/                            # 📦 源代码目录
│   ├── App.vue                     # 应用入口 — 全局生命周期、公共样式、H5 适配
│   ├── main.js                     # Vue 初始化 — 插件注册、全局混入、Store 挂载
│   ├── manifest.json               # 应用配置 — 名称、图标、平台特有配置
│   ├── pages.json                  # 路由配置 — 页面路径、TabBar、窗口样式
│   ├── uni.scss                    # 全局 SCSS 变量 — 颜色、间距等设计令牌
│   ├── mixin.js                    # 全局混入 — 设备信息获取、学习时长统计、rpx 转换
│   ├── .prettierrc                 # Prettier 格式化规则
│   │
│   ├── pages/                      # 📄 主包页面
│   │   ├── index/                  #   首页 — 文章/视频/资源三大模块
│   │   ├── exercise/               #   题库 — 难度分类与题目推荐
│   │   ├── community/              #   社区 — 消息、帖子、私信、标签
│   │   │   ├── cumTag/             #     社区标签 & 聊天页
│   │   │   └── cummunityNews/      #     系统通知/收到的赞/回复/私信
│   │   ├── person/                 #   个人中心 — 信息、收藏夹、创作
│   │   │   ├── personComponents/   #     收藏夹、浏览记录
│   │   │   ├── myCreate/           #     我的帖子
│   │   │   └── settingInfo/        #     设置 & 个人信息修改
│   │   ├── login/                  #   登录页
│   │   ├── rigister/               #   注册页
│   │   └── newRigister/            #   新版注册页
│   │
│   ├── subPackages/                # 📦 分包页面（优化主包体积）
│   │   ├── index/                  #   首页分包 — 文章详情、搜索、写文章、回复
│   │   ├── exercise/               #   题库分包 — 答题、结果、解析、分类详情
│   │   ├── person/                 #   个人分包 — 错题本、我的博客、错题详情
│   │   └── static/                 #   分包静态资源
│   │
│   ├── components/                 # 🧩 公共组件
│   │   ├── article-list/           #   文章列表
│   │   ├── video-list/             #   视频列表
│   │   ├── file-list/              #   文件/资源列表
│   │   ├── question-list/          #   题组列表
│   │   ├── questionInfo/           #   题目详情
│   │   ├── wrongQuestion-list/     #   错题列表
│   │   ├── my-tag/                 #   自定义标签
│   │   ├── publishPanel/           #   发布面板
│   │   └── pageComponents/         #   页面级组件（顶部导航、帖子页）
│   │
│   ├── store/                      # 🗄️ Vuex 状态管理
│   │   ├── index.js                #   Store 主入口
│   │   └── user.js                 #   用户模块 — Token、用户信息
│   │
│   ├── utils/                      # 🔧 工具函数
│   │   ├── interceptor.js          #   请求/响应拦截器 — Token 注入、异常处理
│   │   └── utils.js                #   通用工具函数
│   │
│   ├── mock/                       # 🧪 Mock 模拟数据
│   │   ├── articleList.js          #   文章数据
│   │   ├── commentList.js          #   评论数据
│   │   ├── cummunityPost.js        #   社区帖子
│   │   ├── fileList.js             #   文件资源
│   │   ├── questionList.js         #   题库数据
│   │   ├── analysisList.js         #   解析数据
│   │   ├── videoList.js            #   视频数据
│   │   ├── replyList.js            #   回复数据
│   │   └── wrongQuestionList.js    #   错题数据
│   │
│   └── static/                     # 🎨 静态资源
│       ├── icon/                   #   字体图标 (Iconfont)
│       ├── fonts/                  #   字体文件
│       ├── tabbar/                 #   底部导航栏图标
│       ├── cummunity/              #   社区模块图片
│       ├── person/                 #   个人中心图片
│       ├── register/               #   注册页图片
│       ├── logo.png                #   应用 Logo
│       ├── bg.png                  #   通用背景图
│       └── bg-login.png            #   登录页背景图
│
├── .gitignore                      # Git 忽略规则
├── babel.config.js                 # Babel 编译器配置
├── jsconfig.json                   # JS 项目配置（IDE 路径跳转）
├── package.json                    # 依赖项与脚本配置
├── postcss.config.js               # PostCSS 配置
├── project.config.json             # 微信小程序项目配置
├── project.private.config.json     # 微信小程序私人配置
├── vue.config.js                   # Vue CLI 配置
└── PROJECT_STRUCTURE.md            # 项目结构说明文档
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 12.x
- **npm** >= 6.x
- **微信开发者工具**（用于小程序调试）
- 推荐使用 **VS Code** 或 **HBuilderX** 进行开发

### 安装与运行

```bash
# 1. 克隆项目
git clone https://gitee.com/xiaodye/jxau_study_mp.git
cd jxau_study_mp

# 2. 安装依赖
npm install

# 3. 运行 H5 开发环境
npm run serve
# 或
npm run dev:h5

# 4. 运行微信小程序（编译后使用微信开发者工具打开 dist/dev/mp-weixin 目录）
npm run dev:mp-weixin
```

### 构建生产版本

```bash
# 构建 H5
npm run build:h5

# 构建微信小程序
npm run build:mp-weixin

# 构建 App
npm run build:app-plus
```

---

## 📜 可用脚本

| 命令 | 说明 |
| :--- | :--- |
| `npm run serve` | 启动 H5 开发服务器（localhost:8080） |
| `npm run dev:h5` | 同上，H5 开发模式 |
| `npm run dev:mp-weixin` | 编译微信小程序（监听模式） |
| `npm run dev:app-plus` | 编译 App（监听模式） |
| `npm run build:h5` | 构建 H5 生产版本 |
| `npm run build:mp-weixin` | 构建微信小程序生产版本 |
| `npm run build:app-plus` | 构建 App 生产版本 |
| `npm run info` | 查看 Uni-app 环境信息 |

---

## 📱 功能模块详解

### 🏠 首页模块

首页采用 **双层 Tab + Swiper 全屏选项卡** 布局，包含三大内容板块：

| 板块 | 功能 |
| :--- | :--- |
| **文章** | 浏览/发布文章、点赞、评论/回复、推荐算法排序（最热/最新） |
| **视频** | 视频列表自动播放（默认静音）、分页加载 |
| **资源** | 文件下载（进度条+节流）、本地缓存管理、异常恢复 |

- 🔍 **搜索功能**：历史搜索（本地持久化）、热门文章推荐
- ✍️ **发布文章**：标题、内容、多图上传（最多 3 张）、标签选择（1~3 个）、后台审核机制

### 📝 题库模块

- 按难度分类：`简单` / `中等` / `困难`
- 题目推荐列表，`scroll-view` 自定义下拉刷新
- **答题功能**：进度条、动画切屏、节流防抖、`Map` 数据结构收集答案、支持单选/多选
- **答题报告**：正确率统计、正确/错误题数、答案展示
- **查看解析**：正误彩色标注、逐题跳转、添加/移除错题本

### 💬 社区模块

- **系统通知** — 平台动态推送
- **收到的赞** — 评论/帖子/文章的点赞通知
- **回复** — 评论回复消息
- **社区** — 多社区浏览与加入、帖子交互
- **私信** — 基于 **WebSocket** 的实时聊天功能

### 👤 个人中心

- 个人信息查看与修改
- 📊 学习时长统计（单日/每周）
- 📋 浏览记录查看
- 📁 收藏夹管理（创建/删除）
- ✏️ 我的博客 & 我的帖子
- 📕 错题本（查看/移除已掌握题目）
- ⚙️ 设置（退出登录等）

### 🔐 登录 / 注册

| 功能 | 说明 |
| :--- | :--- |
| 微信一键登录 | 获取微信昵称 & 头像作为默认信息 |
| 手机号验证码登录 | 倒计时防重发，未注册自动注册 |
| 账号密码登录 | 传统用户名密码方式 |
| 注册 | 用户名（4-16 位字母/数字/汉字/下划线）+ 密码（6-12 位）正则校验 |
| Token 认证 | `onLaunch` 检查本地 Token，响应拦截器捕获过期/无效 Token |

---

## ⚙️ 关键技术实现

### 请求拦截器

统一在 `src/utils/interceptor.js` 中封装：
- **请求拦截**：自动拼接 BASE_URL、注入 Token 到请求头
- **响应拦截**：捕获 `511` 状态码（Token 无效/过期），自动跳转登录页
- **上传拦截**：文件上传请求同样注入 Token
- **Promise 化**：兼容 Vue 2 项目使用 Vue 3 的 Promise 化 API

### 状态管理

使用 Vuex 模块化管理：
- **userModule**：管理用户 Token 和个人信息，全局可访问

### 学习时长统计

通过全局 Mixin（`src/mixin.js`）实现：
- 页面可见时启动计时器，每秒累加
- 页面隐藏时持久化到本地 Storage
- 页面恢复时从缓存读取继续累计

### 分包加载

为优化小程序性能和减少主包体积，将非核心页面拆分到 `subPackages/` 目录：
- `subPackages/index/` — 文章详情、搜索、写文章
- `subPackages/exercise/` — 答题、结果、解析
- `subPackages/person/` — 错题本、博客

---

## 🔗 相关仓库

| 仓库 | 说明 | 链接 |
| :--- | :--- | :--- |
| 前端（CLI 版） | 本仓库，基于 Vue CLI 构建 | 当前仓库 |
| 前端（HBuilderX 版） | HBuilderX 原生项目 | [jxau_study_mp](https://gitee.com/xiaodye/jxau_study_mp) |
| 后端服务 | 小程序后端 API | [rc_learntime](https://gitee.com/chenzouquan/rc_learntime) |

---

## 🤝 开发规范

1. **页面开发**：主流程页面放在 `pages/`，非核心页面放入 `subPackages/`
2. **组件复用**：通用 UI 逻辑抽象到 `components/`，easycom 自动注册 uView 组件
3. **样式管理**：全局变量定义在 `uni.scss`，避免在组件中硬编码颜色值
4. **数据请求**：统一使用 `utils/interceptor.js` 封装的拦截器，开发阶段配合 `mock/` 数据调试
5. **代码格式**：提交前使用 Prettier 格式化，规则见 `src/.prettierrc`
6. **Git 提交**：遵循语义化提交规范，如 `feat:`, `fix:`, `docs:`, `refactor:` 等

---

## 📄 License

本项目仅供学习交流使用。

---

<p align="center">
  Made with ❤️ by Echo 学习平台团队
</p>
