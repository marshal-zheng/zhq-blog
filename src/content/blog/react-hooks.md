---
author: ZHQ
pubDatetime: 2025-01-10T10:38:00+08:00
title: 'React Hooks：不只是语法糖'
featured: false
draft: false
tags:
  - 'React'
description: ' React Hooks：不只是语法糖，聊聊它如何彻底改变了 React 开发'
---

## React Hooks：不只是语法糖，聊聊它如何彻底改变了 React 开发

hello every coder！

在 React 的世界里摸爬滚打了这么些年，不知道大家是否还记得 Hooks 出现之前的那个时代？如果你是老司机，可能对当年类组件 (Class Components) 的“辉煌”与“痛点”记忆犹新。我们和 `this` 斗智斗勇，在生命周期方法的迷宫里穿梭，为了复用一点点状态逻辑，不得不借助高阶组件 (HOCs) 或 Render Props 这些模式，层层包裹，写出一堆有时自己都看不太懂的代码。能跑是能跑，但说实话，那过程，有时真挺折腾的，感觉像是在跟框架本身较劲儿，而不是专注于实现功能。

然后，在 React 16.8 版本，Hooks 横空出世，感觉整个 React 生态都为之一振！曾经主要负责简单展示任务的函数组件 (Function Components)，一下子被“超能力”附体，能够优雅地处理状态、副作用、上下文，其简洁和直观前所未有。Hooks 不仅仅是一套新的 API，它代表了 React 对组件构建和逻辑组合方式的一次根本性反思和革新。

但是，**为什么 React 非得搞出 Hooks 这玩意儿呢？** 它到底想解决我们曾经面临的哪些核心痛点？作为开发者，我们又该如何超越仅仅知道 `useState`、`useEffect` 怎么用的层面，去真正掌握 Hooks 背后的**设计哲学**和**强大威力**呢？

这，就是我今天想和大家深入探讨的话题。这不会是一篇仅仅罗列 API 的 Hooks 入门教程。我希望和大家一起，回顾那段“痛并快乐着”的过往，探寻 Hooks 诞生的**核心动机**，理解那些不可或缺的**核心原则与规则**（以及它们为何如此重要！），学习如何高效地运用**核心 Hooks**，领略**自定义 Hooks** 的魔力，并最终思考 Hooks 是如何重塑我们编写和思考 React 代码的方式的。

### Hooks 之前的景象：类组件、HOCs 与 Render Props 的“爱恨情仇”

在开始之前我们看看HOCs和Render Props的样例代码:

#### HOC（高阶组件）示例

```jsx
function withCurrentTime(WrappedComponent) {
  return class extends React.Component {
    state = { now: new Date() };
    componentDidMount() {
      this.timer = setInterval(() => {
        this.setState({ now: new Date() });
      }, 1000);
    }
    componentWillUnmount() {
      clearInterval(this.timer);
    }
    render() {
      return <WrappedComponent {...this.props} now={this.state.now} />;
    }
  };
}

function ShowTime({ now }) {
  return <div>当前时间：{now.toLocaleTimeString()}</div>;
}
const ShowTimeWithCurrentTime = withCurrentTime(ShowTime);
```

#### Render Props 示例

```jsx
class MouseTracker extends React.Component {
  state = { x: 0, y: 0 };
  handleMouseMove = e => {
    this.setState({ x: e.clientX, y: e.clientY });
  };
  render() {
    return (
      <div style={{ height: 200 }} onMouseMove={this.handleMouseMove}>
        {this.props.children(this.state)}
      </div>
    );
  }
}

// 使用 Render Props
function ShowMousePosition() {
  return (
    <MouseTracker>
      {({ x, y }) => <p>鼠标位置：({x}, {y})</p>}
    </MouseTracker>
  );
}
```

想要真正体会 Hooks 的价值，咱们得先穿越回那个没有 Hooks 的时代，看看当时的开发者们都在经历些什么。那时，我们管理状态和生命周期的主要武器是**类组件**。它功能强大，但也确实带来了一系列挑战：

*   **`this` 关键字的困扰：** 试问多少个不眠之夜，我们为了弄明白事件回调函数里 `this` 的指向而抓耳挠腮？无论是构造函数里的 `bind(this)`，还是类属性箭头函数，亦或是各种奇技淫巧，`this` 在 JavaScript 类中的复杂性，常常让新手（甚至老手）感到头疼。再加上 `super(props)` 这种 ES6 类的标准样板代码，类组件写起来总感觉有点笨重。
*   **有状态逻辑复用的困境：** 这是个大难题。想在不同组件间共享一段包含状态或生命周期逻辑的代码？React 最初并没有提供什么灵丹妙药。多个组件都需要从同一个 API 获取数据？都需要监听同一个浏览器事件？我们只能求助于一些设计模式（比如高阶组件（HOC）、Render Props、继承等）。
*   **HOCs 与 Render Props 的尝试与挣扎：** 为了解决逻辑复用问题，社区大神们创造了**高阶组件 (HOCs)** 和 **Render Props** 这两大流派。<span class="text-red-500">HOC 是个函数，吃进一个组件，吐出一个增强版的新组件；</span>Render Props 则是让组件接收一个返回 React 元素的函数作为 prop。它们很聪明，但也带来了新的烦恼：
    *   **包装器地狱 (Wrapper Hell - HOCs)：** 你有没有在 React DevTools 里看到过你的业务组件被一层又一层的 HOC 包裹得像个俄罗斯套娃？这就是“包装器地狱”。调试起来想追踪某个 prop 的来源？祝你好运！
    *   **Prop 冲突 (Prop Collisions - HOCs)：** 如果两个 HOC 都想给你的组件注入一个同名的 prop，会发生什么？覆盖？报错？行为难以预测，bug 悄然而至。
    *   **逻辑来源不明 (Indirection - HOCs)：** 多个 HOC 嵌套使用时，组件收到的 props 到底是谁给的？这种间接性让理解和调试数据流变得异常困难。
    *   **静态类型噩梦 (HOCs)：** 在 TypeScript 或 Flow 项目里给 HOC 写类型定义？是个技术活儿，想完美保证类型安全相当不易。
    *   **JSX 嵌套过深 (Render Props)：** Render Props 避免了 HOC 的一些问题，但它通常要求你在 JSX 里写函数作为子元素或 prop，结果就是代码一层套一层，可读性直线下降，被戏称为 "Render Prop 地狱"。
    *   **作用域限制 (Render Props)：** 通过 Render Prop 拿到的状态和函数，作用域被限制在那个回调函数里，想在组件其他地方（比如类组件的其他生命周期方法里）用？不方便。

*   **复杂组件的维护噩梦：** 组件写着写着就容易变成一个状态逻辑、副作用处理、UI 渲染混杂在一起的“大泥球”。`componentDidMount` 里可能既要请求数据，又要监听事件；`componentDidUpdate` 里可能又要处理另一堆逻辑；而清理工作则分散在 `componentWillUnmount` 里。相关逻辑被拆得到处都是，不相关的逻辑却挤在一个方法里，极易引入 bug 和不一致性。想把这种复杂组件拆小点？难！想给它写好单元测试？更难！
*   **对机器不够友好：** 类组件的代码，压缩和优化起来效果一般，而且热重载 (Hot Reloading) 经常出问题，体验不佳。它的结构也限制了一些潜在的编译时优化，比如预编译 (Ahead-of-Time Compilation) 和组件折叠 (Component Folding)。

![从类组件到 Hooks 的演进路径](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/A6hNVp.jpg)

这条从类组件，到 HOCs/Render Props，再到 Hooks 的演进之路，清晰地展示了 React 团队和社区为了解决组件开发中的核心挑战所付出的持续努力。每一种模式都试图弥补前者的不足，但也可能带来新的权衡。理解这些先前模式的痛点，对于领会 Hooks 的设计初衷以及它解决问题的巧妙之处至关重要。这不仅仅是学习一套新语法，更是理解一种全新的、更强大的组件逻辑组织方式。

### Hooks 的核心动机：React 为什么要搞这场“革命”？

面对上述种种挑战，React 团队在 React 16.8 版本中憋了个大招——正式引入了 Hooks。推出 Hooks 的核心动机，就是想提供一种**更简洁、更直接、也更强大的方式**来构建和复用组件逻辑。具体来说，Hooks 主要想达成以下几个目标：

1.  **提升有状态逻辑的可复用性：** 这是 Hooks 最核心的驱动力之一。Hooks 允许我们将组件内部的有状态逻辑（比如如何管理某个状态、如何执行某个副作用）提取出来，变成可独立测试和复用的单元（也就是自定义 Hook），而且这个过程**完全不需要改变组件的层级结构**。这直接命中了 HOCs 和 Render Props 模式中“包装器地狱”和逻辑来源不明的痛点。
2.  **改善代码组织与可读性：** 告别生命周期方法的“大杂烩”！Hooks 让我们能够根据逻辑上的相关性（比如，所有与数据获取相关的 state 和 effect 放一起，所有与事件订阅相关的放一起）来组织代码，而不是被迫按照生命周期方法来拆分逻辑。这种**按特性聚合代码**的方式，显著提升了代码的清晰度和可维护性。
3.  **简化复杂组件：** 通过提供更优的代码组织方式，以及更直接访问 React 核心特性的途径（state, context, refs 等），Hooks 有助于我们更好地管理那些原本可能变得异常庞大、难以理解和维护的复杂组件。
4.  **拥抱函数式编程：** 从概念上讲，React 组件一直都更像是函数（输入 props 和 state，输出 UI）。Hooks 彻底拥抱了函数式编程的理念，允许我们在不编写类的情况下，使用 React 的全部核心特性。这与 JavaScript 函数作为一等公民的特性天然契合。
5.  **可能更平缓的学习曲线：** 虽然 Hooks 也有自己的心智模型需要学习，但它至少帮助我们摆脱了 JavaScript 类中 `this` 关键字带来的困扰。
6.  **提升性能与优化潜力：** Hooks 的设计更有利于未来的性能优化，例如进行更精细的编译时优化（如 React Compiler 正在做的事）。同时，函数组件和 Hooks 的代码通常比等效的类组件代码更容易被现代 JavaScript 引擎优化和压缩。
7.  **渐进式采用，无需重写：** React官方团队将 Hooks 设计为 **100% 向后兼容**且**完全可选**的。这意味着我们可以在新代码中开始使用 Hooks，而无需重写现有的所有类组件。

我们可以这么理解, Hooks 代表了 React 中**抽象原语的一次根本性转变**：从过去基于**组件级别**的抽象（比如 HOC 包裹组件，Render Props 传入渲染函数），转向了基于**函数级别**的抽象（自定义 Hooks 在组件内部被直接调用）。HOCs 和 Render Props 通过改变组件树结构来实现逻辑复用，而 Hooks 则是通过普通的函数调用，将逻辑直接“注入”到函数组件中。这意味着，我们复用的主要单元变成了一个更轻量、更灵活的 JavaScript 函数（自定义 Hook），而不是一个重量级的组件包装器。这是一种更直接、侵入性更小的逻辑共享方式。

### 揭秘 React Hooks：核心原则与那两条“铁律”

理解 Hooks 的核心定义和它赖以生存的使用规则，是我们掌握这一新范式的基石。

#### 2.1 Hooks 的定义：组件逻辑的新范式，到底是个啥？

那么，Hooks 到底是什么？官方的说法是：**Hooks 是一些特殊的函数，它们允许你在函数组件中“钩入”(hook into) React 的 state (状态) 和 lifecycle (生命周期) 等特性**。简单来说，Hooks 就是让你在不写 class 的情况下，也能用上 React 核心功能的“魔法”。

*   **Hooks 本质上就是 JavaScript 函数：** 它们没什么神秘的，就是普通的 JS 函数，只不过在使用它们时需要遵守一些特殊的规则。
*   **对类组件无破坏性：** Hooks 是对现有 React 功能的补充，不是替代品。React 没打算废弃类组件，现存的老代码可以和 Hooks 和谐共处。
*   **更直接的 API 访问：** Hooks 提供了一种更直接的方式，让开发者能用上那些早已熟悉的 React 概念，比如 props, state, context, refs 和生命周期管理逻辑。

可以说，Hooks 的出现，彻底释放了函数组件的潜力，让它们也能像类组件一样管理复杂的状态和处理副作用，而这些在过去基本是类组件的“专属领域”。函数组件最初可能更多地被用于无状态的展示场景，而类组件则承担着逻辑和状态的重任。Hooks 打破了这种界限，让函数组件成为了构建各种 React 组件逻辑的一等公民。

“钩入”(hook into) 的说法很形象。它暗示了 Hooks 提供了一种机制，让我们能从传统的类结构之外，接入 React 内部的状态和生命周期管理系统。React 内部负责管理状态和生命周期，类组件通过 `this.state`、`componentDidMount` 等特定方法作为“官方指定入口”来访问这些内部机制。而 Hooks（如 `useState`、`useEffect`）则提供了另一套入口，让函数组件也能获得同样的访问能力。

#### 2.2 Hooks 的两条不可或缺的规则（及其重要性）

为了确保 Hooks 能够正确且可预测地工作，React 规定了两条我们**必须严格遵守**的规则。记住，这些规则可不是 React 团队拍脑袋想出来的，它们与 Hooks 的内部实现机制息息相关。

**规则一：只能在函数组件的顶层调用 Hooks (Only Call Hooks at the Top Level)**

*   **解释：** 你**不能**在循环 (loop)、条件判断 (if/else)、嵌套函数或者 `try/catch/finally` 语句块内部调用 Hooks。Hooks 的调用必须始终位于你的 React 函数组件的**最顶层作用域**，并且在任何可能导致提前返回 (early return) 的语句之前。
*   **为什么？** **React 依赖 Hooks 在每次渲染时的调用顺序来正确地将内部状态与对应的 Hook 调用关联起来**。想象一下 React 内部可能为每个组件维护了一个类似 Hooks “列表”的东西。第一次渲染时，第一个 `useState` 对应列表的第一项，第二个 `useEffect` 对应第二项…… 如果你在一个 `if` 语句里调用 Hook，那么当 `if` 条件在不同渲染中变化时，Hooks 的调用顺序就可能被打乱（比如某个 Hook 时而调用时而不调用），这会导致 React 内部的“列表”错位，状态对应混乱，从而引发各种难以追踪的 bug。
*   **常见错误与修正：** 比如，`if (condition) { const [value, setValue] = useState(0); }` 是**错误**的。正确的做法是将 `useState` 调用移到 `if` 语句**之前**，然后在 `if` 语句内部使用 `value` 和 `setValue`。同理，在循环或事件处理函数内部直接调用 Hook 也是不允许的。

**规则二：只能从 React 函数中调用 Hooks (Only Call Hooks from React Functions)**

*   **解释：** 你只能在以下两种地方调用 Hooks：
    1.  **React 函数组件的内部。**
    2.  **自定义 Hooks (Custom Hooks) 的内部。**
    你**不能**在普通的 JavaScript 函数（即使它在组件内部定义）或者 React 类组件的方法中调用 Hooks。
*   **为什么？** Hooks 是为服务于 React 函数组件的渲染生命周期而设计的。它们需要依赖 React 内部提供的一些上下文信息来正确地管理状态和副作用。在 React 函数组件或自定义 Hook 之外调用它们，会破坏这种必要的关联，导致错误或不可预期的行为。
*   **常见错误与修正：** 比如，你定义了一个普通的 JS 辅助函数 `function calculateSomething() { const [state, setState] = useState(0); /* ... */ }`，然后在组件里调用它，这是**错误**的。如果你需要将包含 Hook 调用的逻辑提取出来复用，你应该把它重构为一个**自定义 Hook**（一个以 `use` 开头的函数），然后在你的函数组件中调用这个自定义 Hook。

---

✅ **正确做法**
  ```jsx
  function Counter() {
    // 正确：在函数组件顶层调用 Hooks
    const [count, setCount] = useState(0);
    useEffect(() => {
      document.title = `点击了 ${count} 次`;
    }, [count]);
    
    return <button onClick={() => setCount(count + 1)}>点击了 {count} 次</button>;
  }
  ```

❌ **错误做法**
  ```jsx
  function Counter() {
    // 错误：条件语句中调用 Hook
    if (windowWidth > 500) {
      const [count, setCount] = useState(0);
    }
    
    // 错误：循环中调用 Hook
    for (let i = 0; i < products.length; i++) {
      const [selected, setSelected] = useState(false);
    }
    
    // 错误：嵌套函数中调用 Hook
    function handleClick() {
      const [timesClicked, setTimesClicked] = useState(0);
    }
  }
  ```

✅ **正确做法**
  ```jsx
  function ProfilePage() {
    // useState Hook 用于在函数组件中管理状态
    const [user, setUser] = useState(null);
    // ...其他代码
  }

  // 正确：自定义 Hook 中调用其他 Hook
  function useUser(userId) {
    const [user, setUser] = useState(null);
    useEffect(() => {
      fetchUser(userId).then(userData => setUser(userData));
    }, [userId]);
    return user;
  }
  ```

❌ **错误做法**
  ```jsx
  // 错误：在普通 JavaScript 函数中调用 Hook
  function formatUser(user) {
    const [formattedName] = useState(user.name.toUpperCase());
    return formattedName;
  }

  // 错误：在类组件中调用 Hook
  class UserProfile extends React.Component {
    render() {
      const [user] = useState(null); // 这会导致错误！
      return <div>{user?.name}</div>;
    }
  }
  ```

**规则的强制执行：** 为了帮助我们开发者养成好习惯，避免无意中违反规则，React 社区提供了官方的 ESLint 插件 `eslint-plugin-react-hooks`。这个插件包含了两个至关重要的规则：

*   `rules-of-hooks`：检查你是否违反了上面提到的两条规则。
*   `exhaustive-deps`：检查 `useEffect`、`useCallback` 等 Hooks 的依赖项数组是否填写完整、正确（这个我们后面会详细聊）。

**深入理解规则背后的机制：** Hooks 依赖调用顺序的机制，初看起来可能有点反直觉，但正是这种机制让 React 能够在多次渲染之间保持状态，而无需像类组件那样依赖 `this` 或显式的实例。可以想象 React 内部为每个组件维护了一个“状态槽位”列表或计数器。每次 Hook 调用都会按顺序占据一个槽位。因此，严格的调用顺序规则并非随意的限制，而是其内部实现方式的直接体现。理解这一点，有助于我们揭开 Hooks 为何如此“固执”的神秘面纱。

同时，这些规则虽然带来了限制，但也正是它们使得 Hooks 可以安全地组合使用，并且让创建强大的**自定义 Hooks** 成为可能。自定义 Hooks 之所以能调用其他 Hooks，正是因为它本身也必须遵守这些规则，从而保证了整个 Hook 调用链的执行上下文是一致和可靠的。

`eslint-plugin-react-hooks` 插件 不仅仅是个代码检查工具，它更像是一位严格的“导师”，帮助我们写出更符合 React 理念的代码。特别是 `exhaustive-deps` 规则，它会促使我们仔细思考依赖项，常常能帮我们发现与闭包或副作用同步相关的潜在 bug。当你看到这个插件报警告时，通常意味着你对依赖项和闭包如何与 Hooks 协同工作可能存在误解，修复这些警告的过程，往往就是加深理解、写出更健壮代码的过程。

### React Hooks核心：深入用法与机制

掌握 `useState`、`useEffect` 和 `useContext` 这三个核心 Hooks，是高效运用 React Hooks 的基础。它们分别负责搞定组件的局部状态管理、副作用处理和跨组件数据共享这三大核心任务。

#### 3.1 `useState`：函数组件拥有状态的基石

`useState` 是我们接触到的第一个，也是最常用的 Hook。它就像给函数组件装上了一个“记忆芯片”，让它能够记住并在多次渲染之间保持自己的局部状态。

*   **语法与核心功能：** 调用方式很简单：`const [state, setState] = useState(initialState);`。它返回一个数组，包含两个元素：
    1.  `state`：当前的状态值。
    2.  `setState`：一个用于更新该状态的函数。
    `initialState` 这个初始值参数，只在组件的**首次渲染**时会被使用，后续的渲染会直接忽略它。
*   **状态可以是任何类型：** 不像类组件的 `this.state` 必须是个对象，`useState` 定义的状态变量可以是任何合法的 JavaScript 数据类型：数字、字符串、布尔值、对象、数组，甚至是 `null` 或 `undefined`。
*   **如何更新状态：**
    *   **直接设置新状态：** `setState(newState)`。这会用 `newState` 来**替换**掉旧的状态。注意！和类组件的 `this.setState` 不同，`useState` 的更新函数**不会自动合并对象**。如果你存的是个对象，想只更新其中一个属性，你需要传入一个包含所有属性的新对象，比如 `setState({ ...oldState, changedProp: newValue })`。
    *   **函数式更新（推荐）：** `setState(prevState => newState)`。当你需要基于**前一个状态**来计算新状态时，强烈推荐使用这种形式。例如，在一个计数器组件里，如果你想连续多次调用增加计数的函数，`setCount(count + 1)` 可能会因为闭包捕获到旧的 `count` 值而出错，而 `setCount(prevCount => prevCount + 1)` 则能保证每次都是在最新的状态基础上进行更新。
*   <span className="text-red-500">**状态更新是异步且可能批处理的：** 调用 `setState` 并不会立即改变 `state` 的值，它更像是向 React “提交了一个更新请求”。React 可能会将短时间内发生的多次状态更新合并（批处理）成一次单独的重新渲染，来优化性能。从 React 18 开始，默认情况下，所有的状态更新（无论发生在事件处理函数还是其他地方）都会自动进行批处理。</span>
*   **惰性初始状态 (Lazy Initialization)：** 如果计算初始状态 `initialState` 的开销比较大（比如需要执行复杂的计算或读取 `localStorage`），你可以给 `useState` 传递一个**函数**：`useState(() => createInitialState(props))`。这个初始化函数将只会在组件**首次渲染**时执行一次。比如 `const [todos, setTodos] = useState(() => createExpensiveTodos());`。
*   **跳过状态更新 (Bailing out)：** 如果你调用 `setState` 时传入的新值，通过 `Object.is` 算法比较后，发现和当前的状态值完全相同，React 会很聪明地跳过这次更新，不会重新渲染该组件及其子组件，也不会执行相关的 Effects。
*   **管理对象和数组状态的“铁律”——不可变性 (Immutability)：** 这是使用 `useState` 处理对象或数组时最重要的原则！**永远不要直接修改** state 中的对象或数组。你应该始终创建它们的**新副本**，并在副本上进行修改。常用的方法包括：
    *   对象：使用对象扩展语法 `...`，例如 `setForm({ ...form, firstName: e.target.value })`。
    *   数组：使用数组的扩展语法 `...`，或者像 `map`, `filter`, `concat` 等不会修改原数组的方法。例如，添加一项：`setList([...list, newItem])`；更新某一项：`setList(list.map(item => item.id === id ? { ...item, completed: true } : item))`。
*   **用 `key` 来重置状态：** 有个小技巧，如果你想完全重置一个组件（或包含状态逻辑的某部分 JSX）的状态，可以改变它的 `key` prop。当 `key` 改变时，React 会认为这是一个全新的组件实例，会卸载旧的并挂载新的，其状态自然也就回到了初始值。
*   **合理设计状态结构：** 好的状态结构是可维护性的关键。一些基本原则包括：
    *   **组织相关状态：** 把相互关联的状态放在一起（比如一个表单的所有字段）。
    *   **避免状态矛盾：** 状态设计应避免出现逻辑上不可能同时存在的情况（比如 `isLoading` 和 `isError` 同时为 `true`）。
    *   **避免冗余状态：** 如果某个信息可以根据 props 或其他已有的 state 在渲染时计算出来，就不要把它单独存为一个 state。
    *   **避免状态数据重复：** 同一份数据尽量只存储一次。
    *   **尽量扁平化：** 避免过深的状态嵌套，有时将嵌套状态拆分成多个独立的 state 或使用 `useReducer` 会更好。

`useState` 不会自动合并对象以及对不可变性的强调，这背后体现了 React 对简化状态管理和优化变更检测的倾向。不可变性使得 React 可以通过快速的引用比较 (`===`) 来判断状态是否真的发生了变化，从而避免了深层比较的开销，并使得状态更新更可预测，避免了直接修改可能带来的副作用。

函数式更新 `setState(prevState => ...)` 不仅仅是为了方便，它对于在闭包（比如在 `useEffect` 内部，或者在某次旧渲染中定义的事件处理函数里）中正确更新状态至关重要。这些闭包可能会捕获到旧的状态值。如果直接使用 `setCount(count + 1)`，并且 `count` 是旧值，那么多次调用可能只会增加 1。函数式更新确保了 `prevState` 参数始终是 React 内部维护的最新状态值，从而绕开了陈旧闭包 (stale closure) 的问题。

惰性初始化 `useState(() => ...)` 则是针对初始状态计算开销较大场景的一个明确的性能优化手段，表明 Hooks 在设计之初就考虑到了性能，并为基础操作也提供了精细控制的可能。

#### 3.2 `useEffect`：精确编排副作用的“瑞士军刀”

`useEffect` 是我们用来在函数组件中处理各种“副作用 (side effects)”的主要武器。所谓副作用，就是那些发生在 React 渲染流程之外的、可能与外部世界交互或影响其他组件的操作，比如：获取数据、设置订阅、手动修改 DOM 等。

*   **目的：** 让函数组件也能执行副作用操作。正常来说组件的渲染过程本身应该是纯粹的，副作用不能直接写在组件函数体里。
*   **语法：** `useEffect(setupFunction, dependenciesArray?)`。
    *   `setupFunction`：这里面就包含了你的命令式的、可能会产生副作用的代码。它会在 React **将渲染结果提交到屏幕之后**异步执行。
    *   `dependenciesArray?` (依赖项数组)：这是一个**可选**的数组，它用来告诉 React，你的这个 effect 依赖了哪些来自组件作用域的值（props, state, 甚至是函数）。**这个数组是 `useEffect` 能否正确工作的关键！**
*   **清理函数 (Cleanup Function)：** `setupFunction` 可以**可选地**返回一个函数，这个函数被称为“清理函数”。它会在以下两种时机执行：
    1.  在组件从 UI 中移除（卸载）之前。
    2.  在下一次 effect **重新运行之前**（如果依赖项发生了变化）。
    清理函数对于防止内存泄漏至关重要，比如取消网络请求、清除定时器、解绑事件监听器等。
*   **依赖项数组的学问：** 这个数组决定了你的 `setupFunction`（以及上一次的清理函数）**何时会重新执行**：
    *   **不提供数组 (undefined)：** `useEffect(setup)`。Effect 会在**每次**组件渲染完成之后都执行。这通常不是你想要的，因为它可能导致不必要的性能开销甚至死循环。
    *   **提供空数组 (`[]`)：** `useEffect(setup, [])`。Effect 只会在组件**初始渲染之后执行一次**，其清理函数则只会在组件**卸载时执行一次**。这有点类似于类组件的 `componentDidMount` 和 `componentWillUnmount` 的组合。
    *   **提供包含值的数组 (`[dep1, dep2, ...]`)：** `useEffect(setup, [dep1, dep2])`。Effect 会在初始渲染后执行。之后，在**每次**组件重新渲染完成时，React 会比较这次渲染中 `dep1`, `dep2` 的值和上一次渲染时的值（使用 `Object.is` 比较）。如果**数组中任何一个依赖项发生了变化**，React 就会先执行上一次 effect 返回的清理函数，然后重新执行 `setupFunction`。
*   **穷尽依赖 (Exhaustive Dependencies) - 必须遵守的规则！** `eslint-plugin-react-hooks` 插件的 `exhaustive-deps` 规则 要求我们：**所有在 `setupFunction` 内部用到的、来自组件作用域的值（props, state, 你在组件内定义的函数等），都必须明确地列在依赖项数组里！**
    *   **陷阱：** 遗漏依赖项是 `useEffect` 最常见的坑之一。这会导致你的 effect 函数拿到的是旧的（“陈旧的”，stale）值，因为它没有在依赖的值变化时重新执行，从而产生各种奇怪的 bug。另一个极端是包含了不必要的依赖项（比如每次渲染都变化的引用，像未用 `useCallback` 包裹的函数或未用 `useMemo` 包裹的对象），这会导致 effect 运行过于频繁。
*   **Effect 的执行时机：**
    *   通常情况下，`useEffect` 的执行是在浏览器完成**布局 (layout)** 和**绘制 (paint)** 之后才**异步**进行的，它不会阻塞浏览器的渲染。
    *   但在 React 18 中，如果某个 effect 是由离散的用户输入（比如一次按钮点击）触发的更新所引起的，或者如果更新被包裹在 `flushSync` 中，那么这个 effect 会在布局和绘制**之前同步**触发。这是一个需要注意的细微差别，但大多数情况下你可以认为它是异步的。
*   **常见应用场景：**
    *   **数据获取:** 在组件挂载时（`[]`）或某个 ID prop 变化时（`[id]`）从 API 获取数据。别忘了处理加载状态和可能的竞态条件（比如在清理函数中取消请求）。
    *   **事件订阅:** 添加和移除 DOM 事件监听器（如 `window.addEventListener('resize', handleResize)`）。
    *   **手动 DOM 操作:** 当确实需要直接操作 DOM 时（虽然通常更推荐用 `useRef` 来直接访问）。
    *   **设置定时器:** `setInterval` 或 `setTimeout`，并在清理函数中用 `clearInterval` 或 `clearTimeout` 清除。
*   **一个组件，多个 `useEffect`：** 你完全可以在一个组件里根据不同的关注点，使用多个 `useEffect`。比如一个负责获取数据，另一个负责设置事件监听。这有助于保持代码的组织性。

**理解 `useEffect` 的核心心智模型：同步 (Synchronization)**

在业务开发的时候, 很容易把 `useEffect` 简单地看作是类组件生命周期方法的替代品。但一个更准确、更强大的心智模型是：**将 `useEffect` 视为一种将你的 React 组件状态与某个外部系统（DOM、网络、第三方库等）或某种副作用进行“同步”的机制**。

依赖项数组就定义了你的 effect 需要与哪些来自 React 世界的值（props, state）保持同步。`setupFunction` 执行实际的同步操作（比如，根据最新的 `userId` 去订阅用户状态），而 `cleanup` 函数则执行“反同步”或“断开连接”的操作（比如，在 `userId` 改变或组件卸载前取消之前的订阅）。

依赖项数组就像在告诉 React：“如果这个数组里的任何一个值发生了变化，意味着我之前建立的那个‘同步状态’可能就不再有效了，所以请先帮我清理掉旧的连接（执行 cleanup），然后再根据新值重新建立一次同步（执行 setup）。”

这种“同步”的心智模型，比单纯考虑“挂载时执行”、“更新时执行”要更健壮，也更能帮助我们理解依赖项数组的真正作用。

清理函数不仅在卸载时执行，**每次 effect 因依赖变化而重新执行之前，上一次的清理函数也会被执行**。这一点对于防止资源泄漏或不一致行为至关重要。比如，如果你在 effect 里设置了一个 `setInterval`，依赖项变化导致 effect 重跑，如果不先 `clearInterval` 清掉旧的定时器，你就会留下多个定时器在后台运行！

错误地指定依赖项数组是 `useEffect` bug 的重灾区（比如拿到陈旧的闭包值、导致无限循环、effect 没有按预期时机运行等）。`exhaustive-deps` ESLint 规则几乎是必装的。很多问题源于对 JavaScript **闭包 (closure)** 的误解：在组件内部定义的函数（包括 effect 的 setup 和 cleanup 函数）会“捕获”其定义时所在的词法作用域中的变量。如果这些变量在后续渲染中发生了变化，但它们没有被包含在依赖项数组里，那么 effect（如果它没有因为其他依赖变化而重新运行）仍然会使用它当初被定义时捕获到的那个旧的、陈旧的值。

![useEffect 同步模型示意图](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/20aeCG.jpg)

#### 3.3 `useContext`：告别“钻透”，优雅地共享状态

`useContext` Hook 为我们在组件树中跨层级传递数据提供了一个官方的、简洁的解决方案，有效地避免了“属性逐层传递 (prop drilling)”问题。

*   **目的：** 让组件能够直接“订阅”并读取来自上层某个 `Context.Provider` 的值，而无需将这个值作为 props 一层一层地手动往下传。这就解决了“属性逐层传递”问题。
*   **“属性逐层传递”解释：** 指的是当一个 prop 数据需要经过好几个中间层组件才能最终到达需要它的那个深层子组件时，即使那些中间组件本身根本不关心这个 prop，也必须在自己的 props 定义和 JSX 中把它透传下去。代码显得冗余，维护起来也很麻烦。
*   **创建 Context：** 首先，你需要使用 `React.createContext(defaultValue)` 来创建一个 Context 对象。这个 `defaultValue` 参数只有在组件尝试消费这个 Context，但在其上层组件树中找不到任何一个对应的 `<MyContext.Provider>` 时才会被用到。
*   **提供 Context 值 (Provider)：** 在你的组件树中某个合适的上层位置，使用 `<MyContext.Provider value={dataToShare}>` 来包裹那些需要访问这个数据的子孙组件。所有被这个 Provider 包裹的后代组件，都可以通过 `useContext` 来读取你传递的 `value`。
*   **消费 Context 值 (useContext)：** 在需要读取数据的函数组件内部，调用 `const contextValue = useContext(MyContext)`。
    *   注意：`useContext` 接收的是 `React.createContext()` 返回的那个 **Context 对象本身**作为参数，而不是 `<MyContext.Provider>` 或已经被废弃的 `<MyContext.Consumer>`。
    *   它会返回当前组件树中，离它**最近**的那个 `<MyContext.Provider>` 所提供的 `value` 值。
    *   **关键点：** 只要那个最近的 Provider 的 `value` prop 发生变化，**所有**调用 `useContext(MyContext)` 来消费这个 Context 的组件，**都会自动重新渲染**。这是使用 Context 时一个非常重要的性能考量点。
*   **如何更新 Context 值？** Context 本身不提供更新机制。通常的做法是将 Context 与**状态管理 Hooks (`useState` 或 `useReducer`)** 结合使用。在 Provider 所在的组件里维护状态，然后将**状态值**和**更新状态的函数**一起通过 `value` prop 传递下去。子组件通过 `useContext` 获取到更新函数后，就可以调用它来间接触发 Provider 组件的状态更新，从而更新 Context 值。
*   **常见用例：** 有些需要在应用中广泛共享的“全局性”或“主题性”数据，比如：应用的主题（亮色/暗色）、当前的用户认证信息、当前的语言/地区偏好设置等。
*   **性能注意事项：** 正如前面提到的，当 Provider 的 `value` 改变时，所有消费该 Context 的子组件都会重新渲染，**即使它们实际用到的只是 `value` 对象中的一小部分，并且那部分并没有改变**。如果 Context 值是一个每次渲染都可能产生新引用的对象或数组，这可能导致不必要的性能开销。缓解策略包括：
    *   将一个大的 Context 拆分成多个更小的、更专注的 Context。
    *   对传递给 `value` prop 的对象或函数使用 `useMemo` 或 `useCallback` 来确保其引用稳定性。
    *   结合使用 `React.memo` 来优化消费者组件（但这只有在传递给消费者组件的其他 props 以及 Context 值本身引用稳定时才有效）。

`useContext` 显著简化了消费 Context 的方式。在它出现之前，我们需要使用 `<MyContext.Consumer>{value => /* JSX using value */}</MyContext.Consumer>` 这样的 Render Prop 模式，代码嵌套层级深，写起来也比较繁琐。`useContext` 提供的 `const value = useContext(MyContext)` 这种直接访问方式，让组件代码更扁平、更易读。

`useContext` 读取的是“最近的” Provider 的值，这个规则使得我们可以在组件树的不同部分嵌套 Provider 来覆盖 Context 值，实现强大的主题嵌套或局部配置覆盖等模式。

而“Context 值改变导致所有消费者重渲染” 这个特性，是使用 Context 时必须牢记的性能关键点。特别是当 `value` prop 是一个对象，并且这个对象在 Provider 组件每次渲染时都重新创建（即使内容没变，引用也变了），就会导致所有消费者不必要地重渲染。<span class="text-red-500">因此，在 Provider 中通常需要配合 `useMemo` 和 `useCallback` 来确保传递给 `value` 的对象和函数的引用稳定性，这是优化 Context 性能的常用手段。</span>

![useContext 解决 Prop Drilling 问题](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/060yL0.jpg)

### 寻找更高级 Hooks 工具集：应对更复杂的挑战

除了我们刚刚聊过的 `useState`, `useEffect`, `useContext` 这“三巨头”之外，React 还为我们准备了一系列更高级的 Hooks，它们就像工具箱里那些更专业的工具，能帮助我们应对更复杂的场景，比如精细的状态管理、极致的性能优化，以及与 DOM 进行更底层的交互。

#### 4.1 `useReducer`：实现健壮且可预测的状态管理

当你发现组件的状态逻辑变得越来越复杂，比如状态包含多个相互关联的部分，或者下一个状态的值严重依赖于前一个状态和发生的具体“动作”时，`useState` 可能就有点力不从心了。这时候，`useReducer` 就是一个非常好的替代方案。

*   **目的：** 用于管理那些相对复杂的状态逻辑，它提供了一种将状态更新逻辑**集中化**和**封装**起来的方式。
*   **语法：** `const [state, dispatch] = useReducer(reducer, initialArg, init?)`。
    *   `reducer` 函数：`(currentState, action) => newState`。这是核心！它必须是一个**纯函数**，接收当前的状态 `currentState` 和一个描述发生了什么事的 `action` 对象，然后计算并返回**新的状态** `newState`。通常我们会在 reducer 内部使用 `switch` 语句，根据 `action.type` 来处理不同的更新逻辑。
    *   `initialArg`：初始状态值。
    *   `init?` (可选)：一个惰性初始化函数 `(initialArg) => initialState`，用于计算复杂的初始状态，和 `useState` 的惰性初始化类似。
*   **返回值：**
    *   `state`：当前的状态值。
    *   `dispatch` 函数：`(action) => void`。你通过调用 `dispatch(action)` 来“派发”一个动作给 reducer，从而触发状态更新。一个非常棒的特性是：`dispatch` 函数的**引用在组件的整个生命周期内是稳定不变的**！
*   **Actions：** 通常我们约定 `action` 是一个包含 `type` 属性（字符串，描述动作类型）和可选的 `payload`（携带的数据）的普通 JavaScript 对象。
*   **`useReducer` 的优点：**
    *   **集中更新逻辑：** 所有相关的状态更新逻辑都收拢在 `reducer` 函数里，代码结构更清晰，复杂的状态转换逻辑一目了然。
    *   **提高可预测性：** 因为 `reducer` 是纯函数，只要给定相同的当前状态和 action，就一定会得到相同的新状态。这让状态的变化更容易追踪、理解和调试。
    *   **优化性能：** `dispatch` 函数的引用是稳定的！这意味着你可以放心地把它作为 prop 传递给子组件，或者作为 `useEffect`、`useCallback` 的依赖项，而不用担心会引起不必要的重渲染或 effect 重复执行。
    *   **易于测试：** `reducer` 纯函数的特性让它非常容易进行单元测试。你只需要给它提供输入状态和 action，然后断言它返回的输出状态是否符合预期，完全不需要依赖 React 组件环境。
*   **从 `useState` 到 `useReducer` 的重构思路：** 通常包括三步：1. 将事件处理器里直接调用 `setState` 的地方，改为调用 `dispatch` 并传递一个描述意图的 action 对象；2. 编写一个 `reducer` 函数，根据不同的 action 类型来计算并返回新的状态；3. 在组件里用 `useReducer` 替换掉原来的 `useState` 调用。

`useReducer` 提倡一种**关注点分离**的思维方式：组件的事件处理函数负责“发生了什么”（派发 action），而 `reducer` 函数则负责“状态应该如何改变”。这种分离对于构建清晰、可维护的复杂组件非常有帮助。`reducer` 的可测试性也是它处理复杂状态逻辑时的一大优势。而 `dispatch` 函数的稳定性则是一个重要的性能优化点，尤其是在需要将更新逻辑传递给深层子组件的场景中。

![useState vs useReducer 决策图](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/dw70Bp.png)

#### 4.2 `useCallback` 与 `useMemo`：性能优化的“记忆”双雄

`useCallback` 和 `useMemo` 是 React 提供的两个主要的性能优化工具，它们的核心武器都是“**记忆化 (memoization)**”——记住上一次计算的结果或函数的实例，在依赖项没有改变的情况下，直接复用，从而避免不必要的重复计算或渲染。

*   **`useCallback(fn, dependencies)`：**
    *   **目的：** 记住（记忆化）一个**函数**。它返回该回调函数的记忆化版本，只有当依赖项数组 `dependencies` 中的某个值发生变化时，这个返回的函数引用才会更新。它的主要作用是**防止在每次渲染时不必要地重新创建函数实例**。
    *   **为何重要（引用相等性）：** 在 JavaScript 中，函数是对象。如果你在组件每次渲染时都重新定义一个函数（即使函数体完全一样），它也是一个新的函数实例（引用不同）。当这样的函数作为 prop 传递给一个被 `React.memo` 包裹的子组件时，即使逻辑没变，子组件也会因为 prop 的引用变化而重新渲染，导致 `React.memo` 优化失效。
    *   **语法与参数：** `fn` 是你想记忆化的函数，`dependencies` 是一个数组，包含了 `fn` 函数体内部依赖的所有来自组件作用域的值。
    *   **主要用例：**
        1.  将回调函数作为 props 传递给那些被 `React.memo` 优化的子组件时。
        2.  当一个函数本身是另一个 Hook（比如 `useEffect`，或者另一个 `useCallback`/`useMemo`）的依赖项时。
    *   **何时避免使用：** 如果你的函数既没有传递给优化的子组件，也不是其他 Hook 的依赖项，那么使用 `useCallback` 可能只会增加代码复杂度和一点点性能开销，属于“过早优化”。

*   **`useMemo(() => value, dependencies)`：**
    *   **目的：** 记住（记忆化）一个**计算结果**。它接收一个“创建”函数和依赖项数组，返回这个创建函数执行后的**结果值**的记忆化版本。只有当依赖项数组 `dependencies` 中的某个值发生变化时，这个“创建”函数才会重新执行，并返回新的值。
    *   **语法与参数：** 第一个参数是用于计算值的“创建”函数 `() => value`，第二个是依赖项数组。
    *   **主要用例：**
        1.  缓存那些**计算开销比较大**的函数的执行结果（比如对一个巨大的列表进行过滤、排序或复杂计算）。
        2.  确保那些作为 props 传递给优化子组件的**对象或数组**具有稳定的引用（避免在每次渲染时都创建新的对象/数组引用）。例如，`const style = useMemo(() => ({ color: 'blue', fontSize: 12 }), []);` 可以保证 `style` 对象的引用稳定。
        3.  当某个计算结果本身是另一个 Hook 的依赖项时。
    *   **Strict Mode 行为：** 在开发环境的 Strict Mode 下，React 会故意执行你的“创建”函数两次，来帮助你检测这个计算过程是否是纯粹的（不应有副作用）。

`useCallback` 和 `useMemo` 是性能调优的“手术刀”，而不是可以随便挥舞的“大锤”。它们本身是有开销的（需要存储记忆化的值/函数，每次渲染需要比较依赖项数组）。因此，**我们不应该盲目地对每一个函数和值都使用它们！** 正确的做法是：

1.  首先，确保你的代码逻辑是正确的。
2.  然后，如果遇到了性能问题，使用 <span className="text-green-500">React DevTools Profiler</span> 等工具**定位到具体的性能瓶颈**。
3.  最后，**有针对性地**在确实存在不必要重渲染或重复计算的地方使用 `useCallback` 或 `useMemo` 进行优化。

理解 JavaScript 中对象和函数的**引用相等性 (Referential Equality)** 对于有效使用这两个 Hooks 至关重要，特别是当它们与 `React.memo` 配合使用时。<span class="text-yellow-500">`React.memo` 默认进行的是浅层 props 比较</span>，它依赖于 props 的引用是否相同来判断是否需要更新。如果传递给 memoized 组件的函数或对象 prop 在每次渲染时都是新的引用，`React.memo` 就会失效。`useCallback` 和 `useMemo` 正是通过在依赖项不变时提供稳定的引用，来帮助 `React.memo` 发挥作用的。

而`useCallback(fn, deps)` 本质上可以看作是 `useMemo(() => fn, deps)` 的一种语法糖。这揭示了 `useCallback` 其实是 `useMemo` 针对“记忆化函数”这个特定场景的一种便捷写法。

#### 4.3 `useRef`：访问 DOM 与存储可变值的“任意门”

`useRef` Hook 返回一个可变的 `ref` 对象，这个对象的 `.current` 属性被初始化为你传入的参数 (`initialValue`)。最关键的是：**这个 `ref` 对象在组件的整个生命周期内保持不变（引用稳定）**。

*   **目的：** 主要有两个：
    1.  提供一种稳定可靠的方式来**访问 DOM 节点**或 React 组件实例。
    2.  在多次渲染之间**持久化任何可变值**，并且这种值的改变**不会触发组件重新渲染**。
*   **语法：** `const myRef = useRef(initialValue)`。
*   **`.current` 属性：** `ref` 对象的核心就是它的 `.current` 属性。可以读取它，也可以直接修改它（比如 `myRef.current = newValue`）。
*   **与 `useState` 的本质区别：**
    *   **修改 `ref.current` 不会触发重渲染！** 这是 `useRef` 和 `useState` 最根本的区别。
    *   `state` 用于存储那些其变化**需要**反映到 UI 上的值。
    *   `ref` 用于存储那些属于组件内部逻辑或副作用一部分，但其变化**不应该**直接导致 UI 更新的值。
*   **主要用例：**
    1.  **访问 DOM 元素：** 将 `ref` 对象作为 `ref` 属性传递给 JSX 元素，例如 `<input ref={inputRef} />`。当对应的 DOM 节点被创建后，React 会自动将该 DOM 节点赋值给 `inputRef.current`。之后你就可以通过 `inputRef.current` 来调用 DOM API 了，比如 `inputRef.current.focus()`、`inputRef.current.scrollIntoView()`，或者用 `getBoundingClientRect()` 测量尺寸和位置。
    2.  **存储可变的“实例变量”：** 用于持有任何你需要在多次渲染间保持不变、并且可以被修改，但又不希望其改变触发重渲染的值。常见的例子包括：定时器的 ID (`setInterval` 返回的 ID)、WebSocket 连接实例、上一次渲染时的某个 state 或 prop 的值（用于比较）、一个可变的计数器（但其变化不显示在 UI 上）等。
*   **注意事项：**
    *   **避免在渲染期间读写 `ref.current`**（除非是那种惰性初始化的模式，比如 `if (!ref.current) ref.current = new SomeClass();`）。因为 `ref` 的变化不会触发重渲染，如果在渲染逻辑中依赖 `ref.current` 的值，可能会导致 UI 与 `ref` 的实际值不一致，让组件行为变得难以预测。副作用（如 `useEffect` 或事件处理函数）是读写 `ref.current` 的安全区域。
    *   将 refs（尤其是在操作 DOM 时）视为一种“**逃生舱口 (escape hatch)**”。React 的核心是声明式的，应尽可能优先使用 props 和 state 来控制 UI。只有在确实需要与命令式 API 交互时，才考虑使用 ref。
*   **Ref 内容的惰性初始化：** 和 `useState`、`useReducer` 类似，如果创建 `initialValue` 的成本很高，也可以给 `useRef` 传递 `null`，然后在 `useEffect` 或首次需要时进行惰性初始化。

React 本质上是声明式的。`useRef` 则像是为我们提供了一个受控的“后门”或“逃生舱口”，允许我们与命令式的世界（比如浏览器 DOM API）进行必要的交互，或者用来管理那些不太适合放在 React 声明式渲染模型中的可变状态。官方文档称其为“逃脱 React 单向数据流的舱口”，就形象地说明了它在连接声明式 React 与命令式需求之间的桥梁作用。

`ref.current` 的更新不会触发重渲染，这不是它的缺点，而是它的核心特性和设计意图。它就是为那些属于组件内部机制或副作用管理一部分，但不直接影响其视觉呈现的值而生的。如果修改 `ref.current` 也触发重渲染，那它就和 `useState` 没区别了。这种区别对于存储定时器 ID 这样的场景至关重要，因为定时器 ID 的改变引发重渲染是毫无意义甚至可能有害的。

下面我们来看看使用useRef的一些常用场景示例子:

1. **DOM 操作与测量**
```jsx
// 控制表单输入框焦点
function AutoFocusInput() {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return <input ref={inputRef} />;
}
```
```jsx
// 元素尺寸测量
function MeasureExample() {
  const divRef = useRef(null);
  useEffect(() => {
    const dimensions = divRef.current.getBoundingClientRect();
    console.log(dimensions.width, dimensions.height);
  }, []);
  return <div ref={divRef}>测量我</div>;
}
```

2. **定时器引用管理**
```jsx
function Timer() {
  const timerRef = useRef(null);
  
  useEffect(() => {
    timerRef.current = setInterval(() => {
      console.log('tick');
    }, 1000);
    
    return () => clearInterval(timerRef.current);
  }, []);
  
  return <div>Timer running...</div>;
}
```

3. **保存前一个值**
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();
  
  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);
  
  return (
    <div>
      现在: {count}, 之前: {prevCountRef.current}
    </div>
  );
}
```

4. **非响应式计数器**
```jsx
function Logger() {
  const countRef = useRef(0);
  
  const handleClick = () => {
    countRef.current += 1;
    console.log(`点击了 ${countRef.current} 次`);
  };
  
  return <button onClick={handleClick}>点击我</button>;
}
```

5. **第三方库实例管理**
```jsx
function MapComponent() {
  const mapInstanceRef = useRef(null);
  
  useEffect(() => {
    mapInstanceRef.current = new ThirdPartyMap('#map');
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
      }
    };
  }, []);
  
  return <div id="map" />;
}
```

6. **媒体元素控制**
```jsx
function VideoPlayer() {
  const videoRef = useRef(null);
  
  const handlePlay = () => {
    videoRef.current.play();
  };
  
  const handlePause = () => {
    videoRef.current.pause();
  };
  
  return (
    <div>
      <video ref={videoRef} src="video.mp4" />
      <button onClick={handlePlay}>播放</button>
      <button onClick={handlePause}>暂停</button>
    </div>
  );
}
```

7. **无限滚动观察者**
```jsx
function InfiniteScroll() {
  const observerRef = useRef(null);
  const bottomRef = useRef(null);
  
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreData();
        }
      },
      { threshold: 0.5 }
    );
    
    if (bottomRef.current) {
      observerRef.current.observe(bottomRef.current);
    }
    
    return () => observerRef.current.disconnect();
  }, []);
  
  return (
    <div>
      <div>内容列表...</div>
      <div ref={bottomRef}>加载更多</div>
    </div>
  );
}
```

#### 4.4 `useLayoutEffect`：同步执行的 Effect，专治布局“闪烁”

`useLayoutEffect` 在功能上和 `useEffect` 非常相似，它们都用于执行副作用。但它们之间有一个关键的区别：**执行时机**。`useLayoutEffect` 会在 React **完成所有 DOM 变更之后，但在浏览器将这些变更实际绘制到屏幕之前，同步地触发**。

*   **目的：** 主要用于那些需要在浏览器**绘制前**读取 DOM 布局信息，并**同步地**根据这些信息重新渲染组件的场景，目的是为了**避免视觉上的闪烁 (flicker)**。
*   **语法：** `useLayoutEffect(setup, dependencies?)`，和 `useEffect` 完全一样。
*   **与 `useEffect` 的关键区别：执行时机！**
    *   `useLayoutEffect`：**同步**执行，在 DOM 更新后、浏览器绘制前。它会**阻塞**浏览器的绘制过程。
    *   `useEffect`：通常**异步**执行，在 DOM 更新和浏览器绘制**之后**。它**不会阻塞**浏览器绘制。
*   **典型用例：**
    *   **DOM 测量与同步更新：** 当你需要读取某个 DOM 元素的布局信息（比如它的尺寸 `offsetWidth` 或位置 `offsetTop`，通常通过 `getBoundingClientRect()` 获取），并且需要根据这个信息**立即**（在用户看到任何中间状态之前）调整 UI 并同步重新渲染时。一个经典的例子就是动态定位一个 Tooltip 组件：先渲染出 Tooltip（可能位置不准），然后用 `useLayoutEffect` 测量它的尺寸，再根据尺寸计算出最终的正确位置，并**同步地**更新 Tooltip 的样式（比如 `top` 和 `left`），这样用户就只会看到最终定位好的 Tooltip，而不会看到它从一个初始位置“闪”到最终位置。
    *   **避免视觉不一致：** 如果某个副作用执行的是对视觉呈现有直接影响的操作，并且使用 `useEffect`（在绘制后执行）会导致用户能观察到一次短暂的“错误”状态到“正确”状态的跳变（即闪烁），那么就应该考虑使用 `useLayoutEffect`。
*   **性能影响：** 这是使用 `useLayoutEffect` 时必须高度警惕的一点！因为它会**阻塞浏览器的渲染流程**，如果滥用它，或者它内部的逻辑执行过于缓慢，可能会严重拖慢你的应用，让界面显得卡顿。**因此，应该尽可能地优先使用 `useEffect`。** 只有在确实遇到了 `useEffect` 无法解决的视觉闪烁问题时，才考虑换用 `useLayoutEffect`。
*   **服务端渲染 (SSR) 注意事项：** `useLayoutEffect` 在服务端渲染期间**不会执行**（因为服务端没有真实的 DOM 和布局）。如果你在 `useLayoutEffect` 中执行了一些只有在浏览器环境中才能进行的操作，并且没有做兼容处理，可能会在客户端激活 (hydration) 时出现警告或错误。通常的解决方案包括：将使用了 `useLayoutEffect` 的组件进行条件渲染（只在客户端渲染），或者针对 SSR 场景回退到使用 `useEffect`。

`useLayoutEffect` 的核心价值在于那些需要在绘制前完成“**测量 -> 计算 -> 同步更新**”闭环的特殊场景。当组件的最终渲染输出依赖于刚刚被添加到 DOM 中的元素的实际布局，并且这种依赖性调整必须在用户看到任何中间状态之前无缝完成时，它就派上用场了。Tooltip 的例子完美地诠释了这一点。

然而，必须强调，`useLayoutEffect` 是一个比 `useEffect` 更“底层”、更“危险”的 Hook。[官方文档对其性能影响的强烈警告](https://legacy.reactjs.org/docs/hooks-reference.html#timing-of-effects)："过度使用 useLayoutEffect 会使应用变慢"（“过度使用会使应用变慢”）意味着它应该是一个经过深思熟虑、权衡利弊后的选择，而不是我们的默认选项。绝大多数的副作用，如数据获取、事件监听、设置定时器等，都应该并且能够用 `useEffect` 完美处理。只有当在下一次绘制前保持视觉呈现的绝对一致性至关重要时（例如，为了避免与布局相关的渲染过程中的闪烁），`useLayoutEffect` 才可能是那个正确的（但也需要谨慎使用的）工具。

#### 4.5 `useImperativeHandle`：给 Ref “穿上马甲”，定制暴露接口

`useImperativeHandle` Hook 通常需要与 `React.forwardRef` 配合使用。它允许子组件**自定义**当父组件通过 `ref` 访问它时，**实际暴露出去的那个“句柄” (handle) 是什么**。换句话说，子组件可以决定只向父组件提供一个特定的、受限制的 API 接口，而不是直接把整个 DOM 节点或者组件实例暴露出去。

*   **目的：** 控制通过 `ref` 从子组件暴露给父组件的接口，实现更精细的封装和更安全的交互。
*   **语法：** `useImperativeHandle(ref, createHandle, dependencies?)`。
    *   `ref`：通过 `React.forwardRef` 从父组件传递过来的那个 `ref` 对象。
    *   `createHandle`：一个函数，它需要返回你希望暴露给父组件的那个**自定义句柄**（通常是一个包含方法的对象）。
    *   `dependencies?`：一个可选的依赖项数组。当数组中的任何依赖项发生变化时，`createHandle` 函数会重新执行，从而更新父组件通过 `ref.current` 拿到的那个句柄。如果省略或为空数组 `[]`，句柄只会在组件首次渲染时创建一次。
*   **与 `forwardRef` 的配合：** `useImperativeHandle` 必须用在那些被 `React.forwardRef()` 包裹的函数组件内部。
*   **典型用例：**
    *   **封装 DOM 操作：** 比如你写了一个很酷的自定义输入框组件 `FancyInput`。父组件可能只需要调用它的 `focus()` 或 `clear()` 方法。使用 `useImperativeHandle`，你可以只暴露这两个方法，而不是将底层的 `<input>` DOM 节点整个暴露出去。
        ```jsx
        const FancyInput = React.forwardRef((props, ref) => {
          const inputRef = useRef();
          useImperativeHandle(ref, () => ({
            focus: () => {
              inputRef.current.focus();
            },
            clear: () => {
              inputRef.current.value = '';
            }
            // 注意：父组件通过 ref 无法直接访问 inputRef.current 了
          }));
          return <input ref={inputRef} {...props} />;
        });
        ```
    *   **暴露命令式 API：** 比如一个复杂的表单组件，可能需要向父组件提供一个 `resetForm()` 或 `submitProgrammatically()` 的方法。
*   **注意事项：** 过度使用 refs 和命令式的编程范式，通常会使代码比基于 props 的声明式控制更难理解和维护。**如果一个行为可以通过传递 props 来控制，那么就应该优先使用 props。** 只有在确实需要父组件向子组件发送“命令”时，才考虑使用 `ref` 和 `useImperativeHandle`。

`useImperativeHandle` 可以看作是 React 为 `ref` 提供的一种**封装机制**，它遵循了面向对象设计中的**最小权限原则**。允许子组件精确地控制自己对外暴露的功能，隐藏内部的实现细节，从而改善了组件的边界清晰度，减少了父子组件之间的意外耦合。虽然声明式的 props 是控制组件行为的首选方式，但有时，命令式的交互确实是必要的（比如触发一个子组件内部的动画，或者让一个深层嵌套的输入框获得焦点）。`useImperativeHandle` 为这些不可避免的命令式场景，提供了一种结构化的、相对安全的实现方式，而不过度破坏组件的封装性。

#### 4.6 `useDebugValue`：给你的自定义 Hook 在 DevTools 里加个“标签”

`useDebugValue` 是一个相对小众但有时很有用的 Hook。它允许开发者为自己的**自定义 Hook** 在 React DevTools（开发者工具）中添加一个自定义的标签或值，让这个 Hook 在被检查时更容易理解其内部状态。

*   **目的：** 改善**自定义 Hook** 在 React DevTools 中的可观察性和调试体验。
*   **语法：** `useDebugValue(value, format?)`。
    *   `value`：你希望在 DevTools 中显示的值。
    *   `format?` (可选)：一个格式化函数。这个函数**只在 DevTools 实际检查这个 Hook 时才会被调用**，用于将 `value` 格式化成一个更易读的字符串。这避免了在每次渲染时都执行可能比较昂贵的格式化操作。
*   **何时最有价值：**
    *   主要用于那些作为**共享库**一部分发布的自定义 Hook。
    *   或者那些内部状态比较复杂、难以通过查看其原始返回值来直接理解其当前状态的自定义 Hook。
    *   **并非每个自定义 Hook 都需要使用它。** 对于内部逻辑简单、状态清晰的自定义 Hook，使用 `useDebugValue` 反而可能增加不必要的干扰。

`useDebugValue` 主要是为**自定义 Hook 的作者**服务的，目的是改善他们自己以及其他使用这个 Hook 的开发者的调试体验。它本身**不影响 Hook 的运行时逻辑**。

我们知道，自定义 Hook 可能封装了非常复杂的逻辑和内部状态。如果在 React DevTools 里检查一个使用了这个自定义 Hook 的组件时，只能看到 Hook 返回的最终结果，可能很难判断 Hook 内部到底发生了什么。`useDebugValue` 就允许 Hook 的作者提供一个更有意义的、概括性的内部状态表示（比如显示 "Online" 或 "Offline" 而不是底层的布尔值），从而直接提升了使用或调试这些自定义 Hook 时的开发者体验。

#### 4.7 其他更专业的 Hooks 概览：应对前沿挑战

除了上面我们详细讨论的这些 Hooks 之外，React 还提供了一些更专门化的 Hooks，它们通常用于满足一些特定的高级需求，尤其是在处理**并发渲染 (Concurrent Rendering)** 和与**外部系统集成**方面。简单了解一下它们的存在和大致用途，可以帮助我们拓宽视野：

*   **`useTransition` 和 `useDeferredValue`：** 这两个是 React 并发模式的核心成员。它们允许你将某些状态更新标记为“非紧急的 (non-urgent)”，从而让 React 可以在执行这些可能比较耗时的更新时，仍然保持用户界面的响应性，避免阻塞主线程，提升用户体验。
*   **`useId`：** 用于生成在服务端渲染 (SSR) 和客户端渲染之间都能保持稳定且唯一的 ID。这对于需要生成 `id` 属性以满足可访问性（Accessibility）要求（比如 `aria-labelledby` 指向某个元素的 `id`）的场景非常有用。
*   **`useSyncExternalStore`：** 当你需要让你的 React 组件能够安全地、且与并发特性兼容地订阅**外部**数据存储（比如 Redux store、Zustand store，或者任何非 React 管理的状态系统）的变化时，这个 Hook 是官方推荐的解决方案。
*   **`useInsertionEffect`：** 这是一个非常特殊的 Hook，普通开发者基本用不到。它主要供 **CSS-in-JS 库**的作者使用，允许他们在 DOM 变更实际发生**之前**同步地向 `<style>` 标签中注入样式规则，以避免样式应用延迟导致页面闪烁的问题。
*   **`useOptimistic`：** 用于实现**乐观更新 (Optimistic Updates)**。当你执行一个需要时间的异步操作（比如向服务器发送一个更新请求）时，你可以使用 `useOptimistic` 来立即向用户展示一个预期的“成功”状态，即使请求还在进行中。这可以极大地提升用户感官上的性能和应用的响应速度。当异步操作最终成功或失败时，再更新到真实的状态。

### 自定义 Hooks 的艺术：封装逻辑，自由组合

如果说内置 Hooks 是 React 提供的“原材料”，那么**自定义 Hooks (Custom Hooks)** 就是我们开发者利用这些原材料创造出的、可复用的“逻辑组件”。自定义 Hooks 是 React Hooks 强大能力的核心体现，它们允许我们将组件内部的逻辑提取到可复用的函数中，实现更清晰、更模块化、更易于测试的代码结构。

#### 5.1 核心原则：提取有状态逻辑，而非 UI

*   **定义：** 自定义 Hook 本质上就是一个 JavaScript 函数，它的**名称必须以 `use` 开头**，并且**可以在其内部调用其他的 Hooks**（无论是 React 内置的 Hooks，还是其他自定义 Hooks）。
*   **目的：** 自定义 Hook 的核心目的是**复用有状态逻辑 (stateful logic)**，而不是复用 UI 或者状态本身。它允许开发者将组件内部耦合在一起的状态管理、副作用处理、事件订阅等逻辑，提取成一个独立的、可测试、可复用的函数。最重要的是，这种逻辑复用**不会引入额外的组件层级**（这与 HOCs 和 Render Props 的根本区别）。
*   **工作方式：** 自定义 Hook 就是利用我们前面学到的各种内置 Hooks（比如 `useState`, `useEffect`, `useRef` 等）来封装一段特定的逻辑。
*   **示例演进：** 我们可以通过一些简单的例子来感受自定义 Hook 的威力。比如，想象一下现在有多个组件都需要判断当前网络是否在线，我们可能会在每个组件里都写一遍监听 `online`/`offline` 事件的 `useEffect` 逻辑。这时，你就可以把这段逻辑提取到一个 `useOnlineStatus` 的自定义 Hook 中。或者，你需要方便地监听某个 DOM 事件，可以封装一个 `useEventListener` Hook。先展示重复代码，再展示如何提取成自定义 Hook，其优势一目了然。


#### 5.2 `use` 命名约定与遵守 Hook 规则：不只是约定！

*   **命名约定：** 自定义 Hook 的函数名**必须**以 `use` 开头，后面通常跟一个大写字母（比如 `useMyAwesomeLogic`）。
*   **为何如此关键：** 这个约定**不仅仅是为了代码风格**！它是 React 和相关工具（比如我们前面提到的 `eslint-plugin-react-hooks` 插件）能够**识别**这是一个 Hook 的信号。只有被识别为 Hook，React 才能确保它内部的 Hooks 调用能够正确工作，linter 才能在其内部强制执行 Hooks 的规则（比如只能在顶层调用）。如果你在一个不以 `use` 开头的普通函数里调用了 `useState`，linter 会报错，React 的行为也可能变得不可预测。
*   **遵守 Hook 规则：** 自定义 Hook 自身也**必须严格遵守** Hooks 的那两条基本规则：
    1.  只能在顶层调用其他 Hooks。
    2.  只能从 React 函数组件或者**其他**自定义 Hook 中调用。

可以把 `use` 前缀看作是你和 React 及其工具链之间签订的一个“契约”, 这种严格性确保了整个 Hook 机制的完整性和可靠性，也使得我们可以放心地组合使用各种自定义 Hooks。

#### 5.3 共享的是逻辑，而非状态：理解实例隔离

这是一个关于自定义 Hook 非常核心且有时容易被误解的概念：<span class="text-red-500">每次在一个组件实例中调用同一个自定义 Hook 时，这个 Hook 内部的状态和副作用都是完全独立的、隔离的。</span> 自定义 Hooks 共享的是**创建和管理状态的逻辑**，而不是**状态本身**。

*   **类比 `useState`：** 这就像你在一个组件里多次调用 `useState` 一样。`const [countA, setCountA] = useState(0);` 和 `const [countB, setCountB] = useState(10);` 会创建两个完全独立的状态变量 `countA` 和 `countB`。
*   **自定义 Hook 也是如此：** 如果你有两个不同的组件 `ComponentA` 和 `ComponentB`，它们都调用了同一个自定义 Hook `useMyCounter()`，那么 `ComponentA` 内部的计数器状态和 `ComponentB` 内部的计数器状态是**完全隔离、互不影响**的。即使是同一个组件 `ComponentC` 多次调用了 `useMyCounter()`，每次调用也会得到一套独立的状态。

这个特性非常重要！它意味着自定义 Hook 是一种非常安全的逻辑复用方式，你不用担心在一个地方使用 Hook 会意外地影响到另一个地方的状态。它只是提供了一套“配方”或“蓝图”，每个组件根据这个“配方”在自己的“厨房”（组件实例）里独立地“烹饪”出状态。

![自定义 Hook 实例隔离示意图](https://cdn.jsdelivr.net/gh/marshal-zheng/images-hosting@main/images/qSQ3Wk.jpg)

#### 5.4 打造可维护自定义 Hooks 的最佳实践

写出能用的自定义 Hook 相对容易，但要写出优秀的、可维护的、易于理解和使用的自定义 Hook，则需要遵循一些最佳实践：

*   **保持专注，单一职责：** 一个好的自定义 Hook 应该只做好一件事情。避免创建一个包罗万象、什么都干的“万能” Hook。如果逻辑变得复杂，考虑将其拆分成多个更小的、可组合的自定义 Hook。
*   **清晰的输入和输出：** 像设计一个好的函数 API 一样，仔细考虑你的自定义 Hook 需要接收哪些参数（输入），以及它应该返回什么（输出）。返回值尽量设计得稳定且易于使用，可以返回一个对象或数组，包含状态值和相关的操作函数。
*   **参数设计要灵活：** 考虑 Hook 的可配置性。通过参数让使用者可以定制 Hook 的行为（比如，`useFetch(url, options)` 中的 `options`）。
*   **隐藏实现细节：** 自定义 Hook 应该封装其内部逻辑。使用者只需要关心它的输入和输出，不需要了解它内部具体是用了 `useState` 还是 `useReducer`，或者是如何处理副作用的。
*   **命名要清晰：** `use` 前缀是必须的，后面的名字应该能清晰地表达这个 Hook 的用途，比如 `useFormInput`、`useWindowSize`、`useDebounce`。
*   **考虑性能：** 如果你的 Hook 内部有昂贵的计算或创建了函数/对象需要传递给外部，记得在适当的时候使用 `useMemo` 和 `useCallback` 进行优化。
*   **可测试性：** 设计 Hook 时就要考虑如何测试它。由于 Hook 可以在 React 组件环境之外被测试（使用像 `@testing-library/react-hooks` 这样的库），良好的设计能让测试更容易编写。
*   **文档和示例：** 对于共享的自定义 Hook，清晰的文档和使用示例至关重要。

---

### 参考文献

1.  React Hooks Component vs Class Component - Stack Overflow, accessed May 13, 2025, https://stackoverflow.com/questions/59132002/react-hooks-component-vs-class-component
2.  Introducing Hooks - React, accessed May 13, 2025, https://legacy.reactjs.org/docs/hooks-intro.html
3.  Blogged Answers: Thoughts on React Hooks, Redux, and ..., accessed May 13, 2025, https://blog.isquaredsoftware.com/2019/07/blogged-answers-thoughts-on-hooks/
4.  An explanation of why Hooks are a nicer way to abstract re-useable ..., accessed May 13, 2025, https://gist.github.com/bradwestfall/4fa683c8f4fcd781a38a8d623bec20e7
5.  Realigning Your Model of React After Hooks With Dan Abramov ..., accessed May 13, 2025, https://kentcdodds.com/chats/01/03/realigning-your-model-of-react-after-hooks-with-dan-abramov
6.  Hooks at a Glance - React, accessed May 13, 2025, https://legacy.reactjs.org/docs/hooks-overview.html
7.  Hooks API Reference – React, accessed May 13, 2025, https://legacy.reactjs.org/docs/hooks-reference.html
8.  5 Tips to Help You Avoid React Hooks Pitfalls - Kent C. Dodds, accessed May 13, 2025, https://kentcdodds.com/blog/react-hooks-pitfalls
9.  A Complete Guide to All React Hooks for Beginners - DEV Community, accessed May 13, 2025, https://dev.to/pedrotech/a-complete-guide-to-all-react-hooks-for-beginners-5cio
10. Rules of Hooks – React, accessed May 13, 2025, https://react.dev/reference/rules/rules-of-hooks
11. useState – React, accessed May 13, 2025, https://react.dev/reference/react/useState
12. Managing State – React, accessed May 13, 2025, https://react.dev/learn/managing-state
13. Choosing the State Structure - React, accessed May 13, 2025, https://react.dev/learn/choosing-the-state-structure
14. useEffect - React, accessed May 13, 2025, https://react.dev/reference/react/useEffect
15. React Hooks Deep Dive: Advanced Usage and Patterns in 2023, accessed May 13, 2025, https://www.protonshub.com/blogs/react-hooks-deep-dive-advanced-usage-and-patterns
16. Why React Hooks: Enhancing Code Performance and Readability, accessed May 13, 2025, https://www.voitanos.io/blog/react-hooks-enhance-code-performance/
17. React's `useEffect`: Best Practices, Pitfalls, and Modern JavaScript ..., accessed May 13, 2025, https://dev.to/hkp22/reacts-useeffect-best-practices-pitfalls-and-modern-javascript-insights-g2f
18. React useEffect() - A complete guide | Hygraph, accessed May 13, 2025, https://hygraph.com/blog/react-useeffect-a-complete-guide
19. How to use React Hooks to manage state and side effects - Quora, accessed May 13, 2025, https://www.quora.com/How-can-you-use-React-Hooks-to-manage-state-and-side-effects
20. The React useContext Hook - Telerik.com, accessed May 13, 2025, https://www.telerik.com/blogs/react-usecontext-hook
21. Everything You Need to Know About useContext Hook in React.js, accessed May 13, 2025, https://codedamn.com/news/reactjs/usecontext-hook
22. Passing Data Deeply with Context – React, accessed May 13, 2025, https://react.dev/learn/passing-data-deeply-with-context
23. State Management in React – Hooks, Context API and Redux ..., accessed May 13, 2025, https://www.geeksforgeeks.org/state-management-in-react-hooks-context-api-and-redux/
24. useContext – React, accessed May 13, 2025, https://react.dev/reference/react/useContext
25. useReducer – React, accessed May 13, 2025, https://react.dev/reference/react/useReducer
26. Advanced React Hooks Patterns & Best Practices - Angular Minds, accessed May 13, 2025, https://www.angularminds.com/blog/advanced-react-hooks-patterns-and-best-practices
27. Extracting State Logic into a Reducer – React, accessed May 13, 2025, https://react.dev/learn/extracting-state-logic-into-a-reducer
28. useCallback – React, accessed May 13, 2025, https://react.dev/reference/react/useCallback
29. React useCallback: When and how to use it for better performance ..., accessed May 13, 2025, https://dev.to/logrocket/react-usecallback-2o8i
30. useMemo – React, accessed May 13, 2025, https://react.dev/reference/react/useMemo
31. You Might Not Need an Effect - React, accessed May 13, 2025, https://react.dev/learn/you-might-not-need-an-effect
32. Referencing Values with Refs – React, accessed May 13, 2025, https://react.dev/learn/referencing-values-with-refs
33. useRef – React, accessed May 13, 2025, https://react.dev/reference/react/useRef
34. Manipulating the DOM with Refs - React, accessed May 13, 2025, https://react.dev/learn/manipulating-the-dom-with-refs
35. useLayoutEffect – React, accessed May 13, 2025, https://react.dev/reference/react/useLayoutEffect
36. useImperativeHandle – React, accessed May 13, 2025, https://react.dev/reference/react/useImperativeHandle
37. useDebugValue – React, accessed May 13, 2025, https://react.dev/reference/react/useDebugValue
38. Reusing Logic with Custom Hooks – React, accessed May 13, 2025, https://react.dev/learn/reusing-logic-with-custom-hooks
39. useOptimistic - React, accessed May 13, 2025, https://react.dev/reference/react/useOptimistic
40. Implementing a Custom React Hook: Best Practices and a Practical ..., accessed May 13, 2025, https://www.pullrequest.com/blog/implementing-a-custom-react-hook-best-practices-and-a-practical-example/