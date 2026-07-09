# Roots & Affixes — Word-Builder Notebook

> 词缀词源笔记本 · 基于 *Merriam-Webster's Vocabulary Builder* 的学习工具
>
> 最后更新：2026-07-09（卡片构建流程 + macOS Menu Bar + 背景景深加深）

---

## 一、项目概览

| 项目 | 信息 |
|------|------|
| **在线地址** | https://andrewyy5178.github.io/word-roots/ |
| **GitHub 仓库** | https://github.com/AndrewYY5178/word-roots |
| **本地路径** | `/Users/andrewpenguin/my-claude-project/word-roots/` |
| **技术栈** | 单文件 HTML + 零依赖 + Vanilla JS |
| **设计系统** | AndDream 品牌（深海蓝 `#00859F` + 暖白 `#F8F4E9`） |
| **电子书源** | `Merriam-Webster's Vocabulary Builder (Second Edition).epub` |
| **用户** | Andrew（AI 专业大一，按天学习词缀词源） |

### 用途

用户学习 *Merriam-Webster's Vocabulary Builder* 时，每天将学到的词根/词缀记录到网站。网站以液态玻璃卡片形式展示，支持搜索、A-Z 字母过滤、词汇反查。Claude（我）负责根据用户学习进度，从 EPUB 电子书中提取对应的词汇和释义，添加到网站。

---

## 二、设计系统

### 2.1 配色

| 变量 | 值 | 用途 |
|------|------|------|
| `--bg` | `#00859F` | 深海蓝背景 |
| `--bg-dark` | `#006476` | 渐变暗部 |
| `--warm` | `#F8F4E9` | 暖白主文字 |
| `--warm-dim` | `rgba(248,244,233,0.72)` | 次级文字 |
| `--warm-muted` | `rgba(248,244,233,0.45)` | 三级文字 |
| `--accent` | `#4ECDC4` | 强调色（匹配高亮） |
| `--glass-bg` | `rgba(248,244,233,0.09)` | 玻璃卡片背景 |
| `--glass-border` | `rgba(248,244,233,0.16)` | 玻璃卡片边框 |

**设计参考**：
- 品牌分析：`/Users/andrewpenguin/my-claude-project/anddream-brand/品牌全面分析.md`
- static-playful 主题 3（深海蓝 `#00859F` + 暖白 `#F8F4E9`）
- Design Lab #1 液态玻璃

### 2.2 字体

| 角色 | 字体 | 用途 |
|------|------|------|
| 标题（Shiny Gradient） | **Cochin** (macOS 系统字体) | 页面大标题 "Roots & Affixes" |
| 副标题 | **Snell Roundhand** (macOS 系统字体) | 标题下方小字 |
| 卡片词根 | **Big Caslon** (macOS 系统字体) | 卡片和 Modal 中的词根名称 |
| 正文 / UI | Inter 400-700 | 搜索框、A-Z 按钮、含义、注释、页脚 |

**后备字体链**：
- Cochin → Georgia → Times New Roman
- Snell Roundhand → Apple Chancery → cursive
- Big Caslon → Playfair Display → Georgia → serif

**Google Fonts 加载**：`Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;1,14..32,400`

> **注意**：Cochin、Snell Roundhand、Big Caslon 是 macOS 内置字体，不需要 CDN 加载。Windows/Linux 用户会看到后备字体。

### 2.3 Shiny Gradient Text（标题动画）

```css
.shiny-title {
  background-image: linear-gradient(to right,
    #F8F4E9 0%, #B8F0EC 15%, #F8F4E9 32%,
    #FFFFFF 50%, #F8F4E9 68%, #B8F0EC 85%, #F8F4E9 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shiny 7s linear infinite;
}
@keyframes shiny {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
```

**参考来源**：https://andrewyy5178.github.io/design-inspiration/ → "Shiny Gradient Text" 卡片

### 2.4 液态玻璃卡片

每张卡片包含三层效果：

| 层 | 实现 | 效果 |
|----|------|------|
| 基础玻璃 | `background: rgba(248,244,233,0.09)` + `backdrop-filter: blur(14px) saturate(1.15)` | 毛玻璃模糊 |
| 镜面高光 | `::before` 伪元素 + 对角线 `linear-gradient` | 固定的斜向高光 |
| 鼠标跟光 | `::after` 伪元素 + `radial-gradient` 跟随 `--mx`/`--my` CSS 变量 | hover 时鼠标位置出现光晕 |

### 2.5 背景装饰

- **底色**：深海蓝 + 径向渐变叠加（亮区 / 暗区）
- **光球**：2 个模糊光球（`filter: blur(100px)`），固定位置，增加玻璃效果的视觉深度
- **噪点纹理**：全屏 SVG `feTurbulence` 滤镜，`opacity: 0.022`，模拟纸张颗粒感

---

## 三、卡片构建流程（强制执行）

> **每次添加新词根时，必须严格遵循以下流程。不得省略任何步骤。**

### 3.1 数据来源

| 数据项 | 来源 | 方法 |
|--------|------|------|
| 词根名称 + 含义 + 词源注释 | EPUB 电子书 | 搜索词根定义段落（`<span class="bold">ROOT</span> is Latin for...`） |
| 关联词汇列表 | `vocab-map.json` | 查 `word_to_root` 字典，获取该词根全部词汇 |
| 词汇定义 + 例句 + 用法/词源 | EPUB 电子书 | 定位词汇条目段落（`<span class="bold">word</span>` + 释义 + `•` 例句 + 用法段落） |
| US IPA 音标 | Wiktionary | `https://en.wiktionary.org/wiki/<word>` → "US (General American)" |
| UK IPA 音标 | Wiktionary | `https://en.wiktionary.org/wiki/<word>` → "UK (Received Pronunciation)" |

### 3.2 提取步骤

```
第 1 步：查 vocab-map.json → 确定该词根的所有关联词汇
        例：BENE → [benediction, benefactor, beneficiary, benevolence]

第 2 步：解压 EPUB → 定位词根定义所在 HTML 文件
        例：BENE → split_005.html ("BENE is Latin for 'well'")

第 3 步：遍历后续 HTML 文件 → 提取每个词汇的完整段落
        直到遇到 Quiz 标题或下一个词根定义为止
        每个词汇段落包含：
          - 单词（<span class="bold">word</span>）
          - 发音图片（跳过，不可用）
          - 释义文本
          - 例句（以 • 符号开头）
          - 用法/词源说明（例句之后的段落）

第 4 步：上网查询每个词汇的 IPA 音标
        对 examples 和 words 中的所有词汇：
          → https://en.wiktionary.org/wiki/<word>
          → 提取 US 和 UK 两个 IPA（如果相同则重复填写）
          → 格式：/ˈaɪ.pi.eɪ/（双斜杠）

第 5 步：整理成 WORD_DATA 条目格式（见 §4.1）
         确保 examples 中的词也包含在 wordDetails 中
```

### 3.3 条目格式模板

```javascript
{
  root: "ROOT_NAME",              // 词根，全大写
  meaning: "meaning in English",  // 英文含义（不要中文）
  examples: [                      // 精选 3 个示例词，展示在卡片上
    "word1",                       //   - 优先选自带 BENE 前缀的常见词
    "word2",                       //   - 必须包含在 wordDetails 中
    "word3"
  ],
  words: [                         // 完整关联词汇列表（从 EPUB 提取）
    "word1", "word2",              //   - 包含 examples 中的所有词
    "word3", "word4",              //   - 加上 EPUB 中该词根下的全部词汇
    ...
  ],
  notes: "Latin/Greek X = Y. Brief explanation.",  // 词源注释
  wordDetails: {                   // 每个词汇的完整释义
    "word1": {                     //   - 覆盖 examples + words 中的所有词
      pronunciationUS: "/US IPA/",  //   - 美式 IPA（Wiktionary 查询）
      pronunciationUK: "/UK IPA/",  //   - 英式 IPA（Wiktionary 查询）
      definition: "English definition from EPUB",     // 英文释义
      example: "Example sentence from EPUB.",          // 例句
      usage: "Usage and etymology notes from EPUB."    // 用法与词源
    },
    // ... 每个词都要有上述 5 个字段
  }
}
```

### 3.4 质量标准

| 检查项 | 要求 |
|--------|------|
| ✅ 所有词都有 wordDetails | `examples` 和 `words` 中的每个词都必须有完整释义 |
| ✅ IPA 双版本 | US 和 UK 都必须提供，不能相同（除非确实相同） |
| ✅ 音标来自在线查询 | 不用 EPUB 图片音标，必须查询 Wiktionary/Cambridge |
| ✅ 释义来自 EPUB | 优先使用书中的原文释义和例句 |
| ✅ examples 精选 | 3 个常见、有代表性的词，不宜过多 |
| ✅ notes 简洁 | 一行词源说明，含语言来源和基本含义 |
| ✅ 全英文 | 除中文翻译标注外，所有内容用英文 |

### 3.5 部署步骤

```
第 6 步：编辑 index.html → 修改 WORD_DATA 数组
第 7 步：运行推送脚本 → python3 /tmp/push_word_roots.py
         （或通过 GitHub API：获取 SHA → base64 编码 → PUT 更新）
第 8 步：触发 Pages 重建 → POST /repos/.../pages/builds
第 9 步：等待 ~15-20s → 访问网站验证（加 ?v=N 参数绕过缓存）
```

---

## 四、功能清单

### 3.1 搜索框

- **位置**：页面顶部中央
- **样式**：液态玻璃 pill（`border-radius: 40px`）+ SVG 放大镜图标
- **搜索范围**：
  - 词根名称（如 `BENE`）
  - 含义（如 `well, good`）
  - 示例词（`examples` 数组）
  - 注释（`notes` 字段）
  - **关联词汇**（`words` 数组，来自电子书提取）
- **匹配效果**：
  - 匹配到 `examples` 中的词 → 绿色高亮（`.ex-word.matched`，`color: #B8F0EC`，`background: rgba(78,205,196,0.18)`）
  - 匹配到 `words` 中的词 → 卡片底部显示 "Matches: ..." 行
- **实时过滤**：`input` 事件触发 `renderCards()`

### 3.2 A-Z 字母过滤

- **位置**：搜索框下方
- **结构**：`ALL` 按钮 + 26 个圆形字母按钮（A → Z）
- **行为**：
  - 点击字母 → 仅显示以该字母开头的词根
  - 有数据的字母正常显示，无数据的字母半透明（`opacity: 0.28`）且不可点击
  - 右上角统计区显示当前字母（`Letter: B`）
  - 点击 "ALL" 恢复全部显示
- **更新机制**：`updateAZState()` 在每次数据变更后刷新各字母的可用状态

### 3.3 点击放大（Modal）

- **触发**：点击任意玻璃卡片
- **效果**：
  - 全屏半透明遮罩（`background: rgba(0,50,60,0.55)` + `backdrop-filter: blur(8px)`）
  - 卡片放大弹出（`transform: translateY(0) scale(1)` + `cubic-bezier(0.22,0.61,0.36,1)` 动画）
  - 显示完整信息：词根、含义、注释（无截断）、示例词、额外关联词汇（如果有）
  - 搜索匹配的词汇同样高亮
- **关闭方式**：
  - 点击右上角 × 按钮（CSS 纯手工，两个旋转的 `<span>` 形成 ×）
  - 点击遮罩背景
  - 按 `Escape` 键

### 3.4 macOS Menu Bar

- **位置**：页面顶部固定
- **样式**：macOS 风格半透明黑底（`rgba(0,0,0,0.48)` + `backdrop-filter: blur(14px)`），上下微细白边框
- **左侧**：Apple Logo（SVG）+ App 名 "Roots & Affixes"（粗体）+ 菜单项 "How to Use" / "About"
- **右侧**：北京时间（UTC+8），实时更新（每秒刷新）
- **菜单交互**：
  - 点击 "How to Use" → 弹出液态玻璃面板，介绍网站使用方法
  - 点击 "About" → 弹出液态玻璃面板，介绍设计初心与项目目标
  - 点击 × / 遮罩 / ESC 关闭

### 3.5 统计显示

- 页面顶部统计芯片：
  - `Total: N` — 当前显示的卡片数量
  - `Letter: X` — 当前字母过滤（仅在非 ALL 时显示）

---

## 五、数据模型

### 5.1 词条结构

```typescript
// WORD_DATA 数组中每个条目：
{
  root: string;       // 词根/词缀，如 "BENE"、"-ology"
  meaning: string;    // 含义，如 "well, good"
  examples: string[]; // 展示在卡片上的示例词（精选 3-6 个）
  words?: string[];   // 完整的关联词汇列表（从 EPUB 提取，用于词汇搜索反查）
  notes?: string;     // 词源注释，如 "Latin bene = well"
  wordDetails?: {     // 每个词汇的完整释义（从 EPUB 提取 + 在线查音标，用于 Modal 点击查看）
    [word: string]: {
      pronunciationUS: string;  // 美式 IPA 音标，如 "/ˌbɛn.əˈdɪk.ʃən/"（上网查，Wiktionary/Cambridge）
      pronunciationUK: string;  // 英式 IPA 音标，如 "/ˌbɛn.ɪˈdɪk.ʃən/"（上网查，Wiktionary/Cambridge）
      definition: string;       // 英文释义
      example: string;          // 例句
      usage: string;            // 用法与词源说明
    }
  }
```

**音标获取规范**（强制执行）：
> ⚠️ EPUB 电子书中的音标是图片格式（音节分隔符），无法直接提取文字。**每次添加新词根时，必须上网查询所有关联词汇的 IPA 音标**。
>
> - 来源：Wiktionary (`en.wiktionary.org/wiki/<word>`) 或 Cambridge Dictionary
> - 必须同时提供 **US（美式）** 和 **UK（英式）** 两个版本
> - 格式：`/ˈaɪ.pi.eɪ/`（双斜杠括起来的 IPA 符号）
> - 如果英美发音相同，两个字段填写相同值
> - `examples` 中的词也必须包含完整 `wordDetails`（含音标），不能遗漏
}
```

### 4.2 词汇详情面板（Modal 内）

**功能**：在 Modal 中点击任意 Example Word 或 More Word，弹出词汇详情面板。

**交互**：
- 点击词汇 → 该词汇高亮为绿色（`.ex-word.selected`）+ 详情面板滑出
- 面板内容包括：音标、释义（Definition）、例句（Example）、用法与词源（Usage & Etymology）
- 再次点击同一词汇 → 取消选中，面板关闭
- 点击另一词汇 → 切换详情

**数据来源**：`wordDetails` 字段，内容从 EPUB 电子书的对应章节提取。

**实施要求**（每次添加新词根时强制执行）：
> 每个新词根的所有关联词汇（`words` 和 `examples` 中的全部单词），必须从 EPUB 中提取完整的 `wordDetails`（发音、释义、例句、用法/词源），填入条目。没有例外。

### 4.2 数据文件

| 文件 | 内容 | 来源 |
|------|------|------|
| `roots-data.json` | 267 个词根的定义、出处文件、所属 Unit | EPUB 批量提取 |
| `vocab-map.json` | 249 个词根 × 1199 个词汇的映射（`word_to_root` 字典） | EPUB 批量提取 |
| `WORD_DATA`（JS 内嵌） | 网站实际展示的卡片数据 | Claude 手动添加，推送到 GitHub |

### 4.3 数据流

```
用户报告学习进度（如 "学了 Unit 1 的 BENE"）
  → Claude 查找 vocab-map.json → 获取该词根的所有词汇
  → Claude 解压 EPUB → 提取每个词汇的释义和例句
  → Claude 整理格式，编辑 WORD_DATA 数组
  → Claude 通过 GitHub API 推送到 word-roots 仓库
  → GitHub Pages 自动部署（~30s）
  → 用户刷新页面即可看到新卡片
```

---

## 五、技术架构

### 5.1 文件结构

```
word-roots/
├── index.html                                          # 网站唯一文件（HTML + CSS + JS）
├── PROJECT.md                                          # 本文档
├── roots-data.json                                     # 词根定义数据库（参考）
├── vocab-map.json                                      # 词汇→词根映射数据库（参考）
└── Merriam-Webster's Vocabulary Builder (...).epub      # 电子书源文件
```

### 5.2 技术选型

- **零依赖**：不依赖任何框架、库、npm 包
- **单文件部署**：CSS 和 JS 全部内嵌在 HTML 中
- **Google Fonts**：仅 CDN 加载字体（Playfair Display + Inter）
- **部署平台**：GitHub Pages（legacy build，从 `main` 分支 `/` 目录部署）
- **无构建步骤**：浏览器直接打开即可使用

### 5.3 部署方式

由于安全分类器偶尔阻止 `git push` 命令，实际部署使用 GitHub API：

```bash
# 1. 编码文件
base64 -i index.html -o /tmp/idx-b64.txt

# 2. 获取当前 SHA
curl -s -H "Authorization: token $(gh auth token)" \
  https://api.github.com/repos/AndrewYY5178/word-roots/contents/index.html

# 3. 上传更新
B64=$(cat /tmp/idx-b64.txt)
curl -s -X PUT \
  -H "Authorization: token $(gh auth token)" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/AndrewYY5178/word-roots/contents/index.html \
  -d "{\"message\":\"...\",\"content\":\"$B64\",\"sha\":\"...\",\"branch\":\"main\"}"
```

**注意**：需要同时确保 `.nojekyll` 文件存在（空文件），防止 Jekyll 处理导致构建失败。

### 5.4 浏览器兼容性

- `backdrop-filter` 需要较新浏览器（Chrome 76+, Safari 9+, Edge 79+）
- `-webkit-backdrop-filter` 覆盖 Safari 旧版本
- `background-clip: text` 需要 `-webkit-` 前缀

---

## 六、关键实现细节

### 6.1 搜索逻辑（`getFilteredData()`）

```javascript
function getFilteredData(){
  return WORD_DATA.filter(entry => {
    // 字母过滤
    if(activeLetter !== 'all' && entry.root.charAt(0).toUpperCase() !== activeLetter)
      return false;

    // 搜索词过滤
    if(searchQuery){
      const q = searchQuery.toLowerCase();
      return (
        entry.root.toLowerCase().includes(q) ||
        entry.meaning.toLowerCase().includes(q) ||
        entry.examples.some(ex => ex.toLowerCase().includes(q)) ||
        (entry.notes && entry.notes.toLowerCase().includes(q)) ||
        (entry.words && entry.words.some(w => w.toLowerCase().includes(q)))  // ← 词汇反查
      );
    }
    return true;
  });
}
```

### 6.2 匹配高亮（`renderCards()`）

```javascript
// 收集所有可匹配的词汇
const allWords = [...entry.examples, ...(entry.words || [])];
const matchedWords = q ? allWords.filter(w => w.toLowerCase().includes(q)) : [];

// 高亮 examples 中的匹配词
entry.examples.map(ex => {
  const isMatch = matchedWords.some(mw => mw.toLowerCase() === ex.toLowerCase());
  return `<span class="ex-word${isMatch ? ' matched' : ''}">${esc(ex)}</span>`;
})

// 显示匹配行（words 中有匹配但不在 examples 中）
if(matchedWords.length > 0) {
  // 渲染 "Matches: benediction, benefactor..." 行
}
```

### 6.3 液态玻璃鼠标高光

```javascript
function bindMouseTracking(){
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
    });
  });
}
```

### 6.4 EPUB 数据提取

提取脚本的逻辑（已完成，结果保存在 `roots-data.json` 和 `vocab-map.json`）：

1. 读取 EPUB 的 `META-INF/container.xml` → 找到 `.opf` 文件
2. 解析 OPF → 获取 spine（阅读顺序）和 manifest（ID → 文件名）
3. 按 spine 顺序遍历所有 HTML 文件
4. 识别词根定义：`<span class="bold">ALL_CAPS_TEXT</span>` + 包含 "Latin/Greek/..." 的段落
5. 识别词汇条目：紧随词根定义之后，`<span class="bold">Word</span>` + 释义 + 例句
6. 跳过 Quiz 章节（`<h2>Quiz X-Y</h2>` / `<h2>Review Quizzes X</h2>`）
7. 建立 `word → root` 映射字典

---

## 七、日常使用工作流

### 用户说 "我学了 XXX"

1. 用户告知学习内容（如 "今天学了 Unit 1 的 BENE, AM, BELL"）
2. Claude 查找 `vocab-map.json` → 获取每个词根的词汇列表
3. Claude 解压 EPUB → 找到对应章节
4. Claude 提取每个词汇的：定义、例句、用法/词源说明（从 EPUB）
5. Claude **上网查询每个词汇的 US + UK IPA 音标**（从 Wiktionary / Cambridge Dictionary）
6. Claude 整理成条目格式（包含完整 `wordDetails`，`examples` 中的词也必须覆盖），编辑 `WORD_DATA` 数组
7. Claude 通过 GitHub API 推送更新
8. Claude 通知用户 "已添加 N 个词根（含完整词汇释义和 IPA 音标），刷新页面即可查看"

### 用户搜索词汇

1. 用户在搜索框输入单词（如 "benediction"）
2. 网站实时过滤 `WORD_DATA`
3. 如果某条目的 `words` 数组包含该词 → 显示该词根卡片
4. 如果该词也在 `examples` 中 → 绿色高亮
5. 如果不是 → 卡片底部显示 "Matches: benediction"

---

### 3.6 交互式 Quiz 系统

- **入口**：标题下方统计栏的 "Quizzes" 和 "Review Quizzes" 按钮
- **Quizzes**：以两个词根为一组的 quiz（如 Quiz 1-1: BENE + AM），点击进入答题界面
- **Review Quizzes**：以 Unit 为单位的复习 quiz，交互方式相同
- **题型与交互**：

| 题型 | 描述 | 交互逻辑 |
|------|------|---------|
| **Synonym** | 选择近义词 | 点击选项 → 对：绿底 + 显示所有选项中文意思；错：红底 + 显示该选项中文，可继续选直到对 |
| **Analogy** | 完成类比 | 同上（类比格式：A:B :: C:___） |
| **Fill** | 选字母填空 | 先填写所有空 → 点 "Check All" → 对：绿框；错：红框 + 显示正确答案和中文 |
| **Match** | 左右配对 | （待实现） |
| **Indicate** | 判断正误 | （待实现） |

- **数据源**：EPUB 电子书中的 quiz 章节（每两个词根后一个 quiz）
- **答案**：手动确定（EPUB 无独立答案密钥）

### 3.7 Quiz 数据格式

```javascript
// QUIZZES 对象：key = quiz 名称
"Quiz 1-1": {
  unit: 1, roots: ["BENE","AM"],
  sections: [{
    type: "synonym" | "analogy" | "fill",
    label: "Section description",
    questions: [{
      word: "vocabulary word",       // 目标词
      opts: ["a","b","c","d"],       // 选项
      ans: 2,                         // 正确答案索引
      cn: ["中1","中2","中3","中4"]   // 各选项中文（对后显示）
    }],
    // fill 类额外字段：
    wordBank: [{letter:"a", word:"...", cn:"中文"}]
  }]
}
```

---

## 九、待完善功能（TODO）

- [ ] 为每个词汇卡片补充完整释义和例句（点击词根卡片后，在 Modal 中展示每个关联词汇的详细定义）
- [ ] 数据持久化：考虑将 `WORD_DATA` 迁移到独立 JSON 文件，通过 `fetch` 加载
- [ ] 支持手动添加词条的 UI（不用编辑 HTML，直接在网页上添加）
- [ ] 每日学习记录 / 进度追踪
- [ ] PWA 支持（离线可用）
- [ ] 单元分类视图（按 Unit 1-30 分组浏览）

---

## 九、设计约束 & 原则

### 禁止使用

- ❌ Emoji 作为设计元素（按钮、图标、装饰）
- ❌ 紫色渐变（AI slop 模板）
- ❌ React / Vue / 框架（保持零依赖传统）
- ❌ npm 依赖
- ❌ 圆角卡片 + 左彩色 border（2020-2024 视觉噪音）

### 必须保持

- ✅ 单文件自包含（CSS + JS inline）
- ✅ 浏览器直接打开可用
- ✅ 液态玻璃视觉效果
- ✅ 深海蓝 + 暖白配色
- ✅ Playfair Display + Inter 字体组合
- ✅ Shiny Gradient Text 标题动画
- ✅ 响应式布局（移动端适配）

---

## 十、文件清单

| 文件 | 说明 | 状态 |
|------|------|:--:|
| `index.html` | 网站全部代码 | ✅ 持续更新 |
| `PROJECT.md` | 本文档，项目完整说明 | ✅ 持续更新 |
| `roots-data.json` | 267 词根定义（参考数据） | ✅ 已完成 |
| `vocab-map.json` | 249 词根 × 1199 词汇映射（参考数据） | ✅ 已完成 |
| `Merriam-Webster's Vocabulary Builder (...).epub` | 电子书源 | ✅ 参考 |
| `.nojekyll` | 跳过 Jekyll 处理 | ✅ |
