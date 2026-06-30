# AI Rules Framework

这是 Cursor、OpenCode、Claude Code 等 Agent 共用的规范库。规则正文只维护一份，适配器只负责声明加载入口，避免多端复制导致规范漂移。

## 目录设计

- `core/`: 所有项目都可复用的底线规则。
- `domains/`: 按任务、技术栈或场景加载的专项规则。
- `adapters/`: 不同 Agent 工具的入口说明，只引用共享规则，不复制规则正文。
- `rule.md`: 原始合集文件，作为迁移来源和历史参考保留。

## 核心加载策略

任何任务始终加载：

- `core/scope.md`

按需加载：

- 涉及 JS / TS / 业务逻辑 / 接口 / 状态 / 组件脚本：`core/coding.md`
- 存在多个方案、删除、重构、替换、兼容、扩大范围：`core/decision.md`
- 代码生成、代码修改、代码审查前自检：`core/review.md`
- Vue3：`domains/vue.md`
- UniApp：`domains/uniapp.md` 和 `domains/vue.md`
- React：`domains/react.md`
- 性能优化：`domains/performance.md`
- 架构设计：`domains/architecture.md`
- Git 操作：`domains/git.md`
- 面试 / 原理解释：`domains/interview.md`
- 任务完成回复：`domains/output.md`

## 可跳过场景

- 纯页面视觉、纯 CSS / 样式调整、文档调整：不强制加载 `core/coding.md`，除非涉及脚本逻辑。
- 普通 Bug 修复：不默认加载 `domains/architecture.md` 或 `domains/performance.md`，除非用户明确要求。

## 优先级

当规则冲突时，按以下优先级执行：

1. `core/scope.md`
2. `core/decision.md`
3. `core/coding.md`
4. 相关 `domains/*.md`
5. `domains/output.md`

## 维护原则

- 新增通用底线规则放入 `core/`。
- 新增技术栈或场景规则放入 `domains/`。
- Cursor / OpenCode 等工具入口只写加载策略，不复制规范正文。
- 不删除 `rule.md`，避免迁移期丢失历史语义。
