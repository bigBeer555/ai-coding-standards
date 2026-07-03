# AI Rules Framework

这是 Cursor、OpenCode、Claude Code、Gemini CLI、GitHub Copilot、Windsurf 等 Agent 共用的编码规范库。

核心原则：

- 规则正文只维护一份：`core/` 和 `domains/`。
- 不同 Agent 只写入口适配器：`adapters/`。
- npm 包只负责分发规则，不在安装时自动修改用户环境。
- 用户通过 `ai-rules` 显式安装项目级或全局级规则。

## 安装

从 npm 安装：

```bash
npm install -g ai-front-standards
```

从 GitHub 安装：

```bash
npm install -g github:bigBeer555/ai-coding-standards
```

验证安装：

```bash
ai-rules --version
ai-rules list
```

## 指定安装某个 Agent

默认会安装当前范围支持的全部 Agent 入口。只想安装某一个或几个时，可以在命令后追加 Agent 名称：

```bash
ai-rules install project cursor --target .
ai-rules install project claude gemini --target .
ai-rules install global cursor
ai-rules install all cursor claude --target .
```

也可以用参数形式：

```bash
ai-rules install project --agent cursor,claude --target .
ai-rules install project --model gemini --target .
ai-rules install global --agent opencode
```

当前支持的 Agent 名称：

```txt
cursor
opencode
claude
gemini
copilot
windsurf
```

说明：

- `cursor` 项目级会同时写入 `.cursor/rules/ai-coding-standards.mdc` 和 `.cursorrules`。
- `copilot` 目前只支持项目级入口 `.github/copilot-instructions.md`，不提供全局级入口。
- 不指定 Agent 时，仍按原逻辑安装当前范围支持的全部入口。
- 规则正文始终会完整复制到 `.ai-coding-standards/`，入口文件只决定哪些 Agent 会自动读取规范。

## 项目级使用

在目标项目根目录执行：

```bash
ai-rules install project --target .
```

也可以直接通过 npx 使用：

```bash
npx ai-front-standards install project --target .
```

执行后会写入：

```txt
目标项目/
├─ .ai-coding-standards/
│  ├─ core/
│  └─ domains/
├─ .cursor/rules/ai-coding-standards.mdc
├─ .cursorrules
├─ AGENTS.md
├─ CLAUDE.md
├─ GEMINI.md
├─ .github/copilot-instructions.md
└─ .windsurfrules
```

适合团队项目。规则随项目走，支持的 Agent 在该项目内编码时会读取对应入口。

## 全局级使用

```bash
ai-rules install global
```

执行后会写入：

```txt
用户目录/
├─ .ai-coding-standards/
│  ├─ core/
│  └─ domains/
├─ .cursor/rules/ai-coding-standards.md
├─ .config/opencode/AGENTS.md
├─ .claude/CLAUDE.md
├─ GEMINI.md
└─ .windsurfrules
```

适合个人机器长期使用。不同 Agent 的全局规则读取能力不完全一致；项目级安装仍是团队协作的推荐方式。

## 一次安装项目级和全局级

```bash
ai-rules install all --target .
```

## 同步规则正文

升级 npm 包后，同步已安装的规则正文：

```bash
ai-rules sync project --target .
ai-rules sync global
ai-rules sync all --target .
```

`sync` 只更新 `.ai-coding-standards/` 下的规则正文，不覆盖已有 Agent 入口文件。

## 覆盖入口文件

默认不覆盖已存在的 Agent 入口文件。确实需要覆盖时追加：

```bash
ai-rules install project --target . --force
ai-rules install global --force
```

## 检查安装状态

```bash
ai-rules doctor --target .
```

会检查当前项目和当前用户目录中的规则正文、项目级入口、全局级入口是否存在。

## CLI 命令

```bash
ai-rules install project [agent...] [--target .] [--force]
ai-rules install global [agent...] [--force]
ai-rules install all [agent...] [--target .] [--force]
ai-rules install project --agent cursor,claude --target .
ai-rules install project --model gemini --target .
ai-rules sync project [--target .]
ai-rules sync global
ai-rules sync all [--target .]
ai-rules doctor [--target .]
ai-rules list
ai-rules show core/scope.md
ai-rules --version
```

兼容旧命令：

```bash
ai-rules cursor
ai-rules global
ai-rules all
ai-rules install cursor-project --target .
ai-rules install cursor-user
ai-rules install opencode --target .
```

## 支持范围

| Agent / 工具 | 项目级入口 | 全局入口 |
| --- | --- | --- |
| Cursor | `.cursor/rules/ai-coding-standards.mdc`、`.cursorrules` | `.cursor/rules/ai-coding-standards.md` |
| OpenCode / 通用 Agent | `AGENTS.md` | `.config/opencode/AGENTS.md` |
| Claude Code | `CLAUDE.md` | `.claude/CLAUDE.md` |
| Gemini CLI | `GEMINI.md` | `GEMINI.md` |
| GitHub Copilot Coding Agent | `.github/copilot-instructions.md` | 暂不提供稳定全局入口 |
| Windsurf | `.windsurfrules` | `.windsurfrules` |

说明：npm 包无法强制“任何 Agent”天然遵守规范。只有支持读取这些入口文件的 Agent 才能自动遵守；不支持规则入口机制的工具，需要手动把入口内容加入系统提示或工具配置。

## 项目结构

```txt
ai-coding-standards/
├─ package.json
├─ bin/
│  └─ ai-rules.js
├─ core/
│  ├─ scope.md
│  ├─ coding.md
│  ├─ comments.md
│  ├─ decision.md
│  └─ review.md
├─ domains/
│  ├─ vue.md
│  ├─ uniapp.md
│  ├─ react.md
│  ├─ performance.md
│  ├─ architecture.md
│  ├─ git.md
│  ├─ interview.md
│  └─ output.md
└─ adapters/
   ├─ cursor/
   │  ├─ project-rules.md
   │  └─ user-rules.md
   ├─ opencode/
   │  └─ AGENTS.md
   ├─ claude/
   │  └─ CLAUDE.md
   ├─ gemini/
   │  └─ GEMINI.md
   ├─ copilot/
   │  └─ copilot-instructions.md
   └─ windsurf/
      └─ windsurfrules
```

## 规则加载策略

任何任务始终加载：

- `core/scope.md`

按需加载：

- JS / TS / 业务逻辑 / 接口 / 状态 / 组件脚本：`core/coding.md` 和 `core/comments.md`
- 仅 template 模板或 HTML 代码：`core/comments.md`
- 多方案、删除、重构、替换、兼容、扩大范围：`core/decision.md`
- 涉及脚本逻辑的代码生成、修改、审查：`core/review.md`
- Vue3 脚本、状态、接口、组件逻辑：`domains/vue.md`
- UniApp 脚本、状态、接口、组件逻辑或跨端行为：`domains/uniapp.md` 和 `domains/vue.md`
- React 脚本、状态、Hooks、组件逻辑：`domains/react.md`
- 性能优化：`domains/performance.md`
- 架构设计：`domains/architecture.md`
- Git 操作：`domains/git.md`
- 面试 / 原理解释：`domains/interview.md`
- 任务完成回复：`domains/output.md`

## 优先级

当规则冲突时，按以下优先级执行：

1. `core/scope.md`
2. `core/decision.md`
3. `core/coding.md`
4. `core/comments.md`
5. 相关 `domains/*.md`
6. `domains/output.md`

## 维护原则

- 通用底线规则放入 `core/`。
- 技术栈或任务场景规则放入 `domains/`。
- Agent 入口只声明加载策略，不复制规则正文。
- 修改加载策略时，同步检查 `README.md` 和所有 `adapters/` 入口。