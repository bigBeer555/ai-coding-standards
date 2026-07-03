项目规则：

当前项目使用仓库根目录中的共享 Agent 规则。

始终遵守：
- `core/scope.md`

按任务加载：
- 编辑 JS / TS / 组件脚本 / 业务逻辑时，加载 `core/coding.md` 和 `core/comments.md`。
- 仅编辑 template 模板或 HTML 代码时，只加载 `core/comments.md`。
- 任务涉及删除、重构、替换、兼容决策、多个可行方案或扩大范围时，加载 `core/decision.md`。
- 涉及 JS / TS / 组件脚本 / 业务逻辑的修改前后，加载 `core/review.md`。
- Vue3 脚本、状态、接口或组件逻辑任务加载 `domains/vue.md`。
- UniApp 脚本、状态、接口、组件逻辑或跨端行为任务加载 `domains/uniapp.md` 和 `domains/vue.md`。
- React 脚本、状态、Hooks 或组件逻辑任务加载 `domains/react.md`。
- 明确的性能优化任务加载 `domains/performance.md`。
- 明确的架构任务加载 `domains/architecture.md`。
- Git 操作加载 `domains/git.md`。
- 原理解释任务加载 `domains/interview.md`。
- 最终回复加载 `domains/output.md`。

不要把规则正文复制到适配器文件中；如需更新规则，请修改共享规则文件。
