# 项目结构说明文档 (Project Structure)

本项目是一个基于 **Uni-app** 框架开发的移动端应用（支持小程序、H5、App）。使用 **Vue 2**、**Vuex**、**uView UI** 等技术栈。

## 1. 根目录 (Root Directory)

| 文件/目录 | 说明 |
| :--- | :--- |
| `.vscode/` | VS Code 项目配置文件（如插件推荐、设置） |
| `dist/` | 编译后的发行代码（由开发工具生成） |
| `node_modules/` | 第三方依赖库 |
| `public/` | 静态公共资源 |
| `src/` | **源代码目录**（核心开发区域） |
| `.gitignore` | Git 忽略规则 |
| `babel.config.js` | Babel 编译器配置 |
| `jsconfig.json` | JavaScript 项目配置文件（用于 IDE 路径跳转） |
| `package.json` | 项目元数据、依赖项及脚本配置 |
| `postcss.config.js` | PostCSS 配置 |
| `project.config.json` | 微信小程序项目配置 |
| `project.private.config.json` | 微信小程序私人配置（不建议提交） |
| `README.md` | 项目自述文件 |
| `vue.config.js` | Vue CLI 配置文件 |

---

## 2. 源代码目录 (src/)

### 核心文件

| 文件 | 说明 |
| :--- | :--- |
| `App.vue` | 应用配置，用来配置应用全局生命周期、公共样式等 |
| `main.js` | Vue 初始化入口文件 |
| `manifest.json` | 应用的配置文件，用于指定应用的名称、图标、权限等 |
| `pages.json` | 配置页面路径、界面窗口样式、底部 TabBar 等 |
| `uni.scss` | 常见的内置变量及自定义全局变量 |
| `mixin.js` | 全局混入逻辑 |
| `.prettierrc` | Prettier 代码格式化配置 |

### 目录结构

#### `components/` - 公共组件
存放全局可复用的 UI 组件。
- `article-list/`: 文章列表组件
- `file-list/`: 文件列表组件
- `my-tag/`: 自定义标签组件
- `pageComponents/`: 页面级大型组件（如 `pageHead`, `postPage`）
- `publishPanel/`: 发布面板组件
- `question-list/`: 问题列表组件
- `questionInfo/`: 问题详情组件
- `video-list/`: 视频列表组件
- `wrongQuestion-list/`: 错题列表组件

#### `mock/` - 模拟数据
存放用于前端开发的 Mock 数据。
- 包含文章、评论、社区帖子、文件、问题、视频、错题等各类数据的模拟 JS 文件。

#### `pages/` - 主包页面
应用的 TAB 页或主要功能页面。
- `community/`: 社区模块（包含消息、标签、帖子等子模块）
- `exercise/`: 练习/题库入口
- `index/`: 首页
- `login/`: 登录页面
- `rigister/` & `newRigister/`: 注册页面
- `person/`: 个人中心（包含设置、我的创作、学习记录等）

#### `static/` - 静态资源
- `icon/`: 字体图标（iconfont）
- `tabbar/`: 底部导航栏图标
- `cummunity/`, `person/`, `register/`: 各模块对应的本地图片资源

#### `store/` - 状态管理 (Vuex)
- `index.js`: Vuex 主入口
- `user.js`: 用户相关的状态管理（如 Token、用户信息）

#### `subPackages/` - 分包页面
为了优化性能和减少主包体积，将功能模块拆分为分包。
- `exercise/`: 练习相关分包（解析、分类详情、题目详情、结果页）
- `index/`: 首页相关分包（文章详情、搜索、评论回复）
- `person/`: 个人中心分包（错题本、博客等）

#### `utils/` - 工具类
- `interceptor.js`: 网络请求拦截器（通常用于处理请求头、登录态、错误响应）
- `utils.js`: 通用的工具函数

---

## 3. 开发规范建议

1. **页面开发**：优先在 `pages/` 目录下创建主流程页面，非核心页面建议放入 `subPackages/`。
2. **组件复用**：具有通用性质的 UI 逻辑应抽象到 `components/` 中。
3. **样式管理**：全局颜色或常用变量应定义在 `uni.scss` 中。
4. **数据请求**：统一使用 `utils/interceptor.js` 封装的请求方法，并配合 `mock/` 数据进行调试。
