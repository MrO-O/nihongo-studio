# Nihongo Studio

Nihongo Studio 是一个纯前端、结构化的日语基础学习应用。它以现代教材式学习流程组织内容，包含课程、假名、单词、语法、例句、原创对话、混合练习、错题复习和学习进度记录。

项目不需要后端、账号或云同步，也不会调用 AI API。下载后即可在本地运行。

## 功能概览

- 学习 Dashboard：总进度、已完成课程、错题、收藏、继续学习和复习入口
- 课程系统：统一 `Lesson` 类型驱动的课程列表与详情页
- 假名模块：平假名表、片假名表、点击显示罗马音、双向选择练习
- 单词模块：读音与释义显隐、收藏、已掌握和待复习标记
- 语法模块：结构、简明解释、使用提示和原创例句
- 对话模块：翻译显隐、逐句展开和关键词解释
- 日语注音：支持 furigana / 假名注音，使用 `ruby / rt` 显示在汉字上方
- 练习引擎：选择、填空、排序、匹配和判断五种题型
- 复习中心：错题筛选、错题重练、随机 10 题、待复习单词
- 数据管理：重置、JSON 导出和容错导入
- 响应式界面：适配桌面、平板与移动端

## 安装与运行

需要 Node.js 20.19 或更高版本（或 Node.js 22.12+）。

Windows 用户可以直接双击项目根目录中的 `Start Nihongo Studio.cmd`：

- 首次运行时，如果没有 `node_modules`，脚本会自动执行 `npm install`。
- 启动后会打开 `http://localhost:5173`。
- 学习时请保持脚本窗口打开；关闭窗口或按 `Ctrl+C` 会停止本地服务。

也可以使用命令行运行：

```bash
npm install
npm run dev
```

终端会显示本地访问地址，通常是 `http://localhost:5173`。

生产构建：

```bash
npm run build
```

预览生产构建：

```bash
npm run preview
```

## 部署到 GitHub Pages

本项目可以通过 GitHub Actions 部署到 GitHub Pages。当前 Vite `base` 已按仓库名 `nihongo-studio` 设置为 `/nihongo-studio/`，对应的访问地址格式为：

```text
https://<USERNAME>.github.io/nihongo-studio/
```

部署步骤：

1. 在 GitHub 创建名为 `nihongo-studio` 的仓库。
2. 确认仓库名和 `vite.config.ts` 中的 `base` 一致。当前配置为 `/nihongo-studio/`。
3. 将项目 push 到 `main` 分支。
4. 进入 GitHub 仓库的 Settings → Pages。
5. 在 Build and deployment 的 Source 中选择 GitHub Actions。
6. 打开 Actions 页面，查看 `Deploy to GitHub Pages` workflow 的运行状态。
7. 部署成功后，访问 `https://<USERNAME>.github.io/nihongo-studio/`。

如果仓库名发生变化，需要同步修改 `vite.config.ts` 中的 `base`。例如仓库名改为 `my-japanese-app` 时，`base` 应改为 `/my-japanese-app/`。

## 内容说明

v1.2 内置 11 个原创基础单元：

1. Unit 0：假名与日语发音基础
2. Unit 1：A は B です
3. Unit 2：これ / それ / あれ
4. Unit 3：ここ / そこ / あそこ
5. Unit 4：时间表达
6. Unit 5：动词ます形与日常动作
7. Unit 6：助词 を / で / に 的基础用法
8. Unit 7：形容词入门
9. Unit 8：好き・嫌い・上手・下手
10. Unit 9：あります / います
11. Unit 10：てください / ましょう

课程中的单词编排、语法说明、例句、对话与练习均为本项目原创示例内容，没有复制《新标准日本语》或其他教材的课文、练习、单词表、录音、插图或版式。

## 学习数据

学习数据保存在当前浏览器的 `localStorage` 中，存储键为：

```text
nihongo-studio-learning-data
```

保存内容包括：

- 已完成课程
- 每课练习正确率
- 错题记录
- 单词掌握与待复习状态
- 收藏单词
- 假名练习正确率
- 最近学习课程
- 假名注音显示偏好

清除浏览器站点数据会同时清除这些记录。项目没有云端备份。

## 假名注音 / Furigana

项目支持教材式假名注音。带读音的日文会通过 HTML `ruby` / `rt` 显示在汉字上方；学习者可以在“数据”页面切换“显示假名注音 / 隐藏假名注音”，偏好会保存在当前浏览器的 `localStorage` 中。

内容数据支持普通字符串，也支持分段注音结构：

```ts
type JapaneseTextSegment = {
  text: string;
  reading?: string;
  meaning?: string;
};
```

示例：

```ts
[
  { text: "図書館", reading: "としょかん", meaning: "图书馆" },
  { text: "はここです。" }
]
```

带 `reading` 或 `meaning` 的片段可以悬停或聚焦查看简短词语信息。当前 Unit 0 到 Unit 10 均支持 furigana；旧课程读音来自 `src/content/furigana.ts` 中手工维护的课程读音表，新课程优先直接使用 `JapaneseTextSegment[]` 写入读音。不接入在线词典，也不自动推断未知读音。

## 导入与导出

进入“数据”页面：

- 点击“导出 JSON”下载当前学习数据备份。
- 点击“选择 JSON 文件”导入此前导出的备份。
- 导入前会对数据结构做容错检查。无效 JSON 或不兼容数据不会覆盖当前记录，也不会导致应用崩溃。

## 项目结构

```text
src/
├─ components/       通用界面与学习组件
├─ content/          结构化课程与假名数据
├─ hooks/            路由等复用逻辑
├─ pages/            页面级组件
├─ store/            localStorage 状态与 React Context
├─ utils/            注音文本等通用工具
├─ App.tsx           页面路由入口
├─ types.ts          课程、题型与学习数据类型
└─ styles.css        全局视觉与响应式样式
```

## 新增课程

1. 在 `src/content/` 新建课程文件。
2. 按 `src/types.ts` 中的 `Lesson` 类型填写课程数据。
3. 为单词、语法点和练习提供全局唯一 `id`。
4. 如果日文中有汉字，优先用 `JapaneseTextSegment[]` 直接维护读音，或在 `src/content/furigana.ts` 中补充明确的手工读音词条。
5. 在 `src/content/index.ts` 中导入课程并加入 `lessons` 数组。

后续新增课程请先阅读 [docs/content-guide.md](docs/content-guide.md)。

课程列表、详情页、正确率和复习功能会自动读取新数据，通常不需要修改核心组件。

一个课程包含以下字段：

```ts
interface Lesson {
  id: string;
  unit: number;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  accent: string;
  goals: string[];
  vocabulary: VocabularyItem[];
  grammar: GrammarPoint[];
  examples: LessonExample[];
  reading: ReadingContent;
  exercises: Exercise[];
}
```

## 新增练习题型

1. 在 `src/types.ts` 中定义新题型接口，并加入 `Exercise` 联合类型。
2. 在 `src/components/ExerciseRenderer.tsx` 中增加对应渲染与判定分支。
3. 保持题型数据只描述题目，不在课程组件中写题目专用逻辑。
4. 如有新的答案数据结构，确认它可以被 JSON 序列化，以便写入错题记录。

`ExerciseSession` 负责题目进度、计分、错题记录和课程完成状态；新增题型通常不需要改动会话层。

## 技术说明

- Vite
- React
- TypeScript
- 普通 CSS
- Hash 路由，无额外路由依赖
- 无大型 UI 框架
- 无后端
- 无登录
- 无云同步
- 无 AI API
- 无运行时外部资源依赖
