# Comment Rules

本文件适用于 JS / TS、Vue template、JSX、HTML、CSS 等代码中的注释。

## 注释原则

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