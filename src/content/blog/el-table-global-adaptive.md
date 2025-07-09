---
author: ZHQ
pubDatetime: 2024-4-10T20:17:34.000+08:00
title: 'Element UI 全局表格自适应'
featured: false
draft: false
tags:
  - 'tech'
description: '不影响现有项目使用的情况下, 快速对el-table做自定义配置'
---


最近在根据客户 UI 的定制化需求做自定义适配时，遇到了一个 el-table 高度自适应的问题。用户希望列表页面的表格能够自动填满可视区域高度，不出现滚动条。按照常规做法，只需在 el-table 上配置 height 属性即可，让表格内部出现滚动条; 效果如下:

![最终效果图](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/KfVU7r.jpg)

但在实际项目中，存在大量的列表页面，甚至有些详情页也复用了列表组件。如果要逐个页面去修改 height，工作量非常大，维护和测试的成本也会急剧上升。我们也尝试过通过 mixin 或指令的方式批量处理，但这些方案要么侵入性强，要么难以覆盖所有场景，最终效果并不理想。

为了解决这个问题，我们希望能有一种“全局生效、低侵入、易维护”的方案。经过多次探索和实践，团队最终采用了“全局封装 + 入口替换”的方式，实现了 el-table 的高度自适应，同时又兼顾了灵活性和可控性。下面就来分享一下我们的思路和实现过程

我们的目标很明确：
*   **一次性改动，全局生效。**
*   **对现有业务代码的侵入性降到最低。**
*   **必须提供一个“逃生阀”，让个别表格能轻松地豁免自适应。**

经过一番探索，我们找到了一个“全局封装 + 入口替换”的方案，效果拔群。下面我就把这个过程分享出来。

### 解题思路：全局替换，局部豁免

整个方案的核心思路可以浓缩为两点：

1.  **“狸猫换太子”**：我们不直接动原生的 `<el-table>`，而是创建一个名为 `AutoTable.vue` 的包装组件。在这个组件内部，我们实现高度自适应的逻辑，然后把所有的属性、事件和插槽都“透传”给它内部包含的真正 `<el-table>`。
2.  **“总开关”与“分开关”**：在项目的入口文件（`main.js`）里，我们用 `Vue.component` 把全局的 `el-table` 标签指向我们刚创建的 `AutoTable.vue`。这样，所有业务页面里的 `<el-table>` 实际上都变成了我们的 `AutoTable`。同时，我们在 `AutoTable` 上设计一个 `prop` 作为“逃生阀”，让开发者可以随时在模板里关闭这个自适应功能。

听起来是不是有点意思？下面看看如何实现。

### 第一步：打造一个公共的`AutoTable` 组件

这是整个方案的核心。我们需要创建一个 `AutoTable.vue` 组件，它要足够“聪明”和“透明”。

*   **聪明**：它得知道什么时候该自适应，怎么计算高度。
*   **透明**：它必须完美伪装成一个原生的 `<el-table>`，不影响任何已有的 `props`、`events` 或 `slots`。

```vue
<template>
  <ElTable
    ref="table"
    v-bind="finalProps"
    v-on="$listeners"
  >
    <!-- 透传所有插槽，包括 default 和 named slots -->
    <template v-for="(_, slotName) in $slots">
      <slot :name="slotName" />
    </template>
  </ElTable>
</template>

<script>
// lodash-es 或其他节流库，可选，但推荐
import throttle from 'lodash-es/throttle';
import { Table as ElTable } from 'element-ui'

export default {
  name: 'AutoTable',
  // 非常关键：避免父组件的 non-prop 属性被应用到根元素上
  inheritAttrs: false,

  props: {
    adapt:   { type: Boolean, default: true },
    // 支持 <el-table no-adapt> 这种更简洁的写法
    noAdapt: { type: Boolean, default: false },
    // 自适应高度时，需要减去的高度（比如页头、页脚、分页器等）
    minus:   { type: Number,  default: 0 },
    data:   Array,
    height: [String, Number],
    maxHeight: [String, Number],
    // ... 其他你常用的 el-table props
  },

  data() {
    return {
      adaptiveHeight: undefined,
    };
  },

  computed: {
    // 判断当前表格是否应该启用自适应
    shouldAdapt() {
      // 只要写了 :height 或者 :max-height，就以手写的为准，禁用自适应
      if (this.height !== undefined || this.maxHeight !== undefined) {
        return false;
      }
      return this.adapt && !this.noAdapt;
    },
    
    // 整合所有 props，决定最终传递给 <el-table> 的是什么
    finalProps() {
      // 基础 props 包含所有透传的属性
      const baseProps = {
        ...this.$attrs,
        ...this.$props,
      };

      if (this.shouldAdapt) {
        // 如果需要自适应，就用我们计算出的高度覆盖 height
        baseProps.height = this.adaptiveHeight;
      }
      
      return baseProps;
    },
  },

  // 使用节流函数，避免窗口缩放时过于频繁地计算
  created() {
    this.throttledCalcHeight = throttle(this.calcHeight, 150);
  },

  mounted() {
    if (this.shouldAdapt) {
      this.calcHeight();
      window.addEventListener('resize', this.throttledCalcHeight);
    }
  },

  beforeDestroy() {
    if (this.shouldAdapt) {
      window.removeEventListener('resize', this.throttledCalcHeight);
    }
  },

  methods: {
    // 计算表格的自适应高度
    calcHeight() {
      if (!this.$el) return;
      // 用视口高度减去预设的 `minus` 值
      this.adaptiveHeight = window.innerHeight - this.minus;
      
      // DOM 更新后，通知 el-table 重新计算布局，修复列对不齐等问题
      this.$nextTick(() => {
        this.$refs.table?.doLayout();
      });
    },

    // 暴露 doLayout 方法，方便外部调用
    doLayout() {
      this.$refs.table?.doLayout();
    }
  },
};
</script>
```

**代码关键点解读：**

1.  **`inheritAttrs: false`**：这是实现透传的关键。它告诉 Vue 不要把未被 `props` 接收的属性（比如 `border`, `stripe` 等）渲染到 `AutoTable` 组件的根 `div` 上，而是让我们可以在 `computed` 里通过 `$attrs` 手动控制，将它们全部传递给内部的 `<el-table>`。
2.  **`finalProps` 计算属性**：这是整个属性控制的中枢。它整合了来自父组件的所有 `props` 和 `attrs`，并根据 `shouldAdapt` 的值来决定最终的 `height` 属性是采用计算值还是用户手写的值。**我们添加了一个重要的优化：用户手写的 `:height` 或 `:max-height` 优先级最高**，这非常符合直觉。
3.  **生命周期与事件监听**：在 `mounted` 时计算初始高度并监听窗口 `resize` 事件，在 `beforeDestroy` 时移除监听，这是标准的资源管理实践。我们还加入了 `throttle` (节流) 来优化性能，避免窗口缩放时的高频计算。
4.  **`doLayout()`**：`el-table` 的一个重要方法。在高度变化后调用它，可以强制表格重新计算布局，避免出现列表头和内容对不齐的 bug。我们也把这个方法暴露出去，方便外部在某些特殊场景（如 Tab 切换）下手动调用。

### 第二步：调整入口 `main.ts`

这一步非常简单，但却是让魔法全局生效的关键。

```javascript
// main.js
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 引入我们刚创建的组件
import AutoTable from '@/components/AutoTable.vue';

Vue.use(ElementUI);

// 这行代码之后，项目中所有的 <el-table> 标签都会被解析为 AutoTable 组件。
Vue.component('el-table', AutoTable);

new Vue({
  // ...
}).$mount('#app');
```

执行完这一步后，刷新项目就会发现，所有没写固定 `height` 的表格，现在都自动撑满了整个屏幕！而我们没有改动任何一行业务代码。

### 第三步：为特殊场景准备好“逃生阀”

现在，全局自适应已经生效了。接下来就要处理那些不需要适配的特殊表格。得益于我们在 `AutoTable` 中精心设计的 `props`，这件事变得异常简单。

```html
<!-- 场景一：常规列表页，希望表格高度是 100vh - 页面头部(60px) - 分页器(40px) -->
<el-table :data="list" :minus="100" border>
  <!-- ... columns ... -->
</el-table>

<!-- 场景二：弹窗中的小表格，我需要它固定高度 300px -->
<!-- 由于我们设置了 height 优先级最高，直接写 height 即可“逃生” -->
<el-table :data="detailList" :height="300" stripe>
  <!-- ... columns ... -->
</el-table>

<!-- 场景三：另一个局部表格，我不确定具体高度，但就不想让它自适应 -->
<!-- 使用我们预设的“裸属性”逃生阀 -->
<el-table :data="logs" no-adapt>
  <!-- ... columns ... -->
</el-table>

<!-- 场景四：动态控制是否自适应，比如全屏时自适应，非全屏时固定 -->
<el-table :data="chartData" :adapt="isFullscreen">
  <!-- ... columns ... -->
</el-table>
```

通过 `minus`、`:height`、`no-adapt` 和 `:adapt` 这几个接口，我们获得了精准控制能力。

### 踩坑指南：几个你可能会遇到的问题

1.  **表格在 `v-show` 或 `el-tabs` 里，初次显示时高度不正确？**
    *   **原因**：`mounted` 时表格是隐藏的，无法获取正确的高度。
    *   **解决**：在控制 `v-show` 的变量变化后，或者在 `el-tabs` 的 `tab-click` 事件里，通过 `this.$refs.myTableRef.doLayout()` 手动触发一次重绘。
2.  **列宽在某些情况下对不齐？**
    *   **原因**：`el-table` 的布局计算没跟上。
    *   **解决**：`doLayout()` 是你的好朋友。我们的 `AutoTable` 在每次 `resize` 后都自动调用了，通常能覆盖大部分场景。
3.  **除了页面整体的 `minus`，还有其他 DOM 元素挤占了高度怎么办？**
    *   **思考**：我们的 `calcHeight` 是基于 `window.innerHeight` 计算的。更精密的做法是获取表格父容器的高度。你可以扩展 `AutoTable`，增加一个 `relative` 模式，当 `relative=true` 时，去计算 `this.$el.parentElement.clientHeight` 而不是 `window.innerHeight`。这留作一个进阶思考题。

### 总结：小改动，大收益

通过“封装 + 替换”这个简单的模式，我们实现了一个可维护性极高的全局表格高度自适应方案。

*   **零侵入**：业务代码几乎不用改动。
*   **高内聚**：所有关于表格高度的复杂逻辑都收敛在 `AutoTable.vue` 这一个文件里。
*   **易扩展**：未来如果还想给所有表格增加“列宽拖拽记忆”、“虚拟滚动”等功能，我们只需要继续迭代 `AutoTable.vue` 这一个组件即可，业务层可以继续“躺平”。

这个方案为我们节省了大量重复的体力劳动，也让整个项目的表格体验更加统一和流畅。希望这个思路能对你有所启发。