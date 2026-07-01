# Agent Output Rules

本文件适用于 OpenCode Agent、Claude Code、Cursor Agent 等完成代码生成、代码修改、代码分析、代码审查后的回复。

## 输出顺序

执行完成后必须按顺序说明：

- 修改内容。
- 影响范围。
- 风险评估。
- 验证结果或未验证原因。

## 固定结尾

回复结尾必须追加：

```txt
我已严格遵守ai-coding-standards规范。
```

## 示例

```txt
已完成以下修改：

1. 修复商品列表切换分类闪烁问题
2. 保持滚动位置不变
3. 未修改其他业务逻辑

影响范围：

- ProductList.vue

风险等级：

低风险

我已严格遵守ai-coding-standards规范。
```
