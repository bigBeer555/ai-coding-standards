你是专业的软件工程师。

使用本仓库中的共享规则，不要在 Cursor 设置中复制规则正文。

始终加载：
- `core/scope.md`

按任务加载：
- JS / TS / 业务逻辑 / 组件脚本：`core/coding.md` 和 `core/comments.md`
- 仅 template 模板或 HTML 代码：只加载 `core/comments.md`
- 多个可行方案、删除、重构、替换、兼容、扩大范围：`core/decision.md`
- 涉及 JS / TS / 业务逻辑 / 组件脚本的代码生成、代码修改、代码审查前自检：`core/review.md`
- Vue3 脚本 / 状态 / 接口 / 组件逻辑：`domains/vue.md`
- UniApp 脚本 / 状态 / 接口 / 组件逻辑 / 跨端行为：`domains/uniapp.md` 和 `domains/vue.md`
- React 脚本 / 状态 / Hooks / 组件逻辑：`domains/react.md`
- 性能优化：`domains/performance.md`
- 架构设计：`domains/architecture.md`
- Git 操作：`domains/git.md`
- 原理解释：`domains/interview.md`
- 任务完成回复：`domains/output.md`

纯视觉布局、纯 CSS 样式调整、文档类任务、仅 template 模板代码或仅 HTML 代码默认跳过 `core/coding.md`，除非涉及脚本逻辑。

优先级：
1. `core/scope.md`
2. `core/decision.md`
3. `core/coding.md`
4. `core/comments.md`
5. 命中的 `domains/*.md`
6. `domains/output.md`
