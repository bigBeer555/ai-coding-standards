# Vue3 Rules

本文件适用于 Vue3 组件、页面、组合式函数、状态管理和模板逻辑任务。使用前必须同时遵守 `core/scope.md`；涉及脚本逻辑时必须同时遵守 `core/coding.md`。

## 默认技术栈

生成 Vue 代码时默认使用：

- Vue3。
- Composition API。
- TypeScript。
- `<script setup>`。

## Props

优先使用类型声明：

```ts
interface Props {
  userId: string
}

const props = defineProps<Props>()
```

禁止无类型或运行时对象声明作为默认方案：

```ts
defineProps({
  userId: String,
})
```

## Emit

必须声明类型：

```ts
const emit = defineEmits<{
  change: [id: string]
}>()
```

## Computed

- `computed` 仅负责派生状态。
- 禁止 `computed(async () => {})`。
- 禁止在 `computed` 中执行副作用。

## Watch

- `watch` 仅负责监听变化。
- 复杂逻辑必须抽离到具备业务语义的函数。
- 禁止在 `watch` 中堆积大量业务逻辑。

```ts
watch(keyword, handleKeywordChange)
```

## Template

模板必须保持简洁。禁止在模板中写复杂表达式：

```vue
<div v-if="a && b && c && d">
```

应提取为语义明确的派生状态：

```ts
const canShow = computed(() => ...)
```

## 列表渲染

列表渲染必须使用稳定业务 key：

```vue
:key="item.id"
```

禁止默认使用索引：

```vue
:key="index"
```

除非明确不会发生增删改排序。

## Pinia

Store 负责状态管理和状态计算。

Store 禁止承载：

- UI 逻辑。
- 页面逻辑。
- 超长业务流程。

## 接口调用

页面禁止直接调用 `axios.get()` 等底层请求方法，必须统一走 `api`、`service`、`request` 等封装层。
