# Coding Rules

本文件适用于涉及 JS / TS / Vue / React / UniApp 逻辑代码的任务。纯页面视觉、纯样式、文档类任务无需强制加载本文件，但只要涉及脚本逻辑就必须加载。

## 核心原则

代码首先服务于：

- 可读性。
- 可维护性。
- 可调试性。
- 可扩展性。
- 简洁性。

禁止为了高级写法、函数式炫技、极致简洁、减少代码行数而牺牲可理解性。性能优化必须基于实际需求和数据证明，禁止过度优化。

当规范与个人习惯冲突时，始终选择：

- 可读性 > 简洁性。
- 可维护性 > 技巧性。
- 显式逻辑 > 隐式逻辑。
- 业务语义 > 语法炫技。
- 团队协作 > 个人风格。

## 优先复用现有实现

生成或修改代码时，优先复用项目现有实现，包括对象、字段、方法、类型、组件、工具函数、命名。

禁止为了封装、解构、重命名、缩短访问路径或追求代码形式统一，而新增无实际价值的代码。

任何新增变量、函数、类型、组件都必须具有明确价值。如果直接使用原实现能够达到相同效果，应优先使用原实现。

原则：

- 优先复用，而不是重新实现。
- 优先沿用，而不是重新命名。
- 优先保持现有代码风格，而不是强行统一风格。
- 降低阅读成本高于追求形式上的“优雅”。

## 三元运算符

仅允许简单赋值场景：

```ts
const statusText = status === 1 ? '成功' : '失败'
```

禁止嵌套三元：

```ts
const result = a ? (b ? c : d) : e
```

出现以下情况必须改为 if-else：

- 多条件判断。
- 多步骤执行。
- 存在副作用。
- 调用函数。
- 业务逻辑处理。

## 函数颗粒度

禁止创建仅用于调用另一个函数且没有任何额外业务逻辑的包装函数。

禁止无复用价值的简单逻辑抽函数，例如只返回 `user.name`、`user.age` 的函数。

只有满足以下条件之一才允许拆分函数：

- 功能闭环，例如 `calculateOrderAmount()`。
- 逻辑复用，例如 `formatPrice()`。
- 业务语义明确，例如 `validateUserPermission()`。

函数拆分必须提升复用性、可读性或业务语义，而不是单纯减少函数长度。

## 变量定义

能够直接使用原对象、原字段、原方法时，禁止创建仅用于转发或缩短访问路径的中间变量。

错误：

```ts
const userName = user.name
console.log(userName)
```

正确：

```ts
console.log(user.name)
```

允许提取变量的场景：

- 多次使用。
- 表达式过长。
- 能提升业务语义。

属性访问层级不超过 2 层时优先直接使用，例如 `user.name`、`order.id`、`item.price`。

## 类型处理

禁止在业务逻辑中暴力转型或重复纠偏：

```ts
Number(id)
String(status)
Boolean(value)
const amount = Number(data.amount)
```

类型转换应在边界层统一处理：

- `transformResponse`。
- DTO。
- Mapper。
- Adapter。

业务层默认信任类型系统。函数参数已声明为 `number` 时，禁止再次 `Number(amount)`。

## 分支判断

二元判断优先使用 early return：

```ts
if (isSuccess) {
  return data
}

return error
```

仅两个分支时不要写 `else if`。

超过两个分支时优先使用 `switch` 或语义清晰的映射表。

禁止超过 2 层嵌套，优先使用 early return 降低缩进和阅读成本。

## Null 与 Optional 处理

类型已保证非空时，禁止重复判空、滥用 Optional Chaining 或 `&&` 保护。

禁止：

```ts
if (!user) {
  return
}

user?.name
user && user.name
```

正确：

```ts
user.name
```

运行时校验只允许出现在边界层：

- API 响应。
- 用户输入。
- URL 参数。
- LocalStorage。
- SessionStorage。
- WebSocket 消息。
- 第三方 SDK。

内部业务逻辑禁止重复校验。

## 异常处理

禁止吞错：

```ts
try {
  await save()
} catch {}
```

```ts
try {
  await save()
} catch (error) {
  console.log(error)
}
```

正确方式必须包含上报、重试、UI 降级或继续抛出：

```ts
catch (error) {
  reportError(error)
  throw error
}
```

无法处理的异常必须继续抛出，不要吞掉。

## 防御性编程

禁止过度防御：

```ts
if (data && data.user && data.user.profile && data.user.profile.name) {}
const list = data?.list || []
const count = Number(value || 0)
```

TypeScript 已声明的结构应直接使用，不要重复保护。

## 命名规范

命名必须体现业务语义。

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

Boolean 命名必须使用 `is`、`has`、`can`、`should` 等前缀，例如 `isLogin`、`hasPermission`、`canEdit`、`shouldRefresh`。

方法命名必须体现动作，例如 `getUserInfo()`、`createOrder()`、`updateProfile()`、`deleteRecord()`。禁止 `handleData()`、`process()`、`operate()` 这类无业务语义命名。

## 注释规范

注释解释为什么这样做、业务规则是什么、特殊兼容原因是什么、边界条件是什么。不要解释代码表面行为。

禁止使用英文注释，必须使用中文注释。

禁止无意义注释：

```ts
// 定义变量
const name = user.name

// 判断是否登录
if (isLogin) {}
```

公共函数必须包含函数注释，说明用途、参数和返回值：

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

复杂逻辑必须说明业务原因或兼容原因：

```ts
// 微信小程序 scroll-view 在 iOS 下切换分类会重置滚动位置
// 因此缓存当前位置并在渲染后恢复
```

Magic Number 必须解释：

```ts
// 188mm 为热敏打印纸标准宽度
if (width > 188) {}
```

AI 必须自动补充必要注释，禁止废话注释，优先解释业务原因和设计意图。
