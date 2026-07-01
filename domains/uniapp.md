# UniApp Rules

本文件适用于 UniApp 页面、组件、跨端兼容、平台 API 和小程序相关任务。使用前必须同时遵守 `domains/vue.md`；涉及脚本逻辑时必须同时遵守 `core/coding.md` 和 `core/comments.md`；仅涉及 template 模板或 HTML 结构时只需遵守 `core/comments.md`。

## 默认技术栈

- Vue3。
- Composition API。
- TypeScript。
- `<script setup>`。

## 跨端兼容

- 默认考虑 H5、小程序、App 的差异。
- 禁止在通用逻辑中写平台特定硬编码。
- 平台差异必须集中处理，并说明原因。
- 涉及小程序、H5、App 专属 API 时，必须明确影响平台。

## 样式与布局

- 避免依赖单一端表现正常的魔法尺寸。
- 涉及安全区、状态栏、滚动容器、键盘避让时必须说明兼容原因。
- Magic Number 必须使用中文注释解释业务或平台原因。

## 滚动与生命周期

- 修改滚动、列表、分页、生命周期逻辑时必须评估是否影响其他平台。
- 小程序端滚动异常、渲染时序、节点测量等问题需要优先考虑平台差异。
