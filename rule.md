# 开发代码质量与规范 Skill

# 0. 问题边界保护原则（Scope Protection Rules）

## 最高优先级规则

本规则优先级高于所有代码规范。

当与其他规范冲突时，以本规则为准。

---

## 核心原则

本次修改仅允许影响当前需求相关代码。

禁止为了修复一个问题而修改无关逻辑。

禁止为了代码整洁而修改无关功能。

禁止为了重构而修改无关模块。

---

## 🔍 修改前分析（最高优先级）

开始修改代码前必须先分析：

- 当前问题真正原因是什么？
- 修改哪些文件？
- 为什么修改这些文件？
- 是否还有影响范围？
- 是否存在多个实现方案？

---

## 🚫 禁止行为

- 未分析直接修改代码
- 未确认方案直接开始实现
- 为“顺手优化”扩大修改范围
- 在未确认前删除或重构代码

---

## 📦 决策机制（强制）

如果存在多个合理方案：

必须先统一输出：

- 所有可行方案
- 每个方案优缺点
- 影响范围
- 风险等级

然后进入：

👉 用户确认后再执行

---

## 🎯 执行原则

在未完成分析 + 未获得确认前：

- 禁止修改代码
- 禁止删除代码
- 禁止重构代码
- 禁止扩展修改范围

---

## 删除代码特殊规则

删除任何代码前必须确认：

### 是否与当前问题直接相关

如果无关：

禁止删除。

例如：

```ts
const reportExposure = () => {}
```

当前问题：

```txt
修复商品列表样式异常
```

即使：

* 当前未调用
* 看起来无用
* 存在重复

也禁止删除。

因为其与当前问题无关。

---

## 新增功能保护规则

AI 必须假设：

任何现有代码都可能承载：

* 新增功能
* 灰度功能
* 未来功能
* 埋点统计
* 权限控制
* 特殊业务逻辑

在未确认用途前：

禁止删除。

---

## 最小修改原则

优先：

```txt
修改1处代码解决问题
```

而不是：

```txt
重构整个模块解决问题
```

优先：

```txt
局部修复
```

而不是：

```txt
全局调整
```

---

## 删除与重构确认机制

涉及以下行为：

* 删除代码
* 删除逻辑
* 删除组件
* 删除配置
* 删除接口
* 删除状态
* 删除字段
* 删除兼容逻辑
* 大规模重构

必须先分析：

* 当前用途
* 调用链
* 影响范围
* 是否与当前问题相关

然后输出：

```txt
发现以下代码疑似可删除：

1. xxx

分析结果：

- 与当前需求相关：是 / 否
- 当前引用次数：x
- 是否存在副作用：是 / 否
- 风险等级：低 / 中 / 高

是否确认执行？
```

未经用户明确同意：

禁止执行。

---

## 修改范围失控保护

当发现需要修改范围扩大时：

例如：

```txt
最初修改：
1个文件

后续影响：
8个文件
```

必须停止继续修改并告知用户：

```txt
发现问题影响范围超出初始预估。

预计修改：

- A文件
- B文件
- C文件

原因：

xxxx

是否继续？
```

未经确认禁止继续。

---

## AI Agent 强制规则

修改代码时：

只解决用户当前提出的问题。

只修改解决问题必须修改的代码。

只删除与当前问题直接相关的代码。

任何与当前问题无关的代码：

禁止修改。
禁止重构。
禁止删除。

---

## 最终原则

修复问题 ≠ 重构项目

修复 Bug ≠ 优化代码

解决需求 ≠ 清理代码

与当前需求无关的代码视为受保护代码。

未经用户明确授权：

禁止修改。
禁止删除。
禁止重构。


## 核心原则

代码首先服务于：

1. 可读性
2. 可维护性
3. 可调试性
4. 可扩展性
5. 简洁性

禁止为了追求：

* 高级写法
* 函数式炫技
* 极致简洁
* 代码行数更少

而牺牲代码可理解性。

性能优化必须基于实际需求和数据证明，禁止过度优化。

### 优先复用现有实现

生成或修改代码时，优先复用项目现有实现。

优先使用已有：

- 对象
- 字段
- 方法
- 类型
- 组件
- 工具函数
- 命名

禁止为了封装、解构、重命名、缩短访问路径或追求代码形式统一，而新增无实际价值的代码。

任何新增的变量、函数、类型、组件都必须具有明确价值。

如果直接使用原实现能够达到相同效果，应优先使用原实现。

核心原则：

优先复用，而不是重新实现。

优先沿用，而不是重新命名。

优先保持现有代码风格，而不是强行统一风格。

降低阅读成本，高于追求代码形式上的“优雅”

---

# 1. 三元运算符规范（Ternary Operator）

## 允许

仅允许简单赋值场景：

```ts
const statusText = status === 1 ? '成功' : '失败'
```

## 禁止

嵌套三元：

```ts
const result = a ? (b ? c : d) : e
```

复杂逻辑：

```ts
const result = isLogin
  ? handleLogin()
  : handleGuest()
```

## 要求

出现以下情况必须改为 if-else：

* 多条件判断
* 多步骤执行
* 存在副作用
* 调用函数
* 业务逻辑处理

```ts
if (isLogin) {
  return handleLogin()
}

return handleGuest()
```

---

# 2. 函数颗粒度规范（Function Granularity）

## 禁止无意义包装函数（Meaningless Wrapper Function）

禁止创建仅用于调用另一个函数且没有任何额外业务逻辑的包装函数。

错误：

```ts
getTrialAvailableLimit(item) {
  return this.getTrialLimit(item)
}
```

## 禁止过度拆分

错误：

```ts
function getName(user) {
  return user.name
}
```

```ts
function getAge(user) {
  return user.age
}
```

无复用价值的简单逻辑不要抽函数。

---

## 合理拆分

满足以下条件之一才允许拆分：

### 功能闭环

```ts
function calculateOrderAmount() {}
```

### 逻辑复用

```ts
function formatPrice() {}
```

### 业务语义明确

```ts
function validateUserPermission() {}
```

---

## 原则

函数拆分必须提升：

* 复用性
* 可读性
* 业务语义

而不是单纯减少函数长度。

---

# 3. 变量定义原则（Variable Definition）

## 优先使用原对象（Prefer Original References）

### 核心原则

能够直接使用原对象、原字段、原方法时。

禁止创建仅用于转发或缩短访问路径的中间变量。

---

错误：

```ts
const userName = user.name

console.log(userName)
```

## 禁止无意义中间变量

错误：

```ts
const userName = user.name

console.log(userName)
```

正确：

```ts
console.log(user.name)
```

---

## 允许提取变量

### 多次使用

```ts
const userId = user.id

query(userId)
update(userId)
```

### 表达式过长

```ts
const currentPermission =
  user.roles[0].permissions[0]
```

### 提升业务语义

```ts
const isVipUser =
  user.level >= VIP_LEVEL
```

---

## 原则

属性访问层级 ≤ 2 层：

```ts
user.name
order.id
item.price
```

直接使用，不额外定义变量。

---

# 4. 类型处理准则（Type Handling）

## 禁止暴力转型

错误：

```ts
Number(id)
String(status)
Boolean(value)
```

错误：

```ts
const amount = Number(data.amount)
```

---

## 正确方式

在边界层统一处理：

* transformResponse
* DTO
* Mapper
* Adapter

业务层默认信任类型系统。

---

## 禁止重复纠偏

错误：

```ts
function calculate(amount: number) {
  const value = Number(amount)

  return value * 100
}
```

正确：

```ts
function calculate(amount: number) {
  return amount * 100
}
```

---

# 5. 分支判断结构（Control Flow）

## 二元判断

优先：

```ts
if (isSuccess) {
  return data
}

return error
```

---

## 禁止

```ts
if (type === 1) {
}
else if (type === 2) {
}
```

仅两个分支时不要写 else if。

---

## 多分支判断

超过两个分支：

```ts
switch (status) {
  case 1:
    break

  case 2:
    break

  case 3:
    break

  default:
    break
}
```

或者：

```ts
const actionMap = {
  create,
  update,
  delete,
}

actionMap[type]()
```

---

## 优先 Early Return

错误：

```ts
function submit() {
  if (isLogin) {
    if (hasPermission) {
      save()
    }
  }
}
```

正确：

```ts
function submit() {
  if (!isLogin) {
    return
  }

  if (!hasPermission) {
    return
  }

  save()
}
```

---

# 6. Null 与 Optional 处理规范

## 类型已保证非空

禁止：

```ts
if (!user) {
  return
}
```

```ts
user?.name
```

```ts
user && user.name
```

正确：

```ts
user.name
```

---

## 运行时校验边界

仅允许出现在：

* API响应
* 用户输入
* URL参数
* LocalStorage
* SessionStorage
* WebSocket消息
* 第三方SDK

内部业务逻辑禁止重复校验。

---

# 7. 异常处理规范（Error Handling）

## 禁止吞错

错误：

```ts
try {
  await save()
} catch {}
```

错误：

```ts
try {
  await save()
} catch (e) {}
```

错误：

```ts
try {
  await save()
} catch (e) {
  console.log(e)
}
```

---

## 正确方式

### 上报

```ts
catch (error) {
  reportError(error)
  throw error
}
```

### 重试

```ts
catch (error) {
  return retry()
}
```

### UI降级

```ts
catch (error) {
  showErrorToast()
  throw error
}
```

---

## 原则

无法处理的异常：

```ts
catch (error) {
  throw error
}
```

不要吞掉。

---

# 8. 防御性编程规范

## 禁止过度防御

错误：

```ts
if (
  data &&
  data.user &&
  data.user.profile &&
  data.user.profile.name
) {
}
```

错误：

```ts
const list = data?.list || []
```

错误：

```ts
const count = Number(value || 0)
```

---

## 原则

TypeScript 已声明：

```ts
interface User {
  name: string
}
```

则直接使用：

```ts
user.name
```

不要重复保护。

---

# 9. 代码注释规范（Code Comment Rules）

## 核心原则

注释解释：

* 为什么这样做
* 业务规则是什么
* 特殊兼容原因是什么
* 边界条件是什么

不要解释代码表面行为。
禁止使用英文注释，必须使用中文注释。

---

## 禁止无意义注释

错误：

```ts
// 定义变量
const name = user.name

// 判断是否登录
if (isLogin)
```

---

## 函数注释规范

公共函数必须包含：

```ts
/**
 * 获取用户订单列表
 *
 * @param userId 用户ID
 * @param page 页码
 * @param pageSize 每页数量
 * @returns 订单分页数据
 */
```

---

## 复杂逻辑必须说明

```ts
// 微信小程序 scroll-view 在 iOS 下切换分类会重置滚动位置
// 因此缓存当前位置并在渲染后恢复
```

---

## Magic Number 必须解释

错误：

```ts
if (width > 188)
```

正确：

```ts
// 188mm 为热敏打印纸标准宽度
if (width > 188)
```

---

## AI要求

* 自动补充必要注释
* 禁止废话注释
* 优先解释业务原因
* 优先解释设计意图

---

# 10. Vue3 / UniApp 项目规范

## 默认技术栈

生成代码时默认：

* Vue3
* Composition API
* TypeScript
* script setup

---

## Props

优先：

```ts
interface Props {
  userId: string
}

const props = defineProps<Props>()
```

禁止：

```ts
defineProps({
  userId: String,
})
```

---

## Emit

必须声明类型：

```ts
const emit = defineEmits<{
  change: [id: string]
}>()
```

---

## Computed

仅负责派生状态。

禁止：

```ts
computed(async () => {})
```

禁止副作用。

---

## Watch

仅负责监听变化。

复杂逻辑抽离：

```ts
watch(keyword, handleKeywordChange)
```

禁止在 watch 中堆积大量业务逻辑。

---

## Template

禁止：

```vue
<div v-if="a && b && c && d">
```

提取：

```ts
const canShow = computed(() => ...)
```

保持模板简洁。

---

## 列表渲染

必须：

```vue
:key="item.id"
```

禁止：

```vue
:key="index"
```

除非明确不会发生增删改排序。

---

## Pinia

Store 负责：

* 状态管理
* 状态计算

禁止：

* UI逻辑
* 页面逻辑
* 超长业务流程

---

## 接口调用

页面禁止直接：

```ts
axios.get()
```

统一走：

```ts
api
service
request
```

封装层。

---

# 11. 命名规范（Naming Convention）

## 命名必须体现业务语义

禁止：

```ts
const data = {}
const res = {}
const obj = {}
```

推荐：

```ts
const userInfo = {}
const orderList = {}
const paymentResult = {}
```

---

## Boolean命名

必须使用：

```ts
isLogin
hasPermission
canEdit
shouldRefresh
```

禁止：

```ts
loginFlag
permissionStatus
```

---

## 方法命名

必须体现动作：

```ts
getUserInfo()
createOrder()
updateProfile()
deleteRecord()
```

禁止：

```ts
handleData()
process()
operate()
```

---

# 12. AI代码审查规则（Code Review Rules）

每次生成或修改代码前必须检查：

* 是否存在嵌套三元
* 是否存在超过2层嵌套
* 是否存在无意义中间变量
* 是否存在无意义函数拆分
* 是否存在重复类型转换
* 是否存在滥用 Optional Chaining
* 是否存在滥用 watch
* 是否存在 any
* 是否存在空 catch
* 是否存在吞错
* 是否存在重复代码
* 是否存在模板复杂表达式
* 是否存在不合理命名
* 是否新增了无必要变量
* 是否改变了已有命名
* 是否创建了无意义对象解构
* 是否可以直接使用原字段
* 是否可以直接调用原方法

发现问题优先重构后再输出代码。

---

# 最终决策标准

当规范与个人习惯冲突时：

始终选择：

可读性 > 简洁性

可维护性 > 技巧性

显式逻辑 > 隐式逻辑

业务语义 > 语法炫技

团队协作 > 个人风格

# 13. Agent 输出规范（Agent Output Rules）

## 任务完成提醒

当使用 OpenCode Agent、Claude Code、Cursor Agent 完成代码生成、代码修改、代码分析、代码审查后。

回复结尾必须追加：

```txt
都多余了爱谁谁。
```

---

## 输出要求

执行完成后：

* 先说明修改内容
* 再说明影响范围
* 再说明风险评估
* 最后输出：

```txt
都多余了爱谁谁。
```

---

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

都多余了爱谁谁。
```

# 14. 问题连续处理规范（Issue Continuation Rules）

## 核心原则

用户提出的问题目标优先级高于当前执行动作。

AI 必须始终关注：

```txt
最终要解决什么问题
```

而不是：

```txt
当前执行什么操作
```

---

## 示例

用户：

```txt
商品列表滚动闪烁
```

AI进行了修改。

用户：

```txt
还是有问题，还原回去
```

此时：

还原代码 ≠ 任务结束

真正任务仍然是：

```txt
解决商品列表滚动闪烁问题
```

---

## 禁止行为

禁止：

```txt
用户：
还是报错了，还原回去

AI：
代码已还原。
任务结束。
```

---

## 正确行为

应该：

```txt
已还原上一次修改。

当前问题仍未解决：

xxxx报错

接下来重新分析问题原因：

1. xxx
2. xxx
3. xxx

准备尝试新的修复方案。
```

---

## 回滚不等于结束

当用户要求：

* 还原
* 回退
* 撤销
* 恢复

时：

默认理解为：

```txt
撤销当前方案
```

而不是：

```txt
放弃当前任务
```

---

## 必须持续跟踪原始目标

AI 必须记录：

```txt
原始需求
```

例如：

```txt
修复白屏
修复报错
修复闪烁
修复样式异常
修复接口问题
```

即使中途：

* 回滚代码
* 更换方案
* 放弃某次尝试

原始目标仍然存在。

---

## 问题未解决禁止结束

出现以下情况：

```txt
问题仍然存在
报错仍然存在
功能仍然异常
```

禁止输出：

```txt
已完成
```

```txt
任务结束
```

```txt
修改完成
```

---

## 多方案处理机制

当前方案失败：

以下回滚指特指仅回滚本次失败调整的改动代码。

```txt
方案A
↓
失败
↓
回滚
↓
方案B
↓
失败
↓
回滚
↓
方案C
```

允许不断尝试。

禁止：

```txt
方案A失败
↓
回滚
↓
结束
```

---

## 用户明确终止才允许结束

仅当用户明确表达：

```txt
不用改了
先这样
算了
不处理了
结束
```

才允许终止任务。

否则默认继续解决问题。

---

## AI Agent 强制规则

当用户说：

```txt
还是报错
还是有问题
不行
回退
还原
恢复
```

必须理解为：

```txt
当前修复方案失败
```

而不是：

```txt
当前任务结束
```

回滚后继续分析问题。

重新提出下一版修复方案。

---

## 最终原则

回滚的是方案。

不是需求。

撤销的是修改。

不是目标。

用户的问题没有解决前。

任务不能视为完成。


# 15. 决策点确认规范（Decision Gate Rules）

## 核心原则

当存在多个合理实现方案时。

AI 负责分析。

用户负责决策。

禁止 AI 擅自选择方案并执行。

---

## 必须暂停并询问用户的场景

包括但不限于：

- 是否兼容旧逻辑
- 是否保留历史逻辑
- 是否删除旧代码
- 是否删除兼容代码
- 是否进行重构
- 是否修改接口结构
- 是否修改数据结构
- 是否扩大修改范围
- 是否调整技术方案
- 是否新增缓存
- 是否新增防抖节流
- 是否替换现有实现方案

---

## 必须一次性列出所有决策点

禁止：

问一个问题改一次。

再问一个问题改一次。

必须：

统一收集。

统一分析。

统一询问。

统一执行。

---

## 必须提供推荐方案

禁止：

方案A

方案B

请选择。

---

必须输出：

问题：

xxxx

方案A：

优点：
xxxx

缺点：
xxxx

影响范围：
xxxx

风险等级：
低 / 中 / 高

---

方案B：

优点：
xxxx

缺点：
xxxx

影响范围：
xxxx

风险等级：
低 / 中 / 高

---

推荐方案：

方案A

推荐原因：

xxxx

请确认后继续执行。

---

## 推荐原则

默认优先推荐：

- 风险最低
- 修改范围最小
- 与当前问题最相关
- 不影响现有功能
- 最容易回滚

的方案。

---

## 默认策略

当无法确定用户偏好时：

默认：

- 不删除
- 不重构
- 不改变接口
- 不改变数据结构
- 不扩大修改范围

先询问用户。

---

## AI Agent 强制规则

遇到以下关键词：

- 兼容
- 删除
- 重构
- 替换
- 优化
- 合并
- 废弃
- 改造

必须进入决策确认模式。

未经确认禁止执行。

---

## 最终原则

技术实现由 AI 负责。

业务决策由用户负责。

遇到选择题时：

先分析。

给出推荐。

等待确认。

再执行。