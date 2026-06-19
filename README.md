# Nihongo Studio

Nihongo Studio 是一个纯前端、结构化的日语基础学习应用。它以现代教材式学习流程组织内容，包含课程、假名、单词、语法、例句、原创对话、混合练习、错题复习和学习进度记录。

项目默认不需要后端或账号，也不会调用 AI API。下载后即可在本地运行；如需跨设备同步，可以配置 Firebase Authentication + Cloud Firestore，并在“数据”页面手动同步学习记录。

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
- 数据管理：重置、JSON 导出、容错导入和可选 Firebase 云同步
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

清除浏览器站点数据会同时清除这些本机记录。JSON 导出仍然是最直接的离线备份方式。

## 跨设备同步

Nihongo Studio 默认仍支持纯本地 `localStorage` 模式。未登录时，应用不会读写云端，学习记录只跟随当前设备和浏览器。

配置 Firebase 后，可以在“数据”页面使用邮箱密码登录，然后手动执行：

- 上传本机记录到云端
- 从云端下载记录到本机
- 合并本机与云端记录
- 删除云端学习记录

部署方式保持不变：GitHub Pages 只负责静态网页托管；用户学习数据保存在 Cloud Firestore 的当前用户文档中：

```text
userStates/{uid}
```

云端文档结构：

```ts
{
  schemaVersion: 1,
  userId: string,
  updatedAt: string,
  deviceId: string,
  learningState: LearningState
}
```

`learningState` 复用本项目已有的本地学习数据结构。同步功能只上传学习记录、错题、收藏、单词状态、假名练习统计和设置等用户状态，不会上传 Unit 课程文本、例句、练习题或其他课程内容。

### Firebase 配置

1. 在 Firebase Console 中创建项目。
2. 启用 Authentication，并开启 Email/Password 登录方式。
3. 创建 Cloud Firestore 数据库。
4. 个人使用时，建议先在 Firebase Authentication 中创建自己的账号。
5. 创建账号后保持注册入口关闭，只在新设备上登录同一个账号。
6. 在项目根目录复制 `.env.example` 为 `.env.local`，填入 Firebase Web App 配置：

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_ENABLE_SIGNUP=false
```

`VITE_ENABLE_SIGNUP=false` 是推荐默认值，云同步区域只显示登录入口。如果确实需要临时开放页面注册，可以设置 `VITE_ENABLE_SIGNUP=true`，注册完成后再改回 `false` 并重新部署。

`.env.local` 不应提交到仓库；`.gitignore` 已忽略 `.env`、`.env.*` 和 `*.local`。

部署到 GitHub Pages 时，GitHub Actions 不会自动读取本地 `.env.local`。需要在 GitHub 仓库 Settings -> Secrets and variables -> Actions -> Repository secrets 中添加同名 secrets：

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_APP_ID
VITE_ENABLE_SIGNUP
```

项目的 Pages workflow 会在构建时把这些 secrets 注入给 Vite。修改 secrets 后，需要重新运行部署 workflow，或推送一次新提交触发部署。

`VITE_FIREBASE_API_KEY` 应来自 Firebase Console -> Project settings -> General -> Your apps -> Firebase SDK snippet 中的 `apiKey` 字段。填入 GitHub secrets 时只填值本身，不要包含单引号、双引号、逗号、字段名前缀或多余空格。例如填写 `AIza...`，不要填写 `"AIza..."` 或 `apiKey: "AIza..."`。如果页面提示 `auth/api-key-not-valid`，通常说明这个 secret 值不是有效的 Firebase Web API key，或修改 secret 后还没有重新部署成功。

Firebase Web config 不是 Admin 密钥，但 Firestore Security Rules 必须正确设置。推荐规则见 [docs/firebase-security-rules.md](docs/firebase-security-rules.md)，需要在 Firebase Console 中手动部署。如果没有正确规则，不能认为同步是安全的。

个人自用部署建议把 Firestore Rules 改成 UID 白名单，只允许你的 Firebase Auth UID 访问自己的 `userStates/{uid}`。同一个人换新设备时，只需要登录同一个账号，仍然使用同一个 UID，不需要创建新 UID。

不要把 Firebase Admin SDK、service account JSON、服务端私钥或任何真正的密钥放进前端代码或仓库。

### 合并策略限制

Cloud Sync v1 不做实时自动同步，也不会频繁写入 Firestore。完成练习或修改收藏后，页面会标记“有本地更改未上传”，由用户手动上传。

当前学习数据没有足够细的更新时间字段，因此合并采用保守策略：

- 空数据不会自动覆盖非空数据。
- 收藏单词取并集。
- 错题按题目 ID 合并，优先保留 `lastAttemptAt` 较新的记录。
- 课程完成状态取并集；每课练习统计保留答题总数更高的记录，总数相同时保留正确数更高的记录。
- 单词掌握 / 待复习状态没有逐项更新时间，冲突时保留当前设备状态。
- 设置项没有逐项更新时间，合并时以当前设备为准。

合并完成后只更新本机 `localStorage`，不会自动覆盖云端。确认结果后，需要手动点击“上传本机记录到云端”。

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
- Firebase Web SDK（可选云同步）
- 无大型 UI 框架
- 无自建后端
- 可选 Firebase 邮箱密码登录
- 可选手动云同步
- 无 AI API
- 无运行时外部资源依赖
